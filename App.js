import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import VoiceToTextScreen from './src/screens/VoiceToTextScreen';
import VoiceToClickScreen from './src/screens/VoiceToClickScreen';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import TrackPlayer from 'react-native-track-player';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    (async () => {
      await TrackPlayer.setupPlayer();
    })();
  }, []);

  useEffect(() => {
    async function androidRequestPermission() {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Audio Recording Permission',
              message:
                'This app needs access to your microphone to record audio.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Recording permission granted');
          } else {
            console.log('Recording permission denied');
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }
    }

    androidRequestPermission();
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="VoiceToTextScreen"
      >
        <Tab.Screen
          options={{
            tabBarLabel: 'Voice To Text',
            tabBarIcon: () => null,
            tabBarStyle: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
          name="VoiceToTextScreen"
          component={VoiceToTextScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: 'Voice To Click',
            tabBarIcon: () => null,
            tabBarStyle: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
          name="VoiceToClickScreen"
          component={VoiceToClickScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
