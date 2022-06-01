import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import { Dimensions } from "react-native";
import Item from './Item'
import { useNavigation } from '@react-navigation/native';

function S2() {
    const [numColumns, setnumColumns] = useState(4);
    const [images, setimages] = useState();
    const [imagesLoading, setimagesLoading] = useState(false);
    const navigation = useNavigation()

    const handleLoadPhotos = useCallback(async () => {
        let { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('brak uprawnień do czytania image-ów z galerii')
        }

        let obj = await MediaLibrary.getAssetsAsync({
            first: 100, // ilość pobranych assetów
            mediaType: 'photo' // typ pobieranych danych, photo jest domyślne
        })
        let toAlert = obj
        obj = JSON.stringify(obj.assets)
        setimages(JSON.parse(obj))
        setimagesLoading(true)
        //alert(JSON.stringify(toAlert, null, 4))
    })

    useEffect(() => {
        handleLoadPhotos()
        navigation.addListener("focus", () => {
            handleLoadPhotos()
        })
    }, []);

    const handleChangeDisplay = () => {
        numColumns === 4 ? setnumColumns(1) : setnumColumns(4)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleChangeDisplay}>
                <Text style={{ margin: 10, marginTop: 50, fontSize: 20 }}>
                    GRID / LIST
                </Text>
            </TouchableOpacity>
            {
                imagesLoading ?
                    <View>
                        <FlatList
                            numColumns={numColumns}
                            key={numColumns}
                            data={images}
                            renderItem={
                                ({ item }) => {
                                    return item.uri !== null ?
                                        <Item
                                            uri={item.uri}
                                            photoID={item.id}
                                            obj={item}
                                            styleimg={{
                                                borderRadius: 20,
                                                width: (Dimensions.get("window").width / numColumns) - 8,
                                                height: Dimensions.get("window").height / 5,
                                                marginLeft: 6,
                                                marginBottom: 6,
                                            }}
                                        /> : null
                                }

                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View> :
                    <Text>Loading...</Text>
            }
        </View>
    );
}

export default S2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50
    },
});
