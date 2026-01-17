import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
export const folder = `${RNFS.DocumentDirectoryPath}/voices`;
export const AUDIO_EXTENSIONS =
  Platform.OS === 'ios'
    ? ['m4a', 'wav', 'aac']
    : ['mp3', 'wav', 'm4a', 'aac', 'ogg'];
