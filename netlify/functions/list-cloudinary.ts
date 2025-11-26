import type { Handler } from '@netlify/functions'

// Lists images from Cloudinary by category folders
// Requires env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// Optional: CLOUDINARY_UPLOAD_FOLDER base (defaults to itsbysoul/portfolio)

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const base = process.env.CLOUDINARY_UPLOAD_FOLDER || 'itsbysoul/portfolio'

  if (!cloudName || !apiKey || !apiSecret) {
    return { statusCode: 500, body: 'Missing Cloudinary credentials' }
  }

  const cats = ['retratos','eventos','moda','producto','reels','paisajes'] as const

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    const results: any[] = []

    // Fetch each category sequentially (small lists); could be parallel if needed
    for (const cat of cats) {
      const expression = `folder:${base}/${cat}`
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression, max_results: 100, sort_by: 'public_id', direction: 'asc' }),
      })
      if (!res.ok) throw new Error(`Cloudinary search failed for ${cat}`)
      const data = await res.json()
      for (const r of data.resources || []) {
        results.push({
          id: r.public_id,
          title: r.public_id.split('/').pop(),
          category: cat,
          src: r.secure_url,
          width: r.width,
          height: r.height,
        })
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: results }),
    }
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || 'Error listing Cloudinary images' }
  }
}
