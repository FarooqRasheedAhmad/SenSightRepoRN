import { AppConstants, StorageUtils } from "../../utils";
import { Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { ProgressBar, ShowWeather, UsersList, BellAlert } from "../../components";
import React, { Component } from "react";
import { Icon } from "react-native-elements";
// import IconBadge from "react-native-icon-badge";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { icons } from "../../assets";
import { theme } from "../../theme";
import { monthNames } from '../../configs'

export class CaregiverHome extends Component {
  constructor(props) {
    super(props);
    this.state = { spinner: false, name: "", date: "", data: null, markers: [], region: null, refresh: false,  apptype: "" }
    this.newAlertCount = 0;
    // this.monthNames = [
    //   "January",
    //   "February",
    //   "March",
    //   "April",
    //   "May",
    //   "June",
    //   "July",
    //   "August",
    //   "September",
    //   "October",
    //   "November",
    //   "December",
    // ];
    this.totalTasks = 0;
    this.completedTasks = 0;
    this.progress = 0;
    this.map = null;
    this.refetchWeather = null;
  }

  componentDidMount() {
    // StatusBar.setBarStyle("dark-content", true);
    const { isShowTasks, apptype,navigation } = this.props
    this.setState({apptype})
    if (isShowTasks) {
      this.getTasksFromServer()
      this.getAlertsFromServer();
    }
    {apptype === "1" && this.showDataFromPrefs()}

    StorageUtils.getValue(AppConstants.SP.USER_ID).then(r => { this.setState({ seniorId:r }) });

    this.focusListener = navigation.addListener("didFocus", () => {
      this.refreshUserScreen();
    })
  }

  showDataFromPrefs = () => {
    this.showNameFromPrefs();

    this.showDate();
    this.getSeniorsFromServer();
    this.getAlertsFromServer();
  }

  getTasksFromServer = async () => {
    try {
      this.setState({ spinner: true });
      const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
      let uri = String(api.assignTasks).replace("{2}", "2");
      const response = await fetch(uri, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        this.completedTasks = 0;
        this.totalTasks = 0;
        const data = await response.json();
        this.totalTasks = data.length
        this.completedTasks = data.length
        // data.seniorCaregiverTasks.forEach((task) => {
        //   if (task.taskStatus) this.completedTasks++;
        //   this.totalTasks++;
        // });
        // this.progress =
        //   this.totalTasks == 0
        //     ? 0
        //     : Math.round((this.completedTasks / this.totalTasks) * 100);
        this.setState({ spinner: false });
      }
    } catch (err) {
      this.showError();
    }
  };
  showNameFromPrefs = async () => {
    var prefName = await StorageUtils.getValue(AppConstants.SP.FIRST_NAME);
    prefName += ",";
    this.setState({ name: prefName });
  };
  getAlertsFromServer = async () => {
    try {
      this.setState({ spinner: true });
      const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
      const response = await fetch(api.alerts, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        
        this.newAlertCount = 0;
        data.forEach((alert) => {
          if (!alert.acknowledged) {
            this.newAlertCount++;
          }
        });

        this.setState({ spinner: false });
      }
    } catch (err) {
      this.showError();
    }
  };
  showDate = () => {
    var d = new Date();
    var dayName =
      this.dayOfWeekAsInteger(d.getDay()) +
      ", " +
      monthNames[d.getMonth()] +
      " " +
      d.getDate();
    this.setState({ date: dayName });
  }

  dayOfWeekAsInteger(day) {
    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][day];
  }

  refreshUserScreen = () => {
    this.getTasksFromServer();
    this.getAlertsFromServer();
    {this.state.apptype === "1" && this.showDataFromPrefs();}
    this.refreshHandler(true);
    if (this.props.isShowTasks) {
      this.getTasksFromServer()
    }
    if (this.refetchWeather) {
      this.refetchWeather();
    }
    this.showDate();
  };

  refreshHandler = (value) => {
    this.setState({ refresh: value });
  }

  getSeniorsFromServer = async () => {
    this.setState({ spinner: true })
    var token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    fetch(api.seniors, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          this.showError();
          return;
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ spinner: false });
        this.setState({ data: data });
        this.parseCordinates(data);
      })
      .catch((error) => {
        this.showError();
      });
  };

  parseCordinates = (data) => {
    const newData = [];
    if (data && data.length > 0) {
      data.map((d) =>
        newData.push({
          profileImage: d.profileImage,
          coordinates: { latitude: d.lastLatitude, longitude: d.lastLongitude },
        })
      );

      const region = {
        latitude: data[0] && data[0].lastLatitude ? data[0].lastLatitude : 0,
        longitude: data[0] && data[0].lastLongitude ? data[0].lastLongitude : 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      this.setState({ region, markers: [...newData] }, () => {
        const markerIdentifiers = [];
        this.state.markers.forEach((marker, index) =>
          markerIdentifiers.push("mk" + index.toString())
        );

        this.map.fitToSuppliedMarkers(markerIdentifiers, {
          edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
          animated: true,
        });
      });
    }
  };

  showError = () => {
    this.setState({
      spinner: false,
    });

    Snackbar.show({
      title: theme.strings.call_fail_error,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  render() {
    let i = 0
    const { date, apptype } = this.state
    const { isShowTasks, isShowStatics, navigation,temperature,weather,cityName } = this.props
    
    
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.primaryBgStyle}>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 15 }}>
                <Text style={styles.date}>{date}</Text>
                <ShowWeather 
                 refetchWeather={(refresh) => (this.refetchWeather = refresh) } 
                 temperature={temperature}
                 weather={weather}
                 cityName={cityName}/>
              </View>

              <View style={styles.horizontalView}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", }} >
                  <View style={{ flex: .65 }}>
                      <Text numberOfLines={1} style={[styles.name, { marginLeft: 15 }]} >{"Hi " + this.state.name}</Text>
                  </View>
                  <View style={styles.navRightContainer}>

                    <TouchableOpacity style={{ height:'100%', marginRight: 20,flexDirection: 'row' , alignItems: 'center' }}
                      onPress={() => {
                        navigation.navigate("TaskForm", {
                          // name: seniorName, seniorId: seniorId, profileImage: seniorImg,
                        });
                      }}> 
                      <Text style={{marginRight: 10,color: 'white', fontWeight: 'bold'}}>Add Task</Text>
                        <Icon type="material-community" name="square-edit-outline" color="#FFFFFF" /></TouchableOpacity>


                    <BellAlert alerts={this.newAlertCount} onPress={() => this.props.navigation.navigate("AlertsScreen", { getAlertsFromServer: this.getAlertsFromServer, })} />
                  </View>
                </View>
              </View>

            </View>

            <ScrollView refreshControl={ <RefreshControl refreshing={this.state.spinner} onRefresh={this.refreshUserScreen} /> } contentContainerStyle={{ flexGrow: 1 }}>
              <View>
                <Spinner visible={this.state.spinner} />
                <View style={{ height: 20 }} />
                <UsersList
                  type="senior"
                  refreshHandler={this.refreshHandler}
                  refresh={this.state.refresh}
                  navigate={this.props.navigation.navigate}
                  isShowTasks={isShowTasks}
                  role={this.props.role}
                  isShowStatics={isShowStatics}
                />
               {/*  <View style={{ height: 48, justifyContent: 'center' }}>
                  <Text style={[styles.headerLocStatsTitle, { marginLeft: 15 }]}>
                    {theme.strings.statistics}
                  </Text>
                </View> */}
                <View style={{ height: 10 }} />
                {isShowTasks && <TouchableOpacity onPress={() => navigation.navigate("TasksScreen", { getTasksFromServer: this.getTasksFromServer, userType: "2" }) } >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 15, marginRight: 15, height: 48 }}>
                    <Text style={[ styles.headerLocStatsTitle, { fontFamily: theme.fonts.SFProRegular, fontSize: 17, lineHeight: 22, letterSpacing: -0.41 }]}>
                      {theme.strings.tasks}
                    </Text>
                    <Image style={styles.image} source={icons.disclosure} />
                  </View>
                  <View style={styles.tasksContainer}>
                    <ProgressBar progress={this.progress / 100} color={theme.colors.colorPrimary} />
                    <View style={{ height: 10 }} />
                    <View style={styles.horizontalView}>
                      <View style={{ flexDirection: "row", flexGrow: 1 }}>
                        <Text style={styles.taskNum}>{this.completedTasks}</Text>
                        <Text style={styles.taskTotal}>/{this.totalTasks}</Text>
                      </View>
                      <Text style={styles.taskTotal}>{this.progress}%</Text>
                    </View>
                  </View>
                </TouchableOpacity>}

                <View style={{ height: 15 }} />
                { apptype == "1" && ( <View>
                <Text style={[styles.headerLocStatsTitle, { marginLeft: 15 }]}>{theme.strings.tracking}</Text>
                <MapView initialRegion={this.state.region} style={styles.map} zoomEnabled provider={PROVIDER_GOOGLE} ref={(ref) => (this.map = ref)}
                  // region={this.state.region}
                >
                  {this.state.markers.map((marker, index) => (
                    <MapView.Marker coordinate={marker.coordinates} title={marker.title} zIndex={i++} identifier={"mk" + index.toString()} key={index}>
                      <View style={styles.markerContainer}>
                        <Image source={icons.ic_senior_marker} />
                        <Image source={ marker.profileImage != null ? { uri: marker.profileImage } : icons.placeholder_user } style={[styles.markerSeniorIcon]} />
                      </View>
                    </MapView.Marker>
                  ))}
                </MapView>
                </View>)}
                <View style={{ height: 55 }} />
              </View>
            </ScrollView>
          </SafeAreaView>
          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.colorPrimary,
    marginBottom: 15
  },
  subContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    marginTop: Platform.OS === "ios" ? 44 : 0
  },
  primaryBgStyle: {
    backgroundColor: theme.colors.colorPrimary,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 8,
    shadowColor: theme.colors.white,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.26,
  },
  date: {
    fontFamily: theme.fonts.SFProSemibold,
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    marginTop: 20,
    marginLeft: 15,
    flexGrow: 1,
    textTransform: "uppercase",
  },
  iconStyle: {
    width: 24,
    height: 24
  },
  horizontalView: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  name: {
    fontFamily: theme.fonts.SFProBold,
    color: theme.colors.white,
    fontSize: 32,
    marginLeft: 15,
  },
  navRightContainer: {
    flex: .35,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 15
  },
  alertOutCircle: {
    position: 'absolute',
    right: -10,
    top: -10,
    minWidth: 20,
    minHeight: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertOutCircle1: {
    position: 'absolute',
    right: -10,
    top: -10,
    minWidth: 30,
    minHeight: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertInnerCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.red_shade_2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertInnerCircle1: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.red_shade_2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.Roboto,
    fontSize: 10,
    lineHeight: 12
  },
  weather: {
    fontFamily: theme.fonts.SFProSemibold,
    marginRight: 25,
    marginTop: 20,
    color: theme.colors.grey_shade_1,
    fontSize: 13,
  },
  alertContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.bg_grey,
    alignContent: "center",
    paddingLeft: 15,
    paddingTop: 7,
    paddingBottom: 7,
    marginTop: 5,
    marginBottom: 5,
  },
  image: {
    alignSelf: "center",
  },
  alert: {
    color: theme.colors.red_shade_1,
    fontFamily: theme.fonts.SFProSemibold,
    marginLeft: 7,
    fontSize: 13,
  },
  todayActivity: {
    fontSize: 22,
    fontFamily: theme.fonts.SFProBold,
    color: theme.colors.black,
    marginLeft: 15,
    marginTop: 5,
  },
  beHonest: {
    color: "rgba(0,0,0, 0.18)",
    fontFamily: theme.fonts.SFProRegular,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 12,
  },
  headerLocStatsTitle: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProBold,
    fontSize: 21,
  },
  markerSeniorIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: "cover",
    position: "absolute",
    alignSelf: "center",
    top: 0,
    marginTop: 6,
  },
  markerContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  tasksContainer: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: "rgba(248, 248, 248, 0.92)",
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },
  taskNum: {
    fontFamily: theme.fonts.SFProSemibold,
    fontSize: 15,
    color: theme.colors.black,
    marginRight: 2,
  },
  taskTotal: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    color: "rgba(0, 0, 0, 0.50)",
    marginLeft: 2,
  },
  map: {
    height: 350,
    margin: 15,
    borderRadius: 10,
  },
});
