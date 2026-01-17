import Sound from 'react-native-nitro-sound';

const toggleSpeed = async (playbackSpeed, setPlaybackSpeed) => {
  const next = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
  setPlaybackSpeed(next);
  await Sound.setPlaybackSpeed(next);
};

export default toggleSpeed;
