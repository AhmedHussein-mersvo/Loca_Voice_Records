import TrackPlayer from "react-native-track-player";

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

  export default getAudioDuration;