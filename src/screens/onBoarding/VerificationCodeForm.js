import React, { Component, useEffect } from "react";
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';


const VerificationCodeForm = props => {
    const CELL_COUNT = 6;
    const [value, setValue] = React.useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [field_props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });
  
    useEffect(() => {
      props.onChange(value)
    }, [value])
  
    return (<View>
        <CodeField
          ref={ref}
          {...field_props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <View key={index} onLayout={getCellOnLayoutHandler(index)}
            style={[styles.cell, isFocused && styles.focusCell]}
            >
              <Text
                style={[styles.cell_txt, isFocused && styles.focusCell_txt]}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
  
          )}
        />
    </View>)
  }
  
  export default VerificationCodeForm;

const styles = StyleSheet.create({
    root: { flex: 1, padding: 20 },
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: { marginTop: 20 },
    cell_txt:{
      color: "#000",
      ...Platform.select({ web: { lineHeight: 46, }, }),
      lineHeight: 38,
      fontSize: 30,
      textAlign: 'center',
    },
    cell: {
      height: 50,
      width: 40,
      borderRadius: 3,
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderWidth: 1,
      borderColor: '#00000030',
      margin:2,
      paddingTop: 5,
    },
    focusCell: {
      backgroundColor: "rgba(255, 255, 255, 0)",
      borderColor: '#000',
    },
    focusCell_txt: {
      color: "#FFF",
    },
  });
  