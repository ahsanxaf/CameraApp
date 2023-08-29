import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import {Ionicons} from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import CameraHeader from './components/CameraHeader';
import { FlashMode, CameraQuality } from './types/Types';
import SettingsModal from './components/SettingsModal';
import { useNamingScheme } from './components/NamingSchemeContext';


const ALBUM_NAME = 'CameraApp';
const CameraScreen: React.FC = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  requestPermission();
  const cameraRef = useRef<Camera | null>(null);
  const [selectedCamera, setSelectedCamera] = useState(CameraType.back);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [selectedQualityStream, setSelectedQualityStream] = useState<CameraQuality>('high')
  const [selectedQualityForCapture, setSelectedQualityForCapture] = useState<CameraQuality>('medium');
  const { namingScheme, setNamingScheme } = useNamingScheme();


  const switchCamera = () => {
    setSelectedCamera(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const updateSequence = () => {
    const currentSequence = namingScheme.sequence || "";
    const sequenceParts = currentSequence.split("_");
    let newSequence = currentSequence;
  
    if (sequenceParts.length > 1) {
      // If the sequence already contains an underscore and a number, increment the number
      const lastPart = sequenceParts[sequenceParts.length - 1];
      if (!isNaN(parseInt(lastPart))) {
        const newNumber = parseInt(lastPart) + 1;
        newSequence = sequenceParts.slice(0, sequenceParts.length - 1).join("_") + "_" + newNumber;
      } else {
        // If the last part is not a number, simply add "_1" to the end
        newSequence += "_1";
      }
    } else {
      // If the sequence doesn't contain an underscore, add "_1" to the end
      newSequence += "_1";
    }
  
    setNamingScheme((prevScheme) => ({ ...prevScheme, sequence: newSequence }));
  };
    
  const takePicture = async (quality: CameraQuality) => {
    if (cameraRef.current) {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
  
        if (status === 'granted') {

          // const timestamp = new Date().getTime();
          // const filename = `IMG_${timestamp}.jpg`;
          
          let fileName = '';
          const options = {
            quality: quality === 'low' ? 0.4 : quality === 'medium' ? 0.7 : 1,
            flashMode: flashMode,
            base64: false,
            exif: false,
          }
          const photo = await cameraRef.current.takePictureAsync(options);
          console.log('Photo taken:', photo);
          
          if (photo){
            if(namingScheme?.type === 'datetime'){
              const currentDate = new Date();
              const formattedDate = currentDate.toISOString().replace(/[:-]/g, '').split('.')[0];
              fileName = `${namingScheme.prefix}_${formattedDate}`
            }
            else if(namingScheme?.type === 'sequence'){
              fileName = `${namingScheme.prefix} ${namingScheme.sequence}`
              updateSequence();
            }
            else if(namingScheme?.type === 'datetime & sequence'){
              const currentDate = new Date();
              const formattedDate = currentDate.toISOString().replace(/[:-]/g, '').split('.')[0];
              fileName = `${namingScheme.prefix} ${formattedDate}_${namingScheme.sequence}`;
              updateSequence();
            }
            else{
              const currentDate = new Date();
              const formattedDate = currentDate.toISOString().replace(/[:-]/g, '').split('.')[0];
              fileName = `default_${formattedDate}`;
            }
            
          }
          const newUri = `${FileSystem.cacheDirectory}${fileName}.jpg`;
          await FileSystem.moveAsync({ from: photo.uri, to: newUri });
          // Save the photo to the gallery
          const asset = await MediaLibrary.createAssetAsync(newUri);
          
          const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
          if (!album) {
            await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }

          console.info("Pictures Saced successfully: ", newUri)
          

        } else {
          console.log('Permission to save picture not granted.');
          // You can show a message to the user that permission is required
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  const handleSettingsPress = () => {
    setShowSettingModal(true);
    console.log("setting button pressed!");
  };

  const handleQualitySelect  = async(selectedQuality: CameraQuality) => {
    setShowSettingModal(false);
    // if(isRecording){
    //   await stopRecording();
    // }
    // setSelectedQualityStream(selectedQuality);
    // if(isRecording){
    //   await startRecording();
    // }

    setSelectedQualityForCapture(selectedQuality);
    console.log('Selected Camera Quality: ', selectedQuality);
  };

  const toggleFlash = () => {
    // flashMode === 'off' ? setFlashMode('on') : setFlashMode('off');
    // setFlashMode(flashMode === 'on' ? 'off' : 'on');
    if (flashMode === 'off') {
      setFlashMode('on');
      console.info("flash mode is set to ON");
    } else {
      setFlashMode('off');
      console.info("flash mode is set to OFF");
    }
  }

  
  return (
    <View style={{ flex: 1 }}>
      <CameraHeader 
        onPressSettings={handleSettingsPress}
        onPressFlashToggle = {toggleFlash}
        flashMode={flashMode}/>
      <Camera
        style={{ flex: 1 }}
        type={selectedCamera}
        ref={cameraRef}>


        <View style={styles.captureButtonContainer}>
          <TouchableOpacity onPress={() => takePicture(selectedQualityForCapture)} style={styles.captureButton}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <View style={styles.switchCameraButtonContainer}>
            <TouchableOpacity onPress={switchCamera} style={styles.switchCameraButton}>
              <Ionicons name="sync" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
      </Camera>

      <SettingsModal
        visible={showSettingModal}
        selectedQuality={selectedQualityStream}
        onClose={() => setShowSettingModal(false)}
        onQualitySelect={handleQualitySelect }/> 
      
    </View>
    
  );
};

const styles = StyleSheet.create({
  captureButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    padding: '5%'
  },
  captureButton: {
    padding: 10,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  switchCameraButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  switchCameraButton: {
    padding: 16,
    color: 'white'
  },
});

export default CameraScreen;
