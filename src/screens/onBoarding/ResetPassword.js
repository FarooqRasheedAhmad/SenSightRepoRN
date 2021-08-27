import React, { Component } from "react";
import { View, Text, TextInput, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
// import CodeFiled from "react-native-confirmation-code-field";
import Snackbar from "react-native-snackbar";
import { api } from "../../api";
// import { images } from "../../assets";
import { theme } from "../../theme";

import VerificationCodeForm from './VerificationCodeForm'

export class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { password: "", confirmPassword: "", code: "" };
  }
  containerProps = { style: styles.inputWrapStyle };

  onFinishCheckingCode = code => {
    console.log(code);
    this.setState({ code: code });
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  cellProps = ({ /*index, isFocused,*/ hasValue }) => {
    if (hasValue) {
      return { style: [styles.input, styles.inputNotEmpty] };
    }
    return { style: styles.input };
  };

  resetPassword = () => {
    if (this.state.code === ""){
      Snackbar.show({ text: theme.strings.code_not_found, duration: Snackbar.LENGTH_SHORT });
      return;
    }
    if (this.state.password !== this.state.confirmPassword){
      Snackbar.show({ text: theme.strings.password_not_match, duration: Snackbar.LENGTH_SHORT });
      return;
    }
    if (this.state.password.length < 8){
      Snackbar.show({ text: theme.strings.minimum_password_length, duration: Snackbar.LENGTH_SHORT });
      return;
    }


    var body = JSON.stringify({
      code: this.state.code,
      confirmPassword: this.state.confirmPassword,
      email: this.props.navigation.state.params.email,
      password: this.state.password
    });
    console.log(body);

    fetch(api.resetPassword, { method: "post", headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: body
    })
      .then(response => {
        console.log( "[response.status] : " + response.status + ",, " + JSON.stringify(response) );
        return response.json();
      })
      .catch(error => {
        console.error(error);
        this.showError();
      })
      .then(data => {
        if (data != null && data.errors != null) {
          var desc = data.errors[0].description;
          console.log("error :" + desc);
          setTimeout(() => {
            Snackbar.show({ text: desc, duration: Snackbar.LENGTH_SHORT });
          }, 100);
          return;
        }
        if (data == undefined) {
          this.showError();
          return;
        }
        if (data != null && data.isValid) {
          console.log("====resetPassword data", data);
          setTimeout(() => {
            Snackbar.show({ text: data.message, duration: Snackbar.LENGTH_SHORT });
          }, 1000);
          this.props.navigation.navigate("Login");
        } else if (data.code == 400) {
          this.showError();
          return;
        }
      });
  };

  showError = () => {
    Snackbar.show({ text: theme.strings.call_fail_error, duration: Snackbar.LENGTH_SHORT });
  };

  render() {

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          
          <Text style={styles.title}>{theme.strings.reset_password}</Text>
          
          <View style={{ marginBottom: 30 }}>
            <VerificationCodeForm onChange={this.onFinishCheckingCode} />
            {/* <CodeFiled
              rootStyle={{borderColor:"#FF0000"}}
              blurOnSubmit={false}
              variant="clear"
              codeLength={6}
              keyboardType="numeric"
              cellProps={this.cellProps}
              containerProps={this.containerProps}
              onFulfill={this.onFinishCheckingCode}
            /> */}
          </View>

          <TextInput
            // style={[theme.palette.textInputTransparentBg, styles.inputField]}
            style={[theme.palette.textInput, styles.inputField]}
            placeholder={theme.strings.new_password}
            placeholderTextColor={theme.colors.colorPrimary}
            secureTextEntry={true}
            onChangeText={text => this.handleChange("password", text)}
          />
          <TextInput
            style={[theme.palette.textInput, styles.inputField]}
            placeholder={theme.strings.confirm_password}
            placeholderTextColor={theme.colors.white}
            secureTextEntry={true}
            onChangeText={text => this.handleChange("confirmPassword", text)}
          />
          <TouchableOpacity onPress={this.resetPassword} activeOpacity={0.8} style={[theme.palette.button, styles.submitButton]}>
            <Text style={theme.palette.buttonText}>{theme.strings.reset_password}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.colorPrimary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 5,
    paddingLeft: 5
  },
  title: {
    color: "#FFF", // theme.colors.colorPrimary,
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20
  },
  inputField: {
    width: "80%",
    borderColor: theme.colors.colorPrimary,
  },
  submitButton: {
    marginTop: 20,
    width: "80%",
    borderWidth:1,
    borderColor: "#FFF"
  },
  inputWrapper: {
    alignItems: "center",
    justifyContent: "center"
  },
  inputLabel: {
    paddingTop: 100,
    paddingBottom: 10,
    color: "#000",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center"
  },
  inputSubLabel: {
    color: "#000",
    textAlign: "center"
  },
  inputWrapStyle: {
    height: 50,
    marginTop: 30
  },
  input: {
    borderWidth:1,
    borderColor: theme.colors.colorPrimary,
    height: 50,
    width: 40,
    borderRadius: 3,
    color: "#000",
    fontWeight: "bold",
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
