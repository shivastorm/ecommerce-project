import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import * as Yup from 'yup';
import sqlite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';



const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Please enter your full-name'),
    email: Yup.string()
        .email('Invalid email')
        .required('must contain valid email address with @ symbol ')
        .matches(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
            "must contain valid email address with @ symbol"),
    address: Yup.string()
        .matches(/^.{1,50}$/, "please enter a valid address")
        .required("Please enter your Address"),
    phone: Yup.string()
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits")
        .matches(/^[0-9]+$/, "Only Digits")
        .required("Please enter your Mobile Number"),
});

// const db = sqlite.openDatabase(
//   { name: 'my.db', location: 'default' },
//   () => {
//     console.log("Database opened successfully");
//   }, console.log("Database opened successfully"),
//   (error) => {
//     console.error("Error while opening the database:", error);
//   }
//   );

const Userform = ({ navigation }) => {

    const [name, SetName] = useState('')
    const [email, SetEmail] = useState('')
    const [address, Setaddress] = useState('')
    const [phone, SetPhone] = useState('')

    const save = async () => {
        try {
            await AsyncStorage.setItem("name", name)
            await AsyncStorage.setItem("email", email)
            await AsyncStorage.setItem("address", address)
            await AsyncStorage.setItem("phone", phone)
        } catch (err) {
            alert(err);
        }
    };
    useEffect(() => {
        save();
    }, [name,email,address,phone])

    return (
        <Formik initialValues={{
            name: '',
            email: '',
            address: '',
            phone: ''
        }}
            validationSchema={SignupSchema}
            onSubmit={value => {
                console.log(value)
                SetName(value.name)
                SetEmail(value.email)
                Setaddress(value.address)
                SetPhone(value.phone)
            }}
        //onSubmit={value => { insertDataToDatabase(value) }}

        >

            {({ values, errors, touched, isValid, setFieldTouched, handleChange, handleSubmit }) => (


                <View style={styles.wrapper}>
                    <StatusBar style={'light-content'} />
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Userform local</Text>
                        {Object.keys(errors).length === 0 ? (
                            <Text>Form is valid</Text>
                        ) : (
                            <Text>Form is invalid</Text>
                        )}
                        <View style={styles.inputWrapper}>
                            <TextInput style={styles.inputStyle}
                                placeholder='name'
                                value={values.name}
                                onChangeText={handleChange('name')}
                                onBlur={() => setFieldTouched('name')} />
                            {touched.name && errors.name && (
                                <Text style={styles.errorTxt}>{errors.name}</Text>
                            )}
                        </View>
                        <View style={styles.inputWrapper}>
                            <TextInput style={styles.inputStyle}
                                placeholder='Email'
                                value={values.email}
                                onChangeText={handleChange('email')}
                                onBlur={() => setFieldTouched('email')} />
                            {touched.email && errors.email && (
                                <Text style={styles.errorTxt}>{errors.email}</Text>
                            )}
                        </View>
                        <View style={styles.inputWrapper}>
                            <TextInput style={styles.inputStyle}
                                placeholder='address'
                                value={values.address}
                                onChangeText={handleChange('address')}
                                onBlur={() => setFieldTouched('address')}
                            />
                            {touched.address && errors.address && (
                                <Text style={styles.errorTxt}>{errors.address}</Text>
                            )}
                        </View>
                        <View style={styles.inputWrapper}>
                            <TextInput style={styles.inputStyle}
                                placeholder='Phone'
                                value={values.phone}
                                keyboardType='phone-pad'
                                onChangeText={handleChange('phone')}
                                onBlur={() => setFieldTouched('phone')}
                            />
                            {touched.phone && errors.phone && (
                                <Text style={styles.errorTxt}>{errors.phone}</Text>
                            )}

                        </View>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!isValid}
                            style={[styles.submitBtn, { backgroundColor: isValid ? "#395B64" : "#A5C9CA" }]}
                        >
                            <Text style={styles.submitBtnTxt}> Submit</Text>
                        </TouchableOpacity>
                        {/* <Text style={styles.title}>Saved data using local-storage</Text>
                        <Text style={styles.inputStyle}>
                            name: {name}
                        </Text>
                        <Text style={styles.inputStyle}>
                            email: {email}
                        </Text>
                        <Text style={styles.inputStyle}>
                            address: {address}
                        </Text>
                        <Text style={styles.inputStyle}>
                            phone: {phone}
                        </Text> */}
                        <Button
                            title="Go to List"
                            onPress={() => navigation.navigate('Details')}
                        />
                    </View>
                </View>
            )}
        </Formik>
    )
}

export default Userform

const styles = StyleSheet.create({
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