import RNFS from 'react-native-fs';
const getAudios = async (
  folder,
  setAudioPlayers,
  AUDIO_EXTENSIONS,
  getAudioDuration,
) => {
  try {
    const exists = await RNFS.exists(folder);
    if (!exists) {
      await RNFS.mkdir(folder);
      setAudioPlayers([]);
      return;
    }

    const files = await RNFS.readDir(folder);

    const audioFiles = files.filter(
      f =>
        f.isFile() &&
        AUDIO_EXTENSIONS.includes(f.name.split('.').pop().toLowerCase()),
    );

    const withDurations = [];

    for (const file of audioFiles) {
      const duration = await getAudioDuration(file.path);
      withDurations.push({ ...file, duration });
    }

    setAudioPlayers(withDurations);
  } catch (e) {
    console.error('Read audio error:', e);
    setAudioPlayers([]);
  }
};

export default getAudios;