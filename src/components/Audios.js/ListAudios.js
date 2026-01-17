import Slider from '@react-native-community/slider';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { width } from '../../utils/config';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
}) {
  return (
    <ScrollView contentContainerStyle={styles.list}>
      {audioPlayers.length ? (
        audioPlayers
          .sort((a, b) => b.mtime - a.mtime)
          .map(audio => (
            <View key={audio.path} style={styles.card}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
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
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() =>
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
                    )
                  }
                >
                  <Ionicons
                    style={styles.icon}
                    name={
                      playingPath === audio.path && !isPaused ? 'pause' : 'play'
                    }
                    size={20}
                  />
                </TouchableOpacity>

                {playingPath === audio.path && (
                  <TouchableOpacity
                    onPress={() => toggleSpeed(playbackSpeed, setPlaybackSpeed)}
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
                  maximumValue={audio.duration ? audio.duration * 1000 : 1} // ms
                  value={playingPath === audio.path ? position : 0}
                  minimumTrackTintColor="blue"
                  maximumTrackTintColor="#ddd"
                  thumbTintColor="blue"
                  onValueChange={value => {
                    // optional: live preview while dragging
                    if (playingPath === audio.path) {
                      setPosition(value);
                    }
                  }}
                  onSlidingComplete={value => {
                    if (playingPath === audio.path) {
                      seekTo(value); // 🔥 SEEK
                    }
                  }}
                />
              </View>

              <View style={styles.timeRow}>
                <Text style={{ color: '#525252' }}>
                  {playingPath === audio.path ? formatTime(position) : '00:00'}
                </Text>

                <Text style={{ color: '#525252' }}>
                  {audio.duration ? formatTime(audio.duration * 1000) : '--:--'}
                </Text>
              </View>
            </View>
          ))
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
  icon: {
    color: '#525252',
  },
});
