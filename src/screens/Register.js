import React, {useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default function Register({navigation}) {
  const [email,  setEmail]  = useState('');
  const [idBN,   setIdBN]   = useState('');
  const [pass,   setPass]   = useState('');
  const [pass2,  setPass2]  = useState('');

  const toast = msg =>
    Platform.OS === 'android'
      ? ToastAndroid.show(msg, ToastAndroid.SHORT)
      : Alert.alert('Info', msg);

  const onRegister = async () => {
    if (!email || !idBN || !pass || !pass2) return toast('Lengkapi semua data');
    if (pass !== pass2) return toast('Password tidak sama');

    try {
      const cred = await auth().createUserWithEmailAndPassword(email.trim(), pass);
      await database().ref(`users/${cred.user.uid}`).set({
        email, IDBankNotes: idBN,
      });
      toast('Registrasi berhasil, silakan login');
      navigation.goBack();
    } catch (e) {
      toast(e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex:1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.h1}>Create</Text>
          <Text style={styles.h2}>Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="ID Banknotes"
            placeholderTextColor="#666"
            value={idBN}
            onChangeText={setIdBN}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={pass}
            onChangeText={setPass}
          />

          <TextInput
            style={styles.input}
            placeholder="Re-type Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={pass2}
            onChangeText={setPass2}
          />

          <TouchableHighlight style={styles.btn} onPress={onRegister}>
            <Text style={styles.btnTxt}>SIGN UP</Text>
          </TouchableHighlight>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll:{flexGrow:1,justifyContent:'center',alignItems:'center',
          backgroundColor:'#1d2b3a',paddingBottom:40},
  h1:{fontSize:75,fontFamily:'cursive',fontWeight:'bold',color:'#fff',
      marginTop:-120},
  h2:{fontSize:75,fontFamily:'cursive',fontWeight:'bold',color:'#fff',
      marginTop:-15,marginBottom:20},
  input:{backgroundColor:'#fff',width:300,height:50,borderRadius:50,
         paddingLeft:20,fontSize:15,marginTop:15,color:'#000'},
  btn:{backgroundColor:'#A2FF86',width:120,height:50,borderRadius:50,
       justifyContent:'center',alignItems:'center',marginTop:30},
  btnTxt:{fontFamily:'monospace',fontWeight:'bold',color:'#000'},
});
