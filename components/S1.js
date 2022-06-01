import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';


function S1(props) {
    const [loaded] = useFonts({
        Pacifico: require('.././assets/pacifico.ttf'),
    });

    if (!loaded) {
        return null;
    }
    const handleGoToGallery = () => {
        props.navigation.navigate("Gallery")
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleGoToGallery}>
                <Text style={styles.h1}>Photos app</Text>
            </TouchableOpacity>
            <Text style={styles.h3}>show gallery pictures</Text>
            <Text style={styles.h3}>delete photo from device</Text>
            <Text style={styles.h3}>share photo</Text>
        </View>

    );
}

export default S1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#723FF2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    h1: {
        fontFamily: 'Pacifico',
        fontSize: 80,
        color: '#fff'
    },
    h3: {
        fontSize: 20,
        color: '#fff'
    }
});
