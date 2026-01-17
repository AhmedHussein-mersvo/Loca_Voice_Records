  import { Platform } from 'react-native';
import Sound from 'react-native-nitro-sound';
  const onPlayPause = async (path, setPlayingPath, setIsPaused, setDuration, setPosition, setPlaybackSpeed, onStop, playingPath, isPaused) => {
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

      const playPath =
        Platform.OS === 'ios' && !path.startsWith('file://')
          ? `file://${path}`
          : path;

      await Sound.startPlayer(playPath);

      Sound.addPlayBackListener(e => {
        if (!e?.duration) return;

        setDuration(e.duration);
        setPosition(e.currentPosition);

        if (e.currentPosition >= e.duration - 200) {
          onStop(setPlayingPath, setPlaybackSpeed, setPosition, setDuration);
        }
      });
    } catch (e) {
      console.error('Play error:', e);
    }
  };

  export default onPlayPause;