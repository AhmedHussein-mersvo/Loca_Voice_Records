import Sound from 'react-native-nitro-sound';

const onStopRecord = async (setRecording, setFilePath) => {
  const result = await Sound.stopRecorder();
  setRecording(false);

  if (result) {
    setFilePath(result);
    return result; // return audio file path
  }

  return null;
};

export default onStopRecord;
