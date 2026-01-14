import { use, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  RecordBackType,
  PlayBackType,
} from 'react-native-nitro-sound';

export default function VoiceToTextScreen() {
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [audioPath, setAudioPath] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayers, setAudioPlayers] = useState([]);
  const [playingPath, setPlayingPath] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const folder = `${RNFS.DownloadDirectoryPath}/voices`;
  
  // Recording
  const onStartRecord = async () => {
    // Set up recording progress listener
    Sound.addRecordBackListener(e => {
      console.log('Recording progress:', e.currentPosition, e.currentMetering);
      setRecordSecs(e.currentPosition);
      setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
    });

    const result = await Sound.startRecorder();
    console.log('Recording started:', result);
  };
  const onStopRecord = async () => {
    const from = await Sound.stopRecorder();
    Sound.removeRecordBackListener();

    console.log('Recording stopped:', from);

    const exists = await RNFS.exists(folder);
    if (!exists) {
      await RNFS.mkdir(folder);
    }

    const fileName = `voice_${Date.now()}.mp3`;
    const to = `${folder}/${fileName}`;

    await RNFS.copyFile(from, to);

    setAudioPath(to);
    console.log(RNFS.readFileAssets(folder));

    console.log('Saved to:', to);
    setRecordSecs(0);
    setRecordTime('00:00:00');
  };
  const AUDIO_EXTENSIONS = ['mp3', 'wav', 'm4a', 'aac', 'ogg'];

  async function getAudios() {
    try {
      const files = await RNFS.readDir(folder);

      const audioFiles = files.filter(file => {
        if (!file.isFile()) return false;
        const ext = file.name.split('.').pop().toLowerCase();
        return AUDIO_EXTENSIONS.includes(ext);
      });

      setAudioPlayers(audioFiles);
    } catch (err) {
      console.error('Error reading audios:', err);
    }
  }

  useEffect(() => {
    getAudios();
  }, [audioPath]);
  useEffect(() => {
    return () => {
      Sound.stopPlayer();
      Sound.stopRecorder();
      Sound.removePlayBackListener();
      Sound.removeRecordBackListener();
    };
  }, []);
  const onPlayPause = async path => {
    try {
      // SAME audio → pause
      if (playingPath === path && !isPaused) {
        await Sound.pausePlayer();
        setIsPaused(true);
        return;
      }

      // SAME audio → resume
      if (playingPath === path && isPaused) {
        await Sound.resumePlayer();
        setIsPaused(false);
        return;
      }

      // DIFFERENT audio → stop old, start new
      await Sound.stopPlayer();
      Sound.removePlayBackListener();

      setPlayingPath(path);
      setIsPaused(false);

      await Sound.startPlayer(path);

      Sound.addPlayBackListener(e => {
        if (!e || !e.duration) return;

        setDuration(e.duration);
        setPosition(e.currentPosition);

        // Detect finish safely
        if (e.currentPosition >= e.duration - 200) {
          Sound.stopPlayer();
          Sound.removePlayBackListener();
          setPlayingPath(null);
          setIsPaused(false);
          setPosition(0);
          setDuration(0);
        }
      });
    } catch (e) {
      console.error('Play/Pause error:', e);
    }
  };
  const onStop = async () => {
    try {
      await Sound.stopPlayer();
      Sound.removePlayBackListener();
      setPlayingPath(null);
      setPosition(0);
      setDuration(0);
    } catch (e) {
      console.error('Stop error:', e);
    }
  };
  const seekTo = async milliseconds => {
    try {
      await Sound.seekToPlayer(milliseconds);
    } catch (e) {
      console.error('Seek error:', e);
    }
  };
  const toggleSpeed = async () => {
    const next = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
    setPlaybackSpeed(next);
    await Sound.setPlaybackSpeed(next);
  };
  const formatTime = ms => {
    if (!ms || ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 40000,
        }}
      >
        <TouchableOpacity
          onPress={onStartRecord}
          style={{
            margin: 10,
            backgroundColor: 'green',
            padding: 10,
            borderRadius: 4,
          }}
        >
          <Text style={{ color: 'white' }}>Start Recording</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onStopRecord}
          style={{
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 4,
          }}
        >
          <Text style={{ color: 'white' }}>Stop Recording</Text>
        </TouchableOpacity>
        <Text>{recordTime}</Text>

        {/* {audioPath && (
          <>
            <Text style={styles.file}>Recorded File:</Text>
            <Text style={styles.path}>{audioPath}</Text>

            <View style={styles.row}>
              <TouchableOpacity style={styles.btnBlue} onPress={onPlay}>
                <Text style={styles.btnText}>Play</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnOrange} onPress={onPause}>
                <Text style={styles.btnText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOrange} onPress={onResume}>
                <Text style={styles.btnText}>resume</Text>
              </TouchableOpacity>
            </View>
          </>
        )} */}
      </View>
      <ScrollView
        contentContainerStyle={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 20,
          padding: 40,
          width: '35%',
        }}
        style={{ flex: 1 }}
      >
        {audioPlayers && audioPlayers.length > 0 ? (
          audioPlayers
            .sort((a, b) => {
              return new Date(b.mtime).getTime() - new Date(a.mtime).getTime();
            })
            .map((audio, index) => (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 15,
                  backgroundColor: 'rgb(252, 249, 249)',
                  borderRadius: 12,
                  padding: 20,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,
                  elevation: 4,
                  width: '100%',
                }}
                key={index}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: 10,
                    width: '100%',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {audio.name}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                  }}
                >
                  <TouchableOpacity onPress={() => onPlayPause(audio.path)}>
                    <Ionicons
                      name={
                        playingPath === audio.path
                          ? isPaused
                            ? 'play'
                            : 'pause'
                          : 'play'
                      }
                      size={20}
                      color={'black'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={playingPath !== audio.path}
                    onPress={toggleSpeed}
                  >
                    <Text
                      style={{
                        display: playingPath !== audio.path ? 'none' : 'flex',
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'rgb(201, 201, 48)',
                      }}
                    >
                      {playbackSpeed}x
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onStop()}>
                    <Ionicons name="stop" size={20} color={'black'} />
                  </TouchableOpacity>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration || 1}
                    value={playingPath === audio.path ? position : 0}
                    minimumTrackTintColor="blue"
                    maximumTrackTintColor="blue"
                    thumbTintColor="blue"
                    tapToSeek
                    onSlidingComplete={value => {
                      if (playingPath === audio.path) {
                        seekTo(value);
                      }
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 4,
                    width: '100%',
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#666' }}>
                    {playingPath === audio.path
                      ? formatTime(position)
                      : '00:00'}
                  </Text>

                  <Text style={{ fontSize: 12, color: '#666' }}>
                    {playingPath === audio.path
                      ? formatTime(duration)
                      : '--:--'}
                  </Text>
                </View>
              </View>
            ))
        ) : (
          <View>
            <Text>No audio files found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  slider: {
    width: '70%',
    // height: 40,
  },
});
