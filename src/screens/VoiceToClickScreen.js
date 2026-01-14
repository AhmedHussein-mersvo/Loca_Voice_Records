import { StyleSheet, Text, View } from 'react-native';

type Props = {
  navigation: any;
};

export default function VoiceToClickScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text>Open up VoiceToClickScreen to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
