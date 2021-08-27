import { AppConstants, StorageUtils } from "../../../utils";
import React, { Component } from "react";
import { StyleSheet, Text, View, } from "react-native";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../../api";
// import { theme } from "../../../theme";
import Header from '../../../components/Header';
import { InputField } from '../../../components/Form';


export class UpdatePassword extends Component {
  state = { oldPassword: "", newPassword: "", confirmPassword: "", email: "", spinner: false, };

  componentDidMount() {
    const { getParam } = this.props.navigation;
    this.setState({ email: getParam("email", "") });
  }

  validateInput = () => {
    const { oldPassword, newPassword, confirmPassword } = this.state;
    let error = false;
    console.log(`${oldPassword}, ${newPassword}, ${confirmPassword}`);
    

    if (!error && (!oldPassword || oldPassword.length < 1)) error = "Please provide old password";
    if (!error && (!newPassword || newPassword.length < 8)) error = "Please provide minimum 8 characters new password";
    if (!error && (!confirmPassword || confirmPassword.length < 1)) error = "Please confirm new password";
    if (!error && (newPassword !== confirmPassword)) error = "Password doesn't match";

    if(error){
      Snackbar.show({ text: error, duration: Snackbar.LENGTH_SHORT, });
      return false;
    }
    // if ( this.state.newPassword.length >= 8 && this.state.confirmPassword !== this.state.newPassword ) {
    //   Snackbar.show({ text: "Password doesn't match", duration: Snackbar.LENGTH_SHORT, });
    //   return false;
    // }
    // if (this.state.newPassword.length < 8) {
    //   Snackbar.show({ text: "Password must be minimum 8 characters", duration: Snackbar.LENGTH_LONG, });
    //   return false;
    // } else if ( this.state.newPassword.length >= 8 && this.state.confirmPassword === this.state.newPassword ) {
    //   return true;
    // } else {
    //   Snackbar.show({ text: "Some match error", duration: Snackbar.LENGTH_LONG, });
    //   return false;
    // }
    return true;
  };

  updateNewPassword = async () => {
    const isValid = this.validateInput();
    if (!isValid) return;

    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);

    this.setState({ spinner: true });

    const reqBody = JSON.stringify({
      oldPassword: this.state.oldPassword,
      password: this.state.newPassword,
      confirmPassword: this.state.confirmPassword,
    });
    fetch(api.ChangePassword, {
      method: "post",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
      body: reqBody,
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({ spinner: false });
        if (json.isValid) {
          Snackbar.show({ text: json.message, duration: Snackbar.LENGTH_SHORT, });
          this.props.navigation.navigate("HomeScreen");
        } else {
          setTimeout(
            function() {
              Snackbar.show({ text: json.message, duration: Snackbar.LENGTH_LONG, });
            }.bind(this),
            100
          );
        }
      })
      .catch((error) => {
        this.setState({ spinner: false });
        Snackbar.show({ text: "Old password does not match", duration: Snackbar.LENGTH_LONG, });
      });

  };

  cancelButtonPress = () => {
    const { firstName, lastName } = this.state

    if (firstName === "" && lastName === ""){
      Snackbar.show({ text: "Please update fields", duration: Snackbar.LENGTH_LONG, });
      return;
    }
    this.props.navigation.goBack(null);
  }

  render() {
    return (
      <View>
        <Spinner visible={this.state.spinner} />

        <Header title="Change Password" 
          leftButton={{ title:'Cancel', onPress:this.cancelButtonPress }}
          rightButton={{ title:'Update', onPress:this.updateNewPassword }}
        />

        <View style={styles.container}>
          <View style={{ flexDirection: "row", paddingTop: 20, paddingLeft: 20, }}/>

          <InputField label="Old Password" type="password" autoFocus={true}
            onChange={(text) => { this.setState({ oldPassword: text }); }} />

          <InputField label="New Password" type="password"
            onChange={(text) => { this.setState({ newPassword: text }); }} />

          <InputField label="Confirm New Password" type="password"
            onChange={(text) => { this.setState({ confirmPassword: text }); }} />

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
