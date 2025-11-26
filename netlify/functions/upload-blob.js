// Upload image to Netlify Blobs under portfolio/<category>/<filename>
// Accepts multipart/form-data with fields: category, file
const { put } = require('@netlify/blobs')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  const ct = event.headers['content-type'] || event.headers['Content-Type']
  
  // JSON path: { category, filename, contentType, data (base64) }
  if (ct && ct.includes('application/json')) {
    try {
      const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '')
      const { category = 'retratos', filename, contentType = 'application/octet-stream', data } = JSON.parse(raw || '{}')
      if (!filename || !data) return { statusCode: 400, body: 'Missing filename or data' }
      const key = `portfolio/${category}/${filename}`
      const buf = Buffer.from(data, 'base64')
      await put(key, buf, { contentType })
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, key, category, fileName: filename }) }
    } catch (e) {
      return { statusCode: 500, body: e?.message || 'Upload JSON error' }
    }
  }

  if (!ct || !ct.startsWith('multipart/form-data')) {
    return { statusCode: 400, body: 'Expected multipart/form-data or application/json' }
  }
  try {
    const boundary = ct.split('boundary=')[1]
    if (!boundary) return { statusCode: 400, body: 'No boundary' }
    const buf = Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'utf8')
    const parts = buf.toString('binary').split(`--${boundary}`)
    let category = 'retratos'
    let fileName = `upload-${Date.now()}`
    let fileContent = null
    let fileType = 'application/octet-stream'

    for (const part of parts) {
      const idx = part.indexOf('\r\n\r\n')
      if (idx === -1) continue
      const rawHeaders = part.slice(0, idx)
      const rawBody = part.slice(idx + 4)
      const headers = rawHeaders.split('\r\n')
      const disp = headers.find((h) => /content-disposition/i.test(h)) || ''
      const nameMatch = /name="([^"]+)"/i.exec(disp)
      const filenameMatch = /filename="([^"]+)"/i.exec(disp)
      if (!nameMatch) continue
      const fieldName = nameMatch[1]
      if (filenameMatch) {
        const typeHeader = headers.find((h) => /content-type/i.test(h)) || ''
        const typeMatch = /content-type:\s*([^\r\n]+)/i.exec(typeHeader)
        if (typeMatch) fileType = typeMatch[1].trim()
        fileName = filenameMatch[1]
        const bodyStr = rawBody.replace(/\r\n--$/, '').replace(/\r\n$/, '')
        fileContent = Buffer.from(bodyStr, 'binary')
      } else {
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
  } catch (e) {
    return { statusCode: 500, body: e?.message || 'Upload error' }
  }
}
