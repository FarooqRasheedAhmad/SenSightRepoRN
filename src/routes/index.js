import * as React from "react";
import { theme } from "../theme";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { icons } from "../assets";

import {
  AddTaskScreen,
  Alergies,
  AlertsScreen,
  AssesmentScreen,
  CareCircle,
  CaregiverDetailScreen,
  CodeVerificationRegistration,
  ComingSoon,
  DeviceReading,
  Devices,
  ManuallyReadings,
  EditProfile,
  FDAStaticsScreen,
  ForgotPassword,
  GeofenceListScreen,
  HeartRateVariationScreen,
  HomeScreen,
  InfectionAssessment,
  Location,
  Login,
  ManualDataInputScreen,
  Medication,
  TaskForm,
  PatientDairyScreen,
  PrivacySettings,
  PrivacyPolicy,
  ResetPassword,
  SeniorHome,
  Signup,
  Splash,
  StatisticsScreen,
  StatsDetails,
  Tasks,
  UpdatePassword,
  Walkthrough,
  Screening,
  ProfileScreen,
  WidgetsSettings,
  StatisticAlerts,
  SetAlertPreferences,
  DeviceInfo,
  VayyarConnect,
  FitbitConnect,
  BiostrapConnect,
  ServicesScreen,
  HealthSuiteScreen,
  DeviceUnitsScreen,
  Apps,
  Streamer,
  Assessments,
  PatientOverviewList,
  PatientDiaryNoteForm,
  ScheduleCall,
  ScheduleForm,
  ScheduleCallDetails,
  Chat,
  ChatList,
} from "../screens";
import { fromBottom } from "react-navigation-transitions";
import { createStackNavigator, TransitionPresets } from "react-navigation-stack";
import { NavigationHeader } from '../components'

const handleTransition = ({ scene, scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];
  return fromBottom(700);
};

const BackButton = ({ navigation, onPress, leftText }) => (
  <TouchableOpacity
    style={{ zIndex: 999, flexDirection: "row", alignItems: 'center', paddingLeft:10 }}
    onPress={() => onPress && onPress() || navigation.goBack()}
  >
    <Image source={icons.arrow_blue} style={{ tintColor: 'white' }} />
    <Text style={{ marginLeft: 5, color: theme.colors.white, fontSize: 17,}}>{leftText || 'Back'}</Text>
  </TouchableOpacity>
)

const default_headerProps = (props, options) => {
  const { title, headerShown, headerTintColor, backgroundColor, headerTitleStyle } = options;
  // console.log("======== props: ", props);
  if (!headerShown) return { headerShown:false };
  const { navigation, screenProps, navigationOptions } = props;
  // const { routeName } = navigation.state.routes[navigation.state.index];
  // title: navigation.getParam('otherParam', 'A Nested Details Screen'),


  const obj = {
    // title,
    headerShown: headerShown==true,
    headerStyle: {
      backgroundColor: backgroundColor || theme.colors.colorPrimary,
    },
    headerTintColor: headerTintColor || '#FFFF',

    headerLeft: <BackButton navigation={navigation} />,
    // headerTitle: <Text style={{ textAlign: "center" }}>{navigationOptions?.title || title}</Text>,
    headerTitle: navigationOptions?.title || title,
    headerRight: <Text />,
    // headerBackTitle: "Hello world",
    // headerBackImage: null
  
    
    // headerTransparent: false,
    // headerBackground: () => (
    //   <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
    // ),
    headerTitleStyle: {
      // fontWeight: 'bold',
      textAlign:"center",
      fontSize: 17,
      color: "#FFFFFF"
    },
    // headerTitle: props => <LogoTitle {...props} />,
    // headerRight: () => (
    //   <Button
    //     onPress={() => alert('This is a button!')}
    //     title="Info"
    //     color="#fff"
    //   />
    // ),

  }
  // if (headerShown) Object.assign(obj, { headerLeft});;
  if (title) Object.assign(obj, {title});;
  if (headerTitleStyle) Object.assign(obj, { headerTitleStyle });;
  return obj;
}

export const AppNavigator = createStackNavigator(
  {
    // Splash: { screen: Splash, navigationOptions: (navProps)=>(default_headerProps({})) },
    Splash: { screen: Splash, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    Walkthrough: { screen: Walkthrough, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    SignupScreen: { screen: Signup, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    Login: { screen: Login, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    ForgotPassword: { screen: ForgotPassword, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    ResetPassword: { screen: ResetPassword, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    CodeVerificationRegistration: { screen: CodeVerificationRegistration, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    HomeScreen: { screen: HomeScreen, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    SeniorHome: { screen: SeniorHome, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    AlertsScreen: { screen: AlertsScreen, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    Location: { screen: Location, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    DevicesScreen: { screen: Devices, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    ManuallyReadingsScreen: { screen: ManuallyReadings, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    DeviceReadingScreen: { screen: DeviceReading, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    StatisticAlerts: { screen: StatisticAlerts, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    EditProfileScreen: { screen: EditProfile, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    /////
    DeviceInfo: { screen: DeviceInfo, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    VayyarConnect: { screen: VayyarConnect, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    FitbitConnect: { screen: FitbitConnect, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    BiostrapConnect: { screen: BiostrapConnect, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    ServicesScreen: { screen: ServicesScreen, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    HealthSuiteScreen: { screen: HealthSuiteScreen, navigationOptions: (navProps) => (default_headerProps(navProps, {})) },
    Apps: { screen: Apps, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    Streamer: { screen: Streamer, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    //////
    ProfileScreenTab: { screen: ProfileScreen, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    CareCircleScreen: { screen: CareCircle, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    AlergiesScreen: { screen: Alergies, navigationOptions: (navProps) => (default_headerProps(navProps, {  })) },
    MedicationScreen: { screen: Medication, navigationOptions: (navProps) => (default_headerProps(navProps, {  })) },
    AssesmentScreen: { screen: AssesmentScreen, navigationOptions: (navProps) => (default_headerProps(navProps, {  })) },
    WidgetsSettings: { screen: WidgetsSettings, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    SetAlertPreferences: { screen: SetAlertPreferences, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    DeviceUnitsScreen: { screen: DeviceUnitsScreen, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },

    TasksScreen: { screen: Tasks, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    StatisticsScreen: { screen: StatisticsScreen, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    StatsDetails: { screen: StatsDetails, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    FDAStaticsScreen: { screen: FDAStaticsScreen, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    ScreeningScreen: { screen: Screening, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    InfectionAssesmentScreen: { screen: InfectionAssessment, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    UpdatePasswordScreen: { screen: UpdatePassword, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    GeofenceListScreen: { screen: GeofenceListScreen, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    CaregiverDetailScreen: { screen: CaregiverDetailScreen, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    ComingSoonScreen: { screen: ComingSoon, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    ManualDataInputScreen: { screen: ManualDataInputScreen, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    HeartRateVariationScreen: { screen: HeartRateVariationScreen, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    PatientDairyScreen: { screen: PatientDairyScreen, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    TaskForm: { screen: TaskForm, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    PrivacySettings: { screen: PrivacySettings, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    PrivacyPolicy: { screen: PrivacyPolicy, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    AddTaskScreen: { screen: AddTaskScreen, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    PatientDiaryNoteForm: { screen: PatientDiaryNoteForm, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    Assessments: { screen: Assessments, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    PatientOverviewList: { screen: PatientOverviewList, navigationOptions: (navProps) => (default_headerProps(navProps, { })) },
    ///
    ScheduleCall: { screen: ScheduleCall, navigationOptions: (navProps) => (default_headerProps(navProps, { }))},
    ScheduleForm: { screen: ScheduleForm, navigationOptions: (navProps) => (default_headerProps(navProps, { }))},
    ScheduleCallDetails: { screen: ScheduleCallDetails, navigationOptions: (navProps) => (default_headerProps(navProps, { }))},
    Chat: { screen: Chat, navigationOptions: (navProps) => (default_headerProps(navProps, { }))},
    ChatList: { screen: ChatList,navigationOptions: (navProps) => (default_headerProps(navProps, { }))}
  },
  {
    // headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      // ...TransitionPresets.ModalSlideFromBottomIOS,
    },
  }
  // {
  //   transitionConfig: (nav) => handleTransition(nav),
  // }
);
