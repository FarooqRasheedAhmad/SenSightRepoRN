import { AppConstants, StorageUtils, showMessage } from "../../utils";
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import React, { Component, useEffect } from "react";
// import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';

import RNLocation from "react-native-location";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { images } from "../../assets";
import { theme } from "../../theme";
import updater from '../../utils/updater';
import { getProfile } from '../../utils/fetcher';
import VerificationCodeForm from './VerificationCodeForm'
import { EventRegister } from 'react-native-event-listeners'
 



export class CodeVerificationRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, codeValue:"" };
    this.locationPosted = false;
  }
  containerProps = { style: styles.inputWrapStyle };

  componentWillUnmount() {
    try {
      this.locationSubscription();
    } catch (error) {}
  }

  onFinishCheckingCode = (code) => {
    if (/^[0-9]*$/.test(code)) {
      this.setState({ verifyCode: code, });
    } else {
      showMessage("Please enter code in numbers only");
    }
  };

  showError = (error) => {
    setTimeout(
      function() {
        Snackbar.show({
          text: error,
          duration: Snackbar.LENGTH_LONG,
        });
      }.bind(this),
      100
    );
  };

  cellProps = ({ /*index, isFocused,*/ hasValue }) => {
    if (hasValue) {
      return {
        style: [styles.input, styles.inputNotEmpty],
      };
    }
    return {
      style: styles.input,
    };
  };

  submitCode = async () => {
    if (!this.state.verifyCode || this.state.verifyCode.length < 6) return;

    this.setState({ loading: true });
    
    const { Email, Password, UserType, AppType, } = this.props.navigation.state.params;
    var token = await StorageUtils.getValue(AppConstants.SP.DEVICE_TOKEN);
    
    const body = new FormData();
          body.append("LoginName", Email);
          body.append("Password", Password);
          body.append("DeviceToken", token);
    
    const confirmationResponse = await fetch(
        `${api.confirmPasswordForRegistration}?token=${this.state.verifyCode}`,
        { method: "post", headers: { Accept: "application/json", "Content-Type": "multipart/form-data", }, body: body, }
      )
      .then((response) => (response.json()))
      .then((data) => {
        console.log("confirmation result: ", data);
        
        if (data.errors) {
          this.setState({ loading: false });
          this.showError(data.errors[0].description);
          return false;
        }
        
        this.postCurrentLocation(data.accessToken, data.role);
        return data;

      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Error: ", error);
        this.showError("Error: Invalid code or network request error");
        return false;
      });

      console.log("confirmationResponse: ", confirmationResponse);
    if (!confirmationResponse) return;

    

    const profileData = await updater.fetchProfileLogin({ ...confirmationResponse, applicationType: AppType, showCart: false, isLoggedIn: true,email:Email,password: Password });
    EventRegister.emit('onAppLogin', { ...profileData })
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: "EditProfileScreen", params: { noBack: true, ...profileData } }),
      ],
    });
    this.props.navigation.dispatch(resetAction);



  };

  postCurrentLocation = async (token, role) => {
    console.log("Posting Location Call");

    console.log("Access: ", token);
    console.log("Role: ", role);

    if (role === "senior") {
      RNLocation.configure({ distanceFilter: 50.0, });
      RNLocation.requestPermission({ ios: "whenInUse", android: { detail: "coarse", }, }).then((granted) => {
        console.log("Granted", granted);
        if (granted) {
          this.locationSubscription = RNLocation.subscribeToLocationUpdates(
            (locations) => {
              console.log("Locations");
              if (!this.locationPosted) {
                fetch(api.seniorLocations, {
                  method: "post",
                  headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
                  body: JSON.stringify({
                    latitude: locations[0].latitude,
                    longitude: locations[0].longitude,
                    isWatchPaired: true,
                  }),
                })
                  .then((response) => {
                    this.setState({ loading: false });
                    console.log("Posting Location First: ", response);
                  })
                  .catch((onRejected) => {
                    this.setState({ loading: false });
                    console.log("Error posting location: ", onRejected);
                  });
                this.locationPosted = true;
              }
            }
          );
        }
      });
    } else {
      this.setState({ loading: false });
    }
  };

  onResendCode = async () => {
    const { Email, Password, UserType, AppType, CompanyId } = this.props.navigation.state.params;
    const body = new FormData();
    body.append("FirstName", "New User");
    body.append("LastName", "New User");
    body.append("Email", Email);
    body.append("Password", Password);
    body.append("ConfirmPassword", Password);
    body.append("UserType", UserType);
    body.append("ApplicationType", AppType);
    if (UserType == 2) body.append("CompanyId", CompanyId)
    try {
      this.setState({ loading: true });
      const response = await fetch(api.signUp, {
        method: "post",
        headers: { Accept: "application/json", "Content-Type": "multipart/form-data", },
        body,
      });
      if (response) {
        this.setState({ loading: false });
        /*if (!response.ok) {
          this.showError();
          return;
        }*/
        const json = await response.json();
        if (json && json.errors) {
          throw Error(json.errors.length && json.errors[0].description);
        } else {
          Snackbar.show({ text: "Code Resent", duration: Snackbar.LENGTH_LONG, });
        }
      }
    } catch (err) {
      this.setState({ loading: false });
      this.showError(err);
    }
  };


  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" />
        <ImageBackground style={theme.palette.backgroundOnBoarding} source={images.login_bg} />

        <Spinner visible={this.state.loading} />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Enter 6-digit code to confirm account{" "}</Text>
              <Text style={styles.inputSubLabel}>The verification code has been sent to your email. Please enter the code</Text>
              {/* <CodeFiled
                blurOnSubmit={false}
                variant="clear"
                codeLength={6}
                keyboardType="numeric"
                cellProps={this.cellProps}
                containerProps={this.containerProps}
                onFulfill={this.onFinishCheckingCode}
              /> */}
              <VerificationCodeForm onChange={this.onFinishCheckingCode} />

              <TouchableOpacity activeOpacity={0.8} onPress={this.onResendCode}>
                <Text style={{ ...theme.palette.buttonText, color: theme.colors.white, marginTop: 16, }}>Resend Code</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={[theme.palette.buttonWhiteBg, styles.submitButton]}
              onPress={!this.state.loading ? this.submitCode : undefined}
            >
              <Text style={theme.palette.buttonTextPrimary}>Submit Code</Text>
            </TouchableOpacity>
            <Text style={styles.subLabel}>Please check your spam or junk mail folder in case you have not received the email with the verification code within a few minutes</Text>
          </View>
        </ScrollView>
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
    paddingLeft: 5,
  },
  submitButton: {
    marginTop: 20,
    width: "80%",
  },
  inputWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputLabel: {
    paddingTop: 100,
    paddingBottom: 10,
    color: "#FFFF",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
  },
  inputSubLabel: {
    color: "#FFFF",
    textAlign: "center",
  },
  inputWrapStyle: {
    height: 50,
    marginTop: 30,
  },
  input: {
    height: 50,
    width: 40,
    borderRadius: 3,
    color: "#FFFF",
    backgroundColor: "rgba(255, 255, 255, 1)",
    ...Platform.select({
      web: {
        lineHeight: 46,
      },
    }),
  },
  inputNotEmpty: {
    backgroundColor: "rgba(0,0,0,0)",
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
    elevation: 5,
  },
  nextButtonArrow: {
    transform: [{ translateX: -3 }, { rotate: "45deg" }],
    borderColor: "#ff595f",
    width: 20,
    height: 20,
    borderWidth: 4,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  subLabel: {
    color: "#FFFF",
    textAlign: "center",
    marginTop: 15,
  },
});
