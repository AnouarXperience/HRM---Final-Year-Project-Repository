/* eslint-disable prettier/prettier */
// MenuModal.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchEmployeeById, fetchAdminById, logout } from '../config/apiService'; // Ensure both methods are available
import { getToken } from '../config/asyncStorage';
import { connect, useDispatch } from 'react-redux';
import { logout as reduxLogout } from '../Redux/authActions';
import CustomAlert from './CustomAlert';

const MenuModal = ({ navigation, id, roles }) => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [userName, setUserName] = useState('Loading...');
    const defaultImage = require('../assets/images/digidlogo.png');  // Path to the default image
    const dispatch = useDispatch();
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const loadUserProfile = useCallback(async () => {
        const token = await getToken();
        if (!token) {
            console.error("No token found, user may need to login again.");
            return;
        }

        const fetchConfig = {
            'Administrateur': {
                method: fetchAdminById,
                basePath: 'administrateur/files/'
            },
            'Employee': {
                method: fetchEmployeeById,
                basePath: 'employee/files/'
            }
        };

        let fetchMethod, basePath;
        roles.some(role => {
            if (fetchConfig[role]) {
                fetchMethod = fetchConfig[role].method;
                basePath = fetchConfig[role].basePath;
                return true;  // Stop the iteration if a match is found
            }
            return false;
        });

        if (!fetchMethod) {
            console.error("No appropriate fetch method found for the roles");
            return;
        }

        try {
            const userProfile = await fetchMethod(id, token);
            if (userProfile && userProfile.image) {
                setProfilePicture(`http://192.168.1.19:8086/${basePath}${userProfile.image}`);
            } else {
                setProfilePicture(defaultImage);
            }
            setUserName(userProfile.firstname && userProfile.lastname ? `${userProfile.firstname} ${userProfile.lastname}` : userProfile.username || 'No Name');
        } catch (error) {
            console.error("Failed to load user profile:", error);
            setUserName('Failed to load');
            setProfilePicture(defaultImage);
        }
    }, [id, roles, defaultImage]);

    useEffect(() => {
        if (!id) {
        //   console.error("User ID is undefined");
          navigation.replace('Login');
          return;
        }
        loadUserProfile();
    }, [id, roles, loadUserProfile, navigation]);

    const handleLogout = async () => {
        try {
          await logout();
          dispatch(reduxLogout());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } catch (error) {
          setAlertMessage('Unable to log out. Please try again.'); // Set the message for the alert
          setAlertVisible(true); // Show the alert
        }
      };
    const closeAlert = () => {
        setAlertVisible(false);
      };

    return (
        <ScrollView style={styles.MenuModal}>
            <View style={styles.profileSection}>
                {profilePicture ? (
                    typeof profilePicture === 'string' ? <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                    : <Image source={profilePicture} style={styles.profilePicture} />
                ) : (
                    <Icon name="account-circle" size={80} color="#FFF" />
                )}
                <Text style={styles.userName}>{userName}</Text>
            </View>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CheckInOut')}>
                <Icon name="clock-outline" size={20} color="#FFF" />
                <Text style={styles.menuText}>Check In/Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ConsultHistory')}>
                <Icon name="history" size={20} color="#FFF" />
                <Text style={styles.menuText}>Consult History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Holidays')}>
                <Icon name="beach" size={20} color="#FFF" />
                <Text style={styles.menuText}>Holidays</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Icon name="logout" size={24} color="#FFF" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
            <CustomAlert
                isVisible={alertVisible}
                message={alertMessage}
                onClose={closeAlert}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    MenuModal: {
        flex: 1,
        backgroundColor: '#6200EE',
        padding: 20,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    userName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuText: {
        color: '#FFF',
        marginLeft: 10,
        fontSize: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    logoutText: {
        color: '#FFF',
        marginLeft: 10,
    },
});

const mapStateToProps = (state) => ({
    id: state.auth.id,
    roles: state.auth.roles,
});

export default connect(mapStateToProps)(MenuModal);





























/////////////////////Old version////////////////

// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { fetchEmployeeById } from '../config/apiService'; // Import the getToken method
// import { getToken } from '../config/asyncStorage';
// import { connect } from 'react-redux';

// const MenuModal = ({ navigation, id, roles }) => {
//     const [profilePicture, setProfilePicture] = useState(null);
//     const [userName, setUserName] = useState('Loading...');
//     const isAdmin = roles.includes('Administrateur');
//     const isEmployee = roles.includes('Employee');
//     const defaultImage = require('../assets/images/digidlogo.png');  // Path to the default image

//     useEffect(() => {
//         if (!id) {
//           console.error("Employee ID is undefined");
//           return; // Exit if no employee ID is found
//         }
//         const loadUserProfile = async () => {
//             // if (!id) {
//             //   console.error("Employee ID is undefined");
//             //   return; // Exit if no employee ID is found
//             // }
//             const token = await getToken(); // Retrieve the stored token
//             console.log("Retrieved token:", token); 
//             if (!token) {
//                 console.log("No token found, user may need to login again.");
//                 return; // Handle scenario where there is no token
//             }
//             try {
//                 const userProfile = await fetchEmployeeById(id, token);
//                 // if (userProfile) {
//                 //     setProfilePicture(userProfile.image ? `http://192.168.1.19:8086/employee/files/${userProfile.image}` : null);
//                 //     setUserName(userProfile.firstname + ' ' + userProfile.lastname || 'No Name');
//                 // } else {
//                 //     setUserName('No User Data');
//                 // }
//                 if (userProfile) {
//                   // Set the profile picture depending on the user's role
//                   if (isAdmin && !userProfile.image) {
//                       setProfilePicture(defaultImage);
//                   } else {
//                       setProfilePicture(`http://192.168.1.19:8086/employee/files/${userProfile.image}`);
//                   }
//                   // setUserName(userProfile.firstname + ' ' + userProfile.lastname || userProfile.username || 'No Name');
//                   setUserName(userProfile.firstname && userProfile.lastname ? `${userProfile.firstname} ${userProfile.lastname}` : userProfile.username || 'No Name');
//               } else {
//                   setUserName('No User Data');
//               }
//             } catch (error) {
//                 console.error("Failed to load user profile:", error);
//                 console.error("Error details:", error.response ? error.response.data : "No additional error info");
//                 setUserName('Failed to load');
//             }
//         };
//         loadUserProfile();
//       //   if (id) {  // Ensuring id is not undefined
//       //     loadUserProfile();
//       // }
//     }, [id, isAdmin, defaultImage]);

//   return (
//     <ScrollView style={styles.MenuModal}>
//       <View style={styles.profileSection}>
//         {profilePicture ? (
//           <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
//         ) : (
//           <Icon name="account-circle" size={80} color="#FFF" /> // Show default icon if no image is available
//         )}
//         <Text style={styles.userName}>{userName}</Text>
//       </View>
//       <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CheckInOut')}>
//         <Icon name="clock-outline" size={20} color="#FFF" />
//         <Text style={styles.menuText}>Check In/Out</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ConsultHistory')}>
//         <Icon name="history" size={20} color="#FFF" />
//         <Text style={styles.menuText}>Consult History</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Holidays')}>
//         <Icon name="beach" size={20} color="#FFF" />
//         <Text style={styles.menuText}>Holidays</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   MenuModal: {
//     flex: 1,
//     backgroundColor: '#6200EE',
//     padding: 20,
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   profilePicture: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 10,
//   },
//   userName: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   menuText: {
//     color: '#FFF',
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   iconStyle: {
//     width: 24,
//     height: 24,
//   },
// });
// const mapStateToProps = (state) => ({
//   id: state.auth.id,
//   roles: state.auth.roles,
// });

// export default connect(mapStateToProps)(MenuModal);
