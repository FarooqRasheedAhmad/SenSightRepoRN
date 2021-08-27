import { AppConstants, StorageUtils, showMessage } from "../../utils";
import { Image, ImageBackground, Platform, SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, TextInput, TouchableOpacity, View,Modal
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import React, { Component } from "react";
import { icons, images } from "../../assets";
import { VERSION } from "../../../version";
import { EventRegister } from 'react-native-event-listeners'
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import Pushy from 'pushy-react-native';
// import firebase from "react-native-firebase";
import { theme } from "../../theme";
// import { SocialLoginButtons } from '../../components'
import ProfileUpdater from '../../utils/updater'


export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      spinner: false,
      showPassword: false,
      modalVisible: false,
      policyId: null,
      policyText: "",
      policyTitle: "",
      userId: "",
      token: "",
      userData: ""
    };
  }

  onChangeText = (value) => {
    this.setState({ value });
  };

  validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    }
    return true;
  };

  privacyPolicy = (userData) => {
    this.setState({ spinner: true });
    let uri = String(api.privacyPolicy).replace("{userId}", userData.userId);
    fetch(uri, { method: "get" })
      .then((response) => { return response.json(); })
      .catch((error) => {
        console.log(error)
        this.setState({ spinner: false });
        this.showError();
      })
      .then((data) => {
        console.log(data)
        if (data && data.length == 0) {
          ProfileUpdater.refetchLocalProfile({ ...userData, isLoggedIn: true, showCart: false }).then(r => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: "HomeScreen" })],
            });
            this.props.navigation.dispatch(resetAction);
          });
        }
        else {
          this.setState({
            spinner: false,
            modalVisible: true,
            policyId: data[0].policyId,
            policyText: data[0].policyText,
            policyTitle: data[0].title,
            userId: userData.userId,
            token: userData.accessToken,
            userData: userData,
          })
        }

      })
  }

  accecptPrivacyPolicy = () => {
    this.setState({ modalVisible: false, spinner: true })

    var body = {
      "userId": this.state.userId,
      "policyId": this.state.policyId,
      "reply": "yes"
    }
    // var formData = new FormData();
    // formData.append("UserId",this.state.userId)
    // formData.append("PolicyId",this.state.policyId)
    // formData.append("Reply","yes")
    fetch(api.accecptPrivacyPolicy, {
      method: "post",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + this.state.token, },
      body: JSON.stringify(body)
    })
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .catch((error) => {
        console.log(error)
        this.setState({ spinner: false });
      })
      .then((data) => {
        console.log(data)
        if (data) {
          ProfileUpdater.refetchLocalProfile({ ...this.state.userData, isLoggedIn: true, showCart: false }).then(r => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: "HomeScreen" })],
            });
            this.props.navigation.dispatch(resetAction);
          });
        }
      })
  }

  registerPushyToken = async () => {
    await Pushy.register().then(async (pushy_token) => {
      console.log("pushy_token: ", pushy_token);
      StorageUtils.storeInStorage('pushy_token', `${pushy_token}`)
      // Send the token to your backend server via an HTTP GET request
      //await fetch('https://your.api.hostname/register/device?token=' + pushy_token);
      // Succeeded, optionally do something to alert the user
    }).catch((err) => {
      // Handle registration errors
      Snackbar.show({ text: `Unable to generate notification Token`, duration: Snackbar.LENGTH_SHORT, });
      console.log("ERROR: ", err);
    });
  }

  login = async () => {
   await this.registerPushyToken();
    const date = new Date();
    const offset = date.getTimezoneOffset() / 60;
    const timeOffset = offset < 0 ? Math.abs(offset) : -offset;

    var message = "";
    var token = await StorageUtils.getValue(AppConstants.SP.DEVICE_TOKEN);
    var pushy_token = await StorageUtils.getValue('pushy_token');
    
    if (!pushy_token || pushy_token.length < 5) {
      console.log("Invalid pushy_token: ", pushy_token);
      // Snackbar.show({ text: `Invalid Notification Token (${pushy_token})`, duration: Snackbar.LENGTH_SHORT, });
      // return;
    }

    if (this.state.email.length == 0 || !this.validate(this.state.email))
      message = theme.strings.enter_email;
    else if (this.state.password.length == 0) message = theme.strings.enter_password;

    if (message.length > 0) {
      Snackbar.show({ text: message, duration: Snackbar.LENGTH_SHORT, });
      return;
    }

    var loginBody = JSON.stringify({
      loginName: this.state.email,
      password: this.state.password,
      deviceToken: pushy_token,  //token,
      offSetHoursDevice: timeOffset.toString(),
    });

    this.setState({ spinner: !this.state.spinner, });

    fetch(api.login, {
      method: "post",
      headers: { Accept: "application/json", "Content-Type": "application/json", },
      body: loginBody,
    })
      .then((response) => { return response.json(); })
      .catch((error) => {
        this.showError();
      })
      .then((data) => {
        this.setState({ spinner: false, });
        if (data != null && data.errors != null) {
          var desc = data.errors[0].description;
          setTimeout(() => {
            Snackbar.show({ text: desc, duration: Snackbar.LENGTH_SHORT, });
          }, 100);

          return;
        }
        if (data == undefined) {
          this.showError();
          return;
        }
        if (data != null && data.accessToken != undefined) {
          if (data.role !== "caretaker" && data.role !== "senior") {
            setTimeout(() => {
              showMessage("User role is not authorized to login", "long");
            }, 200);
            return;
          }
          console.log("Login Data: ", data);
          // data.getPackageModuleResponse.getModuleDetail[].moduleTag
          // if (data.getPackageModuleResponse && data.getPackageModuleResponse.getModuleDetail){
          //   let modules = data.getPackageModuleResponse.getModuleDetail.map(itm => (itm.moduleTag));
          //   console.log("modules: ", modules);
          // }
          // this.setState({ spinner: false, });
          // return;

          EventRegister.emit('onAppLogin', { ...data })

          this.privacyPolicy(data)

        } else if (data.code == 400) {
          this.showError();
          return;
        }
      })
      .catch((error) => {
        this.showError();
      });
  };

  showError = () => {
    this.setState({ spinner: false, });

    Snackbar.show({
      text: theme.strings.call_fail_error,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  modalView = () => {
    return (
      <Modal
        visible={this.state.modalVisible}
        transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#d3d3d3C2' }}>
          <View style={{ width: '90%', height: '90%', backgroundColor: 'white', padding: 22, }} >
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.state.policyTitle}</Text>

            <View style={{ height: '87%', marginTop: 10,}}>
              <ScrollView>
                <Text style={{ fontSize: 18, lineHeight: 25, letterSpacing: 0.35 }}>{this.state.policyText}</Text>
              </ScrollView>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around',alignItems: 'center', height: '8%',}}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => this.accecptPrivacyPolicy()} >
                <Text style={{ color: "#fff", fontSize: 15, }}>Agree</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.modalView()}
        <StatusBar barStyle="light-content" translucent backgroundColor={theme.colors.colorPrimary} />
        <Spinner visible={this.state.spinner} textStyle={styles.spinnerTextStyle} />

        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              <View style={{ marginTop: Platform.OS === "ios" ? 15 : 35 }} />
              {/* <TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }} activeOpacity={0.8}>
                  <Text style={styles.cancel}>{theme.strings.cancel}</Text>
                </TouchableOpacity> */}
              <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.loginToYourAccount}>{theme.strings.login_to_your_account}</Text>
                <View style={{ height: 15 }} />
                <TextInput
                  style={theme.palette.textInputTransparentBGLogin}
                  placeholder={theme.strings.email}
                  placeholderTextColor={theme.colors.white}
                  keyboardType={"email-address"}
                  onChangeText={(text) => { this.setState({ email: text }); }}
                  autoCapitalize="none"
                />
                <View style={styles.passwordContainerLogin}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder={theme.strings.password}
                    placeholderTextColor={theme.colors.white}
                    secureTextEntry={!this.state.showPassword}
                    onChangeText={(text) => { this.setState({ password: text }); }}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => this.setState({ showPassword: !this.state.showPassword })} style={{ paddingLeft: 2 }} >
                    <Image source={icons.show_password_login} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate("ForgotPassword"); }} >
                  <Text style={styles.forgotYourPassword}>{theme.strings.forgot_your_password}</Text>
                </TouchableOpacity>
                <View style={{ height: 5 }} />
                <TouchableOpacity activeOpacity={0.8} style={styles.buttonWhiteBg} onPress={() => { this.login(); }}>
                  <Text style={theme.palette.buttonTextPrimary}>{theme.strings.login}</Text>
                </TouchableOpacity>
                <View style={styles.horizontalView}>
                  <Text style={styles.notMember}>{theme.strings.not_yet_a_member}</Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("SignupScreen")}>
                    <Text style={styles.signUp}>{theme.strings.signup}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.in_app_disclosure}>{theme.strings.in_app_disclosure}</Text>
                <Text style={styles.in_app_disclosure}>v {VERSION}</Text>


              </View>

            </View>
          </SafeAreaView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.colorPrimary,
    paddingHorizontal: Platform.OS == 'ios' ? 20 : 10
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  cancel: {
    color: theme.colors.white,
    fontSize: 13,
    textAlign: "right",
    fontFamily: theme.fonts.SFUITextSemiBold,
    margin: 10,
  },
  loginToYourAccount: {
    color: theme.colors.white,
    fontSize: 38,
    textAlign: "center",
    fontFamily: theme.fonts.SFProBold,
  },
  in_app_disclosure: {
    color: theme.colors.white,
    fontSize: 13,
    textAlign: "center",
    fontFamily: theme.fonts.SFProRegular,
    margin: 25,
  },
  forgotYourPassword: {
    color: theme.colors.white,
    fontSize: 13,
    textAlign: "center",
    fontFamily: theme.fonts.SFProRegular,
    margin: 12,
  },
  loginWithText: {
    color: theme.colors.white,
    fontSize: 15,
    textAlign: "center",
    fontFamily: theme.fonts.SFProRegular,
    marginBottom: 20
  },
  horizontalView: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  notMember: {
    color: "rgba(255, 255, 255, 0.70)",
    fontSize: 15,
    textAlign: "center",
    fontFamily: theme.fonts.SFProRegular,
  },
  signUp: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 15,
    textAlign: "center",
    fontFamily: theme.fonts.SFProSemibold,
    marginLeft: 5,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: Platform.OS == 'ios' ? 20 : 10
  },
  horizontalLine: {
    width: 2,
    backgroundColor: "rgba(37, 190, 237, 0.14)",
  },
  passwordContainerLogin: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 45,
    color: theme.colors.white,
    alignItems: "center",
    fontSize: 15,
    fontFamily: theme.fonts.SFProRegular,
    backgroundColor: "transparent",
    marginTop: 7,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  passwordInput: {
    flex: 1,
    color: theme.colors.white,
    paddingLeft: 4,
  },
  buttonWhiteBg: {
    height: 45,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 1, height: 5 }
  },
  modalBtn: {
    width: '40%',
    height: 45,
    backgroundColor: theme.colors.colorPrimary,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
