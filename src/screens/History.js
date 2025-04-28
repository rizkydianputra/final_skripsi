import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

/* ───── helper: ambil timestamp milidetik dari Firebase push-ID ───── */
const PUSH_CHARS =
  '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
function pushIdToMillis(id) {
  let ts = 0;
  for (let i = 0; i < 8; i++) {
    ts = ts * 64 + PUSH_CHARS.indexOf(id[i]);
  }
  return ts;
}

export default function History({navigation}) {
  const [rows,  setRows]  = useState([]);
  const [total, setTotal] = useState('0,00');
  const [busy,  setBusy]  = useState(true);

  /* ───── reload setiap kali halaman di-focus ───── */
  useEffect(() => {
    const unsub = navigation.addListener('focus', readHistory);
    return unsub;
  }, [navigation]);

  async function readHistory() {
    setBusy(true);
    try {
      const uid      = auth().currentUser.uid;
      const idBank   = (await database()
                         .ref(`users/${uid}`).once('value')).val().IDBankNotes;

      const refHist  = database().ref(`BankNotes/${idBank}`);
      const yearNow  = new Date().getFullYear();

      const listener = refHist.on('value', snap => {
        if (!snap.exists()) {
          setRows([]);
          setTotal('0,00');
          setBusy(false);
          return;
        }

        const list   = [];
        let saldoAll = 0;

        Object.entries(snap.val()).forEach(([key, item]) => {
          /* ---- hitung saldo keseluruhan (semua tahun) ---- */
          const nominal = Number(item.nominal?.replace(/\./g, '') || 0);
          saldoAll += item.isWd ? -nominal : nominal;

          /* ---- filter tampilan: hanya tahun sekarang ---- */
          const millis = pushIdToMillis(key);
          const year   = new Date(millis).getFullYear();
          if (year !== yearNow) return;          // skip catatan lama

          list.push({...item, id: key, date: millis});
        });

        /* urutkan terbaru dulu */
        list.sort((a, b) => b.date - a.date);

        /* format saldo ke Rp1.234,56 */
        const saldoFmt = saldoAll
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$&,')
          .replace('.', ',');

        setRows(list);
        setTotal(saldoFmt);
        setBusy(false);
      });

      return () => refHist.off('value', listener);
    } catch (e) {
      console.error(e);
      setBusy(false);
    }
  }

  const renderItem = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.waktu}</Text>
      <Text style={styles.cell}>
        {item.isWd ? '-' : ''}Rp{item.nominal || '0'}
      </Text>
    </View>
  );

  /* ───── UI ───── */
  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.bars} onPress={navigation.openDrawer}>
        <FontAwesome5 name="bars" size={25} color="#fff" />
      </TouchableHighlight>

      <Text style={styles.title}>History</Text>
      <Text style={styles.subtitle}>Tabungan</Text>
      <Text style={styles.caption}>Please save your money!</Text>

      <View style={styles.table}>
        {/* header */}
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.hText]}>Waktu</Text>
          <Text style={[styles.cell, styles.hText]}>Nominal</Text>
        </View>

        {busy ? (
          <ActivityIndicator style={{marginTop: 20}} color="#A2FF86" />
        ) : (
          <FlatList
            data={rows}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}

        {/* footer total */}
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.hText]}>Total</Text>
          <Text style={[styles.cell, styles.hText]}>Rp{total}</Text>
        </View>
      </View>
    </View>
  );
}

/* ───── Styles ───── */
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#040D12'},
  bars:{height:35,width:35,margin:20,backgroundColor:'#1d2b3a',
        borderRadius:10,alignItems:'center',justifyContent:'center'},
  title:{marginTop:10,fontSize:50,color:'#fff',fontWeight:'bold',
         fontFamily:'monospace',textAlign:'center'},
  subtitle:{fontSize:50,color:'#fff',fontWeight:'bold',
            fontFamily:'monospace',textAlign:'center',marginTop:-10},
  caption:{fontSize:20,color:'#A2FF86',textAlign:'center',
           fontFamily:'Poppins-Medium'},
  table:{width:300,backgroundColor:'#000',alignSelf:'center',
         marginTop:30,maxHeight:420},
  header:{backgroundColor:'#A2FF86'},
  hText:{color:'#000',fontWeight:'bold'},
  row:{flexDirection:'row',justifyContent:'space-between',
       paddingHorizontal:10,height:30,alignItems:'center'},
  cell:{color:'#fff',fontSize:14},
});
