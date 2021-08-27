import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React, { Component } from "react";
import { icons, images } from "../../assets";

import Swiper from "react-native-swiper";
import { theme } from "../../theme";

const dimensions = Dimensions.get("window");
const imageHeight = dimensions.height * 0.45;
const imageWidth = dimensions.width * 0.8;

export class Walkthrough extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: true,
      currentPage: 0,
      buttonText: theme.strings.next
    };
  }

  componentWillUnmount() {
    this.state.mounted = false;
    this.swiper = null;
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
        {/* <ImageBackground
          style={theme.palette.backgroundImage}
          source={images.login_bg}
        > */}
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
          <View style={styles.topContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={styles.welcome}>
                {theme.strings.welcome_to_sensights}
              </Text>
              <Text style={styles.tm}>{theme.strings.tm}</Text>
            </View>
            <Text
              style={[
                styles.welcome,
                {
                  marginTop: 5,
                  fontFamily: theme.fonts.SFProRegular,
                  fontSize: 15
                }
              ]}
            >
              {theme.strings.by_locateMotion}
            </Text>
          </View>
          <View style={styles.swiperContainer}>
            <View style={styles.imageContainer}>
              <Image source={images.gothrough_bg} />
            </View>
            <View style={{ flex: 0.5 }}>
              <Swiper
                style={{ height: "100%", marginTop: 25 }}
                showsButtons={false}
                dotColor={theme.colors.grey_shade_1}
                activeDotColor={theme.colors.white}
                dot={<View style={{ backgroundColor: theme.colors.white, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, borderColor: theme.colors.colorPrimary, borderWidth: 1 }} />}
                activeDot={<View style={{ backgroundColor: theme.colors.colorPrimary, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />}
                loop={false}
                onIndexChanged={index => this.onIndexChanged(index)}
                ref={ref => {
                  this.swiper = ref;
                }}
              >
                <View>

                  <Text style={styles.benefitsText}>BENEFITS 1/3</Text>
                  <Text style={styles.title}>
                    {theme.strings.tutorial1_title}
                  </Text>
                  <Text style={styles.desc}>{theme.strings.tutorial1_desc}</Text>
                </View>
                <View>
                  <Text style={styles.benefitsText}>BENEFITS 2/3</Text>
                  <Text style={styles.title}>
                    {theme.strings.tutorial2_title}
                  </Text>
                  <Text style={styles.desc}>{theme.strings.tutorial2_desc}</Text>
                </View>
                <View>
                  <Text style={styles.benefitsText}>BENEFITS 3/3</Text>
                  <Text style={styles.title}>
                    {theme.strings.tutorial3_title}
                  </Text>
                  <Text style={styles.desc}>{theme.strings.tutorial3_desc}</Text>
                </View>
              </Swiper>
            </View>
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.props.navigation.navigate("Login")}
                activeOpacity={0.5}
              >
                <View style={theme.palette.button}>
                  <Text style={{ color: theme.colors.white }}>
                    {theme.strings.login}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.props.navigation.navigate("SignupScreen")}
                activeOpacity={0.5}
              >
                <View style={theme.palette.buttonWithBorder}>
                  <Text style={{ color: theme.colors.colorPrimary }}>
                    {theme.strings.signup}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        {/* </ImageBackground> */}
      </View>
    );
  }

  onIndexChanged(index) {
    if (!this.state.mounted) return;
    this.setState({ currentPage: index });
    if (index == 0) {
      this.state.buttonText = theme.strings.next;
    } else if (index == 1) {
      this.state.buttonText = theme.strings.next;
    } else if (index == 2) this.state.buttonText = theme.strings.done;
  }

  PageChange() {
    if (!this.state.mounted) return;
    if (this.state.currentPage < 3) {
      this.swipetheme.scrollBy(1);
      this.setState({ currentPage: this.state.currentPage + 1 });
      if (this.state.currentPage == 0) {
      } else if (this.state.currentPage == 1) {
        this.state.buttonText = theme.strings.done;
      } else if (this.state.currentPage == 2) this.navigateToIntroScreen();
    }
  }

  navigateToIntroScreen() {
    setTimeout(this.props.navigation.goBack, 10);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white
  },
  viewpagerContainer: {
    // width: "100%",
    height: "100%"
  },
  welcome: {
    fontSize: 17,
    color: theme.colors.colorPrimary,
    fontFamily: theme.fonts.SFProSemibold,
    marginTop: 4,
    textAlign: "center"
  },
  tm: {
    fontSize: 10,
    color: theme.colors.colorPrimary,
    fontFamily: theme.fonts.SFProSemibold
  },
  sliderBgContainer: {
    width: imageWidth,
    height: imageHeight,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  sliderBg: {
    width: "90%",
    height: "90%",
    overflow: "hidden",
    resizeMode: "contain",
    alignSelf: "center",
    aspectRatio: 3 / 2
  },
  title: {
    color: theme.colors.colorPrimary,
    fontSize: 22,
    textAlign: "center",
    fontFamily: theme.fonts.SFProBold,
    textAlign: "center",
    marginLeft: 40,
    marginRight: 40,
    lineHeight: 28,
    letterSpacing: 0.35
  },
  desc: {
    color: theme.colors.colorPrimary,
    fontSize: 17,
    textAlign: "center",
    marginTop: 15,
    fontFamily: theme.fonts.SFProRegular,
    marginLeft: 40,
    marginRight: 40,
    lineHeight: 22,
    letterSpacing: -0.48
  },
  bottomContainer: {
    width: '100%',
    height: 70,
    alignSelf: 'flex-end',
    alignItems: 'center',
    flexDirection: "row",
  },
  swiperContainer: {
    flex: 1,
    justifyContent: "flex-end"
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  topContainer: {
    width: '100%',
    paddingTop: 40,
    flex: 0.1,
  },
  bottomBarContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    marginLeft: 45
  },
  indicatoryStyle: {
    width: 10,
    height: 10,
    resizeMode: "center",
    marginLeft: 5,
    marginRight: 5
  },
  skip: {
    color: theme.colors.colorPrimary,
    fontSize: 14,
    fontFamily: theme.fonts.GothamBook,
    marginRight: 20,
    justifyContent: "flex-end"
  },
  benefitsText: {
    color: theme.colors.colorPrimary,
    fontSize: 13,
    fontFamily: theme.fonts.SFProRegular,
    marginBottom: 2,
    textAlign: "center",
    marginLeft: 40,
    marginRight: 40,
    lineHeight: 18,
    letterSpacing: -0.08
  }
});
