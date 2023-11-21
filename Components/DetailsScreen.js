import React, { useState, useEffect } from 'react'
import { Button, SafeAreaView, ScrollView, Alert, StyleSheet, TouchableOpacity, Text, View, } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as SQLite from "expo-sqlite"

const DetailsScreen = ({ navigation, route }) => {
    const db = SQLite.openDatabase("shivasnews_dbss");
    // const db = SQLite.openDatabase("usersne_db");
    const passedData = route.params.passedData;
    // console.log("==>",passedData)
    const [data, setData] = useState(passedData);
    const [editData, setEditData] = useState([]);    
    //console.log("==>..",passedData[0].id)        
        const deleteUserVlaue = (id) => {
            console.log("hi")
            db.transaction(tx => {
                tx.executeSql('DELETE FROM users WHERE id =? ', [id],
                    (txobj, resultset) => {
                        if (resultset.rowsAffected > 0) {
                            let tempUserValue = [...data].filter(name => name.id !== id);
                            setData(tempUserValue);
                            Alert.alert("User Removed sucessfully")
                        }
                    },
                    (txobj, error) => console.log(error)
                );
            });
        };
    
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM users',
                [],
                (_, result) => {
                    setEditData(result.rows._array);
                    //console.log('User data from the database fetch:', userdata);
                },
                (error) => console.error('Error retrieving user data:', error.message)
            );
        });
    }, [db]);

    const EditScreen = (user) => {
        navigation.navigate('EditScreen', { user })
    }
    return (
        <View style={styles.wrapper}>
            <StatusBar style={'light-content'} />
            <View style={styles.formContainer}>
                <SafeAreaView>
                    <ScrollView>
                        <View style={styles.tableRowheader}>
                            <Text style={styles.headerCell}>ID</Text>
                            <Text style={styles.headerCell}>Name</Text>
                            <Text style={styles.headerCell}>Email</Text>
                            <Text style={styles.headerCell}>Address</Text>
                            <Text style={styles.headerCell}>Phone</Text>
                            <Text style={styles.headerCell}>Action</Text>
                        </View>
                        <Text>
                            {editData ? editData.map((name, index) => {
                                return (
                                    <View style={styles.tableRow}>
                                        <Text style={styles.cell}>{passedData[index].id}</Text>
                                        <Text style={styles.cell}>{name.name}</Text>
                                        <Text style={styles.cell}>{name.email}</Text>
                                        <Text style={styles.cell}>{name.address}</Text>
                                        <Text style={styles.cell}>{name.phone}</Text>
                                        <View style={styles.celledit}>
                                            <TouchableOpacity
                                                onPress={() => deleteUserVlaue(name.id)}
                                                style={styles.submitBtn}>
                                                <Text style={styles.submitBtnTxt}>Delete</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => EditScreen(name)}
                                                style={styles.submitBtn}>
                                                <Text style={styles.submitBtnTxt}>Edit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                );
                            }) : data.map((name, index) => {
                                return (
                                    <View style={styles.tableRow}>
                                        <Text style={styles.cell}>{passedData[index].id}</Text>
                                        <Text style={styles.cell}>{name.name}</Text>
                                        <Text style={styles.cell}>{name.email}</Text>
                                        <Text style={styles.cell}>{name.address}</Text>
                                        <Text style={styles.cell}>{name.phone}</Text>
                                        {/* <Text style={styles.cell}>{name.passw}</Text> */}
                                        <View style={styles.celledit}>
                                            <Button title='Remove' onPress={() => deleteUserVlaue(name.id)} />
                                            <Button title='Edit'
                                                onPress={() => EditScreen(name)} />

                                        </View>
                                    </View>

                                );
                            })}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.submitBtn}>
                            <Text style={styles.submitBtnTxt}>Go Back</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </SafeAreaView>
            </View>
        </View >
    )
}
export default DetailsScreen

const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderColor: 'black',
    },
    tableRow: {
        flexDirection: 'row', textAlign: "center"
    },
    tableRowheader: {
        flexDirection: 'row',
        paddingLeft: 40
    },
    tablecolumn: {
        flexDirection: 'column',
    },
    headerCell: {
        flex: 1,
        padding: 8,
        fontWeight: 'bold',
        textAlign: "auto",
        borderBottomWidth: 1,
        borderColor: 'black',
    },
    cell: {
        flex: 1,
        padding: 8,
        textAlign: 'center',
        alignSelf: "center",
        width: 120,
        fontWeight: '800',
        fontSize: 15
    },
    celledit: {
        flex: 1,
        padding: 8,
        justifyContent: 'space-between',
        width: 140,
        flexDirection: "row"

    },
    container: {
        padding: 16,
        marginTop: 20,
        backgroundColor: "white"
    }, card: {
        flexDirection: "row",
        borderColor: "black",
        borderWidth: 1,
        width: 350, height: 40,
        borderRadius: 10,
        paddingLeft: 10,
        alignItems: "center", marginBottom: 5, backgroundColor: "#E4D5C7"
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2C3333',
        paddingHorizontal: 15,
    },
    formContainer: {
        backgroundColor: '#F5EDDC',
        padding: 20,
        borderRadius: 20,
        width: '100%',
    },
    title: {
        color: '#16213E',
        fontSize: 26,
        fontWeight: '400',
        marginBottom: 15,
    },
    inputWrapper: {
        marginBottom: 15,
    },
    inputStyle: {
        borderColor: '#16213E',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    errorTxt: {
        fontSize: 12,
        color: '#FF0D10',
    },
    submitBtn: {
        backgroundColor: '#395B64',
        padding: 10,
        borderRadius: 15,
        justifyContent: 'center',
    }, submitBtnTxt: {
        color: "#fff",
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "700"
    }
});