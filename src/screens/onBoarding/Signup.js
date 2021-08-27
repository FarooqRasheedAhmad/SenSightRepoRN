import { Image, StatusBar, Picker, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { Component } from "react";
import { icons, images } from "../../assets";
import { SignupForm, SocialLoginButtons } from "../../components";
import { theme } from "../../theme";
import { ButtonGroup, CheckBox } from "react-native-elements";
import { appOptions, careHomesUsers, senSightsUsers } from "../../utils";


export class Signup extends Component {
  state = {
    userName: "", email: "", password: "", registerAs: "",
    hidePassword: true, isChecked: false, appType: 0, selectappType: true 
  };
  onUserNameChange = text => {
    this.setState({ userName: text });
  };
  onEmailChange = text => {
    this.setState({ email: text });
  };
  onPasswordChange = text => {
    this.setState({ password: text });
  };
  onShowPasswordClick = () => {
    console.log("in show");
    this.setState((state, props) => {
      return { hidePassword: !state.hidePassword };
    });
  };

  onCheckBoxPress = () => {
    const { isChecked } = this.state
    if (isChecked) this.setState({ isChecked: false })
    else this.setState({ isChecked: true })
  }

  onChangeType = (type) => {
    this.setState({ appType: type });
    // if (type) setUserList(careHomesUsers);
    // else setUserList(senSightsUsers);
  };

  selectAppType = () => {
    const { appType } = this.state;
    return (
      <View style={[styles.subContainer,{ backgroundColor: '#DBECFF',}]}>
        <View style={{ marginTop: Platform.OS === "ios" ? 15 : 25 }} />
        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} activeOpacity={0.8}>
          <Text style={styles.cancel}>{theme.strings.cancel}</Text>
        </TouchableOpacity>
        <View style={styles.topContainer}>
          <View style={{ flexDirection: "row", justifyContent: "center", }}>
            <Text style={styles.welcome}>
              {theme.strings.welcome_to_sensights}
            </Text>
            <Text style={styles.tm}>{theme.strings.tm}</Text>
          </View>
          <Text style={[styles.welcome, { marginTop: 5, fontFamily: theme.fonts.SFProRegular, fontSize: 15 }]}>
            {theme.strings.by_locateMotion}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={appType == 0 ? images.signup_safe2home : images.signup_safe2work} />
        </View>

        <View style={{ flex: 0.25, }}>
          <Text style={styles.title}>
            {appType == 0 ? theme.strings.safe_home : theme.strings.safe_work}
          </Text>
          <Text style={styles.desc}>{appType == 0 ? theme.strings.safe_home_dec : theme.strings.safe_work_dec}</Text>
        </View>

        <View style={{ marginTop: 16, flex: 0.07, }}>
          <ButtonGroup
            onPress={(type) => this.onChangeType(type)}
            selectedIndex={appType}
            buttons={appOptions}
            containerStyle={styles.buttonGroupContainer}
            textStyle={styles.buttonGroupText}
            selectedButtonStyle={styles.selectedButton}
            selectedTextStyle={styles.selectedButtonText}
          />
        </View>

        <View style={styles.signupContainer}>
          <TouchableOpacity
            
            onPress={() => this.setState({selectappType: false})}
            activeOpacity={0.5}
          >
            <View style={theme.palette.buttonWithBorder}>
              <Text style={{ color: theme.colors.colorPrimary, paddingLeft: 25, paddingRight: 25 }}>
                {theme.strings.signup}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    )
  }

  render() {

    const { isChecked, hidePassword, selectappType,appType } = this.state
    return (
      <SafeAreaView style={[styles.container,{backgroundColor: selectappType? '#DBECFF': theme.colors.white}]}>
        <StatusBar barStyle="light-content" translucent backgroundColor={theme.colors.colorPrimary} />

        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
              {selectappType && this.selectAppType()}
            {  !selectappType &&
            <View style={styles.subContainer}>

              <View style={{ marginTop: Platform.OS === "ios" ? 15 : 25 }} />
              <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} activeOpacity={0.8}>
                <Text style={styles.cancel}>{theme.strings.cancel}</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, }}>
                <Text style={[styles.loginToYourAccount , {marginBottom: 0}]}>Create New</Text>
                <Text style={styles.loginToYourAccount}>Account</Text>

                <SignupForm
                  navigation={this.props.navigation}
                  onUserNameChange={this.onUserNameChange}
                  onEmailChange={this.onEmailChange}
                  onPasswordChange={this.onPasswordChange}
                  hidePassword={hidePassword}
                  onShowPasswordClick={this.onShowPasswordClick}
                  onCheckBoxPress={this.onCheckBoxPress}
                  isChecked={isChecked}
                  appType={appType}
                ></SignupForm>

                <View style={styles.horizontalView}>
                  <Text style={styles.member}>Already a member?</Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
                    <Text style={styles.login}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
            }
          </SafeAreaView>
        </ScrollView>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: Platform.OS == 'ios' ? 20 : 10,
  },
  subContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 30
  },
  cancel: {
    color: theme.colors.colorPrimary,
    fontSize: 13,
    textAlign: "right",
    fontFamily: theme.fonts.SFUITextSemiBold,
    margin: 20
  },
  loginToYourAccount: {
    color: theme.colors.colorPrimary,
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: theme.fonts.SFProBold
  },
  horizontalView: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8
  },
  member: {
    color: theme.colors.colorPrimary,
    fontSize: 15,
    textAlign: "center",
    fontFamily: theme.fonts.SFProRegular
  },
  login: {
    color: theme.colors.colorPrimary,
    fontSize: 15,
    textAlign: "center",
    fontFamily: theme.fonts.SFProSemibold,
    marginLeft: 5
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 30
  },
  socialLoginContainer: {
    height: 50,
    flexDirection: "row",
    borderRadius: 10,
    borderColor: theme.colors.colorPrimary,
    borderWidth: 2,
    marginTop: 5,
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 25
  },
  socialLoginChildContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  socialText: {
    fontFamily: theme.fonts.SFProSemibold,
    fontSize: 16,
    color: theme.colors.colorPrimary,
    marginLeft: 10,
    textAlign: "center"
  },
  signupWith: {
    color: theme.colors.white,
    fontSize: 13,
    textAlign: "center",
    fontFamily: theme.fonts.SFProRegular,
    margin: 12
  },
  horizontalLine: {
    width: 2,
    backgroundColor: "rgba(37, 190, 237, 0.14)"
  },
  loginWithText: {
    color: theme.colors.white,
    fontSize: 15,
    textAlign: "center",
    fontFamily: theme.fonts.SFProRegular,
    marginBottom: 20
  },
  welcome: {
    fontSize: 17,
    color: 'black',
    fontFamily: theme.fonts.SFProSemibold,
    marginTop: 10,
    textAlign: "center"
  },
  tm: {
    fontSize: 10,
    color: '#DBECFF',
    fontFamily: theme.fonts.SFProSemibold
  },
  topContainer: {
    width: '100%',
    paddingTop: 10,
    flex: 0.1,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    color: 'black',
    fontSize: 22,
    textAlign: "center",
    fontFamily: theme.fonts.SFProBold,
    lineHeight: 28,
    letterSpacing: 0.35
  },
  desc: {
    color: 'black',
    fontSize: 17,
    marginTop: 15,
    textAlign: "center",
    fontFamily: theme.fonts.SFProRegular,
    lineHeight: 22,
    letterSpacing: -0.48
  },
  buttonGroupContainer: {
    borderRadius: 10,
    backgroundColor: "rgba(118, 118, 128, 0.12)",
    height: 45,
    borderWidth: 0,
  },
  buttonGroupText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.SFProSemibold,
  },
  selectedButton: {
    backgroundColor: theme.colors.colorPrimary,
  },
  selectedButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.SFProBold,
  },
  signupContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    marginTop: 20,
  },
});
