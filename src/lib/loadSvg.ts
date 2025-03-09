import { type DataURL } from "@excalidraw/excalidraw/types/types";

const loadSvg = async (fileUrl: string) => {
  try {
    // const svgUrl = new URL(fileUrl, import.meta.url).toString();
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Failed to load SVG: ${response.status} ${response.statusText} for ${fileUrl}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = new Blob([uint8Array], { type: "image/svg+xml" });
    const dataURL = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return dataURL as DataURL;
  } catch (error) {
    console.error("Error loading SVG file:", error, "File URL:", fileUrl);
    // Return a fallback or placeholder SVG
    return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIGZpbGw9IiNmMmYyZjIiIHN0cm9rZT0iI2JiYiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMzIiIHk9IjMyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIj5JY29uPC90ZXh0Pjwvc3ZnPg==" as DataURL;
  }
};

export default loadSvg;
