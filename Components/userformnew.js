import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, Alert, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
  phone: Yup.string()
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits")
    .matches(/^[0-9]+$/, "Only Digits")
    .required("Please enter your Mobile Number"),
  age: Yup.string()
    .matches(/^[0-9]+$/, "Only Digits")
    .required("Please enter your Age"),
  gender: Yup.string()
    .required("Please enter your Gender"),
  address: Yup.string()
    .matches(/^.{1,50}$/, "please enter a valid address")
    .required("Please enter your Address"),
});
 
const UserForm = () => {
  const [isOpen, SetIsOpen] = useState(false)
  const [currentValue, setCurrentValue] = useState()
  const items = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];
  return (
    <Formik initialValues={{
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      address: '',
    }}
      validationSchema={SignupSchema}
     // onSubmit={(values) => { Alert.alert(JSON.stringify(values)) }}
     onSubmit={value=> console.log(value)}
    >
      {({ values, errors, touched, isValid, handleChange, setFieldTouched, handleSubmit }) => (
        <View style={styles.wrapper}>
          <StatusBar barstyle={"light-content"} />
          <View style={styles.formContainer}>
            <Text style={styles.title}> User Data Form</Text>
            <View style={styles.inputWrapper}>
              {Object.keys(errors).length === 0 ? (
                <Text>Form is valid</Text>
              ) : (
                <Text>Form is invalid</Text>
              )}
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
                placeholder='Age'
                value={values.age}
                keyboardType='phone-pad'
                onChangeText={handleChange('age')}
                onBlur={() => setFieldTouched('age')} />
              {touched.age && errors.age && (
                <Text style={styles.errorTxt}>{errors.age}</Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <DropDownPicker
                items={items}
                open={isOpen}
                setOpen={() => { SetIsOpen(!isOpen) }}
                value={currentValue}
                setValue={(val) => { setCurrentValue(val) }}
                placeholder='Select Gender'
                style={{ backgroundColor: "#F5EDDC" }}

              />
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
          </View>
        </View>
      )}
    </Formik>

  );
};
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

export default UserForm;
