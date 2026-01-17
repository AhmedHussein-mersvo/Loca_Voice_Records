import Sound from 'react-native-nitro-sound';

const onStartRecord = async (setRecordSecs, setRecordTime, setRecording) => {
  Sound.addRecordBackListener(e => {
    setRecordSecs(e.currentPosition);
    setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
  });
  await Sound.startRecorder();
  setRecording(true);
};

export default onStartRecord;
