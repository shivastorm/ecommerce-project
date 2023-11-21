import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as SQLite from "expo-sqlite"

const LoginUserSchema = Yup.object().shape({
    // Define validation schema for the edited data
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please enter your full name'),
    // email: Yup.string()
    //     .email('Invalid email')
    //     .required('Must contain a valid email address')
    //     .matches(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/, "Must contain a valid email address"),
    password: Yup.string()
        .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "Please enter a valid password")
        .required("Please enter your password"),
});
const Login = ({ navigation }) => {
    const db = SQLite.openDatabase("shivasnews_dbss");
    const [userData, setUserData] = useState([]);
    // console.log("first==vakue==>.>>",userData)
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM users',
                [],
                (_, result) => {
                    setUserData(result.rows._array);
                },
                (error) => console.error('Error retrieving user data:', error.message)
            );
        });
    }, [db])
    const checkLoginCredentials = async (values) => {
        // console.log("login vakues==>>", values)
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM users WHERE name = ? AND password = ?',
                    [values.name, values.password],
                    (txObj, resultSet) => {
                        //  console.log("result checking in login===>", resultSet);
                        if (resultSet.rows.length > 0) {
                            // Login successful
                            resolve(true);
                        } else {
                            // Login failed
                            resolve(false);
                        }
                    },
                    (txObj, error) => {
                        console.error("login checking=>>", error);
                        reject(error);
                    }
                );
            });
        });
    };
    const LoginSubmit = async (values) => {
        console.log("login vaLUES===>", values);
        const loginSuccessful = await checkLoginCredentials(values);
        if (loginSuccessful) {
            navigation.navigate('UserInfo', { passedData: userData, loginName: values.name });
        } else {
            // Show an alert for failed login
            Alert.alert("Login credentials invalid");

        }
    };
    return (
        <>
            <Formik
                initialValues={{
                    name: '',
                    // email: '',
                    password: '',
                }}
                validationSchema={LoginUserSchema}
                onSubmit={value => LoginSubmit(value)
                }
            >
                {({ values, errors, touched, setFieldTouched, handleChange, handleSubmit }) => (
                    <View style={styles.wrapper}>
                        <StatusBar style={'light-content'} />
                        <View style={styles.formContainer}>
                            <Text style={styles.title}>Login</Text>
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
                                {touched.name && errors.name && (
                                    <Text style={styles.errorTxt}>{errors.name}</Text>
                                )}
                            </View>
                            {/* <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder='Email'
                                    onChangeText={(text) => {
                                        setFieldTouched('email');
                                        handleChange('email')(text);
                                    }}
                                    value={values.email}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.errorTxt}>{errors.email}</Text>)}

                            </View> */}
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder='Password'
                                    secureTextEntry={true}
                                    onChangeText={(text) => {
                                        setFieldTouched('password');
                                        handleChange('password')(text);
                                    }}
                                    value={values.password}
                                />
                                {touched.password && errors.password && (
                                    <Text style={styles.errorTxt}>{errors.password}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={styles.submitBtn}
                            >
                                <Text style={styles.submitBtnTxt}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </>
    )
}

export default Login

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