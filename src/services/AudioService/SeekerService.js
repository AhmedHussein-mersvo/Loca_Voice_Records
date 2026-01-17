import Sound from 'react-native-nitro-sound';

const seekTo = async ms => {
  try {
    await Sound.seekToPlayer(ms);
  } catch (e) {
    console.error('Seek error:', e);
  }
};

export default seekTo;
