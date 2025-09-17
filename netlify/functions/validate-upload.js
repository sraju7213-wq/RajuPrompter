const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 10 * 1024 * 1024; // 10MB limit

function detectMime(buffer) {
  if (!buffer || buffer.length < 4) {
    return 'unknown';
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return 'unknown';
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ valid: false, message: 'Method not allowed.' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { data, type, size } = payload;

    if (!data || typeof data !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ valid: false, message: 'Missing encoded image data.' })
      };
    }

    if (!Number.isInteger(size) || size <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ valid: false, message: 'Missing or invalid file size.' })
      };
    }

    const buffer = Buffer.from(data, 'base64');

    if (buffer.length !== size) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false, message: 'File size mismatch detected.' })
      };
    }

    if (buffer.length > MAX_BYTES) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false, message: 'File exceeds the 10MB upload limit.' })
      };
    }

    const detectedType = detectMime(buffer);

    if (!ALLOWED_TYPES.has(detectedType)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false, message: 'Unsupported or unsafe image format.' })
      };
    }

    if (type && type !== detectedType) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false, message: 'Reported file type does not match detected content.' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: true, detectedType })
    };
  } catch (error) {
    console.error('validate-upload error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ valid: false, message: 'Unexpected error during validation.' })
    };
  }
};
