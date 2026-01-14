import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, AppState } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true, // ✅ allows PIN/Pattern/Passcode fallback
});

export default function BiometricGate({ onUnlocked }) {
  const [loading, setLoading] = useState(true);
  const [supported, setSupported] = useState(false);

  const authenticate = async () => {
    try {
      setLoading(true);

      const { available } = await rnBiometrics.isSensorAvailable();
      if (!available) {
        setSupported(false);
        setLoading(false);
        Alert.alert(
          'Biometrics not available',
          'No fingerprint/FaceID or device credential is set up on this device.'
        );
        return;
      }

      setSupported(true);

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Unlock to continue',
        cancelButtonText: 'Cancel',
      });

      setLoading(false);

      if (success) {
        onUnlocked?.();
      } else {
        // user cancelled
      }
    } catch (e) {
      setLoading(false);
      // common: user canceled / too many attempts / lockout
      console.log('Biometric error:', e);
      Alert.alert('Authentication failed', 'Please try again.');
    }
  };

  useEffect(() => {
    authenticate();

    // Optional: re-lock when app goes background and require auth again
    const sub = AppState.addEventListener('change', s => {
      if (s === 'active') authenticate();
    });

    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Locked</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={styles.subtitle}>
            {supported
              ? 'Authenticate to enter.'
              : 'Biometrics are not set up on this device.'}
          </Text>

          <TouchableOpacity style={styles.button} onPress={authenticate}>
            <Text style={styles.buttonText}>Unlock</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 18, textAlign: 'center' },
  button: { backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
