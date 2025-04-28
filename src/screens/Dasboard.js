import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export default function Dasboard({navigation}) {
  const [saldo, setSaldo] = useState('0,00');
  const [busy,  setBusy]  = useState(true);

  const hitungSaldo = async () => {
    const uid = auth().currentUser.uid;
    try {
      const snapUser = await database().ref(`users/${uid}`).once('value');
      const idBank   = snapUser.val().IDBankNotes;
      const snapHist = await database().ref(`BankNotes/${idBank}`).once('value');

      let total = 0;
      snapHist.forEach(s => {
        const {nominal, isWd} = s.val();
        total += (isWd ? -1 : 1) * Number(nominal.replace(/\./g, ''));
      });

      const saldoFmt = total
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')
        .replace('.', ',');

      setSaldo(saldoFmt);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', hitungSaldo);
    return unsub;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.bars} onPress={navigation.openDrawer}>
        <FontAwesome5 name="bars" size={25} color="#fff" />
      </TouchableHighlight>

      <Text style={styles.h1}>WELCOME TO</Text>
      <Text style={styles.h2}>SMART BANKNOTES</Text>
      <Text style={styles.sub}>Please save your money!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Balance Now</Text>
        {busy ? (
          <ActivityIndicator style={{marginTop: 10}} color="#fff" />
        ) : (
          <Text style={styles.cardSaldo}>Rp. {saldo}</Text>
        )}
      </View>

      <TouchableHighlight
        style={styles.btn}
        onPress={() => navigation.navigate('Pengeluaran')}>
        <Text style={styles.btnText}>Withdraw</Text>
      </TouchableHighlight>
    </View>
  );
}

/* ────────────── STYLES ────────────── */
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#040D12'},
  bars:{height:35,width:35,margin:20,backgroundColor:'#1d2b3a',
        borderRadius:10,alignItems:'center',justifyContent:'center'},

  /* teks judul & sub (Poppins) */
  h1:{marginTop:10,fontSize:30,color:'#A2FF86',
      fontFamily:'Poppins-Bold',textAlign:'center'},
  h2:{fontSize:40,color:'#fff',
      fontFamily:'Poppins-Bold',textAlign:'center',marginTop:-5},
  sub:{fontSize:15,color:'#A2FF86',
       fontFamily:'Poppins-Regular',textAlign:'center'},

  /* kartu saldo */
  card:{height:130,width:250,backgroundColor:'#1d2b3a',
        borderRadius:15,alignSelf:'center',marginTop:40,alignItems:'center'},
  cardTitle:{fontSize:20,color:'#fff',marginTop:15,
             fontFamily:'Poppins-Bold'},
  cardSaldo:{fontSize:18,color:'#fff',marginTop:10,
             fontFamily:'Poppins-Regular'},

  /* tombol */
  btn:{width:120,height:50,backgroundColor:'#1d2b3a',
       borderRadius:20,justifyContent:'center',alignSelf:'center',marginTop:40},
  btnText:{color:'#fff',fontSize:16,textAlign:'center',
           fontFamily:'Poppins-Bold'},
});
