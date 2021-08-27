import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import React, { Component } from "react";

import Snackbar from "react-native-snackbar";
import { api } from "../../api";
import { images } from "../../assets";
import { theme } from "../../theme";

export class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "" };
  }
  containerProps = { style: styles.inputWrapStyle };

  validate = text => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    }
    return true;
  };

  onFinishCheckingCode = code => {
    console.log(code);
  };

  cellProps = ({ /*index, isFocused,*/ hasValue }) => {
    if (hasValue) {
      return {
        style: [styles.input, styles.inputNotEmpty]
      };
    }
    return {
      style: styles.input
    };
  };

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    });
  };

  sendMail = () => {
    if (this.state.email.length == 0 || !this.validate(this.state.email)) {
      message = theme.strings.enter_email;
      if (message.length > 0) {
        Snackbar.show({ text: message, duration: Snackbar.LENGTH_SHORT });
        return;
      }
    }
    var body = JSON.stringify({ email: this.state.email });

    fetch(api.forgotPassword, {
      method: "post",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
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
          console.log("====forgotPassword data", data);
          setTimeout(() => {
            Snackbar.show({ text: data.message, duration: Snackbar.LENGTH_SHORT });
          }, 1000);
          this.props.navigation.navigate("ResetPassword", { email: this.state.email });
        } else if (data.code == 400) {
          this.showError();
          return;
        }
      });
  };

  showError = () => {
    Snackbar.show({
      text: theme.strings.call_fail_error,
      duration: Snackbar.LENGTH_SHORT
    });
  };

  render() {
    return (
        <View style={styles.container}>
          {/* <View style={{ marginTop: Platform.OS === "ios" ? 15 : 35 }} /> */}

          <Text style={styles.title}>{theme.strings.forgot_password}</Text>
          <TextInput
            style={[theme.palette.textInputTransparentBg, styles.inputField]}
            placeholder={theme.strings.email}
            placeholderTextColor={theme.colors.white}
            keyboardType={"email-address"}
            onChangeText={text => this.handleChange("email", text)}
          />
          
          <TouchableOpacity onPress={this.sendMail} activeOpacity={0.8} style={[theme.palette.buttonWhiteBg, styles.submitButton]}>
            <Text style={theme.palette.buttonTextPrimary}>{theme.strings.send_mail}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.cancel}>{theme.strings.cancel}</Text>
          </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: theme.colors.colorPrimary
  },
  cancel: {
    color: theme.colors.white,
    fontSize: 13,
    textAlign: "right",
    fontFamily: theme.fonts.SFUITextSemiBold,
    margin: 10
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20
  },
  submitButton: {
    marginTop: 20,
    width: "80%"
  },
  inputField: {
    width: "80%"
  }
});
