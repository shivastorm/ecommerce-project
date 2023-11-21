import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import Userform from './Components/userFormLocal';
import Userform from './Components/Userform';
import DetailsScreen from './Components/DetailsScreen';
import EditUserData from './Components/EditUserData';
import Login from './Components/Login';
import UserInfo from './Components/UserInfo';
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Mainpage"
            component={Userform}
            options={{ headerShown: false }} />
          <Stack.Screen name="Details"
            options={{ headerShown: false ,orientation:'landscape'}}
            component={DetailsScreen} />
          <Stack.Screen name="EditScreen"
            options={{ headerShown: false}}
            component={EditUserData} />
          <Stack.Screen name="Login"
            options={{ headerShown: false}}
            component={Login} />
          <Stack.Screen name="UserInfo"
            options={{ headerShown: false ,orientation:'landscape'}}
            component={UserInfo} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <Userform/> */}

    </>
  );
};


export default App;
