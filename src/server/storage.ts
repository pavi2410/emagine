import { S3Client } from 'bun'

// Initialize S3 client for Railway Bucket
const s3 = new S3Client({
  endpoint: process.env.BUCKET_ENDPOINT!,
  bucket: process.env.BUCKET_NAME!,
  accessKeyId: process.env.BUCKET_ACCESS_KEY_ID!,
  secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY!,
})

/**
 * Save HTML content to S3 bucket
 * @param appId - The app ID (used as folder name)
 * @param html - The HTML content to save
 * @returns The storage path (S3 key)
 */
export async function saveAppHtml(appId: string, html: string): Promise<string> {
  const storagePath = `apps/${appId}/index.html`

  await s3.write(storagePath, html, {
    type: 'text/html',
  })

  return storagePath
}

/**
 * Get HTML content from S3 bucket
 * @param storagePath - The S3 key to read from
 * @returns The HTML content
 */
export async function getAppHtml(storagePath: string): Promise<string> {
  const file = s3.file(storagePath)
  return await file.text()
}

/**
 * Delete app HTML from S3 bucket
 * @param storagePath - The S3 key to delete
 */
export async function deleteAppHtml(storagePath: string): Promise<void> {
  await s3.delete(storagePath)
}

/**
 * Check if an app HTML file exists
 * @param storagePath - The S3 key to check
 * @returns True if the file exists
 */
export async function appHtmlExists(storagePath: string): Promise<boolean> {
  const file = s3.file(storagePath)
  return await file.exists()
}

/**
 * Save a workspace file to S3 bucket
 * @param workspaceId - The workspace ID
 * @param path - The virtual file path
 * @param content - The file content
 * @param mimeType - The MIME type
 * @returns The storage path (S3 key)
 */
export async function saveWorkspaceFile(
  workspaceId: string,
  path: string,
  content: string | Uint8Array,
  mimeType: string
): Promise<string> {
  // Normalize path (remove leading slash)
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const storagePath = `workspaces/${workspaceId}/${normalizedPath}`

  await s3.write(storagePath, content, {
    type: mimeType,
  })

  return storagePath
}

/**
 * Get a workspace file from S3 bucket
 * @param storagePath - The S3 key to read from
 * @returns The file content as ArrayBuffer
 */
export async function getWorkspaceFile(storagePath: string): Promise<ArrayBuffer> {
  const file = s3.file(storagePath)
  return await file.arrayBuffer()
}

/**
 * Delete a workspace file from S3 bucket
 * @param storagePath - The S3 key to delete
 */
export async function deleteWorkspaceFile(storagePath: string): Promise<void> {
  await s3.delete(storagePath)
}
