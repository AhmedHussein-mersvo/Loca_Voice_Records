import RNFS from 'react-native-fs';
import Sound from 'react-native-nitro-sound';
const deleteAudio = async (
  audio,
  playingPath,
  setPlayingPath,
  setIsPaused,
  setPosition,
  setDuration,
  setAudioPlayers,
) => {
  try {
    // 1️⃣ If this audio is playing → stop it
    if (playingPath === audio.path) {
      await Sound.stopPlayer();
      Sound.removePlayBackListener();
      setPlayingPath(null);
      setIsPaused(false);
      setPosition(0);
      setDuration(0);
    }

    // 2️⃣ Delete file
    const exists = await RNFS.exists(audio.path);
    if (exists) {
      await RNFS.unlink(audio.path);
    }

    // 3️⃣ Remove from UI list
    setAudioPlayers(prev => prev.filter(item => item.path !== audio.path));
  } catch (e) {
    console.error('Delete audio error:', e);
  }
};

export default deleteAudio;
