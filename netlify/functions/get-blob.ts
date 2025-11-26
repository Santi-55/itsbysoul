// JS-compatible Netlify Function (no type imports)
const { get } = require('@netlify/blobs')

// Serves a blob by key: /.netlify/functions/get-blob?key=portfolio/<category>/<filename>
exports.handler = async (event: any) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' }
  const key = event.queryStringParameters?.key
  if (!key) return { statusCode: 400, body: 'Missing key' }

  try {
    const b = await get(key)
    if (!b) return { statusCode: 404, body: 'Not found' }

    const body = await b.arrayBuffer()
    const contentType = b.contentType || 'application/octet-stream'
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      body: Buffer.from(body).toString('base64'),
      isBase64Encoded: true,
    }
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || 'Error fetching blob' }
  }
}
