import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  ActivityIndicator,

} from 'react-native';
import React, {useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {jumlah} from './History.js';  

export default function Pengeluaran({navigation}) {
  const [datahistory, setdatahistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jumlah, setJumlah] = useState(0);
  const [Pengeluaran, OnChangeEmail] = useState('Email');



  React.useEffect(() => {
    const fetchHistory = async () => {
      // Ambil UID dari user
      const uid = auth().currentUser.uid;

      try {
        // Ambil ID Bank Note berdasarkan UID user
        const fetchIdBankNote = await database()
          .ref(`users/${uid}`)
          .once('value');

        // Setelah ID Bank Note diambil, baca data history berdasarkan ID Bank Note tersebut
        if (fetchIdBankNote.val().IDBankNotes) {
          const IDBankNotes = fetchIdBankNote.val().IDBankNotes;
          const fetchHistoryData = await database()
            .ref(`BankNotes/${IDBankNotes}`)
            .once('value');

          let hitungJumlah = 0;
          let historyDataTemp = [];
          console.log('Fetch History: ', fetchHistoryData.val());
          for (const itemHistory in fetchHistoryData.val()) {
            // hitungJumlah += fetchHistoryData.val()[itemHistory].nominal;
            const item = fetchHistoryData.val()[itemHistory];
            item.id = itemHistory;
            const nominalNoDot = Number(item.nominal.replace(/[.]+/g, ''));
            hitungJumlah += nominalNoDot;
            historyDataTemp.push(item);
          }

          const jumlahRupiah = hitungJumlah
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,');
          setdatahistory(historyDataTemp);
          setJumlah(jumlahRupiah);
          setLoading(false);

        //  const warnaKalender = {};
        //   for (const itemHistory in fetchHistoryData.val()) {
        //     warnaKalender[`${itemHistory.tanggal}`] = {
        //       color: fetchHistoryData.val()[itemHistory].warna, // itemHistory.warna,
        //       startingDay: true,
        //       endingDay: true,
        //       textColor: 'black',
        //     };
        //   }

          // console.log('Warna Kalender: ', warnaKalender);
          // setDataKalender(warnaKalender);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchHistory();
  }, []);

  console.log('Data History: ', datahistory);

  return (
    <View style={styles.Container}>
      <TouchableHighlight
        style={styles.Bars}
        onPress={() => navigation.openDrawer()}>
        <FontAwesome5 name={'bars'} size={25} color="white" />
      </TouchableHighlight>
      <Text style={styles.Text0}>WELCOME TO</Text>
      <Text style={styles.Text1}>SMART BANKNOTES</Text>
      {/* <Text style={styles.Text2}>BANKNOTES</Text> */}
      <Text style={styles.Text3}>Withdraw </Text>
      <View style={styles.Balance}>
        <View style={styles.Total}>
          <Text style={styles.Text4}>Input Withdraw</Text>
        </View>
        <View style={styles.Total}>
        <TextInput
        style={styles.Pengeluaran}
        placeholder="Nominal"
        placeholderTextColor="white"
        onChangeText={text => OnChangeEmail(text)}
        keyboardType="email-address"
      />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#040D12',
  },
  Bars: {
    height: 35,
    width: 35,
    marginTop: 20,
    marginLeft: 20,
    backgroundColor: '#1d2b3a',
    paddingLeft: 7,
    paddingTop: 4,
    borderRadius: 10,
  },
  shadow: {
    width: 320,
    height: 50,
    width: '90%',
    height: '10%',
    borderRadius: 100,
    marginTop: -30,
    paddingTop: 10,
    marginLeft: 22,
    shadowColor: '#000000',
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 1,
    elevation: 15,
  },
  Text0: {
    marginTop: 10,
    fontFamily: 'fantasy',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#A2FF86',
    textAlign: 'center',
  },
  Text1: {
    marginTop: -9,
    fontFamily: 'fantasy',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  Text2: {
    fontFamily: 'fantasy',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  Text3: {
    fontFamily: 'FasterOne-Regular',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#A2FF86',
    textAlign: 'center',
  },
  Text4: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    marginLeft: 10,
    textAlign: 'center',
  },
  Text5: {
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white',
    marginTop: 10,
    marginLeft: 10,
  },
  Balance: {
    height: 130,
    width: 250,
    marginTop: 10,
    backgroundColor: '#1d2b3a',
    alignSelf: 'center',
    borderRadius: 15,
  },
  Total: {
    height: 70,
    width: 290,
    alignSelf: 'center',
    marginTop: 3,
  },
  Pengeluaran: {
    color: 'white',
    backgroundColor: '#1d2b3a',
    height: 50,
    width: 300,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 50,
    fontFamily: 'FasterOne-Regular',
    fontSize: 15,
    paddingLeft: 20,
    paddingBottom: 10,
  },
});
