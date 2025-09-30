const DEFAULT_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash-latest';
const DEFAULT_VISION_MODEL = process.env.GEMINI_VISION_MODEL || DEFAULT_TEXT_MODEL;
const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

function sanitizePrompt(text) {
  return typeof text === 'string' ? text.replace(/[\s\u0000-\u001f]+$/g, '').trim() : '';
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callGemini(model, body, attempt = 0) {
  const url = ${BASE_URL}/:generateContent?key=;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  let json;
  try {
    json = await response.json();
  } catch (error) {
    const err = new Error(Gemini response parsing failed ().);
    err.statusCode = response.status;
    throw err;
  }

  if (!response.ok) {
    if (response.status === 429 && attempt < 2) {
      await wait(300 * Math.pow(2, attempt));
      return callGemini(model, body, attempt + 1);
    }
    const err = new Error(json?.error?.message || Gemini API error ().);
    err.statusCode = response.status;
    throw err;
  }

  return json;
}

function extractTextFromCandidates(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return '';
  }
  return parts
    .map(part => (typeof part.text === 'string' ? part.text : ''))
    .filter(Boolean)
    .join('\n')
    .trim();
}

async function handleDescribeImage(payload) {
  const image = payload.image || {};
  const data = sanitizePrompt(image.base64 || image.data || '');
  const mimeType = sanitizePrompt(image.mimeType || '');
  const prompt = sanitizePrompt(payload.prompt);

  if (!data || !mimeType) {
    throw new Error('Missing image data or mime type.');
  }
  if (!prompt) {
    throw new Error('Missing description prompt.');
  }

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { data, mimeType } }
        ]
      }
    ]
  };

  const model = sanitizePrompt(payload.model) || DEFAULT_VISION_MODEL;
  const response = await callGemini(model, requestBody);
  const description = extractTextFromCandidates(response);

  if (!description) {
    throw new Error('Gemini did not return a description.');
  }

  return { description };
}


async function handleRefineDescription(payload) {
  const source = sanitizePrompt(payload.source);
  if (!source) {
    throw new Error('Missing description to refine.');
  }

  const mode = sanitizePrompt(payload.descriptionMode) || 'describe-detail';
  const aspect = sanitizePrompt(payload.aspectRatio) || '1:1';
  const naturalLanguage = Boolean(payload.naturalLanguage);
  const customQuestion = sanitizePrompt(payload.customQuestion || '');

  if (mode === 'custom-question' && !customQuestion) {
    throw new Error('Missing custom question.');
  }

  let modeInstruction;
  switch (mode) {
    case 'describe-brief':
      modeInstruction = 'Summarize the key visual elements in two sentences, highlighting the main subject and mood.';
      break;
    case 'person-description':
      modeInstruction = 'Describe the person, covering pose, facial features, clothing, emotions, and surroundings.';
      break;
    case 'object-recognition':
      modeInstruction = 'List the primary objects and elements visible, noting materials, shapes, and placement.';
      break;
    case 'art-style':
      modeInstruction = 'Analyse the artistic style, medium, colour palette, and composition so it can inspire a new prompt.';
      break;
    case 'text-extraction':
      modeInstruction = 'Extract and transcribe any legible text. If none exists, state that clearly.';
      break;
    case 'midjourney':
      modeInstruction = `Rewrite the idea as a Midjourney-ready prompt with vivid detail, style, lighting, and camera notes. Target aspect ratio ${aspect}.`;
      break;
    case 'stable-diffusion':
      modeInstruction = `Rewrite the idea as a Stable Diffusion prompt, including style, lighting, and aspect ratio ${aspect}. Suggest a concise negative prompt if helpful.`;
      break;
    case 'custom-question':
      modeInstruction = customQuestion;
      break;
    case 'describe-detail':
    default:
      modeInstruction = 'Provide a richly detailed description covering subjects, environment, style, lighting, mood, and camera perspective.';
      break;
  }

  const instructions = [
    `Base description:
"""${source}"""`,
    modeInstruction
  ];

  if (mode !== 'text-extraction' && mode !== 'custom-question') {
    instructions.push(`Target aspect ratio: ${aspect}.`);
  }

  instructions.push(
    naturalLanguage
      ? 'Respond in natural language paragraphs that read clearly to humans.'
      : 'Respond with a single text-to-image prompt optimised for creative generation. Include style, lighting, composition, and mood details.'
  );

  instructions.push('Keep the response concise and focused.');

  const userPrompt = instructions
    .filter(Boolean)
    .join('

')
    .trim();

  const systemInstruction = 'You are an expert prompt engineer. Refine the provided description according to the instructions while preserving factual accuracy.';

  const requestBody = {
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [
      {
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      temperature: naturalLanguage ? 0.8 : 0.6,
      topP: 0.9,
      maxOutputTokens: naturalLanguage ? 512 : 256
    }
  };

  const model = sanitizePrompt(payload.model) || DEFAULT_TEXT_MODEL;
  const response = await callGemini(model, requestBody);
  const description = extractTextFromCandidates(response);

  if (!description) {
    throw new Error('Gemini did not return a description.');
  }

  return { description };
}

function buildVariationPromptPayload(payload) {
  const basePrompt = sanitizePrompt(payload.prompt);
  if (!basePrompt) {
    throw new Error('Missing base prompt.');
  }

  const contextSegments = [];
  if (payload.platformLabel || payload.platform) {
    contextSegments.push(Target platform: .);
  }
  if (payload.aspectRatio) {
    contextSegments.push(Preferred aspect ratio: .);
  }
  if (Array.isArray(payload.tags) && payload.tags.length) {
    const tags = payload.tags
      .map(tag => sanitizePrompt(String(tag)))
      .filter(Boolean)
      .slice(0, 15)
      .join(', ');
    if (tags) {
      contextSegments.push(Image keywords: .);
    }
  }
  if (payload.dominantColor) {
    contextSegments.push(Dominant color: .);
  }
  if (payload.fromImage) {
    contextSegments.push('The base prompt originated from an image description.');
  }
  if (payload.magicEnhance) {
    contextSegments.push('Enhancement mode is enabled; preserve clarity and structure.');
  }

  const userPrompt = [Base prompt: "".]
    .concat(contextSegments)
    .join(' ')
    .trim();

  const systemInstruction = 'You are an expert prompt engineer for advanced text-to-image models. '
    + 'Rewrite the provided idea into one optimized prompt and three creative variations. '
    + 'Each entry must include a short descriptive title. '
    + 'Ensure prompts contain style, lighting, composition, and mood details. '
    + 'Return strictly valid JSON matching the provided schema.';

  return {
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [
      {
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          variations: {
            type: 'ARRAY',
            minItems: 2,
            maxItems: 6,
            items: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING' },
                prompt: { type: 'STRING' }
              },
              required: ['title', 'prompt']
            }
          }
        },
        required: ['variations']
      }
    }
  };
}

function parseVariationsPayload(rawText) {
  const cleaned = rawText.replace(/`(?:json)?/gi, '').replace(/`/g, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error('Gemini returned invalid variation JSON.');
  }

  const variations = Array.isArray(parsed?.variations) ? parsed.variations : [];
  return variations
    .map((item, index) => {
      const title = sanitizePrompt(item?.title) || Variation ;
      const prompt = sanitizePrompt(item?.prompt);
      if (!prompt) {
        return null;
      }
      return { title, prompt };
    })
    .filter(Boolean);
}

async function handlePromptVariations(payload) {
  const requestBody = buildVariationPromptPayload(payload);
  const model = sanitizePrompt(payload.model) || DEFAULT_TEXT_MODEL;
  const response = await callGemini(model, requestBody);
  const rawText = extractTextFromCandidates(response);

  if (!rawText) {
    throw new Error('Gemini returned an empty response.');
  }

  const variations = parseVariationsPayload(rawText);
  if (!variations.length) {
    throw new Error('Gemini did not return any valid variations.');
  }

  return { variations };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { success: true });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, message: 'Method not allowed.' });
  }

  if (!API_KEY) {
    return jsonResponse(500, { success: false, message: 'Gemini API key is not configured.' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return jsonResponse(400, { success: false, message: 'Invalid JSON payload.' });
  }

  const mode = sanitizePrompt(payload.mode);
  if (mode !== 'describe-image' && mode !== 'prompt-variations' && mode !== 'refine-description') {
    return jsonResponse(400, { success: false, message: 'Unsupported mode requested.' });
  }

  try {
    let data;
    if (mode === 'describe-image') {
      data = await handleDescribeImage(payload);
    } else if (mode === 'prompt-variations') {
      data = await handlePromptVariations(payload);
    } else {
      data = await handleRefineDescription(payload);
    }
    return jsonResponse(200, { success: true, data });
  } catch (error) {
    console.error('Gemini proxy error', error);
    const statusCode = error.statusCode && Number.isInteger(error.statusCode) ? error.statusCode : 500;
    return jsonResponse(statusCode, { success: false, message: error.message || 'Gemini request failed.' });
  }
};
