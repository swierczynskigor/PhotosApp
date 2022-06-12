import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from '@react-navigation/core';
import * as Sharing from 'expo-sharing';
import * as SecureStore from 'expo-secure-store';

function ViewImage(props) {
    const navigation = useNavigation()

    useEffect(() => {

    }, [])

    const handleDelete = async () => {
        try {
            await MediaLibrary.deleteAssetsAsync([props.route.params.obj.id]);
            navigation.goBack();
        } catch (e) {
            alert(e)
        }
    }
    const handleShare = async () => {
        try {
            await Sharing.shareAsync('file://' + (props.route.params.obj.uri).slice(5))
        } catch (error) {
            alert(error.message);
        }
    }
    const handleUpload = async () => {
        const data = new FormData();

        data.append('photo', {
            uri: props.route.params.obj.uri,
            type: 'image/jpeg',
            name: props.route.params.obj.id
        });

        let resultServer = await SecureStore.getItemAsync('server')
        let resultPort = await SecureStore.getItemAsync('port')

        fetch(`http://${resultServer}:${resultPort}/upload`, {
            method: 'POST',
            body: data
        }).then(() => alert('Image uploaded :D'))
    }
    return (
        <View style={styles.container}>
            <Image
                style={[styles.photo]}
                resizeMode={'cover'}
                source={{ uri: props.route.params.obj.uri }}
            />
            <View style={styles.buttons}>
                <TouchableOpacity onPress={handleShare}>
                    <Text style={{ fontSize: 40 }}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete}>
                    <Text style={{ fontSize: 40 }}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpload}>
                    <Text style={{ fontSize: 40 }}>Upload</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

export default ViewImage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column"
    },
    photo: {
        marginTop: 20,
        width: '90%',
        height: '60%',
        borderRadius: 30
    },
    buttons: {
        flex: 1,
        height: 100,
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-around",
        marginTop: 100,
        fontSize: 40
    }
});
