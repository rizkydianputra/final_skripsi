// App.js
import 'react-native-gesture-handler';   // harus di baris pertama
import React from 'react';
import {Text, TextInput, Platform} from 'react-native';
import Navigation from './src/Navigation/Navigation';

/* ---------- GLOBAL FONT SETUP ---------- */
// siapkan objek defaultProps jika belum ada
Text.defaultProps      = Text.defaultProps      || {};
TextInput.defaultProps = TextInput.defaultProps || {};

// gabungkan style lama (jika ada) + font baru
const globalFont = {fontFamily: 'Poppins-Regular'};
Text.defaultProps.style      = [globalFont, Text.defaultProps.style];
TextInput.defaultProps.style = [globalFont, TextInput.defaultProps.style];

/* ---------- (optional) ganti fontWeight:bold ---------- */
if (Platform.OS === 'android') {
  // Android mem­buat varian Bold terpisah: Poppins-Bold.ttf
  const oldRender = Text.render;
  Text.render = function (...args) {
    const origin = oldRender.call(this, ...args);
    const style  = origin.props.style || {};
    if (Array.isArray(style) ? style.some(s => s?.fontWeight === 'bold')
                             : style.fontWeight === 'bold') {
      return React.cloneElement(origin, {
        style: [{fontFamily: 'Poppins-Bold'}, style],
      });
    }
    return origin;
  };
}

/* ---------- APP ---------- */
export default function App() {
  return <Navigation />;
}
