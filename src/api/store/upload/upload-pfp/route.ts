// src/api/store/upload/upload-pfp/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"

interface UploadPfpBody {
  filename: string
  mimeType: string
  content: string // base64 string
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { filename, mimeType, content } = req.body as any as UploadPfpBody

  if (!filename || !mimeType || !content) {
    return res.status(400).json({
      error: "filename, mimeType, and content (base64) are required.",
    })
  }

  try {
    const { result } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: [
          {
            filename,
            mimeType,
            content,
            access: "public",
          },
        ],
      },
    })

    const uploadedFile = result?.[0]

    if (!uploadedFile?.url) {
      return res.status(500).json({ error: "Upload succeeded but no URL was returned." })
    }

    return res.status(200).json({ url: uploadedFile.url })
  } catch (error: any) {
    console.error("[upload-pfp] uploadFilesWorkflow error:", error)
    return res.status(500).json({ error: error?.message ?? "Upload failed" })
  }
}