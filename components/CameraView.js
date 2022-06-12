import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from '@react-navigation/core';
import { Camera } from "expo-camera";
import { BackHandler } from "react-native"
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

function CameraView(props) {
    const [hasCameraPermission, sethasCameraPermission] = useState([]);
    const [cameraType, setcameraType] = useState(Camera.Constants.Type.front);
    const [newPhoto, setnewPhoto] = useState([]);
    const navigation = useNavigation()

    let camera
    useEffect(() => {
        handleCameraLoad()
        console.log('useEffect')
        BackHandler.addEventListener("hardwareBackPress", () => passData())
    }, [])

    const passData = useCallback(async () => {
        await props.route.params.refresh()
        navigation.goBack()
        return true;
    })

    const handleCameraLoad = useCallback(async () => {
        setnewPhoto([])
        let { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('No permission')
            navigation.goBack();
        } else {
            sethasCameraPermission(status == 'granted')
        }
    })

    const handleTakePicture = async () => {
        if (camera) {
            let foto = await camera.takePictureAsync();
            let asset = await MediaLibrary.createAssetAsync(foto.uri); // domyślnie zapisuje w folderze DCI
            await props.route.params.refresh()
        } else {
            alert('coś nie działa')
        }
    }

    const handleTurnCamera = () => {
        setcameraType(cameraType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
    }

    const handleShowPicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            const data = new FormData();
            data.append('photo', {
                uri: result.uri,
                type: 'image/jpeg',
                name: 'test'
            });
            let resultServer = await SecureStore.getItemAsync('server')
            let resultPort = await SecureStore.getItemAsync('port')
            console.log(`http://${resultServer}:${resultPort}/upload`)
            fetch(`http://${resultServer}:${resultPort}/upload`, {
                method: 'POST',
                body: data
            }).then(() => alert('Image uploaded :D'))
        }
    }
    if (hasCameraPermission == null) {
        return <View><Text>Camera Loading...</Text></View>;
    } else if (hasCameraPermission == false) {
        return <Text>brak dostępu do kamery</Text>;
    } else {
        return (
            <View style={{ flex: 1 }}>
                <Camera
                    ref={ref => {
                        camera = ref; // Uwaga: referencja do kamery używana później
                    }}
                    style={{ flex: 1 }}
                    type={cameraType}>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
                            <Image style={{ width: 50, height: 50 }} source={require('../assets/Photo.webp')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleTurnCamera}>
                            <Image style={{ width: 50, height: 50 }} source={require('../assets/rotate.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleShowPicker}>
                            <Image style={{ width: 50, height: 50 }} source={require('../assets/crop.webp')} />
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column"
    },
    buttons: {
        position: 'absolute',
        display: 'flex',
        width: '100%',
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',

    },
    button: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#723FF2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTxt: {
        fontSize: 70,
        color: '#fff'
    }
});

export default CameraView;