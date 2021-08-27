import {
  Platform,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppConstants, StorageUtils, Utils, watchPaired,getGeoCodePosition } from "../../utils";
import { Divider, ListItem } from "react-native-elements";
import { Map, PreviousLocations, NavigationHeader } from "../../components";
import React, { Component } from "react";
import BackgroundGeolocation from "react-native-background-geolocation";
import { HeaderBackButton } from "react-navigation-stack";
import { Info } from "../../components";
import RNLocation from "react-native-location";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { icons } from "../../assets";
import moment from "moment";
import { theme } from "../../theme";
// import { getTrackingStatus } from 'react-native-tracking-transparency';

export class Location extends Component {
  constructor(props) {
    super(props);
    // this.lastLocationName = this.props.navigation.getParam( "lastLocationName", "" );
    // this.lastLocationDetail = this.props.navigation.getParam( "lastLocationDetail", "" );
    this.latitude = this.props.navigation.getParam("latitude", 0);
    this.longitude = this.props.navigation.getParam("longitude", 0);
    this.seniorId = this.props.navigation.getParam("seniorId", "");
    this.geofenceLimit = this.props.navigation.getParam("geofenceLimit", 0);
    this.noGoAreas = this.props.navigation.getParam("noGoAreas", []);
    this.role = this.props.navigation.getParam("role", "senior");
    this.isShowRideRequest = this.props.navigation.getParam("isShowRideRequest", true);
    this.state = {
      checkWatchFirstTime: true,
      currentLatitude: 0,
      currentLongitude: 0,
      spinner: false,
      watchIsReachable: true,
      previousLocationPointer: [],
      region: { longitude: this.longitude, latitude: this.latitude },
      locations: [],
      allLocations: [],
      lastLocationName: '',
      lastLocationDetail: ''
    };
    this.baseLatitude = 0;
    this.baseLongitude = 0;
    this.locationPosted = false;
  }

  scroll = new Animated.Value(0);
  headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, 56), -1);

  componentDidMount() {
    StatusBar.setBarStyle("dark-content", true);
    if (Platform.OS !== "ios") {
      // StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor(theme.colors.colorPrimary);
    }

    this.setState({ spinner: false });
    setTimeout(() => {
      this.getSeniorLocationFromServer();
    }, 1000)
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      setTimeout(() => {
        this.getSeniorLocationFromServer();
      }, 1000)
      setInterval(() => {
        this.getSeniorLocationFromServer();
      }, 100000)
    })

    setInterval(() => {
      this.getSeniorLocationFromServer();
    }, 100000)

     // This handler fires whenever bgGeo receives a location update.
     BackgroundGeolocation.onLocation(this.onLocation, this.onError);
  }

  onLocation = (location) => {
    this.latitude = location && location["coords"].latitude || this.latitude
    this.longitude = location && location["coords"].longitude || this.longitude
  }

  onError = (error) => {
    console.warn('[location] ERROR -', error);
  }

  getLocation = () => {
    return BackgroundGeolocation.getCurrentPosition({
      timeout: 30, // 30 second timeout to fetch location
      persist: true, // Defaults to state.enabled
      maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
      desiredAccuracy: 10, // Try to fetch a location with an accuracy of `10` meters.
      samples: 3, // How many location samples to attempt.
      extras: {
        // Custom meta-data.
        route_id: 123,
      },
    }).then((currentlocation) => {
      return currentlocation
    })
  }

  updateLocationNow = async () => {
    // const trackingStatus = await getTrackingStatus();
    // if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
        // enable tracking features
    this.setState({ spinner: true })
    const currentLocation = await this.getLocation()
    const lati = currentLocation["coords"].latitude || this.latitude
    const longi = currentLocation["coords"].longitude || this.longitude 
    this.postCurrentLocation(lati, longi)
    // }
    // else  
    // {Snackbar.show({ text: "Please Turn on Auto Tracking from mobile setting",duration: Snackbar.LENGTH_SHORT,})};
  }

  postCurrentLocation = async (latitude, longitude) => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
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
            this.setState({ spinner: false })
            this.getSeniorLocationFromServer()
            console.log("Location is saved in the Background", latitude, longitude)
          }
        })
        .catch((error) => {
          this.setState({ spinner: false })
          console.log("Error in posting location ", error)
        })
  }

  getSeniorLocationFromServer = async () => {
    this.setState({ spinner: true });
    const role = await StorageUtils.getValue(AppConstants.SP.ROLE);
    const userId =
      role === "senior"
        ? await StorageUtils.getValue(AppConstants.SP.USER_ID)
        : this.seniorId;
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);

    fetch(api.seniorLocations + userId + '?NoRecord=432', {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Locations response not OK!");
          this.setState({ spinner: false });
          this.showError();
          return;
        }
        return response.json();
      })
      .catch((error) => {
        this.setState({ spinner: false });
        console.log("Error in locations response");
        this.showError();
      })
      .then((locations) => {
        this.setState({ spinner: false });
        if (locations !== undefined && locations.length > 0) {
          console.log('locations ', locations)
          const lastLocation = locations[0]

          getGeoCodePosition(locations, (parsedLocation) => {
            if (parsedLocation && parsedLocation[0] && parsedLocation[0].name){
              this.setState({
                lastLocationName: parsedLocation[0].name,
                lastLocationDetail: parsedLocation[0].detail,
              });
            }
          });
          if (lastLocation) {
            this.geofenceLimit = lastLocation.geofenceLimit;
            this.baseLatitude = lastLocation.baseLatitude;
            this.baseLongitude = lastLocation.baseLongitude;
          }
          this.setState({
            locations: locations,
          })
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ spinner: false })
        this.showError();
      })
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners()
    try {
      const getSeniorLocation = this.props.navigation.getParam(
          "getSeniorLocation",
          () => {}
      );
      getSeniorLocation();
      this.locationSubscription();
    } catch (error) {}
  }

  showError = () => {
    this.setState({ spinner: false });
    Snackbar.show({
      text: theme.strings.call_fail_error,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  previousLocationPointers = (item, key) => {
    if (this.state.previousLocationPointer.find((e) => e.key === key)) {
      return;
    }
    const previousLocationPointer = {
      key,
      longitude: item.longitude,
      latitude: item.latitude,
      color: "#FF8C00",
      title: item.name + " • " + item.detail.split("• ")[0],
      timeAgo: item.detail.split("• ")[1],
    }

    this.setState({
      previousLocationPointer: [
        previousLocationPointer,
      ],
      region:{ ...this.state.region,longitude: item.longitude, latitude: item.latitude }
    })
  };

  render() {

    return (<>
     
      <View style={styles.parentContainer}>

      <NavigationHeader title={''} leftText={'Back'} navigation={this.props.navigation} style={{paddingTop: Platform.OS === "ios"? 35:15}} /> 

        <Spinner visible={this.state.spinner} />
        <Animated.ScrollView
          scrollEventThrottle={5}
          showsVerticalScrollIndicator={false}
          style={{ zIndex: 0, backgroundColor: "transparent" }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scroll } } }],
            { useNativeDriver: true }
          )}
        >
          <Animated.View
            style={{
              height: Dimensions.get("window").height * 0.665,
              width: "100%",
              transform: [{ translateY: Animated.multiply(this.scroll, 0.8) }],
            }}
          >
            <Map
              coords={this.state.region}
              baseCoords={{
                longitude: this.baseLongitude,
                latitude: this.baseLatitude,
              }}
              geofence={this.geofenceLimit}
              seniorId={this.seniorId}
              noGoAreas={this.noGoAreas}
              isWatchReachable={this.state.watchIsReachable}
              onAddNoGoAreas={(areas) => {
                this.noGoAreas = areas;
              }}
              navigation={this.props.navigation}
              previousLocationPointer={this.state.previousLocationPointer}
              unpinPreviousLocations={() =>
                this.setState({ previousLocationPointer: [] })
              }
              getSeniorLocations={this.getSeniorLocationFromServer}
            />
          </Animated.View>

          <View>
            <View style={styles.dialogBg}>
              <View style={styles.headerContainer}>
                <View style={{ width: '55%', flexDirection: 'row' }}>
                  <Image source={icons.location_circle} style={{ width: 36, height: 36, marginRight: 15 }} />
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={styles.titleTextStyle}>Last Location</Text>
                    <Text numberOfLines={1} style={{ fontSize: 14, maxWidth: '86%', color: theme.colors.grey_shade_1 }}>{this.state.lastLocationDetail}</Text>
                  </View>
                </View>
                {this.role === "senior" && <View style={{ maxWidth: '45%', alignItems: 'flex-end', zIndex: 999 }}>
                  <TouchableOpacity
                      onPress={this.updateLocationNow}
                      activeOpacity={0.6}
                      style={styles.smsButton}
                    >
                      <Text style={[theme.palette.buttonText, { color: theme.colors.colorPrimary, fontSize: 12 }]}>Update Location Now</Text>
                    </TouchableOpacity>
                </View>}
              </View> 
              
              <Divider />
              <Divider /><Divider />

              <PreviousLocations
                locations={this.state.locations}
                setPreviousLocationPointer={this.previousLocationPointers}
                allLocations={this.state.allLocations}
              />

              {this.isShowRideRequest &&<TouchableOpacity
                activeOpacity={0.8}
                style={[
                  theme.palette.button,
                  { margin: 15, backgroundColor: theme.colors.grey_shade_3 },
                ]}
                onPress={() => {}}
              >
                <Text style={theme.palette.buttonText}>
                  {theme.strings.ride_request}
                </Text>
              </TouchableOpacity>}
            </View>
          </View>
        </Animated.ScrollView>
        <Animated.View
          style={{
            width: "100%",
            position: "absolute",
            transform: [
              {
                translateY: this.headerY,
              },
            ],
            flex: 1,
            backgroundColor: "transparent",
          }}
        />
      </View>
    </>)
  }

  static navigationOptions = ({ navigation }) => {
    const getSeniorLocation = navigation.getParam(
      "getSeniorLocation",
      () => {}
    );

    return {
      headerBackTitle: null,
      title: "Locations",
      headerTintColor: theme.colors.white,
      headerStyle: {
        backgroundColor: theme.colors.colorPrimary,
      },
      headerTitleStyle: {
        fontSize: 22,
      },
      headerRight: () => (
        <Info type="location" containerStyle={{ marginRight: 8 }} color={theme.colors.white} />
      ),
      headerLeft: () => (
        <HeaderBackButton
          tintColor={theme.colors.white}
          onPress={() => {
            getSeniorLocation();
            navigation.goBack();
          }}
        />
      ),
    }
  }
}


const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    height: "100%",
    width: "100%",
  },
  headerLocStatsView: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: "white",
  },
  image: {
    alignSelf: "center",
  },
  locStatsItemTitle: {
    color: "rgba(0,0,0, 0.48)",
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 14,
    flexGrow: 1,
  },
  locItemDetail: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProBold,
    fontSize: 21,
    flexGrow: 1,
  },
  locStatsItemDetail: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 20,
  },
  locStatsItemLine: {
    height: 1,
    backgroundColor: "rgba(0,0,0, 0.20)",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 12,
  },
  dialogBg: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 1, height: 15 },
    // paddingTop: 15,
  },
  smsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.colorPrimary,
    height: 40,
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15
  },
  titleTextStyle: {
    fontSize: 16,
    maxWidth: '86%',
    paddingRight: 0
  }
})
