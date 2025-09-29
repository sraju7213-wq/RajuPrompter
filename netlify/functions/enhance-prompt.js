const API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/qwen/qwen3-coder:free/api';
const API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || 'https://rajuprompter.netlify.app';
const APP_NAME = process.env.OPENROUTER_APP_NAME || 'AI Prompt Generator';

function jsonResponse(statusCode, body = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    body: JSON.stringify(body)
  };
}

function sanitize(text) {
  return typeof text === 'string' ? text.trim() : '';
}

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(204, {});
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, message: 'Method not allowed.' });
  }

  if (!API_KEY) {
    console.error('OpenRouter API key is not configured.');
    return jsonResponse(500, { success: false, message: 'Server configuration error.' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return jsonResponse(400, { success: false, message: 'Invalid JSON payload.' });
  }

  const prompt = sanitize(payload.prompt);
  if (!prompt) {
    return jsonResponse(400, { success: false, message: 'Prompt text is required.' });
  }

  const requestBody = {
    model: 'qwen/qwen3-coder:free',
    messages: [
      {
        role: 'system',
        content: 'You are an expert AI prompt engineer. Enhance user prompts for clarity, creativity, and completeness while preserving the original intent.'
      },
      {
        role: 'user',
        content: `Please refine the following prompt for use with advanced creative models. Respond with the improved prompt only.\n\n${prompt}`
      }
    ],
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 600
  };

  let response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': APP_NAME
      },
      body: JSON.stringify(requestBody)
    });
  } catch (error) {
    console.error('OpenRouter request failed:', error);
    return jsonResponse(502, { success: false, message: 'Unable to reach OpenRouter API.' });
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error('Failed to parse OpenRouter response:', error);
    return jsonResponse(response.status, { success: false, message: 'Invalid response from OpenRouter API.' });
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.message || 'OpenRouter API returned an error.';
    console.error('OpenRouter API error:', message, data);
    return jsonResponse(response.status, { success: false, message });
  }

  const enhancedPrompt = sanitize(data?.choices?.[0]?.message?.content);
  if (!enhancedPrompt) {
    console.error('OpenRouter response missing enhanced prompt:', data);
    return jsonResponse(502, { success: false, message: 'OpenRouter did not return any content.' });
  }

  return jsonResponse(200, {
    success: true,
    data: {
      enhancedPrompt
    }
  });
};
