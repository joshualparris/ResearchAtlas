export function getGoogleFileId(url: string): string | null {
  if (!url) return null;
  
  // Handle /file/d/ID/ patterns
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) return fileIdMatch[1];
  
  // Handle /document/d/ID/ patterns
  const docIdMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docIdMatch) return docIdMatch[1];

  // Handle /folders/ID patterns
  const folderIdMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderIdMatch) return folderIdMatch[1];

  // Handle id= query parameter
  try {
    const parsed = new URL(url);
    const id = parsed.searchParams.get("id");
    if (id) return id;
  } catch {
    // ignore
  }

  return null;
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  return url.includes("drive.google.com") || url.includes("docs.google.com");
}

export function getEmbeddedPreviewUrl(url: string, type: string): string | null {
  const fileId = getGoogleFileId(url);
  if (!fileId) return null;

  if (type === "google-doc") {
    return `https://docs.google.com/document/d/${fileId}/preview`;
  }
  
  if (type === "pdf" || type === "docx") {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  if (type === "folder") {
    return null; // Folders shouldn't be embedded
  }

  return `https://drive.google.com/file/d/${fileId}/preview`;
}
