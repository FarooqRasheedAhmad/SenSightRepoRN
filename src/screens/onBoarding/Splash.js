import { AppConstants, StorageUtils } from "../../utils";
import {
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import React, { Component } from "react";

import { images } from "../../assets";
import { theme } from "../../theme";

export class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timePassed: false,
    };
  }
  componentDidMount() {
    if (Platform.OS !== "ios") {
      StatusBar.setBarStyle('light-content')
      StatusBar.setBackgroundColor("#ffffff");
    }
    setTimeout(() => {
      this.setTimePassed();
    }, 1200);
  }

  setTimePassed() {
    this.setState({ timePassed: true });
    this.navigateToScreen();
  }

  componentDidUpdate() {
    if (this.props.timePassed) {
      this.navigateToScreen();
    }
  }

  navigateToScreen = async () => {
    var isLoggedIn = await StorageUtils.getValue(AppConstants.SP.IS_LOGGED_IN);

    console.log("isLoggedIn : " + isLoggedIn);
    if (isLoggedIn == "1") {
      this.props.navigation.replace("HomeScreen");
    } else this.props.navigation.replace("Walkthrough");
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={theme.palette.backgroundImage}
          source={images.login_bg}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: theme.colors.white,
    fontSize: 40,
    textAlign: "center",
    fontFamily: theme.fonts.GothamMedium,
    marginTop: 120,
  },
  text: {
    color: theme.colors.white,
    fontSize: 15,
    textAlign: "center",
    marginTop: 30,
    fontFamily: theme.fonts.GothamBook,
  },
});
