import express from 'express';
import multer from 'multer';
import { pipeline } from '@xenova/transformers';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
let captioner = null;

async function getCaptioner() {
  if (!captioner) {
    captioner = await pipeline('image-to-text', 'Xenova/blip-image-captioning-large');
  }
  return captioner;
}

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  try {
    const model = await getCaptioner();
    const result = await model(req.file.buffer);
    const caption = Array.isArray(result) ? result[0].generated_text : result;
    res.json({ caption });
  } catch (err) {
    console.error('Caption generation failed:', err);
    res.status(500).json({ error: 'Caption generation failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Image analysis server running on port ${PORT}`);
});
