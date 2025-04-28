import React, {useEffect, useState} from 'react';
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Platform,
  ToastAndroid,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export default function Pengeluaran({navigation}) {
  const [amount, setAmount]   = useState('');
  const [idBank, setIdBank]   = useState('');
  const [sending, setSending] = useState(false);

  /* ───── ambil ID BankNote sekali ───── */
  useEffect(() => {
    const uid = auth().currentUser.uid;
    database()
      .ref(`users/${uid}`)
      .once('value')
      .then(s => setIdBank(s.val().IDBankNotes))
      .catch(console.error);
  }, []);

  /* ───── fungsi toast (Android) / alert (iOS) singkat ───── */
  const toast = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', msg);
    }
  };

  /* ───── simpan WD dengan pengecekan saldo ───── */
  const handleWithdraw = async () => {
    if (!amount) {
      toast('Masukkan nominal terlebih dahulu');
      return;
    }

    const amountNum = Number(amount.replace(/\./g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      toast('Nominal tidak valid');
      return;
    }

    setSending(true);
    try {
      /* hitung saldo terkini */
      const snap = await database()
        .ref(`BankNotes/${idBank}`)
        .once('value');

      let saldo = 0;
      snap.forEach(s => {
        const item    = s.val();
        const nominal = Number(item.nominal?.replace(/\./g, '') || 0);
        saldo += item.isWd ? -nominal : nominal;
      });

      if (amountNum > saldo) {
        toast('Saldo tidak mencukupi');
        setSending(false);
        return;
      }

      /* saldo cukup → simpan */
      const ref  = database().ref(`BankNotes/${idBank}`).push();
      const now  = new Date();
      const waktu= now.toLocaleDateString('en-GB') +
                   ' ' +
                   now.toLocaleTimeString('en-GB');

      await ref.set({
        nominal : amount,
        waktu,
        isWd    : true,
        warna   : '#FF7676',
      });

      setAmount('');
      setSending(false);
      navigation.navigate('History');
    } catch (e) {
      console.error(e);
      toast('Terjadi kesalahan, coba lagi');
      setSending(false);
    }
  };

  /* ───── UI ───── */
  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.bars} onPress={navigation.openDrawer}>
        <FontAwesome5 name="bars" size={25} color="#fff" />
      </TouchableHighlight>

      <Text style={styles.h1}>WELCOME TO</Text>
      <Text style={styles.h2}>SMART BANKNOTES</Text>
      <Text style={styles.subtitle}>Withdraw</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Input Withdraw</Text>
        <TextInput
          style={styles.input}
          placeholder="Nominal (contoh: 10000)"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
          value={amount}
          onChangeText={txt => setAmount(txt.replace(/[^0-9]/g, ''))}
        />

        <TouchableOpacity
          style={[styles.btn, (sending || !amount) && {opacity: 0.5}]}
          onPress={handleWithdraw}
          disabled={sending || !amount || !idBank}>
          {sending
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Withdraw</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ───── Styles ───── */
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#040D12'},
  bars:{height:35,width:35,margin:20,backgroundColor:'#1d2b3a',
        borderRadius:10,alignItems:'center',justifyContent:'center'},
  h1:{marginTop:10,fontSize:30,color:'#A2FF86',fontWeight:'bold',textAlign:'center'},
  h2:{fontSize:40,color:'#fff',fontWeight:'bold',textAlign:'center',marginTop:-5},
  subtitle:{fontSize:28,color:'#A2FF86',fontWeight:'bold',textAlign:'center',marginTop:10},
  card:{backgroundColor:'#1d2b3a',borderRadius:15,padding:20,
        alignSelf:'center',marginTop:30,width:'80%'},
  cardTitle:{fontSize:18,color:'#fff',fontWeight:'bold'},
  input:{backgroundColor:'#040D12',color:'#fff',
         borderRadius:8,padding:12,marginTop:15},
  btn:{backgroundColor:'#A2FF86',borderRadius:20,
       paddingVertical:10,marginTop:20,alignItems:'center'},
  btnText:{color:'#040D12',fontWeight:'bold',fontSize:16},
});
