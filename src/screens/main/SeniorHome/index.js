import { AppConstants, StorageUtils, getAppUsers, showMessage, timeConvert, watchPaired, AppWidgets } from "../../../utils";
import { ChartContainer, Device, LocationItem, NavigationHeader, ShowWeather, UsersList, AlertHelper, App, BellAlert, Button,ProgressBar } from "../../../components";
import { Image, Linking, Platform, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar, ActivityIndicator } from "react-native";
import { fetchApiData, sendRequest } from '../../../apicall'
import React, { Component } from "react";
import { icons, images } from "../../../assets";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import { Icon } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { StatisticsContainer } from "../../../components/StatisticsContainer/StatisticsContainer";
import { api, GET_RISK_ASSESSMENT_LASTDATE } from "../../../api";
import { getGeoCodePosition } from "../../../utils";
// import { getTOffset } from "../../../utils/Utils";
import { theme } from "../../../theme";
import CareTakerArea from './CareTakerArea'
import SeniorArea from './SeniorArea'

export class SeniorHome extends Component {
  constructor(props) {
    super(props);
    this.seniorId = this.props.navigation.getParam("seniorId", this.props.id);
    this.seniorName = this.props.navigation.getParam("seniorName", "");
    this.seniorImg = this.props.navigation.getParam("seniorImg", "");
    this.seniorGeofence = this.props.navigation.getParam("seniorGeofence", 0);
    this.seniorPhone = this.props.navigation.getParam("seniorPhone", "");
    const profileRole = this.props.navigation.getParam("role");
    this.state = {
      user_modules:"",
      loading: true,
      spinner: false,
      mounted: true,
      currentPage: 0,
      name: "",
      date: "",
      lastLocationName: "",
      lastLocationDetail: "",
      dialog: false,
      watchIsReachable: false,
      inviteDialog: false,
      statsDate: "",
      timeOffset: "",
      isLocationViewVisible: true,
      isAssessmentViewVisible: true,
      isDeviceViewVisible: true,
      isPatientDiaryViewVisible: true,
      isAppsViewVisible:true,
      isShowActivityScoreCaregiver: true,
      isShowActivityScore: true,
      isShowRiskScore: true,
      isShowInfectionRisk: true,
      isShowStatics: true,
      isShowLocation: true,
      isShowPatientDiary: true,
      isShowRideRequest: true,
      isShowRiskScoreCaregiver: true,
      isShowCaregiversStatics: true,
      isShowRideRequestCaregiver: true,
      isShowLocationCaregiver: true,
      isShowPatientDiaryCaregiver: true,

      risk_AssessmentLastDate: "never",
    }
    this.newAlertCount = 0;
    this.prevAlertCount = 0;
    this.requestAlerts = [];
    this.locationData = null;
    this.lastLocation = null;
    this.appType = "",
    this.role = profileRole || "senior"
    this.caregiverName = "";
    this.caregiverPhone = "";
    this.monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    this.refreshSOS = null
    this.refreshStats = null
    this.refreshCharts = null
    this.refetchWeather = null
    this.refreshHRVChart = null
    this.totalTasks = 0;
    this.completedTasks = 0;
    this.progress = 0;

    this.chartContainerReff = React.createRef();
  }


  async componentDidMount() {
    const { navigation,isShowTasks } = this.props
    // StatusBar.setBarStyle("dark-content", true);
    this.appType = await StorageUtils.getValue(AppConstants.SP.APP_TYPE)
    this.veyetals = await StorageUtils.getValue(AppWidgets.VEYETALS);
    if (isShowTasks) {
      this.getTasksFromServer()
    }
    this.getRole();
    this.showDataFromPrefs();
    this.getSeniorLocationFromServer();
    this.getAlertsFromServer();
    this.checkWatch();
    this.getTimeOffset()
    this.onOffWidgets()
    // this.getLocation();
    
    this.focusListener = navigation.addListener("didFocus", () => {
      this.refreshUserScreen();
      const _chartContainerReff = this.chartContainerReff.current;
      _chartContainerReff.fetchAll();
      this.getAssesmentLatestDate()
    })

    this.checkAllowedmodules();

    this.getAssesmentLatestDate();

    // StorageUtils.getValue('getPackageModuleResponse').then(getPackageModuleResponse => {
    //   if (getPackageModuleResponse){
    //     console.log("getPackageModuleResponse:", JSON.parse(getPackageModuleResponse));
    //     this.setState({ package: JSON.parse(getPackageModuleResponse) })
    //   }
    // })

    // console.log("***********************");
    // console.log(getTOffset("2021-01-25T06:00:08.4147603"));
    // // console.log(getTOffset("2021-01-25T06:00:08"));
    // console.log("***********************");
    
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  getAssesmentLatestDate(){
    sendRequest({
      uri: GET_RISK_ASSESSMENT_LASTDATE(this.seniorId),
      method: 'get',
    }).then(r => {
      if (r && !r.error) {
        let parts = r.split(" ");
        this.setState({ risk_AssessmentLastDate: parts[0] });
      }
    })
  }

  async checkAllowedmodules(){
    StorageUtils.getValue('user_modules').then(r => this.setState({ user_modules: r }));
 }

  /* getAppType = async() => {
   getAppUsers((user, type) => {
      this.setState({ appType: type });
    })
  } */

  onOffWidgets = async () => {

    if (this.role != 'senior') {
      if (Platform.OS !== "ios") {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor(theme.colors.colorPrimary)
      }
  
    }

    const activityScorePref = await StorageUtils.getValue(AppWidgets.ACTIVITY_SCORE)
    const riskScorePef = await StorageUtils.getValue(AppWidgets.RISK_SCORE)

    const infectionRiskRef = await StorageUtils.getValue(AppWidgets.INFECTION_RISK)
    const staticsPref = await StorageUtils.getValue(AppWidgets.STATICS)
    const locationPref = await StorageUtils.getValue(AppWidgets.LOCATION)
    const patientPref = await StorageUtils.getValue(AppWidgets.PATIENT_DIARY)
    const rideRequestPref = await StorageUtils.getValue(AppWidgets.RIDE_REQUEST)

    const activityScoreCaregiverPref = await StorageUtils.getValue(AppWidgets.ACTIVITY_SCORE_CAREGIVER)
    const riskScoreCaregiverPef = await StorageUtils.getValue(AppWidgets.RISK_SCORE_CAREGIVER)
    const caregiverStaticsRef = await StorageUtils.getValue(AppWidgets.CAREGIVER_STATICS)
    const rideRequestCaregiverPref = await StorageUtils.getValue(AppWidgets.RIDE_REQUEST_CAREGIVER)
    const locationCaregiverPref = await StorageUtils.getValue(AppWidgets.LOCATION_CAREGIVER)
    const patientDiatyCaregiverPref = await StorageUtils.getValue(AppWidgets.PATIENT_DIARY_CAREGIVER)


    const isShowActivityScore = !!activityScorePref ? JSON.parse(activityScorePref) : true
    const isShowRiskScore = !!riskScorePef ? JSON.parse(riskScorePef) : true
    const isShowInfectionRisk = !!infectionRiskRef ? JSON.parse(infectionRiskRef) : true
    const isShowStatics = !!staticsPref ? JSON.parse(staticsPref) : true
    const isShowLocation = !!locationPref ? JSON.parse(locationPref) : true
    const isShowPatientDiary = !!patientPref ? JSON.parse(patientPref) : true
    const isShowRideRequest = !!rideRequestPref ? JSON.parse(rideRequestPref) : true

    const isShowActivityScoreCaregiver = !!activityScoreCaregiverPref ? JSON.parse(activityScoreCaregiverPref) : true
    const isShowRiskScoreCaregiver = !!riskScoreCaregiverPef ? JSON.parse(riskScoreCaregiverPef) : true
    const isShowCaregiversStatics = !!caregiverStaticsRef ? JSON.parse(caregiverStaticsRef) : true
    const isShowRideRequestCaregiver = !!rideRequestCaregiverPref ? JSON.parse(rideRequestCaregiverPref) : true
    const isShowLocationCaregiver = !!locationCaregiverPref ? JSON.parse(locationCaregiverPref) : true
    const isShowPatientDiaryCaregiver = !!patientDiatyCaregiverPref ? JSON.parse(patientDiatyCaregiverPref) : true

    this.setState({
      isShowCaregiversStatics, isShowActivityScoreCaregiver, isShowActivityScore,
      isShowRiskScoreCaregiver, isShowRiskScore, isShowInfectionRisk, isShowStatics,
      isShowLocation, isShowPatientDiary, isShowRideRequest, isShowRideRequestCaregiver,
      isShowLocationCaregiver, isShowPatientDiaryCaregiver
    })

  }

  getAlertsFromServer = async () => {
    this.onOffWidgets()
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
        this.prevAlertCount = 0;
        this.newAlertCount = 0;
        const requestAlerts = [];
        data.forEach((alert) => {
          if (alert.acknowledged) {
            this.prevAlertCount++;
          } else {
            if (alert.type === 3) requestAlerts.push(alert);
            this.newAlertCount++;
          }
        });
        this.requestAlerts = requestAlerts;

        this.setState({ spinner: false });
      }
    } catch (err) {
      this.setState({ spinner: false });
      showMessage("Error in getting alerts", "long");
    }
  }

  getRole = async () => {
    this.role = await StorageUtils.getValue(AppConstants.SP.ROLE);
    this.caregiverName = await StorageUtils.getValue(
      AppConstants.SP.CAREGIVER_NAME
    )
    this.caregiverPhone = await StorageUtils.getValue(
      AppConstants.SP.CAREGIVER_PHONE
    )
    if (this.role === "senior") {
      this.seniorId = await StorageUtils.getValue(AppConstants.SP.USER_ID);
      this.seniorName = await StorageUtils.getValue(AppConstants.SP.FULL_NAME);
      this.seniorImg = await StorageUtils.getValue(
        AppConstants.SP.PROFILE_IMAGE
      )
    }
  }

  onIndexChanged(index) {
    if (!this.state.mounted) return;
    this.setState({ currentPage: index });
  }

  showDataFromPrefs = () => {
    this.showNameFromPrefs();
    this.showDate();
  };

  showNameFromPrefs = async () => {
    var prefName = await StorageUtils.getValue(AppConstants.SP.FIRST_NAME);
    prefName += ",";
    this.setState({ name: prefName });
  };

  showDate() {
    var d = new Date();
    var dayName =
      this.dayOfWeekAsInteger(d.getDay()) +
      " " +
      d.getDate() +
      ",  " +
      this.monthNames[d.getMonth()];

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

  getSeniorLocationFromServer = async () => {
    this.setState({ spinner: true });
    var role = await StorageUtils.getValue(AppConstants.SP.ROLE);
    var userId = null;
    if (role == "senior")
      userId = await StorageUtils.getValue(AppConstants.SP.USER_ID);
    else userId = this.seniorId;
    var token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    var url = api.seniorLocations + userId + '?NoRecord=1'
    // console.log("URL=> " + url)
    fetch(url, {
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
        // console.log("------------------")
        // console.log(JSON.stringify(data))
        // console.log("------------------")
        this.locationData = data;
        if (data) {

          this.lastLocation = data[0];
          getGeoCodePosition(data, (parsedLocation) => {
            // console.log("===================")
            // console.log(JSON.stringify(data))
            // console.log("------------------")
            // console.log(JSON.stringify(parsedLocation))
            // console.log("===================")
            if (parsedLocation && parsedLocation[0] && parsedLocation[0].name){
              this.setState({
                lastLocationName: parsedLocation[0].name,
                lastLocationDetail: parsedLocation[0].detail,
              });
            }
          });
        }
      })
      .catch((error) => {
        this.setState({ spinner: false });
        showMessage("Error in getting location");
      });
  }

  refreshUserScreen = () => {
    this.getRole();
    this.showDataFromPrefs();
    this.getSeniorLocationFromServer();
    this.getTimeOffset();
    this.getAlertsFromServer();
    if (this.props.isShowTasks) {
      this.getTasksFromServer()
    }
    if (this.refreshSOS) {
      this.refreshSOS();
    }
    if (this.refreshStats) {
      this.refreshStats();
    }
    if (this.refreshCharts) {
      this.refreshCharts();
    }
    if (this.refetchWeather) {
      this.refetchWeather();
    }
    this.showDate();
    if (this.refreshHRVChart) {
      this.refreshHRVChart();
    }
  };

  showError = () => {
    this.setState({
      spinner: false,
    });

    Snackbar.show({
      text: theme.strings.call_fail_error,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  navigateToLocation = () => {

    const { isShowRideRequest, isShowRideRequestCaregiver } = this.state
    const isRideRequestBtnVisible = this.role == "senior" ? isShowRideRequest : isShowRideRequestCaregiver

    this.props.navigation.navigate("Location", {
      lastLocationName: this.state.lastLocationName,
      lastLocationDetail: this.state.lastLocationDetail,
      latitude: this.lastLocation != null ? this.lastLocation.latitude : 0,
      longitude: this.lastLocation != null ? this.lastLocation.longitude : 0,
      lastLocations: this.locationData,
      seniorId: this.seniorId,
      geofenceLimit: this.seniorGeofence,
      noGoAreas: this.noGoAreas,
      role: this.role,
      isShowRideRequest: isRideRequestBtnVisible,
      getSeniorLocation: this.getSeniorLocationFromServer,
    });
  }

  removeSenior = () => {
    AlertHelper.show({
      description: `Do you want to remove ${this.seniorName}`,
      okButton: { onPress: () => this.processRemoveSenior(), lable: 'Yes' },
      cancelBtn: { negativeBtnLable: 'No' }
    })
  }

  processRemoveSenior = async () => {
    this.setState({ spinner: true })
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    const payload = {
      token: token,
      serviceUrl: api.removeSeniorUrl + this.seniorId,
      method: 'delete'
    }

    const response = await fetchApiData(payload)
    this.setState({ spinner: false })
    if (response && response.data && response.data.errors && response.data.errors.length) {
      AlertHelper.show({
        description: `Oops, ${response.data.errors[0].description} !`,
        cancelBtn: 'Ok'
      })
    }
    else if (response && !response.error) {
      const { navigation } = this.props
      AlertHelper.show({
        description: `Senior has been removed successfully`,
        cancelBtn: { negativeBtnLable: 'Ok', onPress: () => this.goToCaregiverHome() }
      })
    }
  }

  goToCaregiverHome = () => {
    const { navigation } = this.props
    const refreshSeniorsData = navigation.getParam("refreshSeniorsData", () => { })
    navigation.goBack()
    refreshSeniorsData()
  }

  checkWatch = () => {
    watchPaired((data, error) => {
      if (data) {
        this.setState({ watchIsReachable: data.watchPaired });
      }
    });
  };

  sendSMS = () => {
    const msgBody = `Hi ${this.seniorName}, \n`;
    if (Platform.OS === "ios")
      Linking.openURL(`sms:${this.seniorPhone}&body=${msgBody}`);
    else Linking.openURL(`sms:${this.seniorPhone}?body=${msgBody}`);
  };

  getTimeOffset = () => {
    const d = new Date();
    const n = d.getTimezoneOffset() / 60;
    const timeOffset = n < 0 ? Math.abs(n) : -n;
    const { hours, minutes, sign } = timeConvert(timeOffset);
    const p = d.toISOString().replace("Z", "");
    const nDate = `${p}${sign === "+" ? "-" : "+"}${hours}:${minutes}`;
    const t = new Date(nDate);

    this.setState({
      statsDate: t.toISOString(),
      timeOffset: timeOffset.toString(),
    });
  };

  onPressAccordian = (viewStateKey) => {
    const value = this.state[viewStateKey];
    this.setState({ [viewStateKey]: value ? false : true });
  }

  makeCall = () => {
    if (this.seniorPhone) {
      RNImmediatePhoneCall.immediatePhoneCall(this.seniorPhone);
    } else {
      Snackbar.show({
        text: "No phone number given",
        duration: Snackbar.LENGTH_SHORT
      });
    }
  }

  renderInfectionRiskAssessment = () => {
    const { isShowInfectionRisk, user_modules } = this.state

    if (!isShowInfectionRisk) return null

    return (
      <View>
        <View style={styles.headerLocStatsView}>
          <Text style={styles.headerLocStatsTitle}>{theme.strings.infection_risk_Assessment_Result_Screen}</Text>
          <TouchableOpacity onPress={() => this.onPressAccordian("isAssessmentViewVisible") }>
            <Image source={isShowInfectionRisk ? icons.accordian_minus : icons.accordian_plus} style={{ width: 26, height: 26 }} />
          </TouchableOpacity>
        </View>
        {isShowInfectionRisk && (
          <LocationItem
            // disabled={user_modules.indexOf()}
            name={theme.strings.infection_risk_Assessment_Result_Screen}
            detail={`Submitted - ${this.state.risk_AssessmentLastDate}`}
            leftIcon={icons.infection_risk_icon}
            onPress={() =>
              this.props.navigation.navigate("InfectionAssesmentScreen", {title: theme.strings.infection_risk_string,})
            }
          />
        )}
      </View>)
  }

  renderPatientDiary = () => {
    const { isShowPatientDiary, isShowPatientDiaryCaregiver, isPatientDiaryViewVisible } = this.state
    const isDiaryVisible = this.role == "senior" ? isShowPatientDiary : isShowPatientDiaryCaregiver

    if (!isDiaryVisible) return null

    return (<View>
      <View style={styles.headerLocStatsView}>
        <Text style={styles.headerLocStatsTitle}>Patient Dairy</Text>
        <TouchableOpacity
          onPress={() =>
            this.onPressAccordian("isPatientDiaryViewVisible")
          }
        >
          <Image
            source={
              isPatientDiaryViewVisible
                ? icons.accordian_minus
                : icons.accordian_plus
            }
            style={{ width: 26, height: 26 }}
          />
        </TouchableOpacity>
      </View>
      {isPatientDiaryViewVisible && (
        <LocationItem
          name="Patient Dairy"
          // detail="Last Updated • Yesterday"
          leftIcon={icons.patient_diary}
          onPress={() => {
            this.props.navigation.navigate("PatientDairyScreen", {
              seniorId: this.seniorId,
              seniorName: this.seniorName,
              seniorProfile: this.seniorImg,
              role: this.role,
              appType: this.appType,
            });
          }}
        />
      )}
    </View>
    )
  }
  
  renderApps = () => {
    const { isShowPatientDiary, isShowPatientDiaryCaregiver, isPatientDiaryViewVisible, isAppsViewVisible, user_modules } = this.state
    const isDiaryVisible = this.role == "senior" ? isShowPatientDiary : isShowPatientDiaryCaregiver

    if (!isDiaryVisible) return null

    // console.log("this.veyetals: ", this.veyetals);

    const show_veyetals_app = (this.veyetals===false || this.veyetals=='false') ? false : true;

    if (!show_veyetals_app) return null;


    return (<View>
      <View style={styles.headerLocStatsView}>
        <Text style={styles.headerLocStatsTitle}>Apps</Text>
        <TouchableOpacity onPress={() => this.onPressAccordian("isAppsViewVisible") } >
          <Image source={ isAppsViewVisible ? icons.accordian_minus : icons.accordian_plus } style={{ width: 26, height: 26 }} />
        </TouchableOpacity>
      </View>
      
      {isAppsViewVisible && <>
        {show_veyetals_app && 
          <LocationItem name="Veyetals" title="Veyetals"
            // detail="Last Updated • Yesterday"
            // disabled={(user_modules && user_modules.indexOf('Veyetals') < 0)}
            leftIcon={icons.apps}
            onPress={() => {
              if(user_modules.indexOf('Veyetals') < 0){
                alert("Please upgrade your package");
                return;
              }

              this.props.navigation.navigate("Apps", {
                seniorId: this.seniorId,
                seniorName: this.seniorName,
                seniorProfile: this.seniorImg,
                role: this.role,
                appType: this.appType,
              });
            }}
          />
        }
      </>}


    </View>
    )
  }

  renderDevices = () => {
    const { isDeviceViewVisible } = this.state
    return (
      <>
        <View style={styles.headerLocStatsView}>
          <Text style={styles.headerLocStatsTitle}>Devices</Text>
          <TouchableOpacity onPress={() => this.onPressAccordian("isDeviceViewVisible")}>
            <Image source={ isDeviceViewVisible ? icons.accordian_minus : icons.accordian_plus }
              style={{ width: 26, height: 26 }}
            />
          </TouchableOpacity>
        </View>
        {isDeviceViewVisible && (
          <View style={{ flex: 1 }}>
            <Device navigation={this.props.navigation} seniorId={this.seniorId} />
          </View>
        )}
      </>
    )
  }

  renderLocationView = () => {
    const { isShowLocation, isShowLocationCaregiver, isLocationViewVisible } = this.state
    const isLocationVisible = this.role == "senior" ? isShowLocation : isShowLocationCaregiver

    if (!isLocationVisible) return null

    return (<View>
      <View style={styles.headerLocStatsView}>
        <Text style={styles.headerLocStatsTitle}>{theme.strings.last_locations}</Text>
        <TouchableOpacity onPress={() => this.onPressAccordian("isLocationViewVisible")}>
          <Image source={isLocationViewVisible ? icons.accordian_minus : icons.accordian_plus} style={{ width: 26, height: 26 }} />
        </TouchableOpacity>
      </View>
      {isLocationViewVisible && (
        <LocationItem
          name={this.state.lastLocationName}
          detail={this.state.lastLocationDetail}
          leftIcon={icons.location}
          onPress={() => this.navigateToLocation()}
        />
      )}</View>)
  }

  renderChart = () => {
    const { isShowRiskScore, isShowActivityScoreCaregiver, isShowRiskScoreCaregiver, isShowActivityScore } = this.state
    const selectedGraph = this.appType == "2" && isShowRiskScore ? 1 : 0
    const isActivityScoreVisible = this.role == "senior" ? isShowActivityScore : isShowActivityScoreCaregiver
    const isRiskScoreVisible = this.role == "senior" ? isShowRiskScore : isShowRiskScoreCaregiver

    return (<ChartContainer
      ref={this.chartContainerReff}
      showProgressChart
      seniorId={this.seniorId}
      refreshCharts={(refresh) => (this.refreshCharts = refresh)}
      statsDate={this.state.statsDate}
      timeOffset={this.state.timeOffset}
      role={this.role}
      appType={this.appType}
      selectedGraph={selectedGraph}
      navigation={this.props.navigation}
      refreshScreen={this.refreshUserScreen}
      isShowActivityScore={isActivityScoreVisible}
      isShowRiskScore={isRiskScoreVisible}
    />)
  }

  renderStatics = () => {
    const { isShowStatics, isShowCaregiversStatics } = this.state
    const isStaticsVisible = this.role == "senior" ? isShowStatics : isShowCaregiversStatics

    if (!isStaticsVisible) return null

    return (<StatisticsContainer
      navigation={this.props.navigation}
      seniorId={this.seniorId}
      refreshStats={(refresh) => (this.refreshStats = refresh)}
      statsDate={this.state.statsDate}
      timeOffset={this.state.timeOffset}
      role={this.role}
      watchPaired={this.state.watchIsReachable}
    />)
  }

  getTasksFromServer = async () => {
    try {
      this.setState({ spinner: true });
      const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
      let uri = String(api.assignTasks).replace("{2}", "1");
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
        this.setState({ spinner: false });
      }
    } catch (err) {
      this.showError();
    }
  };

  renderTask = () => {
    const {isShowTasks,navigation} = this.props
    return(
      <View>
    <View style={{ height: 10 }} />
    {isShowTasks &&  <TouchableOpacity onPress={() => navigation.navigate("TasksScreen", { getTasksFromServer: this.getTasksFromServer, userType: "1" } )} >
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
    </View>
    )
  }

  render() {
    const { spinner, date } = this.state
    const { temperature, weather, cityName } = this.props

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.subContainer}>
          <ScrollView refreshControl={<RefreshControl refreshing={spinner} onRefresh={this.refreshUserScreen} />}>
            <Spinner visible={spinner} />

            {this.role == "senior" && <SeniorArea 
              {...this.props}
              date={date}
              refetchWeather={this.refetchWeather}
              temperature={temperature}
              weather={weather}
              cityName={cityName}
              name={this.state.name}
              newAlertCount={this.newAlertCount}
              getAlertsFromServer={this.getAlertsFromServer}
              refreshSOS={this.refreshSOS}
              seniorId={this.seniorId}
            />}

            {this.role == "caretaker" && <CareTakerArea styles={styles} 
              {...this.props} 
              seniorImg={this.seniorImg}
              seniorName={this.seniorName}
              removeSenior={this.removeSenior}
              seniorId={this.seniorId}
              sendSMS={this.sendSMS}
              makeCall={this.makeCall}
              seniorPhone={this.seniorPhone}
              appType={this.appType}
            />}

            {this.renderTask()}
            {this.renderStatics()}
            {this.appType != 2 && this.renderLocationView()}
            {this.appType != 2 && this.renderPatientDiary()}
            {this.role !== 'caretaker' && this.renderApps()}
            {this.renderChart()}
            {this.role == "senior" && this.renderInfectionRiskAssessment()}
            <View style={{ height: 80 }} />

          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "red",
    marginVertical: 10,
    marginHorizontal: 140,
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
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: theme.colors.white,
    fontSize: 15,
    marginLeft: 5,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.colorPrimary,
  },
  subContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    marginTop: Platform.OS === "ios" ? 44 : 0
  },
  date: {
    fontFamily: theme.fonts.SFProSemibold,
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    marginTop: 20,
    marginLeft: 15,
    textTransform: "uppercase",
  },
  horizontalView: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  name: {
    fontFamily: theme.fonts.SFProBold,
    color: "rgba(255, 255, 255, 1)",
    fontSize: 32,
    marginLeft: 15,
    flexGrow: 1,
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
  todayActivityRoot: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 4,
  },
  todayActivity: {
    fontSize: 22,
    fontFamily: theme.fonts.SFProBold,
    color: theme.colors.black,
  },
  chart: {
    alignSelf: "center",
    marginLeft: 25,
    marginRight: 25,
  },
  headerLocStatsView: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  headerLocStatsTitle: {
    flex: 1,
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProBold,
    fontSize: 21,
    flexGrow: 1,
  },
  locStatsItemTitle: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    flexGrow: 1,
  },
  locStatsItemDetail: {
    color: "rgba(0,0,0, 0.48)",
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 13,
    flexGrow: 1,
    marginTop: 1,
  },
  locStatsItemLine: {
    height: 1,
    backgroundColor: "rgba(0,0,0, 0.20)",
    marginLeft: 100,
    marginTop: 12,
  },
  registeredSeniorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  navRightContainer: {
    flex: .35,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 15
  },
  alertOutCircle: {
    flex:1,
    position: "absolute",
    right: -10,
    top: -10,
    // width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  alertInnerCircle: {
    // width: 40,
    flex: 1,
    display:"flex",
    width: "auto",
    height: 16,
    margin:2,
    padding:2,
    borderRadius: 8,
    backgroundColor: theme.colors.red_shade_2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection:"column"
  },
  notificationText: {
    // height: 14,
    width: "auto",
    flex:3,
    flexWrap:"nowrap",
    color: theme.colors.white,
    fontFamily: theme.fonts.Roboto,
    fontSize: 10,
    lineHeight: 12,  
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


  tempText:{
    // margin: 2,
    textAlign:"center",
    paddingTop: 3,
    paddingRight:0,
    paddingBottom:1,
    // paddingLeft:1,
    // height: 18,
    width: "auto",
    // backgroundColor: theme.colors.red_shade_2,
    // borderWidth:2, borderColor:"#FFF",
    // borderRadius: 8,
    flex:1,
    display:"flex",
    flexDirection:"column",
    flexWrap:"nowrap",
    color:"#FFF",
    fontFamily: theme.fonts.Roboto,
    fontSize: 10,
    lineHeight: 12,
    position:"relative",
  },
  tempTextWrapper:{
    backgroundColor: theme.colors.red_shade_2,
    borderWidth: 2, borderColor: "#FFF",
    borderRadius: 12,
    flex:1,
    width: "auto",
    position: "absolute",
    top: -10, right: -10,
  },
  tasksContainer: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: "rgba(248, 248, 248, 0.92)",
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },


  iconStyle: {
    width: 24,
    height: 24
  },
  infoTextContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bg_grey,
    height: 52,
    margin: 8,
    padding: 8,
    justifyContent: 'center',
    borderRadius: 12
  },
  infoTextStyle: {
    letterSpacing: -0.08,
    fontSize: 13,
    lineHeight: 18,
    marginRight: 20,
    marginLeft: 8,
    fontFamily: theme.fonts.SFProRegular,
  },
  buttonsContainer: {
    flex: 1,
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginTop: 15
  },
  smsButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.colorPrimary
  }
})
