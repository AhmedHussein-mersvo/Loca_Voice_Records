import { Platform } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
export default function RecordComponent({
  folder,
  setAudioPath,
  setRecordSecs,
  setRecordTime,
  setRecording,
  onStartRecord,
  onStopRecord,
  recording,
  recordTime,
}) {
  return (
    <View style={styles.controls}>
      <TouchableOpacity
        disabled={recording}
        style={[styles.startBtn, { opacity: !recording ? 1 : 0.5 }]}
        onPress={() =>
          onStartRecord(setRecordSecs, setRecordTime, setRecording)
        }
      >
        <Text style={styles.btnText}>Start Recording</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!recording}
        style={[styles.stopBtn, { opacity: recording ? 1 : 0.5 }]}
        onPress={() =>
          onStopRecord(
            folder,
            setAudioPath,
            setRecordSecs,
            setRecordTime,
            setRecording,
          )
        }
      >
        <Text style={styles.btnText}>Stop Recording</Text>
      </TouchableOpacity>

      <Text>{recordTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 20,
    alignItems: 'center',
    gap: 12,
    zIndex: 1000,
  },
  startBtn: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 4,
  },
  stopBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 4,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
