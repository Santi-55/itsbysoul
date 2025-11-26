import type { Handler } from '@netlify/functions'
import { put } from '@netlify/blobs'

// Upload image to Netlify Blobs under portfolio/<category>/<filename>
// Accepts multipart/form-data with fields: category, file

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  const ct = event.headers['content-type'] || event.headers['Content-Type']
  if (!ct || !ct.startsWith('multipart/form-data')) {
    return { statusCode: 400, body: 'Expected multipart/form-data' }
  }

  try {
    const boundary = ct.split('boundary=')[1]
    if (!boundary) return { statusCode: 400, body: 'No boundary' }

    // Simple multipart parser
    const buf = Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'utf8')
    const parts = buf.toString('binary').split(`--${boundary}`)
    let category = 'retratos'
    let fileName = `upload-${Date.now()}`
    let fileContent: Buffer | null = null
    let fileType = 'application/octet-stream'

    for (const part of parts) {
      const [rawHeaders, rawBody] = part.split('\r\n\r\n')
      if (!rawHeaders || !rawBody) continue
      const headers = rawHeaders.split('\r\n')
      const disp = headers.find((h) => /content-disposition/i.test(h)) || ''
      const nameMatch = /name="([^"]+)"/i.exec(disp)
      const filenameMatch = /filename="([^"]+)"/i.exec(disp)
      if (!nameMatch) continue
      const fieldName = nameMatch[1]
      if (filenameMatch) {
        // File field
        const typeHeader = headers.find((h) => /content-type/i.test(h)) || ''
        const typeMatch = /content-type:\s*([^\r\n]+)/i.exec(typeHeader)
        if (typeMatch) fileType = typeMatch[1].trim()
        fileName = filenameMatch[1]
        // Trim trailing CRLF + boundary markers
        const bodyStr = rawBody.replace(/\r\n--$/, '').replace(/\r\n$/, '')
        fileContent = Buffer.from(bodyStr, 'binary')
      } else {
        // Text field
        const val = rawBody.replace(/\r\n--$/, '').replace(/\r\n$/, '')
        if (fieldName === 'category') category = val.trim()
      }
    }

    if (!fileContent) return { statusCode: 400, body: 'No file uploaded' }
    const key = `portfolio/${category}/${fileName}`

    await put(key, fileContent, { contentType: fileType })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, key, category, fileName }),
    }
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || 'Upload error' }
  }
}
