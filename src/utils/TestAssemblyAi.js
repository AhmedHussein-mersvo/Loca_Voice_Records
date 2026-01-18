import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

const API_KEY = '456f55b31977468782f1e4d1cc1a7b4f ';

export default async function transcribeAudio2(path, onTextReady) {
  try {
    const cleanPath = path.replace('file://', '');
    const base64Data = await RNFS.readFile(cleanPath, 'base64');
    const binary = Buffer.from(base64Data, 'base64');

    // Upload
    const upload = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        authorization: API_KEY,
        'content-type': 'application/octet-stream',
      },
      body: binary,
    });

    const { upload_url } = await upload.json();

    // Create job
    const create = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ audio_url: upload_url }),
    });

    const { id } = await create.json();

    // Poll for result
    let status = 'queued';

    while (status !== 'completed' && status !== 'error') {
      const poll = await fetch(
        `https://api.assemblyai.com/v2/transcript/${id}`,
        {
          headers: { authorization: API_KEY },
        },
      );

      const data = await poll.json();
      status = data.status;

      if (status === 'completed') {
        onTextReady(data.text);
        return;
      }

      await new Promise(res => setTimeout(res, 2500));
    }
  } catch (e) {
    console.log('Transcription error:', e);
  }
}
