import Sound from 'react-native-nitro-sound';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
const onStopRecord = async (
  folder,
  setAudioPath,
  setRecordSecs,
  setRecordTime,
  setRecording,
) => {
  const from = await Sound.stopRecorder();
  Sound.removeRecordBackListener();

  if (!(await RNFS.exists(folder))) {
    await RNFS.mkdir(folder);
  }

  const fileName =
    Platform.OS === 'ios'
      ? `voice_${Date.now()}.m4a`
      : `voice_${Date.now()}.mp3`;
  const to = `${folder}/${fileName}`;
  await RNFS.copyFile(from, to);

  setAudioPath(to);
  setRecordSecs(0);
  setRecordTime('00:00:00');
  setRecording(false);
};

export default onStopRecord;
