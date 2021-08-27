import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import { AppConstants, StorageUtils, postLocationTime, showMessage, watchPaired, AppWidgets, weatherApiKey, getAppUsers } from "../../utils";
import React, { Component } from "react";
// import { NavigationActions, StackActions } from 'react-navigation';
// import ActivityScore from './ActivityScore'
import BackgroundGeolocation from "react-native-background-geolocation";
import BackgroundTimer from "react-native-background-timer";
import { CaregiverHome } from "./CaregiverHome";
import { ServicesScreen } from "./ServicesScreen";
import { ProfileScreen } from "./ProfileScreen";
import { SeniorHome } from "./SeniorHome";
import { SocialScreen } from "./SocialScreen"
import { api } from "../../api";
import { icons } from "../../assets";
import { theme } from "../../theme";
import { SOSCallButton, CallTab, Col, Row } from "../../components"
import { Task } from './Tasks';
import { getModules } from "../../utils/updater";
import { ScrollView } from "react-native-gesture-handler";
import ScheduleCall from "./ScheduledVisits";
// import { requestTrackingPermission } from 'react-native-tracking-transparency';
const dimensions = Dimensions.get("window");
const barContainerHeight = dimensions.height * 0.095;
const barHeight = dimensions.height * 0.095;

export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.selectedTab = props.navigation.getParam('selectedTab', 0);
    this.isHidden = false;
    (this.isAnimating = false), (this.alreadyAnimating = false);
    this.offset = 0;
    this.currentOffset = 0;
    this.state = {
      selectedTab: this.selectedTab,
      isNavBarHidden: false,
      height: new Animated.Value(0),
      bounceValue: new Animated.Value(0),
      role: "",
      id: "",
      watchPaired: false,
      isLogin: "",
      showCallTab: false,
      isShowChat: true,
      isShowSocial: true,
      temperature: null,
      weather: null,
      cityName: null,
      isShowTasks: true,
      apptype: 1,
    }

    this.setupBottomTab(0)
    this.getRole()
    this.getWidgetsSettings()
    this.refreshSOS = null,
      this.locationItem = null

  }

  async componentDidMount() {
    const openNotification = await StorageUtils.getValue('OpenAppNotiClik')
    if (openNotification == 'yes') {
      StorageUtils.storeInStorage('OpenAppNotiClik', 'no'),
        this.props.navigation.navigate("AlertsScreen")
    }
    this.getRole();
    this.startLocationTimer();
    if (this.refreshSOS) {
      this.refreshSOS();
    }
    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onLocation(this.onLocation, this.onError);
    this.focusListener = this.props.navigation.addListener("didFocus", async () => {

      this.getWidgetsSettings()
      const locationPoint = await this.getLocation()
      const lat = locationPoint && locationPoint["coords"].latitude || this.locationPoint && this.locationPoint["coords"].latitude || 0
      const longi = locationPoint && locationPoint["coords"].longitude || this.locationPoint && this.locationPoint["coords"].longitude || 0
      this.getWeather(lat, longi)
    })


    getAppUsers((user, type) => {
      this.setState({ apptype: type })
      // Object.assign(newState, { appType: type })
    })

  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
    // Remove the event listener
    this.focusListener.remove();
  }

  onLocation = (location) => {
    if (!this.state.temperature && location && location["coords"].latitude) {
      this.getWeather(location["coords"].latitude, location["coords"].longitude)
    }
    this.locationItem = location
  }

  onError = (error) => {
    console.warn('[location] ERROR -', error);
  }

  getWidgetsSettings = async () => {
    const chatPref = await StorageUtils.getValue(AppWidgets.CHAT)
    const socialPref = await StorageUtils.getValue(AppWidgets.SOCIAL)
    const isShowChat = !!chatPref ? JSON.parse(chatPref) : true
    const isShowSocial = !!socialPref ? JSON.parse(socialPref) : true
    const tasksPref = await StorageUtils.getValue(AppWidgets.TASKS)
    const isShowTasks = !!tasksPref ? JSON.parse(tasksPref) : true

    this.setState({ isShowChat, isShowSocial, isShowTasks })
  }

  startLocationTimer = async () => {
    const role = await StorageUtils.getValue(AppConstants.SP.ROLE);
    const isLogin = await StorageUtils.getValue(AppConstants.SP.IS_LOGGED_IN);
    // const trackingStatus = await requestTrackingPermission();
    if (role === "senior" && isLogin === "1") {
      this.readyBGLocation();
      // if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
      // enable tracking features
      this.backgroundJob();
      // }

    }
  };

  getRole = async () => {
    this.setState({
      role: await StorageUtils.getValue(AppConstants.SP.ROLE),
      id: await StorageUtils.getValue(AppConstants.SP.USER_ID),
      isLogin: await StorageUtils.getValue(AppConstants.SP.IS_LOGGED_IN),
    })
  }

  setupBottomTab = (index) => {
    this.setState({ selectedTab: index, showCallTab: false })
  }

  onCallTabPress = (value) => {
    this.setState({ showCallTab: value })
  }

  backgroundJob = async () => {
    /**
     * * functions call to run location at background
     * ! Will run only in foreground and background not on killing the app
     */

    const dataRefreshRate = await StorageUtils.getValue(AppConstants.SP.DATA_REFRESH_RATE)
    const intervalTime = Number(dataRefreshRate);
    BackgroundTimer.runBackgroundTimer(async () => {
      console.log(
        "Interval Time with Date: ",
        postLocationTime,
        new Date(),
        Platform.OS
      );
      // ToastAndroid.show('Background timer started ', ToastAndroid.SHORT);
      const locationPoint = await this.getLocation()
      const lat = locationPoint && locationPoint["coords"].latitude || this.locationPoint && this.locationPoint["coords"].latitude || 0
      const longi = locationPoint && locationPoint["coords"].longitude || this.locationPoint && this.locationPoint["coords"].longitude || 0
      if (lat && lat !== 0) {
        this.postCurrentLocation(lat, longi)
        console.log('....location Updated....')
        if (!this.state.temperature)
          this.getWeather(lat, longi)
        // print("this")
      }


      watchPaired(async (data, error) => {
        console.log("Watch Pair Data: ", data);
        if (data) {
          if (this.state.role === "senior" && !data.watchPaired) {
            const locationPoint = await this.getLocation()
            const lat = locationPoint && locationPoint["coords"].latitude || this.locationPoint && this.locationPoint["coords"].latitude || 0
            const longi = locationPoint && locationPoint["coords"].longitude || this.locationPoint && this.locationPoint["coords"].longitude || 0
            if (lat && lat !== 0) {
              this.postCurrentLocation(lat, longi)
              if (!this.state.temperature)
                this.getWeather(lat, longi)
              // print("this")
            }
            this.setState({ watchPaired: data.watchPaired })
          }
        }

        if (error) {
          console.log(error.message)
          // suspect: 'Can\'t find variable: Watch' <-- being poped up from here
          /*
          showMessage("Line# 165: " + error.message, "long", "error", {
            action: {
              title: "Retry",
              color: "white",
              onPress: () => watchPaired(cb, timeDuration),
            },
          })
          */
        }
      })
    }, intervalTime * 60000)
  }

  readyBGLocation = () => {
    /**
     * * react-native-background-geolocation
     * ready state
     */

    BackgroundGeolocation.ready(
      {
        // Geolocation Config
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 1,
        notification: false,
        preventSuspend: true,
        // Activity Recognitione
        stopTimeout: 1,
        // Application config
        debug: false, // <-- enable this hear debug sounds.
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when app terminated.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
        // HTTP / SQLite config
        disableStopDetection: true,
        forceReloadOnBoot: true,
        foregroundService: true,
        forceReloadOnLocationChange: true,
        forceReloadOnMotionChange: true,
        autoSync: true, // <-- Set true to sync each location to server as it arrives.
        backgroundPermissionRationale: {
          title: "Allow sensights to access this device's location even when the app is closed or not in use.",
          message: theme.strings.in_app_disclosure,
          positiveAction: 'Change to "{backgroundPermissionOptionLabel}"',
          negativeAction: 'Cancel'
        }
      },
      (state) => {
        console.log(
          "BackgroundGeolocation Ready: ",
          state.enabled,
          Platform.OS
        );

        if (!state.enabled) {
          BackgroundGeolocation.start(function () {
            console.log("Start BackgroundGeolocation success");
          });
        }
      }
    )
  }

  getLocation = () => {
    return BackgroundGeolocation.getCurrentPosition({
      timeout: 30, // 30 second timeout to fetch location
      persist: true, // Defaults to state.enabled
      maximumAge: 50000, // Accept the last-known-location if not older than 5000 ms.
      desiredAccuracy: 10, // Try to fetch a location with an accuracy of `10` meters.
      samples: 3, // How many location samples to attempt.
      extras: {
        // Custom meta-data.
        route_id: 123,
      },
    }).then((currentlocation) => {
      console.log("Getting Location with timer: ", new Date(), currentlocation, Platform.OS)
      return currentlocation
    })
  }

  getWeather = (lat, long) => {
    console.log(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weatherApiKey}&units=metric`)
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=a83ab2ae1bf5b1e2143fdfdcebbf2833&units=metric`
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('result ', result)
        this.setState({
          temperature: Math.ceil(result.main.temp),
          weather: result.weather[0].main,
          cityName: result.name
        })
      })
      .catch((e) => {
        console.log('Error in temp api ', e)
      })
  }

  postCurrentLocation = async (latitude, longitude) => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    const isLogin = await StorageUtils.getValue(AppConstants.SP.IS_LOGGED_IN);

    if (
      this.state.role === "senior" &&
      !this.state.watchPaired &&
      isLogin === "1"
    ) {
      console.log("In posting location! ", latitude, longitude);

      fetch(api.seniorLocations, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
          isWatchPaired: true,
        }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Location is posted in the Background", latitude, longitude)
          }
        })
        .catch((onRejected) => {

        })
    }
  }

  renderTabItem = (index, tabIcon, tabTitle) => {
    let isClickable = true
    // off the click on chat and social tabs based on settings
    const { isShowChat, isShowSocial } = this.state
    if (index === 1 && !isShowChat) {
      isClickable = false
    }
    else if (index === 3 && !isShowSocial) {
      isClickable = false
    }

    return (
      <View style={styles.tabItem}>
        <TouchableOpacity onPress={() => isClickable ? this.setupBottomTab(index) : () => { }} activeOpacity={0.7}>
          <View style={styles.tabItem}>
            <Image style={[styles.tabIcon, { tintColor: 'white' }]} source={tabIcon} />
            <Text style={[styles.tabText, { color: 'white', fontFamily: this.tab1Font },]}>{tabTitle}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  showModules() {
    const { packageModule } = this.state;

    if (packageModule) {
      return (<View>
        <Text>{JSON.stringify(packageModule, 0, 2)}</Text>
      </View>)
    }

    StorageUtils.getValue('getPackageModuleResponse').then(getPackageModuleResponse => {
      if (getPackageModuleResponse) {
        console.log("getPackageModuleResponse:", JSON.parse(getPackageModuleResponse));
        this.setState({ packageModule: JSON.parse(getPackageModuleResponse) })
      }
    })

    // getModules().then(getPackageModuleResponse => {
    //   if (getPackageModuleResponse){
    //     console.log("getPackageModuleResponse:", JSON.parse(getPackageModuleResponse));
    //     this.setState({ packageModule: JSON.parse(getPackageModuleResponse) })
    //   }
    // })

    return <View><Text>Loading packages...</Text></View>

  }

  render() {
    const { selectedTab, showCallTab, temperature, weather, cityName, role, isShowTasks, apptype } = this.state

    return (
      <View style={theme.palette.container}>
        {/* <ActivityScore /> */}
        {/* <ScrollView style={{height:500}}>
          {this.showModules()}
        </ScrollView> */}

        <View style={{ flex: 1 }}>
          {selectedTab == 0 && role == "senior" && (
            <SeniorHome
              style={{ flex: 1 }}
              navigation={this.props.navigation}
              scroll={this.handleScroll}
              animate={this.setAnimation}
              id={this.state.id}
              temperature={temperature}
              weather={weather}
              cityName={cityName}
              role={role}
              isShowTasks={isShowTasks}
            />
          )}
          {selectedTab == 0 && role == "caretaker" && (
            <CaregiverHome
              style={{ flex: 1 }}
              navigation={this.props.navigation}
              scroll={this.handleScroll}
              animate={this.setAnimation}
              temperature={temperature}
              weather={weather}
              cityName={cityName}
              role={role}
              isShowTasks={isShowTasks}
              apptype={apptype}
            />
          )}
          {selectedTab == 1 && (
              <ScheduleCall
              navigation={this.props.navigation}
            />
            // <ServicesScreen
            //   style={{ flex: 1 }}
            //   navigation={this.props.navigation}
            //   scroll={this.handleScroll}
            //   animate={this.setAnimation}
            // />
          )}
          {selectedTab == 3 && (
            <SocialScreen
              navigation={this.props.navigation}
              scroll={this.handleScroll}
              animate={this.setAnimation} />
          )
          }
          {selectedTab == 4 && (
            <ProfileScreen
              style={{ flex: 1 }}
              getWidgetsSettings={this.getWidgetsSettings}
              navigation={this.props.navigation}
              scroll={this.handleScroll}
              animate={this.setAnimation}
              role={role}
              apptype={apptype}
            />
          )}

          {/* {selectedTab == 5 && (
            <Task
              // getTasksFromServer={this.getTasksFromServer}
              // style={{ flex: 1 }}
              // getWidgetsSettings={this.getWidgetsSettings}
              // navigation={this.props.navigation}
              // scroll={this.handleScroll}
              // animate={this.setAnimation}
              // role={role}
            />
          )} */}

          {showCallTab && <CallTab onPressCallBack={this.onCallTabPress} />}

        </View>


        {/* Footer for CareTaker */}
        {this.state.role == 'caretaker' && <>
          <Animated.View style={{ ...styles.subView, transform: [{ translateY: this.state.height }], backgroundColor: "#25BEED" }}>
            {/* <View style={{ backgroundColor:"#25BEED", height:83}}> */}
            <Row>
              <Col flex={70} align="flex-end" valign="center" style={{ height: 83, borderWidth: 0 }}>
                <TouchableOpacity onPress={() => this.setupBottomTab(0)} activeOpacity={0.7} style={{ alignItems: "center" }}><>
                  <Image style={{ tintColor: 'white' }} source={icons.tab_home_selected} />
                  <Text style={{ color: 'white', fontFamily: this.tab1Font }}>Home</Text>
                </></TouchableOpacity>
              </Col>
              <Col flex="auto" align="flex-end" valign="center" style={{ height: 83, borderWidth: 0 }}>
                <TouchableOpacity onPress={() => this.setupBottomTab(1)} activeOpacity={0.7} style={{ alignItems: "center" }}><>
                  <Image style={{ tintColor: 'white' }} source={icons.call_blue} />
                  <Text style={{ color: 'white', fontFamily: this.tab1Font }}>Schedule Call</Text>
                </></TouchableOpacity>
              </Col>


              <Col flex="auto" valign="center" align="center" style={{ borderWidth: 0 }}><View style={{ flexDirection: "column", alignItems: "center" }}>
                {this.state.apptype != '2' && <>
                  {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("TasksScreen")} activeOpacity={0.7} style={{ alignItems: "center" }}><> */}
                  <TouchableOpacity disabled={this.state.apptype == '2'} onPress={() => this.props.navigation.navigate("PatientOverviewList")} activeOpacity={0.7} style={{ alignItems: "center" }}><>
                    <Image style={{ tintColor: 'white', height: 25, width: 45 }} source={icons.individual_overview} />
                    <Text style={{ color: 'white', fontFamily: this.tab1Font }}>Individual Overview</Text>
                  </></TouchableOpacity>
                  {/* <View style={{ height: 5, backgroundColor: "#FFF", borderRadius: 10, width: 150, marginTop: 10 }} /> */}
                </>}
              </View></Col>

              <Col flex={70} align="flex-start" valign="center" style={{ height: 83, borderWidth: 0 }}>
                <TouchableOpacity onPress={() => this.setupBottomTab(4)} activeOpacity={0.7} style={{ alignItems: "center" }}><>
                  <Image style={{ tintColor: 'white' }} source={icons.tab_profile_selected} />
                  <Text style={{ color: 'white', fontFamily: this.tab1Font }}>Profile</Text>
                </></TouchableOpacity>
              </Col>
            </Row>
            {/* </View> */}
          </Animated.View>
        </>}


        {/* footer for NON-Caretaker */}
        {this.state.role !== 'caretaker' && <>
          <Animated.View style={[styles.subView, { transform: [{ translateY: this.state.height }] },]}>
            <View style={{ width: "100%", height: barContainerHeight }}>
              <ImageBackground source={icons.tab_bg_icon} style={{ width: '100%', height: '100%' }}>
                <View style={styles.tabContainer}>
                  {this.renderTabItem(0, icons.tab_home_selected, theme.strings.home)}
                  {this.renderTabItem(1, icons.tab_chat_selected, theme.strings.services)}
                  <View style={styles.tabItem}><SOSCallButton refreshSOS={(refresh) => (this.refreshSOS = refresh)} /></View>
                  {this.renderTabItem(3, icons.tab_social_selected, theme.strings.social)}
                  {this.renderTabItem(4, icons.tab_profile_selected, theme.strings.profile)}
                </View>
              </ImageBackground>
            </View>
          </Animated.View>
        </>}


      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabContainer: {
    height: barHeight,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  gradientBg: {
    width: "100%",
    height: 45,
    resizeMode: "cover",
  },
  tabItem: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  tabIcon: {
    alignItems: "stretch",
  },
  tabText: {
    color: theme.colors.white,
    fontSize: 10,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 4,
    fontFamily: theme.fonts.SFProMedium,
    fontWeight: '500',
    letterSpacing: 0.16

  },
  addButtonContainer: {
    marginTop: -40,
    alignItems: "center",
    justifyContent: "center",
  },
  subView: {
    position: "absolute",
    bottom: 0,
    alignSelf: 'flex-end',
    width: "100%",
    minHeight: barContainerHeight,
  },
});
