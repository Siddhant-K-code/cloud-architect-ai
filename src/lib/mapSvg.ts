import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import type {
  ExcalidrawElement,
  ExcalidrawTextElement,
  FileId,
} from "@excalidraw/excalidraw/types/element/types";
import type {
  BinaryFileData,
  DataURL,
} from "@excalidraw/excalidraw/types/types";
import loadSvg from "./loadSvg";
import type { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform";
import { CloudProviderType } from "./vertex";

const LABEL_OFFSET_X = 55;
const LABEL_OFFSET_Y = 0;
const LABEL_FONT_SIZE = 18;

interface styling {
  width: number;
  height: number;
  offset_x: number;
  offset_y: number;
}

const SVG_STYLING: Record<string, styling> = {
  default: {
    width: 60,
    height: 60,
    offset_x: 5,
    offset_y: 15,
  },
  diamond: {
    width: 60,
    height: 60,
    offset_x: 55,
    offset_y: 95,
  },
  ellipse: {
    width: 60,
    height: 60,
    offset_x: 25,
    offset_y: 45,
  },
};

interface IconData {
  svg: string;
  label: string;
}

// Google Cloud icons
const gcpResourceDataMap: Record<string, IconData> = {
  bigq: {
    svg: "/assets/google-cloud-icons/bigquery/bigquery.svg",
    label: "BigQuery",
  },
  cloudcdn: {
    svg: "/assets/google-cloud-icons/cloud_cdn/cloud_cdn.svg",
    label: "Cloud\nCDN",
  },
  clouddns: {
    svg: "/assets/google-cloud-icons/cloud_dns/cloud_dns.svg",
    label: "Cloud\nDNS",
  },
  loadbalanc: {
    svg: "/assets/google-cloud-icons/cloud_load_balancing/cloud_load_balancing.svg",
    label: "Cloud Load\nBalancing",
  },
  appen: {
    svg: "/assets/google-cloud-icons/app_engine/app_engine.svg",
    label: "App\nEngine",
  },
  cloudrun: {
    svg: "/assets/google-cloud-icons/cloud_run/cloud_run.svg",
    label: "Cloud\nRun",
  },
  cloudfun: {
    svg: "/assets/google-cloud-icons/cloud_functions/cloud_functions.svg",
    label: "Cloud\nFunctions",
  },
  computen: {
    svg: "/assets/google-cloud-icons/compute_engine/compute_engine.svg",
    label: "Compute\nEngine",
  },
  cloudsql: {
    svg: "/assets/google-cloud-icons/cloud_sql/cloud_sql.svg",
    label: "Cloud\nSQL",
  },
  cloudstor: {
    svg: "/assets/google-cloud-icons/cloud_storage/cloud_storage.svg",
    label: "Cloud\nStorage",
  },
  cloudlog: {
    svg: "/assets/google-cloud-icons/cloud_logging/cloud_logging.svg",
    label: "Cloud\nLogging",
  },
  cloudmon: {
    svg: "/assets/google-cloud-icons/cloud_monitoring/cloud_monitoring.svg",
    label: "Cloud\nMonitoring",
  },
  cloudsh: {
    svg: "/assets/google-cloud-icons/cloud_scheduler/cloud_scheduler.svg",
    label: "Cloud\nScheduler",
  },
  cloudspan: {
    svg: "/assets/google-cloud-icons/cloud_spanner/cloud_spanner.svg",
    label: "Cloud\nSpanner",
  },
  cloudgat: {
    svg: "/assets/google-cloud-icons/cloud_api_gateway/cloud_api_gateway.svg",
    label: "Cloud\nAPI\nGateway",
  },
  datastore: {
    svg: "/assets/google-cloud-icons/datastore/datastore.svg",
    label: "Datastore",
  },
  memorystore: {
    svg: "/assets/google-cloud-icons/memorystore/memorystore.svg",
    label: "Memorystore",
  },
  pubsub: {
    svg: "/assets/google-cloud-icons/pubsub/pubsub.svg",
    label: "Cloud\nPub/Sub",
  },
  firest: {
    svg: "/assets/google-cloud-icons/firestore/firestore.svg",
    label: "Firestore",
  },
  idplat: {
    svg: "/assets/google-cloud-icons/identity_platform/identity_platform.svg",
    label: "Identity\nPlatform",
  },
  gke: {
    svg: "/assets/google-cloud-icons/google_kubernetes_engine/google_kubernetes_engine.svg",
    label: "Google\nKubernetes\nEngine",
  },
};

// AWS icons
const awsResourceDataMap: Record<string, IconData> = {
  bigq: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Analytics/64/Arch_Amazon-Redshift_64.svg",
    label: "Redshift",
  },
  cloudcdn: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_Amazon-CloudFront_64.svg",
    label: "CloudFront",
  },
  clouddns: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_Amazon-Route-53_64.svg",
    label: "Route 53",
  },
  loadbalanc: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_Elastic-Load-Balancing_64.svg",
    label: "Elastic Load\nBalancing",
  },
  appen: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_AWS-Elastic-Beanstalk_64.svg",
    label: "Elastic\nBeanstalk",
  },
  cloudrun: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_AWS-Lambda_64.svg",
    label: "Lambda",
  },
  cloudfun: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_AWS-Lambda_64.svg",
    label: "Lambda",
  },
  computen: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_Amazon-EC2_64.svg",
    label: "EC2",
  },
  cloudsql: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-RDS_64.svg",
    label: "RDS",
  },
  cloudstor: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Storage/64/Arch_Amazon-Simple-Storage-Service_64.svg",
    label: "S3",
  },
  cloudlog: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Management-Governance/64/Arch_Amazon-CloudWatch_64.svg",
    label: "CloudWatch\nLogs",
  },
  cloudmon: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Management-Governance/64/Arch_Amazon-CloudWatch_64.svg",
    label: "CloudWatch",
  },
  cloudsh: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_App-Integration/64/Arch_Amazon-EventBridge_64.svg",
    label: "EventBridge",
  },
  cloudspan: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-DynamoDB_64.svg",
    label: "DynamoDB",
  },
  cloudgat: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/64/Arch_Amazon-API-Gateway_64.svg",
    label: "API\nGateway",
  },
  datastore: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-DynamoDB_64.svg",
    label: "DynamoDB",
  },
  memorystore: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-ElastiCache_64.svg",
    label: "ElastiCache",
  },
  pubsub: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_App-Integration/64/Arch_Amazon-SNS_64.svg",
    label: "SNS",
  },
  firest: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Database/64/Arch_Amazon-DynamoDB_64.svg",
    label: "DynamoDB",
  },
  idplat: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/64/Arch_Amazon-Cognito_64.svg",
    label: "Cognito",
  },
  gke: {
    svg: "/assets/aws-icons/Architecture-Service-Icons_02072025/Arch_Compute/64/Arch_Amazon-EKS_64.svg",
    label: "EKS",
  },
};

// Azure icons
const azureResourceDataMap: Record<string, IconData> = {
  bigq: {
    svg: "/assets/azure-icons/analytics/10738-icon-service-Azure-Synapse-Analytics.svg",
    label: "Synapse\nAnalytics",
  },
  cloudcdn: {
    svg: "/assets/azure-icons/networking/10063-icon-service-CDN-Profiles.svg",
    label: "Azure\nCDN",
  },
  clouddns: {
    svg: "/assets/azure-icons/networking/10064-icon-service-DNS-Zones.svg",
    label: "Azure\nDNS",
  },
  loadbalanc: {
    svg: "/assets/azure-icons/networking/10062-icon-service-Load-Balancers.svg",
    label: "Load\nBalancer",
  },
  appen: {
    svg: "/assets/azure-icons/compute/10035-icon-service-App-Services.svg",
    label: "App\nServices",
  },
  cloudrun: {
    svg: "/assets/azure-icons/compute/10104-icon-service-Container-Instances.svg",
    label: "Container\nInstances",
  },
  cloudfun: {
    svg: "/assets/azure-icons/compute/10029-icon-service-Function-Apps.svg",
    label: "Azure\nFunctions",
  },
  computen: {
    svg: "/assets/azure-icons/compute/10021-icon-service-Virtual-Machine.svg",
    label: "Virtual\nMachine",
  },
  cloudsql: {
    svg: "/assets/azure-icons/databases/10130-icon-service-SQL-Database.svg",
    label: "Azure\nSQL",
  },
  cloudstor: {
    svg: "/assets/azure-icons/storage/10086-icon-service-Storage-Accounts.svg",
    label: "Blob\nStorage",
  },
  cloudlog: {
    svg: "/assets/azure-icons/management + governance/00007-icon-service-Monitor.svg",
    label: "Azure\nMonitor\nLogs",
  },
  cloudmon: {
    svg: "/assets/azure-icons/management + governance/00007-icon-service-Monitor.svg",
    label: "Azure\nMonitor",
  },
  cloudsh: {
    svg: "/assets/azure-icons/integration/10200-icon-service-Logic-Apps.svg",
    label: "Logic\nApps",
  },
  cloudspan: {
    svg: "/assets/azure-icons/databases/10121-icon-service-Azure-Cosmos-DB.svg",
    label: "Cosmos\nDB",
  },
  cloudgat: {
    svg: "/assets/azure-icons/integration/10197-icon-service-API-Management-Services.svg",
    label: "API\nManagement",
  },
  datastore: {
    svg: "/assets/azure-icons/databases/10121-icon-service-Azure-Cosmos-DB.svg",
    label: "Cosmos\nDB",
  },
  memorystore: {
    svg: "/assets/azure-icons/databases/10137-icon-service-Cache-Redis.svg",
    label: "Cache for\nRedis",
  },
  pubsub: {
    svg: "/assets/azure-icons/integration/10201-icon-service-Service-Bus.svg",
    label: "Service\nBus",
  },
  firest: {
    svg: "/assets/azure-icons/databases/10121-icon-service-Azure-Cosmos-DB.svg",
    label: "Cosmos\nDB",
  },
  idplat: {
    svg: "/assets/azure-icons/identity/10230-icon-service-Azure-Active-Directory.svg",
    label: "Active\nDirectory",
  },
  gke: {
    svg: "/assets/azure-icons/compute/10023-icon-service-Kubernetes-Services.svg",
    label: "Kubernetes\nService",
  },
};

// Function to get the resource data map based on the cloud provider
const getResourceDataMap = (cloudProvider: CloudProviderType): Record<string, IconData> => {
  switch (cloudProvider) {
    case 'AWS':
      return awsResourceDataMap;
    case 'Azure':
      return azureResourceDataMap;
    case 'GCP':
    default:
      return gcpResourceDataMap;
  }
};

export const labelMaps: Record<string, string> = {
  BigQuery: "bigq",
  "API Gateway": "cloudgat",
  Datastore: "datastore",
  "Cloud CDN": "cloudcdn",
  "Cloud Datastore": "datastore",
  "Cloud API Gateway": "cloudgat",
  "Cloud DNS": "clouddns",
  "Cloud Load Balancing": "loadbalanc",
  "Load Balancing": "loadbalanc",
  "Load Balancer": "loadbalanc",
  "App Engine": "appen",
  "Cloud Pub/Sub": "pubsub",
  "Cloud Scheduler": "cloudsh",
  "Cloud SQL": "cloudsql",
  "Cloud Storage": "cloudstor",
  "Cloud Run": "cloudrun",
  "Cloud Functions": "cloudfun",
  "Cloud Logging": "cloudlog",
  "Cloud Monitoring": "cloudmon",
  "Cloud Spanner": "cloudspan",
  "Compute Engine": "computen",
  "Google Kubernetes Engine": "gke",
  "Kubernetes Engine": "gke",
  "GKE Cluster": "gke",
  GKE: "gke",
  gke: "gke",
  "Identity Platform": "idplat",
  Firestore: "firest",
  Memorystore: "memorystore",
};

export const resourceDataKeys = Object.keys(gcpResourceDataMap);

interface TextContainer {
  key?: string;
  x?: number;
  y?: number;
  type?: string;
}

interface MapTextWithSvgOutput {
  elements: ExcalidrawElement[];
  files: BinaryFileData[];
}

export const mapTextWithSvg = async (
  elements: ExcalidrawElement[],
  cloudProvider: CloudProviderType = 'GCP'
): Promise<MapTextWithSvgOutput> => {
  console.log("mapTextWithSvg called with cloud provider:", cloudProvider);

  const textContainerMap: Record<string, TextContainer> = {};
  const files: BinaryFileData[] = [];
  const textElementSkeleton: ExcalidrawElementSkeleton[] = [];

  const elementIdsToDelete: string[] = [];
  const resourceDataMap = getResourceDataMap(cloudProvider);

  console.log("Using resource data map for provider:", cloudProvider);

  for (let i = 0; i < elements.length; i++) {
    if (
      elements[i]["type"] === "text" &&
      (elements[i] as ExcalidrawTextElement)["text"].includes("XXXX")
    ) {
      const containerId =
        (elements[i] as ExcalidrawTextElement)["containerId"] ?? "";
      textContainerMap[containerId] = {};

      for (const resourceKey of Object.keys(resourceDataMap)) {
        const text = (elements[i] as ExcalidrawTextElement)["text"];
        // remove all whitespaces
        if (text.toLowerCase().replace(/\s/g, "").includes(resourceKey)) {
          textContainerMap[containerId].key = resourceKey;
          console.log("Found resource key:", resourceKey, "for cloud provider:", cloudProvider);
          console.log("Loading SVG from:", resourceDataMap[resourceKey].svg);

          const dataURL = await loadSvg(resourceDataMap[resourceKey].svg);
          files.push({
            mimeType: "image/svg+xml",
            id: resourceKey as FileId,
            dataURL: dataURL as DataURL,
            created: Date.now(),
          });
          textElementSkeleton.push({
            type: "text",
            x: elements[i]["x"] + LABEL_OFFSET_X,
            y: elements[i]["y"] + LABEL_OFFSET_Y,
            text: resourceDataMap[resourceKey].label,
            fontSize: LABEL_FONT_SIZE,
          });
        }
      }

      // remove the placeholder text element
      elementIdsToDelete.push(elements[i]["id"]);
    }
  }

  for (let i = 0; i < elements.length; i++) {
    if (Object.keys(textContainerMap).includes(elements[i]["id"])) {
      textContainerMap[elements[i]["id"]]["x"] = elements[i]["x"];
      textContainerMap[elements[i]["id"]]["y"] = elements[i]["y"];
      textContainerMap[elements[i]["id"]]["type"] = elements[i]["type"];
    }
  }

  elements = elements.filter(
    (element) => !elementIdsToDelete.includes(element.id)
  );

  const textElements = convertToExcalidrawElements(textElementSkeleton);

  const svgElements = convertToExcalidrawElements(
    Object.values(textContainerMap).map((textContainer) => {
      const textContainerType = textContainer["type"] ?? "default";
      const svg_styling = Object.keys(SVG_STYLING).includes(textContainerType)
        ? SVG_STYLING[textContainerType]
        : SVG_STYLING["default"];
      return {
        fileId: (textContainer.key ?? "") as FileId,
        type: "image",
        x: textContainer.x != null ? textContainer.x + svg_styling.offset_x : 0,
        y: textContainer.y != null ? textContainer.y + svg_styling.offset_y : 0,
        width: svg_styling.width,
        height: svg_styling.height,
        backgroundColor: "",
      };
    })
  );

  return {
    elements: [...elements, ...svgElements, ...textElements],
    files: files,
  };
};
