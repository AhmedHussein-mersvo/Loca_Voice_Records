import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-nitro-sound';
import onStartRecord from '../services/RecordService/VoiceToText/StartRecordingService';
import onStopRecord from '../services/RecordService/VoiceToText/StopRecordingSerivce';
import { folder } from '../utils/RecordingDirectory';
import { AUDIO_EXTENSIONS } from '../utils/RecordingDirectory';
import getAudios from '../services/AudioService/GetAudiosService';
import onPlayPause from '../services/AudioService/PlayPauseService';
import onStop from '../services/AudioService/StopAudioService';
import seekTo from '../services/AudioService/SeekerService';
import toggleSpeed from '../services/AudioService/ToggleSpeedService';
import formatTime from '../utils/FormatTime';
import getAudioDuration from '../services/AudioService/GetAudioDuration';
import deleteAudio from '../services/AudioService/DeleteAudioService';
import ListAudios from '../components/Audios.js/ListAudios';
import RecordComponent from '../components/Record/RecordComponent';
export default function VoiceToTextScreen() {
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [audioPath, setAudioPath] = useState(null);
  const [audioPlayers, setAudioPlayers] = useState([]);
  const [playingPath, setPlayingPath] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState({});

  useEffect(() => {
    getAudios(folder, setAudioPlayers, AUDIO_EXTENSIONS, getAudioDuration);
  }, [audioPath]);

  useEffect(() => {
    return () => {
      Sound.stopPlayer();
      Sound.stopRecorder();
      Sound.removePlayBackListener();
      Sound.removeRecordBackListener();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Controls */}
      <RecordComponent
        folder={folder}
        setAudioPath={setAudioPath}
        setRecordSecs={setRecordSecs}
        setRecordTime={setRecordTime}
        setRecording={setRecording}
        onStartRecord={onStartRecord}
        onStopRecord={onStopRecord}
        recording={recording}
        recordTime={recordTime}
      />

      {/* List */}
      <ListAudios
        audioPlayers={audioPlayers}
        setAudioPlayers={setAudioPlayers}
        playingPath={playingPath}
        setPlayingPath={setPlayingPath}
        setIsPaused={setIsPaused}
        setPosition={setPosition}
        setDuration={setDuration}
        setPlaybackSpeed={setPlaybackSpeed}
        onStop={onStop}
        deleteAudio={deleteAudio}
        onPlayPause={onPlayPause}
        seekTo={seekTo}
        toggleSpeed={toggleSpeed}
        formatTime={formatTime}
        position={position}
        playbackSpeed={playbackSpeed}
        isPaused={isPaused}
        transcript={transcript}
        setTranscript={setTranscript}
      />
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
