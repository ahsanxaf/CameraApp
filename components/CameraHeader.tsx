import React from "react";
import {View, TouchableOpacity, StyleSheet, Image, Text} from 'react-native'
import {Ionicons} from '@expo/vector-icons';

interface CameraHeaderProps{
    onPressSettings: () => void;
    onPressFlashToggle: () => void;
    flashMode: "auto" | "on" | "off" | "torch";
}

const CameraHeader: React.FC<CameraHeaderProps> = ({onPressSettings, onPressFlashToggle, flashMode}) => {
    return(
        <View style={styles.header}>
            <View style={styles.flashOnButton}>
                <TouchableOpacity onPress={onPressFlashToggle}>
                    {/* <Icon name="settings-outline" size={24} color="white"/> */}
                    <Image source = {flashMode==="on" ? require('../assets/flashoff_icon.png') : require('../assets/flashon_icon.png')}/>
                </TouchableOpacity>
            </View> 
            <View style={styles.settingsButton}>
                <TouchableOpacity onPress={onPressSettings}>
                    {/* <Ionicons name="settings" size={20} color="black" /> */}
                    <Image source={require('./img/setting_icon.png')}/>
                </TouchableOpacity>
            </View>    
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        height: '8%',
        backgroundColor: 'white',
        // elevation: 4,
        // shadowColor: '#000',
        justifyContent: 'space-between',
        alignContent: 'center',
        top: 20,
        // left: 0,
        // right: 0,
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // position: "relative"
    },
    flex: {
        flex: 1,
    },
    settingsButton: {
        height: '30%',
        width: '7%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    flashOnButton: {
        height: '30%',
        width: '7%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
});

export default CameraHeader;