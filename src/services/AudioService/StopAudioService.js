import Sound from "react-native-nitro-sound";

 
 const onStop = async (setPlayingPath, setPlaybackSpeed, setPosition, setDuration) => {
    await Sound.stopPlayer();
    setPlaybackSpeed(1);
    Sound.removePlayBackListener();
    setPlayingPath(null);
    setPosition(0);
    setDuration(0);
  };

  export default onStop;