import { Excalidraw } from "@excalidraw/excalidraw";
import { useEffect, useState, useRef } from "react";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { BinaryFileData } from "@excalidraw/excalidraw/types/types";
import { mapTextWithSvg } from "../lib/mapSvg";
import { CloudProviderType } from "../lib/vertex";
import { Loader, Center, Button, Tabs, Box, Text, Code, Alert, Paper, Badge, Tooltip, Group } from "@mantine/core";
import { IconRefresh, IconTrash, IconArrowsMaximize, IconCode, IconBrush, IconFileCode } from "@tabler/icons-react";
import mermaid from "mermaid";

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  logLevel: 3, // Error level to reduce console noise
  fontFamily: 'Inter, sans-serif',
});

// const mermaidSyntax = `
// graph LR
//     subgraph Client
//         A[User Device]
//         B[Mobile Device]
//     end

//     subgraph Publisher
//         P[Publisher]
//     end

//     A --> C[Cloud DNS\nXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXXX]
//     B --> C
//     C --> D[Cloud Load Balancer\nXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXX]

//     D --> E[Content Server Zone A]
//     D --> F[Content Server Zone B]

//     E --> G[Static Content]
//     E --> H[Dynamic Content]

//     F --> G
//     F --> H

//     P --> D
// `;

// const mermaidSyntax = `
// flowchart LR\n    subgraph User\n        A[User Browser] -- GET/POST --> CDN\n    end\n\n    subgraph Google Cloud\n        CDN[Cloud CDN] -- Cache Hit --> A\n        CDN -- Cache Miss --> LB\n        LB[Cloud Load Balancer] -- Route Requests --> CF\n        CF[Cloud Functions\nXXXXXXXXXXXXXXXXX\nXXXXXXXXXXXXXXXXXX] -- Read/Write --> DB\n        DB[Firestore] -- Data --> CF\n        CF -- JSON Response --> LB\n    end\n\n    subgraph Third-Party Services\n        PAY[Payment Gateway] -- API Calls --> CF\n    end\n\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style CDN fill:#ccf,stroke:#333,stroke-width:2px\n    style LB fill:#ccf,stroke:#333,stroke-width:2px\n    style CF fill:#ccf,stroke:#333,stroke-width:2px\n    style DB fill:#ccf,stroke:#333,stroke-width:2px\n    style PAY fill:#ccf,stroke:#333,stroke-width:2px\n\n    classDef default fill:#f9f,stroke:#333,stroke-width:2px;\n
// `;

// const mermaidSyntax = `
// graph LR
//     subgraph Users
//         A[User]
//     end

//     subgraph Google Cloud
//         subgraph App Engine
//             B[Frontend (React, Vue.js, etc.)]
//             C[Backend (Python, Node.js, Go, etc.)]
//         end

//         D[Cloud SQL (MySQL, PostgreSQL)]
//         E[Cloud Storage (Product images, static files)]
//         F[Cloud CDN]
//     end

//     A --> F
//     F --> B
//     B --> C
//     C --> D
//     C --> E

//     style A fill:#f9f,stroke:#333,stroke-width:2px
//     style B fill:#ccf,stroke:#333,stroke-width:2px
//     style C fill:#ccf,stroke:#333,stroke-width:2px
//     style D fill:#ccf,stroke:#333,stroke-width:2px
//     style E fill:#ccf,stroke:#333,stroke-width:2px
//     style F fill:#ccf,stroke:#333,stroke-width:2px

//     linkStyle 0,1,2,3,4,5 stroke:#333,stroke-width:2px
// `;

// Simple global cache for diagram state
const diagramCache = new Map<string, {
  elements: ExcalidrawElement[];
  files: BinaryFileData[];
  timestamp: number;
}>();

// Function to clear old cache entries
const clearOldCacheEntries = () => {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutes

  // Remove entries older than maxAge
  for (const [key, value] of diagramCache.entries()) {
    if (now - value.timestamp > maxAge) {
      console.log("Removing old cache entry:", key);
      diagramCache.delete(key);
    }
  }

  // If cache is still too large, remove oldest entries
  if (diagramCache.size > 10) {
    const entries = Array.from(diagramCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Keep only the 5 most recent entries
    const entriesToRemove = entries.slice(0, entries.length - 5);
    for (const [key] of entriesToRemove) {
      console.log("Removing excess cache entry:", key);
      diagramCache.delete(key);
    }
  }
};

/**
 * Comprehensive mermaid syntax fixer
 * This function attempts to fix common mermaid syntax issues
 */
const fixMermaidSyntax = (syntax: string): string => {
  // Make a copy of the original syntax
  let fixedSyntax = syntax.trim();

  try {
    // Fix 1: Add graph type if missing
    if (!fixedSyntax.startsWith("graph") &&
        !fixedSyntax.startsWith("flowchart") &&
        !fixedSyntax.startsWith("sequenceDiagram") &&
        !fixedSyntax.startsWith("classDiagram")) {
      fixedSyntax = "flowchart TD\n" + fixedSyntax;
    }

    // Fix 2: Replace curly braces with square brackets for node labels
    // This is a common issue with mermaid parsing
    let lines = fixedSyntax.split('\n');
    let updatedLines = [];

    for (let line of lines) {
      // Skip comment lines and lines that are part of subgraphs
      if (line.trim().startsWith('%') || line.trim().startsWith('subgraph') || line.trim().startsWith('end')) {
        updatedLines.push(line);
        continue;
      }

      // Replace node definitions with curly braces
      // Pattern: A{Some Label} -> A["Some Label"]
      const nodeWithCurlyBraces = /([A-Za-z0-9_-]+)\s*{([^}]*)}/g;
      line = line.replace(nodeWithCurlyBraces, (match, id, label) => {
        return `${id}["${label}"]`;
      });

      updatedLines.push(line);
    }

    fixedSyntax = updatedLines.join('\n');

    // Fix 3: Ensure proper spacing around arrows
    fixedSyntax = fixedSyntax.replace(/([^\s])(-->|---|->|==>|--x|<-->)([^\s])/g, '$1 $2 $3');

    // Fix 4: Fix specific Azure Functions issue from the error log
    fixedSyntax = fixedSyntax.replace(/C{Azure Functions \(URL Shortener\)}/g, 'C["Azure Functions (URL Shortener)"]');

    // Fix 5: Replace problematic characters in node IDs
    // This regex finds node IDs that might be causing issues
    const nodeIdRegex = /\b([A-Za-z0-9_-]+)(\s*\[)/g;
    fixedSyntax = fixedSyntax.replace(nodeIdRegex, (match, id, bracket) => {
      // Replace spaces and special characters in the ID
      const safeId = id.replace(/[^A-Za-z0-9_-]/g, '_');
      return safeId + bracket;
    });

    // Fix 6: Ensure all subgraphs have end statements
    let subgraphCount = 0;
    let endCount = 0;

    for (const line of fixedSyntax.split('\n')) {
      if (line.trim().startsWith('subgraph')) {
        subgraphCount++;
      } else if (line.trim() === 'end') {
        endCount++;
      }
    }

    // Add missing end statements
    if (subgraphCount > endCount) {
      for (let i = 0; i < subgraphCount - endCount; i++) {
        fixedSyntax += '\nend';
      }
    }

    return fixedSyntax;
  } catch (error) {
    console.error("Error fixing mermaid syntax:", error);
    return syntax; // Return original if fixing fails
  }
};

/**
 * Fallback renderer that uses direct DOM manipulation to render mermaid
 */
const renderMermaidFallback = (syntax: string, elementRef: HTMLElement): void => {
  try {
    console.log("Attempting to render mermaid diagram with syntax:", syntax.substring(0, 50) + "...");

    // Clear the element
    elementRef.innerHTML = '';

    // Create a unique ID for this render
    const id = `mermaid-${Date.now()}`;

    // Create a div with the ID
    const container = document.createElement('div');
    container.id = id;
    container.style.width = '100%';
    container.style.textAlign = 'center';

    // Add the div to the element
    elementRef.appendChild(container);

    // Create a pre element with the mermaid syntax
    const pre = document.createElement('pre');
    pre.className = 'mermaid';
    pre.textContent = syntax;
    container.appendChild(pre);

    // Re-initialize mermaid to ensure it's using the latest configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      logLevel: 3,
      fontFamily: 'Inter, sans-serif',
    });

    // Try the first rendering method - mermaid.init
    try {
      mermaid.init(undefined, pre).then(() => {
        console.log("Mermaid diagram rendered successfully with init method");
      }).catch(error => {
        console.error("Error rendering mermaid with init method, trying render method:", error);

        // If init fails, try the render method
        try {
          // Remove the pre element
          container.removeChild(pre);

          // Use the render method instead
          mermaid.render(id, syntax).then(({ svg }) => {
            container.innerHTML = svg;
            console.log("Mermaid diagram rendered successfully with render method");
          }).catch(renderError => {
            console.error("Error rendering mermaid with render method:", renderError);

            // If both methods fail, try a third approach - direct SVG embedding
            try {
              // Create a simple SVG representation of the diagram
              const simpleSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="400" viewBox="0 0 800 400">
                  <style>
                    text { font-family: Inter, sans-serif; font-size: 14px; }
                    .node rect { fill: #f0f0f0; stroke: #999; stroke-width: 1px; }
                    .node text { fill: #333; }
                    .edge path { stroke: #666; stroke-width: 1.5px; fill: none; }
                    .edge text { fill: #666; }
                  </style>
                  <g class="diagram">
                    <g class="node" transform="translate(400, 50)">
                      <rect width="200" height="50" rx="5" ry="5"></rect>
                      <text x="100" y="30" text-anchor="middle">Diagram Preview</text>
                    </g>
                    <g class="node" transform="translate(400, 200)">
                      <rect width="200" height="50" rx="5" ry="5"></rect>
                      <text x="100" y="30" text-anchor="middle">Rendering Error</text>
                    </g>
                    <g class="edge">
                      <path d="M400,100 L400,200"></path>
                      <text x="410" y="150" text-anchor="start">Please check source</text>
                    </g>
                  </g>
                </svg>
              `;

              container.innerHTML = simpleSvg;

              // Add error message below the SVG
              const errorDiv = document.createElement('div');
              errorDiv.style.color = '#d63031';
              errorDiv.style.padding = '15px';
              errorDiv.style.marginTop = '10px';
              errorDiv.style.backgroundColor = '#f8f9fa';
              errorDiv.style.borderRadius = '5px';
              errorDiv.style.border = '1px solid #e9ecef';
              errorDiv.innerHTML = `
                <p><strong>Error rendering diagram:</strong> ${renderError.message}</p>
                <p>Please check the diagram syntax in the Source tab.</p>
              `;
              container.appendChild(errorDiv);

            } catch (svgError) {
              container.innerHTML = `<div style="color: red; padding: 20px;">
                <p><strong>Error rendering diagram:</strong> ${renderError.message}</p>
                <p>Please check the diagram syntax in the Source tab.</p>
              </div>`;
            }
          });
        } catch (fallbackError) {
          console.error("Error in mermaid fallback rendering:", fallbackError);
          container.innerHTML = `<div style="color: red; padding: 20px;">
            <p><strong>Error rendering diagram:</strong> ${error.message}</p>
            <p>Please check the diagram syntax in the Source tab.</p>
          </div>`;
        }
      });
    } catch (initError) {
      console.error("Error with mermaid.init:", initError);
      container.innerHTML = `<div style="color: red; padding: 20px;">
        <p><strong>Error initializing mermaid:</strong> ${initError instanceof Error ? initError.message : String(initError)}</p>
        <p>Please check the diagram syntax in the Source tab.</p>
      </div>`;
    }
  } catch (error) {
    console.error("Error in renderMermaidFallback:", error);
    elementRef.innerHTML = `<div style="color: red; padding: 20px;">
      <p><strong>Error rendering diagram:</strong> ${error instanceof Error ? error.message : String(error)}</p>
      <p>Please check the diagram syntax in the Source tab.</p>
    </div>`;
  }
};

const ExcalidrawFrame = ({
  mermaidSyntax,
  cloudProvider,
  proposalTitle
}: {
  mermaidSyntax: string;
  cloudProvider: CloudProviderType;
  proposalTitle: string;
}) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState<string | null>("excalidraw");
  const [fixedSyntax, setFixedSyntax] = useState<string | null>(null);
  const [isMermaidRendering, setIsMermaidRendering] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const initAttempted = useRef(false);
  const previousMermaid = useRef<string>(mermaidSyntax);
  const renderAttempts = useRef(0);
  const currentProposalTitle = useRef<string>(proposalTitle);

  // Use a simple hash function to create a more unique key
  const hashString = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  };

  const cacheKey = `${proposalTitle}-${cloudProvider}-${hashString(mermaidSyntax)}`;

  // Reset initialization state when mermaid syntax or proposal title changes
  useEffect(() => {
    const proposalChanged = currentProposalTitle.current !== proposalTitle;
    const syntaxChanged = previousMermaid.current !== mermaidSyntax;

    if (proposalChanged || syntaxChanged) {
      console.log("Proposal or mermaid syntax changed, resetting initialization state");
      console.log("Current proposal:", proposalTitle);
      console.log("Previous proposal:", currentProposalTitle.current);

      initAttempted.current = false;
      renderAttempts.current = 0;
      previousMermaid.current = mermaidSyntax;
      currentProposalTitle.current = proposalTitle;

      // Reset fixed syntax
      setFixedSyntax(null);

      // Force initialization if API is already available
      if (excalidrawAPI) {
        console.log("Excalidraw API available, initializing immediately");
        initializeDiagram();
      }
    }
  }, [mermaidSyntax, proposalTitle, excalidrawAPI]);

  // Render mermaid diagram directly in the mermaid tab
  useEffect(() => {
    if (mermaidRef.current && activeTab === "mermaid") {
      try {
        console.log("Rendering mermaid diagram in mermaid tab");
        // Set rendering state to true
        setIsMermaidRendering(true);

        // Try with fixed syntax if available, otherwise use original
        const syntaxToRender = fixedSyntax || mermaidSyntax;

        // Add a small delay to ensure the DOM is ready
        setTimeout(() => {
          renderMermaidFallback(syntaxToRender, mermaidRef.current!);
          // Set rendering to false after a short delay to ensure the diagram has time to render
          setTimeout(() => {
            setIsMermaidRendering(false);
          }, 500);
        }, 100);
      } catch (err) {
        console.error("Error rendering mermaid:", err);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<div style="color: red; padding: 20px;">Error rendering mermaid: ${err instanceof Error ? err.message : String(err)}</div>`;
        }
        setIsMermaidRendering(false);
      }
    }
  }, [mermaidSyntax, activeTab, fixedSyntax]);

  // Main initialization function
  const initializeDiagram = async () => {
    if (!excalidrawAPI) return;

    console.log("Initializing diagram for proposal:", proposalTitle);
    console.log("Cache key:", cacheKey);
    setIsLoading(true);
    setError(null);
    renderAttempts.current += 1;

    // Clear old cache entries
    clearOldCacheEntries();

    try {
      // Always clear the scene first to avoid stale diagrams
      excalidrawAPI.updateScene({ elements: [] });

      // Check if we have a cached version
      if (diagramCache.has(cacheKey)) {
        console.log("Using cached diagram for proposal:", proposalTitle);
        const cached = diagramCache.get(cacheKey)!;

        // Update the scene with cached elements
        excalidrawAPI.updateScene({ elements: cached.elements });

        // Add the files
        if (cached.files.length > 0) {
          excalidrawAPI.addFiles(cached.files);
        }

        // Update the timestamp
        cached.timestamp = Date.now();

        // Force a scroll to content
        setTimeout(() => {
          excalidrawAPI.scrollToContent();
          setIsLoading(false);
        }, 300);

        return;
      }

      // Try with original syntax first
      try {
        console.log("Trying with original syntax");
        const { elements: mermaidElements, files } = await parseMermaidToExcalidraw(mermaidSyntax, {
          themeVariables: { fontSize: "14px" }
        });

        // Convert to excalidraw elements
        const excalidrawElements = convertToExcalidrawElements(mermaidElements);

        // Update the scene with the basic elements
        excalidrawAPI.updateScene({ elements: excalidrawElements });

        // Map the icons based on cloud provider
        console.log("Mapping icons for cloud provider:", cloudProvider);
        const mappedSvgOutput = await mapTextWithSvg(excalidrawElements, cloudProvider);

        // Clear the scene first
        excalidrawAPI.updateScene({ elements: [] });

        // Add files and update scene with mapped elements
        excalidrawAPI.addFiles(mappedSvgOutput.files);
        excalidrawAPI.updateScene({ elements: mappedSvgOutput.elements });

        // Cache the result
        diagramCache.set(cacheKey, {
          elements: mappedSvgOutput.elements,
          files: mappedSvgOutput.files,
          timestamp: Date.now()
        });

        // Force a scroll to content
        setTimeout(() => {
          excalidrawAPI.scrollToContent();
          setIsLoading(false);
        }, 300);

        return;
      } catch (originalError) {
        console.error("Error with original syntax, trying to fix:", originalError);

        // Try to fix the syntax
        const fixed = fixMermaidSyntax(mermaidSyntax);
        setFixedSyntax(fixed);

        if (fixed !== mermaidSyntax) {
          console.log("Fixed syntax:", fixed);

          try {
            // Try again with fixed syntax
            const { elements: mermaidElements, files } = await parseMermaidToExcalidraw(fixed, {
              themeVariables: { fontSize: "14px" }
            });

            // Convert to excalidraw elements
            const excalidrawElements = convertToExcalidrawElements(mermaidElements);

            // Update the scene with the basic elements
            excalidrawAPI.updateScene({ elements: excalidrawElements });

            // Map the icons based on cloud provider
            console.log("Mapping icons for cloud provider:", cloudProvider);
            const mappedSvgOutput = await mapTextWithSvg(excalidrawElements, cloudProvider);

            // Clear the scene first
            excalidrawAPI.updateScene({ elements: [] });

            // Add files and update scene with mapped elements
            excalidrawAPI.addFiles(mappedSvgOutput.files);
            excalidrawAPI.updateScene({ elements: mappedSvgOutput.elements });

            // Cache the result
            diagramCache.set(cacheKey, {
              elements: mappedSvgOutput.elements,
              files: mappedSvgOutput.files,
              timestamp: Date.now()
            });

            // Force a scroll to content
            setTimeout(() => {
              excalidrawAPI.scrollToContent();
              setIsLoading(false);
            }, 300);

            // Show a warning that syntax was fixed
            setError("Diagram syntax was automatically fixed. Check the 'Source' tab to see the changes.");

            return;
          } catch (fixedError) {
            console.error("Error with fixed syntax:", fixedError);
            throw new Error(`Failed to render diagram even with fixed syntax: ${fixedError instanceof Error ? fixedError.message : String(fixedError)}`);
          }
        } else {
          // If we couldn't fix it, throw the original error
          throw originalError;
        }
      }
    } catch (err) {
      console.error("Error initializing diagram:", err);

      // If we've tried too many times, give up and switch to mermaid view
      if (renderAttempts.current >= 2) {
        setError(`Failed to initialize diagram: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
        setActiveTab("mermaid");
      } else {
        // Try one more time with a simple flowchart
        try {
          const simpleSyntax = `flowchart TD
            A[Start] --> B[End]`;

          const { elements: mermaidElements, files } = await parseMermaidToExcalidraw(simpleSyntax, {
            themeVariables: { fontSize: "14px" }
          });

          // Convert to excalidraw elements
          const excalidrawElements = convertToExcalidrawElements(mermaidElements);

          // Update the scene with the basic elements
          excalidrawAPI.updateScene({ elements: excalidrawElements });

          setError(`Failed to render the diagram. Using a placeholder instead. Error: ${err instanceof Error ? err.message : String(err)}`);
          setIsLoading(false);
        } catch (finalError) {
          // Give up and switch to mermaid view
          setError(`Failed to initialize diagram: ${err instanceof Error ? err.message : String(err)}`);
          setIsLoading(false);
          setActiveTab("mermaid");
        }
      }
    }
  };

  // Initialize when the API is available
  useEffect(() => {
    if (excalidrawAPI && !initAttempted.current) {
      console.log("ExcalidrawFrame: API available, initializing for the first time");
      initAttempted.current = true;
      initializeDiagram();
    }
  }, [excalidrawAPI]);

  // Re-initialize when mermaid syntax or cloud provider changes
  useEffect(() => {
    if (excalidrawAPI) {
      console.log("ExcalidrawFrame: Mermaid syntax or cloud provider changed, reinitializing");
      initAttempted.current = true;
      initializeDiagram();
    }
  }, [cloudProvider, retryCount]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (excalidrawAPI) {
        excalidrawAPI.refresh();
        excalidrawAPI.scrollToContent();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [excalidrawAPI]);

  // Retry initialization if it fails
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    renderAttempts.current = 0;
  };

  // Clear the cache completely
  const handleClearCache = () => {
    console.log("Clearing diagram cache");
    diagramCache.clear();
    setRetryCount(prev => prev + 1);
    renderAttempts.current = 0;
  };

  return (
    <div style={{ height: "800px", position: "relative", backgroundColor: "#ffffff", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        top: 5,
        right: 5,
        zIndex: 100,
        fontSize: "10px",
        color: "#fff",
        background: cloudProvider === 'GCP' ?
          'linear-gradient(135deg, #4285F4 0%, #34A853 100%)' :
          cloudProvider === 'AWS' ?
          'linear-gradient(135deg, #FF9900 0%, #232F3E 100%)' :
          'linear-gradient(135deg, #0078D4 0%, #5C2D91 100%)',
        padding: "4px 10px",
        borderRadius: "20px",
        maxWidth: "250px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Text size="xs" fw={500} style={{ color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
          {cloudProvider} - {proposalTitle.length > 15 ? proposalTitle.substring(0, 15) + "..." : proposalTitle}
        </Text>
      </div>

      {isLoading && activeTab === "excalidraw" && (
        <Center style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, background: "rgba(255, 255, 255, 0.9)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Loader size="xl" color="dark" />
            <Text mt={10} fw={500} c="dimmed">Rendering diagram...</Text>
          </div>
        </Center>
      )}

      {error && activeTab === "excalidraw" && !error.includes("Failed to initialize") && (
        <div style={{ position: "absolute", top: 30, left: 0, right: 0, zIndex: 10, padding: "0 20px" }}>
          <Alert title="Diagram Issue" color="yellow" withCloseButton onClose={() => setError(null)} icon={<IconBrush size={16} />}>
            {error}
          </Alert>
        </div>
      )}

      {error && error.includes("Failed to initialize") && activeTab === "excalidraw" && (
        <Center style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, background: "rgba(255, 255, 255, 0.95)", flexDirection: "column" }}>
          <Paper shadow="md" p="lg" withBorder style={{ maxWidth: "80%", textAlign: "center" }}>
            <Text color="red" mb={20} fw={500}>
              {error}
            </Text>
            <Group>
              <Button color="dark" onClick={handleRetry} leftSection={<IconRefresh size={16} />}>
                Retry
              </Button>
              <Button variant="outline" color="dark" onClick={() => setActiveTab("mermaid")} leftSection={<IconBrush size={16} />}>
                View as Mermaid
              </Button>
            </Group>
          </Paper>
        </Center>
      )}

      <Tabs value={activeTab} onChange={setActiveTab} style={{ height: "100%" }} variant="outline" color="dark">
        <Tabs.List style={{ justifyContent: "center", borderBottom: "1px solid #eee" }}>
          <Tabs.Tab value="excalidraw" leftSection={<IconArrowsMaximize size={16} />}>Interactive Diagram</Tabs.Tab>
          <Tabs.Tab value="mermaid" leftSection={<IconBrush size={16} />}>Mermaid View</Tabs.Tab>
          <Tabs.Tab value="source" leftSection={<IconCode size={16} />}>Source</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="excalidraw" style={{ height: "calc(100% - 40px)" }}>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
            initialData={{
              appState: {
                viewBackgroundColor: "#ffffff",
              },
              scrollToContent: true,
            }}
            gridModeEnabled={false}
            zenModeEnabled={false}
            theme="light"
          />

          {!isLoading && !error?.includes("Failed to initialize") && activeTab === "excalidraw" && (
            <div style={{ position: "absolute", bottom: 15, left: 0, right: 0, zIndex: 5, textAlign: "center" }}>
              <Paper shadow="sm" p="xs" style={{ display: "inline-flex", backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "8px" }}>
                <Tooltip label="Center the diagram">
                  <Button
                    size="sm"
                    variant="subtle"
                    color="dark"
                    onClick={() => excalidrawAPI?.scrollToContent()}
                    style={{ marginRight: 10 }}
                    leftSection={<IconArrowsMaximize size={16} />}
                  >
                    Center
                  </Button>
                </Tooltip>
                <Tooltip label="Debug and refresh the diagram">
                  <Button
                    size="sm"
                    variant="subtle"
                    color="gray"
                    onClick={() => {
                      console.log("Debug info:", {
                        proposalTitle,
                        mermaidSyntax,
                        fixedSyntax,
                        cloudProvider,
                        cacheKey,
                        cached: diagramCache.get(cacheKey),
                        elements: excalidrawAPI?.getSceneElements()
                      });

                      // Force a refresh
                      renderAttempts.current = 0;
                      initializeDiagram();
                    }}
                    style={{ marginRight: 10 }}
                    leftSection={<IconRefresh size={16} />}
                  >
                    Refresh
                  </Button>
                </Tooltip>
                <Tooltip label="Clear the diagram cache">
                  <Button
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={handleClearCache}
                    leftSection={<IconTrash size={16} />}
                  >
                    Clear Cache
                  </Button>
                </Tooltip>
              </Paper>
            </div>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="mermaid" style={{ height: "calc(100% - 40px)", padding: "20px", overflow: "auto" }}>
          <Paper shadow="xs" p="md" withBorder style={{ backgroundColor: "#f9f9f9", minHeight: "500px", position: "relative" }}>
            <Text size="xs" color="dimmed" style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
              Mermaid Diagram View
            </Text>

            <div ref={mermaidRef} style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: "20px" }}></div>

            {/* Loading indicator for mermaid rendering */}
            {activeTab === "mermaid" && isMermaidRendering && (
              <Center style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: "none" }}>
                <Loader size="sm" color="gray" style={{ opacity: 0.5 }} />
              </Center>
            )}
          </Paper>

          <Group mt="md" justify="center" gap="md">
            <Tooltip label="Refresh the Mermaid diagram">
              <Button
                variant="subtle"
                color="dark"
                size="sm"
                leftSection={<IconRefresh size={16} />}
                onClick={() => {
                  if (mermaidRef.current) {
                    setIsMermaidRendering(true);
                    const syntaxToRender = fixedSyntax || mermaidSyntax;
                    renderMermaidFallback(syntaxToRender, mermaidRef.current);
                    setTimeout(() => setIsMermaidRendering(false), 500);
                  }
                }}
              >
                Refresh Diagram
              </Button>
            </Tooltip>

            <Tooltip label="View diagram source code">
              <Button
                variant="subtle"
                color="dark"
                size="sm"
                leftSection={<IconCode size={16} />}
                onClick={() => setActiveTab("source")}
              >
                View Source
              </Button>
            </Tooltip>
          </Group>

          <Text size="xs" color="dimmed" mt="md" style={{ textAlign: "center" }}>
            This view shows a static rendering of the diagram using Mermaid syntax.
            For interactive features, use the "Interactive Diagram" tab.
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="source" style={{ height: "calc(100% - 40px)", padding: "20px", overflow: "auto" }}>
          {fixedSyntax && fixedSyntax !== mermaidSyntax && (
            <Alert title="Syntax Fixed" color="green" mb={20} icon={<IconFileCode size={16} />}>
              The original syntax had errors and was automatically fixed. Below you can see both versions.
            </Alert>
          )}

          {fixedSyntax && fixedSyntax !== mermaidSyntax && (
            <>
              <Paper withBorder p="md" mb={30} style={{ backgroundColor: "#f9f9f9", position: "relative" }}>
                <Text size="sm" mb={10} fw={700}>Fixed Mermaid Syntax:</Text>
                <Code block style={{ whiteSpace: "pre-wrap", backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "4px", fontSize: "0.9em", lineHeight: 1.5 }}>{fixedSyntax}</Code>
                <Tooltip label="Copy to clipboard">
                  <Button
                    variant="subtle"
                    color="dark"
                    size="xs"
                    style={{ position: "absolute", top: 10, right: 10 }}
                    onClick={() => {
                      navigator.clipboard.writeText(fixedSyntax);
                      // You could add a notification here if you have a notification system
                    }}
                    leftSection={<IconCode size={14} />}
                  >
                    Copy
                  </Button>
                </Tooltip>
              </Paper>

              <Paper withBorder p="md" style={{ backgroundColor: "#f9f9f9", position: "relative" }}>
                <Text size="sm" mb={10} fw={700}>Original Mermaid Syntax:</Text>
                <Code block style={{ whiteSpace: "pre-wrap", backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "4px", fontSize: "0.9em", lineHeight: 1.5, opacity: 0.8 }}>{mermaidSyntax}</Code>
                <Tooltip label="Copy to clipboard">
                  <Button
                    variant="subtle"
                    color="dark"
                    size="xs"
                    style={{ position: "absolute", top: 10, right: 10 }}
                    onClick={() => {
                      navigator.clipboard.writeText(mermaidSyntax);
                      // You could add a notification here if you have a notification system
                    }}
                    leftSection={<IconCode size={14} />}
                  >
                    Copy
                  </Button>
                </Tooltip>
              </Paper>
            </>
          )}

          {(!fixedSyntax || fixedSyntax === mermaidSyntax) && (
            <Paper withBorder p="md" style={{ backgroundColor: "#f9f9f9", position: "relative" }}>
              <Text size="sm" mb={10} fw={700}>Mermaid Source Code:</Text>
              <Code block style={{ whiteSpace: "pre-wrap", backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "4px", fontSize: "0.9em", lineHeight: 1.5 }}>{mermaidSyntax}</Code>
              <Tooltip label="Copy to clipboard">
                <Button
                  variant="subtle"
                  color="dark"
                  size="xs"
                  style={{ position: "absolute", top: 10, right: 10 }}
                  onClick={() => {
                    navigator.clipboard.writeText(mermaidSyntax);
                    // You could add a notification here if you have a notification system
                  }}
                  leftSection={<IconCode size={14} />}
                >
                  Copy
                </Button>
              </Tooltip>
            </Paper>
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ExcalidrawFrame;
