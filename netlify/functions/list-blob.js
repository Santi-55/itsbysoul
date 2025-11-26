// Lists images stored in Netlify Blobs under portfolio/<category>/...
// Returns items with a function URL to fetch the binary (get-blob)
const { list } = require('@netlify/blobs')

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' }
  const cats = ['retratos','eventos','moda','producto','reels','paisajes']
  try {
    const results = []
    for (const cat of cats) {
      const prefix = `portfolio/${cat}/`
      const { blobs } = await list({ prefix, limit: 100 })
      for (const b of blobs) {
        const key = b.key
        const file = key.split('/').pop() || ''
        results.push({
          id: key,
          title: file,
          category: cat,
          src: `/.netlify/functions/get-blob?key=${encodeURIComponent(key)}`,
          size: b.size,
          contentType: b.contentType,
        })
      }
    }
    results.sort((a, b) => String(a.title).localeCompare(String(b.title)))
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: results }) }
  } catch (e) {
    return { statusCode: 500, body: e?.message || 'Error listing blobs' }
  }
}
