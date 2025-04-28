import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import 'react-native-gesture-handler';

import Login from '../screens/Login';
import Register from '../screens/Register';
import Dasboard from '../screens/Dasboard';
import History from '../screens/History';
import Pengeluaran from '../screens/Pengeluaran';
import auth from '@react-native-firebase/auth';

/* ───────── navigators ───────── */
const Stack        = createNativeStackNavigator();
const LoginStack   = createNativeStackNavigator();
const Drawer       = createDrawerNavigator();

/* ───────── login stack ───────── */
function LoginScreen() {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <LoginStack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </LoginStack.Navigator>
  );
}

/* ───────── drawer / home ───────── */
function HomeScreen() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Dasboard"
        component={Dasboard}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="History"
        component={History}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Pengeluaran"
        component={Pengeluaran}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}

/* ───────── custom drawer content ───────── */
function CustomDrawerContent(props) {
  /* ambil email user yg login → jadikan username */
  const user     = auth().currentUser;
  const username = user?.email ? user.email.split('@')[0] : 'User';

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{flex: 1}}>
      {/* ─── header profil ─── */}
      <View style={styles.profileBox}>
        <FontAwesome5 name="user-circle" size={60} color="#1d2b3a" />
        <Text style={styles.profileName}>{username}</Text>
      </View>

      {/* daftar menu otomatis */}
      <DrawerItemList {...props} />

      {/* logout selalu di bawah */}
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <DrawerItem
          label="Log Out"
          onPress={() =>
            auth()
              .signOut()
              .then(() => console.log('User signed out!'))
          }
        />
      </View>
    </DrawerContentScrollView>
  );
}

/* ───────── root navigation ───────── */
export default function Navigation() {
  const [signedIn, setSignedIn] = useState(false);

  auth().onAuthStateChanged(user => {
    setSignedIn(!!user);
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {signedIn ? (
          <Stack.Screen
            name="HomeNavigation"
            component={HomeScreen}
            options={{headerShown: false}}
          />
        ) : (
          <Stack.Screen
            name="LoginNavigation"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ───────── styles ───────── */
const styles = StyleSheet.create({
  profileBox: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  profileName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1d2b3a',
  },
});
