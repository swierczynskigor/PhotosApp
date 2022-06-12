import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Dimensions } from "react-native";

function Item(props) {
    const [selected, setSelected] = useState(false)
    const navigation = useNavigation()
    const [base, setBase] = useState(props.base)

    useEffect(() => {
        setSelected(false)
    }, [props.obj, props.uri])

    const press = () => {
        //alert(JSON.stringify(props.obj, null, 4))
        navigation.navigate("Image", { obj: props.obj })
    }
    const handleSelect = () => {
        selected ? setSelected(false) : setSelected(true)
        props.select(props.obj.id, props.uri)
    }

    return (
        <TouchableOpacity
            onPress={press}
            onLongPress={handleSelect}
            style={{ overflow: 'hidden' }}
        >
            <Image
                style={[styles.styleimg, {
                    width: (Dimensions.get("window").width / props.numColumns) - 8,
                    height: Dimensions.get("window").height / 5,
                }]}
                source={{ uri: props.uri }}
            />
            {selected ? <View style={styles.select}><View style={styles.selectChild}><Text style={styles.h3}>+</Text></View></View> : null}
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
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    styleimg: {
        borderRadius: 20,
        margin: 3
    },
    h1: {
        fontFamily: 'Pacifico',
        fontSize: 80,
        color: '#fff'
    },
    h3: {
        fontSize: 120,
        color: '#723FF2',
        opacity: 1
    },
    select: {
        position: 'absolute',
        padding: 3,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    selectChild: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        opacity: 0.4,
        borderRadius: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
});
