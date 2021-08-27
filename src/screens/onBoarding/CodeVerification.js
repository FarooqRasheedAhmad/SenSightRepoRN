import React, { Component } from "react";
import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
// import CodeFiled from "react-native-confirmation-code-field";
import VerificationCodeForm from './VerificationCodeForm'

import { images } from "../../assets";
import { theme } from "../../theme";

export class CodeVerification extends Component {
  containerProps = { style: styles.inputWrapStyle };

  onFinishCheckingCode = code => {
    console.log(code);
  };

  cellProps = ({ /*index, isFocused,*/ hasValue }) => {
    if (hasValue) {
      return { style: [styles.input, styles.inputNotEmpty] };
    }
    return { style: styles.input };
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          style={theme.palette.backgroundOnBoarding}
          source={images.login_bg}
        />
        <View style={styles.container}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Enter 6-digit code to confirm account{" "}</Text>
            <Text style={styles.inputSubLabel}>The verification code has been sent to your email. Please enter the code</Text>
            <VerificationCodeForm onChange={this.onFinishCheckingCode} />
            {/* <CodeFiled
              blurOnSubmit={false}
              variant="clear"
              codeLength={6}
              keyboardType="numeric"
              cellProps={this.cellProps}
              containerProps={this.containerProps}
              onFulfill={this.onFinishCheckingCode}
            /> */}
          </View>
          {/* <TouchableOpacity style={{ alignItems: "center" }}>
            <View style={styles.nextButton}>
              <View style={styles.nextButtonArrow} />
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity activeOpacity={0.8} style={[theme.palette.button,styles.submitButton]}>
            <Text style={theme.palette.buttonText}>Submit Code</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 5,
    paddingLeft: 5
  },
  submitButton:{
    marginTop:20,
  },
  inputWrapper: {
    alignItems: "center",
    justifyContent: "center"
  },
  inputLabel: {
    paddingTop: 100,
    paddingBottom: 10,
    color: "#FFFF",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center"
  },
  inputSubLabel: {
    color: "#FFFF",
    textAlign: "center"
  },
  inputWrapStyle: {
    height: 50,
    marginTop: 30
  },
  input: {
    height: 50,
    width: 40,
    borderRadius: 3,
    color: "#FFFF",
    backgroundColor: "rgba(255, 255, 255, 1)",
    ...Platform.select({
      web: {
        lineHeight: 46
      }
    })
  },
  inputNotEmpty: {
    backgroundColor: "rgba(0,0,0,0)"
  },
  nextButton: {
    marginTop: 100,
    width: 70,
    height: 70,
    borderRadius: 80,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // IOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    // Android
    elevation: 5
  },
  nextButtonArrow: {
    transform: [{ translateX: -3 }, { rotate: "45deg" }],
    borderColor: "#ff595f",
    width: 20,
    height: 20,
    borderWidth: 4,
    borderLeftWidth: 0,
    borderBottomWidth: 0
  }
});
