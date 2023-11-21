import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import * as Yup from 'yup';
import * as SQLite from "expo-sqlite"

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
  password: Yup.string()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Please enter a valid password")
    .required("Please enter your password"),
  address: Yup.string()
    .matches(/^.{1,50}$/, "please enter a valid address")
    .required("Please enter your Address"),
  phone: Yup.string()
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits")
    .matches(/^[0-9]+$/, "Only Digits")
    .required("Please enter your Mobile Number"),
});
const Userform = ({ navigation }) => {
  const db = SQLite.openDatabase("shivasnews_dbss");
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, email TEXT, password TEXT, address TEXT, phone TEXT)'),
        () => console.log('Table created successfully'),
        // console.log("caretd bd"),
        (error) => console.error(" creating db==>", error.message)
    });

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users',
        [],
        (_, result) => {
          setUserData(result.rows._array);
          //console.log('User data from the database fetch:', userdata);
        },
        (error) => console.error('Error retrieving user data:', error.message)
      );
    });

  }, [db]);

  const insertDataToDatabase = (values) => {
    console.log("value after submit event ", values.password)
    console.log("value after submit event ", values)
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO users (name, email, password, address, phone) VALUES (?, ?, ?, ?, ?)',
        [values.name, values.email, values.password, values.address, values.phone],
        () => {
          console.log('Data inserted successfully');
          Alert.alert("data insetred sucessfully")
        },
        (error) => {
          console.error('Error inserting data:', error);
        }
      );
    });
  };

  const Listscreen = () => {
    navigation.navigate('Details', { passedData: userData });
  }
  const Login = () => {
    navigation.navigate('Login');
  }
  return (
    <Formik initialValues={{
      name: '',
      email: '',
      password: '',
      address: '',
      phone: '',
    }}
      validationSchema={SignupSchema}
      //  onSubmit={value => console.log(value)}
      onSubmit={(value, { resetForm }) => {
        insertDataToDatabase(value)
        resetForm({ value: '' })
      }}
    >
      {({ values, errors, touched, isValid, setFieldTouched, handleChange, handleSubmit }) => (
        <View style={styles.wrapper}>
          <StatusBar style={'light-content'} />
          <View style={styles.formContainer}>
            <Text style={styles.title}>Userform</Text>
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
                placeholder='password'
                secureTextEntry={true}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={() => setFieldTouched('password')} />
              {touched.password && errors.password && (
                <Text style={styles.errorTxt}>{errors.password}</Text>
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
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                onPress={Listscreen}
                style={styles.submitBtn}
              >
                <Text style={[styles.submitBtnTxt, { backgroundColor: "#395B64" }]}>Go to DB</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                onPress={Login}
                style={styles.submitBtn}
              >
                <Text style={[styles.submitBtnTxt, { backgroundColor: "#395B64" }]}>Login</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      )}
    </Formik>
  )
};
export default Userform
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