// Delete an image from Netlify Blobs by key
// Expects JSON: { key }
const { del } = require('@netlify/blobs')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'DELETE') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '')
    const { key } = JSON.parse(raw || '{}')
    if (!key || typeof key !== 'string') return { statusCode: 400, body: 'Missing key' }
    await del(key)
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, key }) }
  } catch (e) {
    return { statusCode: 500, body: e?.message || 'Delete error' }
  }
}
