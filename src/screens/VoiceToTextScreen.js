import React, { useEffect, useState } from 'react';
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
import Sound from 'react-native-nitro-sound';
import TrackPlayer from 'react-native-track-player';

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

  const folder = `${RNFS.DownloadDirectoryPath}/voices`;
  const AUDIO_EXTENSIONS = ['mp3', 'wav', 'm4a', 'aac', 'ogg'];

  /* ---------------- Recording ---------------- */

  const onStartRecord = async () => {
    Sound.addRecordBackListener(e => {
      setRecordSecs(e.currentPosition);
      setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
    });
    await Sound.startRecorder();
  };

  const onStopRecord = async () => {
    const from = await Sound.stopRecorder();
    Sound.removeRecordBackListener();

    if (!(await RNFS.exists(folder))) {
      await RNFS.mkdir(folder);
    }

    const fileName = `voice_${Date.now()}.mp3`;
    const to = `${folder}/${fileName}`;
    await RNFS.copyFile(from, to);

    setAudioPath(to);
    setRecordSecs(0);
    setRecordTime('00:00:00');
  };

  /* ---------------- Audio list ---------------- */

  const getAudios = async () => {
    try {
      const files = await RNFS.readDir(folder);

      const audioFiles = files.filter(
        f =>
          f.isFile() &&
          AUDIO_EXTENSIONS.includes(f.name.split('.').pop().toLowerCase()),
      );

      const withDurations = [];

      for (const file of audioFiles) {
        const duration = await getAudioDuration(file.path);

        withDurations.push({
          ...file,
          duration, // seconds
        });
      }

      setAudioPlayers(withDurations);
    } catch (e) {
      console.error('Read audio error:', e);
    }
  };

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

  /* ---------------- Playback ---------------- */

  const onPlayPause = async path => {
    try {
      if (playingPath === path && !isPaused) {
        await Sound.pausePlayer();
        setIsPaused(true);
        return;
      }

      if (playingPath === path && isPaused) {
        await Sound.resumePlayer();
        setIsPaused(false);
        return;
      }

      await Sound.stopPlayer();
      await setPlaybackSpeed(1);
      Sound.removePlayBackListener();

      setPlayingPath(path);
      setIsPaused(false);

      await Sound.startPlayer(path);

      Sound.addPlayBackListener(e => {
        if (!e?.duration) return;

        setDuration(e.duration);
        setPosition(e.currentPosition);

        if (e.currentPosition >= e.duration - 200) {
          onStop();
        }
      });
    } catch (e) {
      console.error('Play error:', e);
    }
  };

  const onStop = async () => {
    await Sound.stopPlayer();
    setPlaybackSpeed(1);
    Sound.removePlayBackListener();
    setPlayingPath(null);
    setPosition(0);
    setDuration(0);
  };

 const seekTo = async ms => {
  try {
    await Sound.seekToPlayer(ms);
  } catch (e) {
    console.error('Seek error:', e);
  }
};


  const toggleSpeed = async () => {
    const next = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
    setPlaybackSpeed(next);
    await Sound.setPlaybackSpeed(next);
  };

  /* ---------------- Utils ---------------- */

  const formatTime = ms => {
    if (!ms) return '00:00';
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(
      s % 60,
    ).padStart(2, '0')}`;
  };
  /* ---------------- Duration ---------------- */
  const getAudioDuration = async filePath => {
    try {
      await TrackPlayer.reset();

      await TrackPlayer.add({
        id: filePath,
        url: `file://${filePath}`, // REQUIRED on Android
      });

      // Force prepare
      await TrackPlayer.play();
      await TrackPlayer.pause();

      // Android needs async settle time
      await new Promise(r => setTimeout(r, 300));

      const duration = (await TrackPlayer.getProgress()).duration; // seconds
      return duration;
    } catch (e) {
      console.error('Duration error:', e);
      return 0;
    }
  };
  /* ---------------- Render ---------------- */

  return (
    <View style={styles.container}>
      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.startBtn} onPress={onStartRecord}>
          <Text style={styles.btnText}>Start Recording</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.stopBtn} onPress={onStopRecord}>
          <Text style={styles.btnText}>Stop Recording</Text>
        </TouchableOpacity>

        <Text>{recordTime}</Text>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.list}>
        {audioPlayers.length ? (
          audioPlayers
            .sort((a, b) => b.mtime - a.mtime)
            .map(
              audio => (
                console.log(audio),
                (
                  <View key={audio.path} style={styles.card}>
                    <Text style={styles.title}>{audio.name}</Text>

                    <View style={styles.row}>
                      <TouchableOpacity onPress={() => onPlayPause(audio.path)}>
                        <Ionicons
                          name={
                            playingPath === audio.path && !isPaused
                              ? 'pause'
                              : 'play'
                          }
                          size={20}
                        />
                      </TouchableOpacity>

                      {playingPath === audio.path && (
                        <TouchableOpacity onPress={toggleSpeed}>
                          <Text style={styles.speed}>{playbackSpeed}x</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity onPress={onStop}>
                        <Ionicons name="stop" size={20} />
                      </TouchableOpacity>

                      <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={
                          audio.duration ? audio.duration * 1000 : 1
                        } // ms
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
                      <Text>
                        {playingPath === audio.path
                          ? formatTime(position)
                          : '00:00'}
                      </Text>

                      <Text>
                        {audio.duration
                          ? formatTime(audio.duration * 1000)
                          : '--:--'}
                      </Text>
                    </View>
                  </View>
                )
              ),
            )
        ) : (
          <Text>No audio files found</Text>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  controls: {
    position: 'absolute',
    top: 20,
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
  list: {
    padding: 40,
    gap: 20,
    width: '35%',
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
    color: '#c9c930',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
