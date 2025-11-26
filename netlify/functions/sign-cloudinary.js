// Netlify Function: Sign Cloudinary uploads
// Env required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// Optional: CLOUDINARY_UPLOAD_FOLDER (default itsbysoul/portfolio), ADMIN_KEY to protect access

const crypto = require('crypto')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  // Simple protection via header
  const adminKey = process.env.ADMIN_KEY
  if (adminKey) {
    const provided = event.headers['x-admin-key'] || event.headers['X-Admin-Key']
    if (provided !== adminKey) return { statusCode: 401, body: 'Unauthorized' }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { folder, tags = [], public_id } = body

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'itsbysoul/portfolio'

    if (!cloudName || !apiKey || !apiSecret) {
      return { statusCode: 500, body: 'Missing Cloudinary credentials' }
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const params = {
      folder: folder || defaultFolder,
      timestamp: String(timestamp),
    }
    if (public_id) params.public_id = public_id
    if (tags && tags.length) params.tags = tags.join(',')

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
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      }),
    }
  } catch (e) {
    return { statusCode: 500, body: e?.message || 'Error signing request' }
  }
}
