import Slider from '@react-native-community/slider';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { width } from '../../utils/config';
import transcribeAudio from '../../utils/AssemblyAi';

export default function ListAudios({
  audioPlayers,
  setAudioPlayers,
  playingPath,
  setPlayingPath,
  setIsPaused,
  setPosition,
  setDuration,
  setPlaybackSpeed,
  onStop,
  deleteAudio,
  onPlayPause,
  seekTo,
  toggleSpeed,
  formatTime,
  position,
  playbackSpeed,
  isPaused,
  transcript,
  setTranscript,
}) {
  return (
    <ScrollView contentContainerStyle={styles.list}>
      {audioPlayers.length ? (
        audioPlayers
          .sort((a, b) => b.mtime - a.mtime)
          .map(audio => {
            const isPlaying = playingPath === audio.path;

            return (
              <View key={audio.path} style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>{audio.name}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      deleteAudio(
                        audio,
                        playingPath,
                        setPlayingPath,
                        setIsPaused,
                        setPosition,
                        setDuration,
                        setAudioPlayers,
                      )
                    }
                  >
                    <Ionicons name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>

                {/* Controls */}
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      onPlayPause(
                        audio.path,
                        setPlayingPath,
                        setIsPaused,
                        setDuration,
                        setPosition,
                        setPlaybackSpeed,
                        onStop,
                        playingPath,
                        isPaused,
                      );
                      transcribeAudio(audio.path, setTranscript);
                    }}
                  >
                    <Ionicons
                      style={styles.icon}
                      name={isPlaying && !isPaused ? 'pause' : 'play'}
                      size={20}
                    />
                  </TouchableOpacity>

                  {isPlaying && (
                    <TouchableOpacity
                      onPress={() =>
                        toggleSpeed(playbackSpeed, setPlaybackSpeed)
                      }
                    >
                      <Text style={styles.speed}>{playbackSpeed}x</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() =>
                      onStop(
                        setPlayingPath,
                        setPlaybackSpeed,
                        setPosition,
                        setDuration,
                      )
                    }
                  >
                    <Ionicons style={styles.icon} name="stop" size={20} />
                  </TouchableOpacity>

                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={audio.duration ? audio.duration * 1000 : 1}
                    value={isPlaying ? position : 0}
                    minimumTrackTintColor="blue"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="blue"
                    onValueChange={value => isPlaying && setPosition(value)}
                    onSlidingComplete={value => isPlaying && seekTo(value)}
                  />
                </View>

                {/* Time */}
                <View style={styles.timeRow}>
                  <Text style={styles.time}>
                    {isPlaying ? formatTime(position) : '00:00'}
                  </Text>
                  <Text style={styles.time}>
                    {audio.duration
                      ? formatTime(audio.duration * 1000)
                      : '--:--'}
                  </Text>
                </View>

                {/* Transcript (only for playing audio) */}
                {transcript[audio.path] ? (
                  <Text style={styles.transcript}>
                    {transcript[audio.path]}
                  </Text>
                ): <Text style={styles.transcript}>No Transcript</Text>}
              </View>
            );
          })
      ) : (
        <Text>No audio files found</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: width > 700 ? 0 : 140,
    padding: 40,
    gap: 20,
    width: width > 700 ? '35%' : '100%',
  },
  card: {
    backgroundColor: '#fcf9f9',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#525252',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    width: '70%',
  },
  speed: {
    fontWeight: 'bold',
    color: '#535353',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    color: '#525252',
  },
  icon: {
    color: '#525252',
  },
  transcript: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
  },
});
