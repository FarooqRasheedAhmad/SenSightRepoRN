import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { icons } from "../../assets";


export const TabBarAdvancedButton = ({
  bgColor,
  ...props
}) => (
  <View
    style={styles.container}
    pointerEvents="box-none"
  >
    <TouchableOpacity
      style={styles.button}
      onPress={()=> props.onPress(true)}
    >
        <Image source={icons.call_blue} style={{ tintColor: 'white', width: 24, height: 24 }} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 75,
    alignItems: 'center'
  },
  background: {
    position: 'absolute',
    top: 0,
  },
  button: {
    top: -22.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 27,
    backgroundColor: '#25BEED',
  },
  buttonIcon: {
    fontSize: 16,
    color: '#F6F7EB'
  }
});