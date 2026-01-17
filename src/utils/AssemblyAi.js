import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';

const ASSEMBLY_KEY = '456f55b31977468782f1e4d1cc1a7b4f';

async function transcribeAudio(path, setTranscripts) {
  try {
    // CLEAN PATH
    const filePath = path.replace('file://', '');

    // Read with RNFS
    const base64Data = await RNFS.readFile(filePath, 'base64');
    const binaryData = Buffer.from(base64Data, 'base64');

    // Upload to AssemblyAI
    const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        authorization: ASSEMBLY_KEY,
        'content-type': 'application/octet-stream',
      },
      body: binaryData,
    });

    const uploadUrl = (await uploadRes.json()).upload_url;

    // Start transcription job
    const jobRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: ASSEMBLY_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ audio_url: uploadUrl }),
    });

    const jobId = (await jobRes.json()).id;

    // Polling
    let status = 'queued';
    while (status !== 'completed' && status !== 'error') {
      const poll = await fetch(
        `https://api.assemblyai.com/v2/transcript/${jobId}`,
        { headers: { authorization: ASSEMBLY_KEY } },
      );

      const data = await poll.json();
      status = data.status;

      if (status === 'completed') {
        // 🔥 SAVE PER AUDIO FILE
        setTranscripts(prev => ({
          ...prev,
          [path]: data.text,
        }));

        return;
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  } catch (e) {
    console.log('transcribe error', e);
  }
}

export default transcribeAudio;
