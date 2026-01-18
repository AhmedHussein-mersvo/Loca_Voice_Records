import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import onStartRecord from '../services/RecordService/VoiceToClick/StartRecordingService';
import onStopRecord from '../services/RecordService/VoiceToClick/StopRecordingSerivce';
import transcribeAudio2 from '../utils/TestAssemblyAi';

export default function VoiceToClickScreen({ navigation }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [filePath, setFilePath] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleStart = async () => {
    if (isTranscribing) return;

    setTranscript('');
    await onStartRecord(setRecordSecs, setRecordTime, setRecording);
  };

  const handleStop = async () => {
    setIsTranscribing(true);

    const audioPath = await onStopRecord(setRecording, setFilePath);

    await transcribeAudio2(audioPath, text => {
      setTranscript(text);
      setIsTranscribing(false);
    });
  };
  useEffect(() => {
    if (!transcript) return;

    if (transcript.toLowerCase().includes('green')) {
      navigation.navigate('SingleClickScreen', {
        transcript: transcript,
        color: 'green',
      });
    }

    if (transcript.toLowerCase().includes('red')) {
      navigation.navigate('SingleClickScreen', {
        transcript: transcript,
        color: 'red',
      });
    }

    if (transcript.toLowerCase().includes('black')) {
      navigation.navigate('SingleClickScreen', {
        transcript: transcript,
        color: 'black',
      });
    }

    if (transcript.toLowerCase().includes('blue')) {
      navigation.navigate('SingleClickScreen', {
        transcript: transcript,
        color: 'blue',
      });
    }
  }, [transcript]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice to Click</Text>
      <TouchableOpacity
        disabled={isTranscribing}
        onPress={recording ? handleStop : handleStart}
        style={[styles.btn, isTranscribing && styles.btnDisabled]}
      >
        <Text style={styles.btnText}>
          {recording
            ? 'Stop Recording'
            : isTranscribing
            ? 'Transcribing...'
            : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.time}>{recordTime}</Text>
      {isTranscribing && <Text style={styles.loading}>⏳ Transcribing...</Text>}
      {transcript ? (
        <Text style={styles.transcript}>Transcript: {transcript}</Text>
      ) : null}
      {transcript && transcript.includes('black') && (
        <Text style={{ color: 'black' }}>black</Text>
      )}
      {transcript && transcript.includes('green') && (
        <Text style={{ color: 'green' }}>Green</Text>
      )}
      {transcript && transcript.includes('red') && (
        <Text style={{ color: 'red' }}>red</Text>
      )}
      {transcript && transcript.includes('blue') && (
        <Text style={{ color: 'blue' }}>blue</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, marginBottom: 20 },
  btn: {
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginBottom: 20,
  },
  btnDisabled: {
    backgroundColor: '#9e9e9e',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
    marginBottom: 20,
  },
  loading: {
    marginTop: 10,
    color: '#555',
  },
  transcript: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eee',
    width: '80%',
    borderRadius: 10,
  },
});
