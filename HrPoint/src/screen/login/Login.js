/* eslint-disable prettier/prettier */
// LoginForm.js
// import React, { useState } from 'react';
// import { View, TextInput, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch } from 'react-redux';
// import { loginRequest, loginSuccess, loginFailure } from '../../Redux/authActions';
// import { login } from '../../config/apiService';
// import { storeToken } from '../../config/asyncStorage';
// import LoaderScreen from '../../components/LoaderScreen';
// import CustomAlert from '../../components/CustomAlert'; // Import the CustomAlert component

// const backgroundImg = require('../../assets/images/background.jpg');
// const userIcon = require('../../assets/icons/user.png');
// const passwordIcon = require('../../assets/icons/loginpassword.png');

// const validationSchema = Yup.object().shape({
//   username: Yup.string().required('Username is required'),
//   password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
// });

// const LoginForm = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (values) => {
//     setLoading(true);
//     dispatch(loginRequest());
//     try {
//       const response = await login(values);
//       const token = response.data.accessToken;
//       if (token) {
//         await storeToken(token);
//         dispatch(loginSuccess(token));
//         navigation.navigate('Main');
//       } else {
//         throw new Error('Token is null or undefined');
//       }
//     } catch (error) {
//       console.log(error);
//       dispatch(loginFailure(error.message));
//       // Use CustomAlert instead of Alert.alert
//       setAlertMessage('Invalid username or password. Please try again.');
//       setAlertVisible(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [alertVisible, setAlertVisible] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');

//   const closeAlert = () => {
//     setAlertVisible(false);
//   };

//   return (
//     <ImageBackground source={backgroundImg} style={styles.background}>
//       {loading ? (
//         <LoaderScreen />
//       ) : (
//         <Formik
//           initialValues={{ username: '', password: '' }}
//           validationSchema={validationSchema}
//           onSubmit={handleLogin}
//         >
//           {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
//             <View style={styles.formContainer}>
//               <View style={styles.inputContainer}>
//                 <Image source={userIcon} style={styles.icon} />
//                 <TextInput
//                   style={[styles.input, touched.username && errors.username && styles.inputError]}
//                   placeholder="Username"
//                   onChangeText={handleChange('username')}
//                   onBlur={handleBlur('username')}
//                   value={values.username}
//                 />
//               </View>
//               {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}

//               <View style={styles.inputContainer}>
//                 <Image source={passwordIcon} style={styles.icon} />
//                 <TextInput
//                   style={[styles.input, touched.password && errors.password && styles.inputError]}
//                   placeholder="Password"
//                   secureTextEntry
//                   onChangeText={handleChange('password')}
//                   onBlur={handleBlur('password')}
//                   value={values.password}
//                 />
//               </View>
//               {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

//               <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//                 <Text style={styles.buttonText}>Login</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </Formik>
//       )}
//       <CustomAlert isVisible={alertVisible} message={alertMessage} onClose={closeAlert} />
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   formContainer: {
//     width: '80%',
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     padding: 20,
//     borderRadius: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderColor: '#000',
//     borderBottomWidth: 1,
//     paddingLeft: 10,
//     marginRight: 10,
//   },
//   icon: {
//     width: 20,
//     height: 20,
//     marginRight: 10,
//   },
//   inputError: {
//     borderColor: 'red',
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   button: {
//     backgroundColor: '#120E43',
//     paddingVertical: 15,
//     borderRadius: 5,
//     marginTop: 20,
//     width: '100%',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });


// export default LoginForm;

/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Modal, Button, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure } from '../../Redux/authActions';
import { login } from '../../config/apiService';
import { storeToken } from '../../config/asyncStorage';
import LoaderScreen from '../../components/LoaderScreen';
import CustomAlert from '../../components/CustomAlert'; // Import the CustomAlert component
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import CheckBox from '@react-native-community/checkbox'; // Import the CheckBox component

const backgroundImg = require('../../assets/images/background.jpg');
const userIcon = require('../../assets/icons/user.png');
const passwordIcon = require('../../assets/icons/loginpassword.png');

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const termsStatus = await AsyncStorage.getItem('termsAccepted');
    const permissionsStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    setTermsAccepted(termsStatus === 'true');
    setPermissionsGranted(permissionsStatus === RESULTS.GRANTED);
  };

  const requestPermissions = async () => {
    const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    setPermissionsGranted(status === RESULTS.GRANTED);
    if (status !== RESULTS.GRANTED) {
      setAlertMessage("This app requires location services to function properly.");
      setAlertVisible(true);
    }
  };

  const handleLogin = async (values) => {
    if (!termsAccepted || !permissionsGranted) {
      setAlertMessage("You must accept terms and enable permissions to use the app.");
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    dispatch(loginRequest());
    try {
      const response = await login(values);
      // const token = response.data.accessToken;
      const { accessToken, id, roles } = response.data;
      if (!accessToken) {
        console.error('Received null or undefined token:', accessToken);
        throw new Error('Token is null or undefined');
      }
      console.log("Login Response:", response.data);
      await storeToken(accessToken);  // Make sure the correct token is being passed
      dispatch(loginSuccess(accessToken, id, roles));
      navigation.replace('Main');
    } catch (error) {
      console.log(error);
      dispatch(loginFailure(error.message));
      setAlertMessage('Invalid username or password. Please try again.');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      {loading ? (
        <LoaderScreen />
      ) : (
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Image source={userIcon} style={styles.icon} />
                <TextInput
                  style={[styles.input, touched.username && errors.username && styles.inputError]}
                  placeholder="Username"
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                />
              </View>
              {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}

              <View style={styles.inputContainer}>
                <Image source={passwordIcon} style={styles.icon} />
                <TextInput
                  style={[styles.input, touched.password && errors.password && styles.inputError]}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
              </View>
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={termsAccepted}
                  onValueChange={setTermsAccepted}
                  style={styles.checkbox}
                />
                <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)}>
                  <Text style={styles.label}>I agree with the <Text style={styles.link}>Privacy Policy</Text></Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      )}
      <CustomAlert isVisible={alertVisible} message={alertMessage} onClose={closeAlert} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={!termsAccepted || !permissionsGranted}
        onRequestClose={() => {
          setAlertMessage("You must accept terms and enable permissions to use the app.");
          setAlertVisible(true);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {!termsAccepted ? (
              <Button title="Accept Terms" onPress={() => setTermsAccepted(true)} />
            ) : (
              <Button title="Grant Permissions" onPress={requestPermissions} />
            )}
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#000',
    borderBottomWidth: 1,
    paddingLeft: 10,
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    marginLeft: 8,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#120E43',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});

export default LoginForm;