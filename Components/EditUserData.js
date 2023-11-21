import React, { useState } from 'react';
import { View, Alert, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as SQLite from "expo-sqlite"

const EditUserSchema = Yup.object().shape({
    // Define validation schema for the edited data
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please enter your full name'),
    email: Yup.string()
        .email('Invalid email')
        .required('Must contain a valid email address')
        .matches(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/, "Must contain a valid email address"),
    address: Yup.string()
        .matches(/^.{1,50}$/, "Please enter a valid address")
        .required("Please enter your address"),
    phone: Yup.string()
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits")
        .matches(/^[0-9]+$/, "Only digits")
        .required("Please enter your mobile number"),
});

const EditUserData = ({ route }) => {
    const db = SQLite.openDatabase("shivasnews_dbss");
    const { user, onUpdate } = route.params;
    const checkNameExists = async (name) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM users WHERE name = ?',
                    [name],
                    (txObj, resultSet) => {
                        console.log("resultset==>", resultSet)
                        if (resultSet.rows.length > 1) {
                            // Name already exists
                            resolve(true);
                        } else {
                            // Name does not exist
                            resolve(false);
                        }
                    },
                    (txObj, error) => {
                        console.error(error);
                        reject(error);
                    }
                );
            });
        });
    };
    const UpdateData = async (id) => {
        db.transaction(tx => {
            tx.executeSql('UPDATE users SET name = ?, email = ?, address = ?, phone = ? WHERE id = ?',
                [id.name, id.email, id.address, id.phone, user.id],
                (txobj, resultset) => {
                    if (resultset.rowsAffected > 0) {
                        Alert.alert("Data Updated sucessfully")
                        onUpdate();
                        console.log('Update successful');
                    } else {
                        console.log('Update failed');
                    }
                }, (txobj, error) => console.log(error)
            );
        });
        const nameExists = await checkNameExists(id.name);
        if (nameExists) {
            Alert.alert('Name Exists', 'The entered name already exists in the database.');
        }
    }
    return (
        <>
            <Formik
                initialValues={{
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    phone: user.phone,
                }}
                validationSchema={EditUserSchema}
                onSubmit={value => UpdateData(value)}
            >
                {({ values, errors, touched, isValid, setFieldTouched, handleChange, handleSubmit }) => (
                    <View style={styles.wrapper}>
                        <StatusBar style={'light-content'} />
                        <View style={styles.formContainer}>
                            <Text style={styles.title}>Edit Form</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder='Name'
                                    onChangeText={(text) => {
                                        setFieldTouched('name');
                                        handleChange('name')(text);
                                    }}
                                    value={values.name}
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder='Email'
                                    onChangeText={(text) => {
                                        setFieldTouched('email');
                                        handleChange('email')(text);
                                    }}
                                    value={values.email}
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder='Address'
                                    onChangeText={(text) => {
                                        setFieldTouched('address');
                                        handleChange('address')(text);
                                    }}
                                    value={values.address}
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder='Phone'
                                    value={values.phone}
                                    keyboardType='phone-pad'
                                    onChangeText={(text) => {
                                        setFieldTouched('phone');
                                        handleChange('phone');
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.submitBtn}
                                onPress={handleSubmit}
                                disabled={!isValid}
                            >
                                <Text style={styles.submitBtnTxt}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </>
    );
}
export default EditUserData
const styles = StyleSheet.create({
    tableRow: {
        flexDirection: 'row', textAlign: "center"
    },
    row: {
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "stretch",
        justifyContent: "space-between",
        margin: 8
    }, ontainer: {
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




