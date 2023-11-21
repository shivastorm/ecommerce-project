import React, { useState, useEffect } from 'react'
import { StyleSheet, Alert, TouchableOpacity, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as SQLite from "expo-sqlite"

const UserInfo = ({ route, navigation }) => {
    const db = SQLite.openDatabase("shivasnews_dbss");
    const value = route.params.passedData;
    const loginName = route.params.loginName;
    const [Data, setData] = useState([]);

    // console.log("datas route=== state data>", Data)
    // console.log("datas route===loginname>", loginName)
    // console.log("datas route===>", value[0].name)
    useEffect(() => {
        const foundUser = value.find(user => user.name === loginName);
        if (foundUser.name === "admin") {
            setData(value)
        } else {
            setData(foundUser);
        }
        // console.log("login name==>",foundUser.name)
    }, [value, loginName]);
    const fetchUserData = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM users',
                [],
                (_, result) => {
                    setData(result.rows._array);
                },
                (error) => console.error('Error retrieving user data:', error.message)
            );
        });
    }
    const deleteUserVlaue = (id) => {
        db.transaction(tx => {
            tx.executeSql('DELETE FROM users WHERE id =? ', [id],
                (txobj, resultset) => {
                    fetchUserData()
                    Alert.alert("User Removed sucessfully")
                },
                (txobj, error) => console.log(error)
            );
        });
    };
    const EditScreen = (user) => {
        navigation.navigate('EditScreen', { user })
    }
    return (
        <>
            <View style={styles.wrapper}>
                <StatusBar style={'light-content'} />
                <View style={styles.formContainer}>
                    <Text style={styles.title}>DashBoard</Text>
                    <SafeAreaView>
                        <ScrollView>
                            <View style={styles.tableRowheader}>
                                <Text style={styles.headerCell}>ID</Text>
                                <Text style={styles.headerCell}>Name</Text>
                                <Text style={styles.headerCell}>Email</Text>
                                <Text style={styles.headerCell}>Address</Text>
                                <Text style={styles.headerCell}>Phone</Text>
                                <Text style={styles.headerCell}>Password</Text>
                            </View>
                            {loginName === 'admin' ? Data.map((name, index) => {
                                return (
                                    <View style={styles.tableRow}>
                                        <Text style={styles.cell}>{name.id}</Text>
                                        <Text style={styles.cell}>{name.name}</Text>
                                        <Text style={styles.cell}>{name.email}</Text>
                                        <Text style={styles.cell}>{name.address}</Text>
                                        <Text style={styles.cell}>{name.phone}</Text>
                                        <Text style={styles.cell}>{name.password}</Text>
                                        <View style={styles.celledit}>
                                        </View>
                                    </View>
                                );
                            }) :
                                < View style={styles.tableRow}>
                                    <Text style={styles.cell}>{Data.id}</Text>
                                    <Text style={styles.cell}>{Data.name}</Text>
                                    <Text style={styles.cell}>{Data.email}</Text>
                                    <Text style={styles.cell}>{Data.address}</Text>
                                    <Text style={styles.cell}>{Data.phone}</Text>
                                    <Text style={styles.cell}>{Data.password}</Text>
                                    <View style={styles.celledit}>
                                    </View>
                                </View>
                            }
                            <Text style={styles.title}>Data Manipulation </Text>
                            {loginName === 'admin' ?
                                <Text style={{ fontSize: 15, fontWeight: '400' }}>Data manipulation is restricted in ADMIN LOGIN</Text>
                                :
                                <View style={styles.updatecell}>
                                    <Text style={styles.cell}>ID :  {Data.id}</Text>
                                    <View style={styles.updatecellrow}>
                                        <TouchableOpacity
                                            onPress={() => EditScreen(Data)}
                                            style={styles.submitBtn}>
                                            <Text style={styles.submitBtnTxt}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => deleteUserVlaue(Data.id)}
                                            style={styles.submitBtn}>
                                            <Text style={styles.submitBtnTxt}>Remove</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </View >
        </>
    )
}

export default UserInfo

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
        paddingLeft: 40,

    },
    tablecolumn: {
        flexDirection: 'column',
    },
    updatecell: {
        padding: 8,
        flexDirection: "row",
        justifyContent: 'space-between',
        width: 480,
        alignSelf: "center"
    },
    updatecellrow: {
        padding: 8,
        flexDirection: "row",
        justifyContent: 'space-between',
        width: 380,
        alignSelf: "center",

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
        fontWeight: '500',
        fontSize: 15,

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
        width: 100
    }, submitBtnTxt: {
        color: "#fff",
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "700"
    }
});