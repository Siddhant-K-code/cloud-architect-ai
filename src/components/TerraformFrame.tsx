import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneSea } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CloudProviderType } from "../lib/vertex";
import { Paper, Title, Button, Group, Tooltip, Text, CopyButton } from "@mantine/core";
import { IconCopy, IconCheck, IconDownload, IconBrandGithub } from "@tabler/icons-react";
import { useState } from "react";

const TerraformFrame = ({
  codeString,
  cloudProvider
}: {
  codeString: string;
  cloudProvider: CloudProviderType;
}) => {
  const [copied, setCopied] = useState(false);

  // Function to download the Terraform code as a file
  const downloadTerraformCode = () => {
    const element = document.createElement("a");
    const file = new Blob([codeString], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "main.tf";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Paper p="md" withBorder mb="md" style={{ backgroundColor: "#f9f9f9" }}>
        <Group position="apart">
          <div>
            <Title order={4} mb={5}>Terraform Configuration</Title>
            <Text size="sm" color="dimmed">
              Ready to deploy infrastructure for {cloudProvider}
            </Text>
          </div>
          <Group>
            <CopyButton value={codeString} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied!" : "Copy code"}>
                  <Button
                    color={copied ? "teal" : "dark"}
                    onClick={copy}
                    variant="subtle"
                    leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  >
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </Tooltip>
              )}
            </CopyButton>
            <Tooltip label="Download as .tf file">
              <Button
                variant="subtle"
                color="dark"
                onClick={downloadTerraformCode}
                leftSection={<IconDownload size={16} />}
              >
                Download
              </Button>
            </Tooltip>
            <Tooltip label="Learn Terraform">
              <Button
                component="a"
                href="https://learn.hashicorp.com/terraform"
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                color="dark"
                leftSection={<IconBrandGithub size={16} />}
              >
                Learn
              </Button>
            </Tooltip>
          </Group>
        </Group>
      </Paper>
      <Paper style={{ flex: 1, overflow: "auto", borderRadius: "8px" }} withBorder>
        <SyntaxHighlighter
          language="hcl"
          style={duotoneSea}
          customStyle={{
            margin: 0,
            borderRadius: "8px",
            height: "100%",
            fontSize: "14px",
            lineHeight: "1.5"
          }}
          showLineNumbers={true}
        >
          {codeString}
        </SyntaxHighlighter>
      </Paper>
    </div>
  );
};

export default TerraformFrame;
