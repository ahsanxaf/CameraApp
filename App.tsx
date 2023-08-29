import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CameraScreen from './CameraScreen';
import AppNavigator from './navigations/AppNavigator';
import {NamingSchemeProvider} from './components/NamingSchemeContext'

export default function App() {
  return (
    <View style={{flex: 1}}>
      <NamingSchemeProvider>
        <AppNavigator/>
      </NamingSchemeProvider>
    </View>
  );
}
