import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import Item from './Item'
import { useNavigation } from '@react-navigation/native';
import Dialog from "react-native-dialog";
import * as SecureStore from 'expo-secure-store';

function S2() {
    const [numColumns, setnumColumns] = useState(4);
    const [images, setimages] = useState();
    const [imagesLoading, setimagesLoading] = useState(false);
    const navigation = useNavigation()
    const [tabSelect, settabSelect] = useState([])
    const [uriSelect, seturiSelect] = useState([]);
    const [base, setBase] = useState(0)
    const [notLaoded, setnotLaoded] = useState('Loading...');
    const [server, setServer] = useState("");
    const [port, setPort] = useState("");
    const [visible, setvisible] = useState(false);
    const [newserver, setnewserver] = useState("");
    const [newport, setnewport] = useState("");

    const handleLoadPhotos = useCallback(async () => {

        let serverRes = await SecureStore.getItemAsync("server")
        if (serverRes) {
            setServer(serverRes)
            setnewserver(serverRes)
        } else {
            await SecureStore.setItemAsync("server", "192.168.0.154")
            setServer("192.168.0.154")
            setnewserver("192.168.0.154")
        }

        let portRes = await SecureStore.getItemAsync("port")
        if (portRes) {
            setPort(portRes)
            setnewport(portRes)
        } else {
            await SecureStore.setItemAsync("port", '3000')
            setPort('3000')
            setnewport('3000')
        }

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
            obj = JSON.stringify(obj.assets)
            setimages(JSON.parse(obj))
            setimagesLoading(true)
            console.log('load')
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

    const handleSelect = (id, uri) => {
        if (tabSelect.includes(id)) {
            let newTab = []
            let newUri = []
            for (let i = 0; i < tabSelect.length; i++)
                if (tabSelect[i] !== id) {
                    newTab.push(tabSelect[i])
                    newUri.push(uriSelect[i])
                }
            settabSelect(newTab)
            seturiSelect(newUri)
        } else {
            settabSelect([id, ...tabSelect])
            seturiSelect([uri, ...uriSelect])
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

    const handleUpladSelected = () => {
        const data = new FormData();

        uriSelect.forEach(item => {
            data.append('photo', {
                uri: item,
                type: 'image/jpeg',
                name: 'test'
            });
        })

        fetch(`http://${server}:${port}/upload`, { method: 'POST', body: data })
    }

    const handleShowCamera = () => {
        navigation.navigate("Camera", { refresh: handleLoadPhotos })
    }

    const handleShowSettings = () => {
        setvisible(true)
    }

    const handleSetServerData = async () => {
        setServer(newserver)
        setPort(newport)
        await SecureStore.setItemAsync("server", newserver)
        await SecureStore.setItemAsync("port", newport)
        setvisible(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttons}>

                <TouchableOpacity onPress={handleChangeDisplay}>
                    <Text style={{ fontSize: 14 }}>
                        GRID / LIST
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpladSelected}>
                    <Text style={{ fontSize: 14 }}>
                        Upload selected
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteSelected}>
                    <Text style={{ fontSize: 14 }}>
                        Delete selected
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShowCamera}>
                    <Text style={{ fontSize: 14 }}>
                        Camera
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShowSettings}>
                    <Text style={{ fontSize: 14 }}>
                        Settings
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
            <Dialog.Container visible={visible}>
                <Dialog.Title>Upload settings</Dialog.Title>
                <Dialog.Input value={newserver} onChangeText={txt => setnewserver(txt)}></Dialog.Input>
                <Dialog.Input value={newport} onChangeText={txt => setnewport(txt)}></Dialog.Input>
                <Dialog.Button
                    label="Cancel"
                    onPress={() => {
                        setvisible(false);
                        setnewserver(server)
                        setnewport(port)
                    }}
                />
                <Dialog.Button label="Save" onPress={handleSetServerData} />
            </Dialog.Container>
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
