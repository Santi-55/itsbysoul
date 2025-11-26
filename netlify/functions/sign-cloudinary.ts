import type { Handler } from '@netlify/functions'
import crypto from 'crypto'

// Expects env vars in Netlify site settings
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// Optional: CLOUDINARY_UPLOAD_FOLDER (e.g. itsbysoul/portfolio)

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { folder, tags = [], public_id } = JSON.parse(event.body || '{}') as {
      folder?: string
      tags?: string[]
      public_id?: string
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'itsbysoul/portfolio'

    if (!cloudName || !apiKey || !apiSecret) {
      return { statusCode: 500, body: 'Missing Cloudinary credentials' }
    }

    const timestamp = Math.floor(Date.now() / 1000)

    // Build params to sign (alphabetical by key)
    const params: Record<string, string> = {
      folder: folder || defaultFolder,
      timestamp: String(timestamp),
      ...(public_id ? { public_id } : {}),
      ...(tags && tags.length ? { tags: tags.join(',') } : {}),
    }

    const toSign = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&') + apiSecret

    const signature = crypto.createHash('sha1').update(toSign).digest('hex')

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cloudName,
        apiKey,
        timestamp,
        signature,
        folder: params.folder,
        tags: params.tags || undefined,
        public_id: public_id || undefined,
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      }),
    }
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || 'Error signing request' }
  }
}
