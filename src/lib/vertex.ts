import { getVertexAI, getGenerativeModel, Schema } from "firebase/vertexai";
import { labelMaps } from "./mapSvg";
import { replaceCaseInsensitive } from "../utils/string";
import firebaseApp from "./firebaseApp";

export type CloudProviderType = 'GCP' | 'AWS' | 'Azure';

export interface DiagramProposalInterface {
  description: string;
  diagram: string;
  runningCost: string;
  terraform: string;
  title: string;
}

// Initialize the Vertex AI service
const vertexAI = getVertexAI(firebaseApp);

// Provide a JSON schema object using a standard format.
// Later, pass this schema object into `responseSchema` in the generation config.
const jsonSchema = Schema.object({
  properties: {
    proposals: Schema.array({
      items: Schema.object({
        properties: {
          title: Schema.string(),
          description: Schema.string(),
          diagram: Schema.string(),
          terraform: Schema.string(),
          runningCost: Schema.string(),
        },
      }),
    }),
  },
});

// Initialize the generative model with a model that supports your use case
const model = getGenerativeModel(vertexAI, {
  model: "gemini-2.0-flash-001",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: jsonSchema,
  },
});

const promptContext = `
    I would like to design a system architecture using {CLOUD_PROVIDER} services.
    The mermaid output should start with the diagram type,
    and DO NOT APPLY any style or STYLE keyword to cloud service objects.

    Mermaid and terraform has to be in English.
    DO NOT use any Special characters in the Mermaid output.

    Title, description, and running cost should be in English.
    Also, give terraform code that would be deployable to {CLOUD_PROVIDER}, and estimate the running cost with a number in USD.

    For the output, I would like 3 proposed Mermaid diagrams.

    Order the proposals based on the best fit for the requirements.

    Here are the system requirements.

    \n
`;

const parseTerraform = (terraform: string) => {
  terraform = replaceCaseInsensitive(terraform, "```terraform\n", "");
  terraform = replaceCaseInsensitive(terraform, "```terraform", "");
  terraform = replaceCaseInsensitive(terraform, "```", "");
  return terraform;
};

const parseDiagram = (diagram: string) => {
  if (diagram.includes("```mermaid\n")) {
    diagram = diagram.split("```mermaid\n")[1];
  } else if (diagram.includes("```mermaid")) {
    diagram = diagram.split("```mermaid")[1];
  } else if (diagram.includes("flowchart")) {
    diagram = "flowchart" + diagram.split(/flowchart(.*)/s)[1];
  } else if (diagram.includes("sequenceDiagram")) {
    diagram = "sequenceDiagram" + diagram.split(/sequenceDiagram(.*)/s)[1];
  } else if (
    diagram.includes("graph LR") ||
    diagram.includes("graph RL") ||
    diagram.includes("graph BT") ||
    diagram.includes("graph TB")
  ) {
    diagram = "graph" + diagram.split(/graph(.*)/s)[1];
  }

  diagram = replaceCaseInsensitive(diagram, "```", "");

  for (const key of Object.keys(labelMaps)) {
    if (diagram.toLowerCase().includes(key.toLowerCase())) {
      diagram = replaceCaseInsensitive(
        diagram,
        key,
        labelMaps[key] + "\nXXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXXX"
      );
    }
  }
  return diagram;
};

export const parseProposals = (proposals: DiagramProposalInterface[]) => {
  return proposals.map((proposal: DiagramProposalInterface) => {
    return {
      ...proposal,
      terraform: parseTerraform(proposal.terraform),
      diagram: parseDiagram(proposal.diagram),
    };
  });
};

const askVertex = async ({
  requirements,
  budget,
  isIncludeLoggingAndMonitoring,
  cloudProvider,
}: // isUseMockData,
{
  requirements: string;
  budget: number | null;
  isIncludeLoggingAndMonitoring: boolean;
  cloudProvider: 'GCP' | 'AWS' | 'Azure';
  // isUseMockData?: boolean;
}): Promise<DiagramProposalInterface[]> => {
  let cloudSpecificPrompt = promptContext.replace(/{CLOUD_PROVIDER}/g, cloudProvider);

  let prompt = cloudSpecificPrompt + requirements;
  if (budget != null) {
    prompt += `\n This is the monthly budget in USD: ${budget}`;
  }

  if (isIncludeLoggingAndMonitoring) {
    if (cloudProvider === 'GCP') {
      prompt += "\n Please include Cloud Monitoring and Cloud Logging services.";
    } else if (cloudProvider === 'AWS') {
      prompt += "\n Please include AWS CloudWatch for monitoring and logging services.";
    } else if (cloudProvider === 'Azure') {
      prompt += "\n Please include Azure Monitor and Azure Log Analytics services.";
    }
  } else {
    if (cloudProvider === 'GCP') {
      prompt += "\n Please do not include Cloud Monitoring and Cloud Logging services.";
    } else if (cloudProvider === 'AWS') {
      prompt += "\n Please do not include AWS CloudWatch for monitoring and logging services.";
    } else if (cloudProvider === 'Azure') {
      prompt += "\n Please do not include Azure Monitor and Azure Log Analytics services.";
    }
  }

  const result = await model.generateContent(prompt);

  const response = result.response;
  const text = response.text();
  const data = JSON.parse(text);

  const proposals = parseProposals(data["proposals"]);
  return proposals;
};

export default askVertex;
