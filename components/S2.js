import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import Item from './Item'
import { useNavigation } from '@react-navigation/native';

function S2() {
    const [numColumns, setnumColumns] = useState(4);
    const [images, setimages] = useState();
    const [imagesLoading, setimagesLoading] = useState(false);
    const navigation = useNavigation()
    const [tabSelect, settabSelect] = useState([])
    const [base, setBase] = useState(0)
    const [notLaoded, setnotLaoded] = useState('Loading...');

    const handleLoadPhotos = useCallback(async () => {
        let { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('brak uprawnień do czytania image-ów z galerii')
            setnotLaoded('No permission')
        } else {
            let dcim = await MediaLibrary.getAlbumAsync("DCIM")
            let obj = await MediaLibrary.getAssetsAsync({
                album: dcim,
                first: 100, // ilość pobranych assetów
                mediaType: 'photo' // typ pobieranych danych, photo jest domyślne
            })
            let toAlert = obj
            obj = JSON.stringify(obj.assets)
            setimages(JSON.parse(obj))
            setimagesLoading(true)
            console.log('load')
            //alert(JSON.stringify(toAlert, null, 4))
        }
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

    const handleSelect = (id) => {
        if (tabSelect.includes(id)) {
            let newTab = []
            for (let i = 0; i < tabSelect.length; i++)
                if (tabSelect[i] !== id)
                    newTab.push(tabSelect[i])
            settabSelect(newTab)
        } else {
            settabSelect([id, ...tabSelect])
        }
    }
    const handleDeleteSelected = () => {
        tabSelect.forEach(async (el) => {
            try {
                await MediaLibrary.deleteAssetsAsync([el]);
            } catch (e) {
                alert(e)
            }
        })
        settabSelect([])
        handleLoadPhotos()
    }
    const handleShowCamera = () => {
        navigation.navigate("Camera", { refresh: handleLoadPhotos })
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttons}>

                <TouchableOpacity onPress={handleChangeDisplay}>
                    <Text style={{ fontSize: 20 }}>
                        GRID / LIST
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteSelected}>
                    <Text style={{ fontSize: 20 }}>
                        Delete selected
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShowCamera}>
                    <Text style={{ fontSize: 20 }}>
                        Camera
                    </Text>
                </TouchableOpacity>
            </View>
            {
                imagesLoading ?
                    <View style={{ marginBottom: 30, backgroundColor: '#fff' }}>
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
                                            select={handleSelect}
                                            numColumns={numColumns}
                                        /> : null
                                }

                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View> :
                    <Text>{notLaoded}</Text>
            }
        </View>
    );
}

export default S2;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 100
    },
    buttons: {
        marginTop: 80,
        marginBottom: 20,
        width: '100%',
        display: 'flex',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
});
