import { StyleSheet, Text, View } from 'react-native';

export default function SingleClickScreen({ route }) {
  const { transcript, color } = route.params;

  return (
    <View style={styles.container}>
      <Text style={[styles.colorPreview, { color }]}>
        {color?.toUpperCase()}
      </Text>
      <Text style={styles.transcript}>You said: {transcript}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  colorPreview: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  transcript: {
    fontSize: 20,
    color: '#333',
  },
});
