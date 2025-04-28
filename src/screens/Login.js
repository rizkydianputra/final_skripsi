import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
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

/*  hitung font responsif  */
const {width} = Dimensions.get('window');
const TITLE    = Math.round(width * 0.22);   // ≈ 22 % lebar layar
const LINE     = TITLE + 4;                  // line-height

export default function Login({navigation}) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  /* toast helper */
  const toast = msg =>
    Platform.OS === 'android'
      ? ToastAndroid.show(msg, ToastAndroid.SHORT)
      : Alert.alert('Info', msg);

  /* login */
  const onLogin = () =>
    auth()
      .signInWithEmailAndPassword(email.trim(), password.trim())
      .catch(e => toast(e.message));

  /* reset password */
  const onForgot = () => {
    if (!email) return toast('Masukkan email terlebih dulu');
    auth()
      .sendPasswordResetEmail(email.trim())
      .then(() => toast('Tautan reset dikirim ke email'))
      .catch(e => toast(e.message));
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.root}
          contentContainerStyle={styles.wrap}
          keyboardShouldPersistTaps="handled">
          {/* piggy bank kiri-atas */}
          <Image
            source={require('../pig.png')}
            style={styles.pigTop}
            resizeMode="contain"
          />

          {/* judul */}
          <Text style={styles.h1}>Smart</Text>
          <Text style={styles.h2}>Banknotes</Text>
          <Text style={styles.tag}>Please save your money!</Text>

          {/* form */}
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
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableHighlight onPress={onForgot} underlayColor="#1d2b3a">
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.btn} onPress={onLogin}>
            <Text style={styles.btnTxt}>SIGN IN</Text>
          </TouchableHighlight>

          <View style={styles.row}>
            <Text style={styles.register}>Don't have an account?</Text>
            <TouchableHighlight
              onPress={() => navigation.navigate('Register')}
              underlayColor="#1d2b3a">
              <Text style={[styles.register, {color: 'red'}]}> SIGN UP</Text>
            </TouchableHighlight>
          </View>

          {/* piggy bank kanan-bawah */}
          <Image
            source={require('../pig2.png')}
            style={styles.pigBottom}
            resizeMode="contain"
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:'#1d2b3a'},
  wrap:{flexGrow:1,alignItems:'center',paddingBottom:40,paddingTop:100},

  /* piggy bank */
  pigTop:{position:'absolute',top:-10,left:-50,width:230,height:230},
  pigBottom:{width:220,height:220,alignSelf:'flex-end',
             marginTop:-40,marginRight:-40,marginBottom:-40},

  /* judul & tagline */
  h1:{fontSize:65,fontFamily:'Poppins-Bold',color:'#fff',
      lineHeight:LINE,marginTop:0},
  h2:{fontSize:65,fontFamily:'Poppins-Bold',color:'#fff',
      lineHeight:LINE,marginTop:-6},
  tag:{fontSize:26,fontFamily:'Poppins-Regular',color:'#A2FF86',
       marginBottom:25},

  /* form */
  input:{backgroundColor:'#fff',width:300,height:50,borderRadius:50,
         paddingLeft:20,fontSize:15,marginTop:15,
         fontFamily:'Poppins-Regular',color:'#000'},

  /* link & tombol */
  link:{alignSelf:'flex-end',marginRight:4,marginTop:5,
        fontFamily:'Poppins-Regular',color:'#A2FF86'},
  btn:{backgroundColor:'#A2FF86',width:110,height:50,borderRadius:50,
       justifyContent:'center',alignItems:'center',marginTop:30},
  btnTxt:{fontFamily:'Poppins-Bold',color:'#000',fontSize:16},

  /* footer */
  row:{flexDirection:'row',alignItems:'center',marginTop:25},
  register:{fontFamily:'Poppins-Regular',color:'#fff',fontSize:15},
});

