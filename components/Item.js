import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';

function Item(props) {

    const navigation = useNavigation()

    const press = () => {
        //alert(JSON.stringify(props.obj, null, 4))
        navigation.navigate("Image", { obj: props.obj })
    }

    return (
        <TouchableOpacity
            onPress={press}
            style={props.style}
        >
            <Image
                style={props.styleimg}
                source={{ uri: props.uri }}
            />
            <Text style={{
                position: 'absolute',
                left: 10,
                bottom: 10,
                color: '#fff'
            }}>{props.photoID}</Text>
        </TouchableOpacity>
    );
}



export default Item;

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
