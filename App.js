import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

import lara from './assets/lara.jpg';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light"/>
      <Image source={lara} style={{ 
        width: 150,
        height: 150,
        resizeMode: 'contain' 
        }}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
