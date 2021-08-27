import {
  AlertInviteNotification,
  AlertNotification,
  AlertUnreadNotification,
  SearchBar,
  ShowAllDialog,
  NavigationHeader
} from "../../../components";
import moment from "moment";
import { AppConstants, StorageUtils, convertDate,getTOffset } from "../../../utils";
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar, Platform } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import React, { Component } from "react";
import Dialog from "react-native-dialog";
import { HeaderBackButton } from "react-navigation-stack";
import RNPickerSelect from "react-native-picker-select";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import Swiper from "react-native-swiper";
import { TextInput } from "react-native-gesture-handler";
import { api } from "../../../api";
import { icons } from "../../../assets";
import { theme } from "../../../theme";

export class AlertsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ackAlerts: [],
      nonAckAlerts: [],
      inviteAlerts: [],
      mounted: true,
      currentPage: 0,
      spinner: false,
      ackAlertsDialog: false,
      nonAckAlertsDialog: false,
      addToTaskDialog: false,
      alertTitle: "",
      alertDescription: "",
      alertDetailDialog: false,
      alertList: false,
      alertData: { title: "", description: "", alertTime: "" },
      taskPriority: "1",
    };
    this.ackArrayHolder = [];
    this.nonAckArrayHolder = [];
    this.phone = null;

    this.alertId = null;
  }

  onIndexChanged = (index) => {
    if (!this.state.mounted) return;
    this.setState({ currentPage: index });
  };

  componentDidMount() {
    if (Platform.OS !== "ios") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor(theme.colors.colorPrimary);
    }
    this.getRole();
    this.getAlertsFromServer();
  }
  searchFilter = (text) => {
    const ackAlerts = this.ackArrayHolder.filter((item) => {
      return item.title.toLowerCase().includes(text.toLowerCase());
    });
    const nonAckAlerts = this.nonAckArrayHolder.filter((item) => {
      return item.title.toLowerCase().includes(text.toLowerCase());
    });
    this.setState({ ackAlerts, nonAckAlerts });
  };

  getRole = async () => {
    const role = await StorageUtils.getValue(AppConstants.SP.ROLE);
    this.setState({role})
  };

  marksAsReadAlerts = async () => {
        this.setState({ spinner: true });
        const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID);
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
        let uri = String(api.marksAsReadAlert).replace("{userId}", userId);
        fetch(uri,{
           method: "put",
           headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
          })
          .then((response) => { 
            this.showMessage("Marked as read alerts");
            if(response.ok) this.getAlertsFromServer()})
          .catch((error) => {
            this.setState({ spinner: false });
            this.showMessage("Error in Marks as read alerts");
          })
      }

  showMessage = (message) => {
    setTimeout(
      function () {
        Snackbar.show({ text: message, duration: Snackbar.LENGTH_SHORT, });
      }.bind(this),
      50
    );
  };

  getAlertsFromServer = async () => {
    // console.log("getAlertsFromServer()");
    
    this.setState({ spinner: true });
    // loadingAlerts
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    
    await fetch(api.alerts, {
      method: "get",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
    }).then(response=>{
      this.setState({ spinner: false });

      if (!response || !response.ok){
        this.showMessage("Error in getting alerts");
        return;
      }
      return response.json();
    }).then(json=>{
      // console.log("getAlertsFromServer: LOADED : ", json);

      const ackAlerts = [], nonAckAlerts = [], inviteAlerts = [];

      json.forEach((item) => {
        if (item.acknowledged) ackAlerts.push(item);
        else if (item.type === 3) inviteAlerts.push(item);
        else nonAckAlerts.push(item);
      });

      this.ackArrayHolder = ackAlerts;
      this.nonAckArrayHolder = nonAckAlerts;
      this.setState({ ackAlerts, nonAckAlerts, inviteAlerts });

    }).catch(err=>{
      this.setState({ spinner: false });
      this.showMessage("Error in getting alerts");
    });

  };

  renderAlertDialog = () => {
    // Set time in details dialog accodring to render list of alerts
    // const dateTime = moment(new Date(this.state.alertData.alertTime)).format('Do MMM, h:mm a')
    const dateTime = getTOffset(this.state.alertData.alertTime)

    return (
      <Dialog.Container visible={this.state.alertDetailDialog} key={"detail"}>
        <Dialog.Title style={{ textAlign: "center" }}>Alert Detail</Dialog.Title>
        <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
          <Text style={{ fontSize: 18 }}>{this.state.alertData.title}</Text>
          <Text style={{ fontSize: 16, color: "grey", paddingTop: 4 }}>{this.state.alertData.description}</Text>
          <Text style={{ fontSize: 16, color: "grey", paddingTop: 4 }}>{`${dateTime.offsetTime.format('ddd, Do MMM,h:mm a')}`}</Text>
        </View>
        <Dialog.Button label="Cancel" onPress={() => this.setState({ alertDetailDialog: false })} />
      </Dialog.Container>
    );
  };

  acknowledgeAlert = async (id) => {
    try {
      this.setState({ spinner: true });
      const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
      const url = `${api.alerts}/${id}/Acknowledge`;

      const response = await fetch(url, {
        method: "put",
        headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
      });

      if (response.ok) {
        const json = await response.json();

        const ackAlerts = [...this.state.ackAlerts];
        const nonAckAlerts = this.state.nonAckAlerts.filter((a) => {
          if (a.alertId !== json.alertId) return a;
        });

        this.state.nonAckAlerts.forEach((a) => {
          if (a.alertId == json.alertId) ackAlerts.unshift(a);
        });

        this.setState({ nonAckAlerts });
        this.setState({ ackAlerts });
        this.setState({ spinner: false });
      }
    } catch (error) {
      this.setState({ spinner: false });
      this.showMessage("Error in acknowledging alerts");
    }
  };

  renderUnreadAlerts = () =>
    this.state.nonAckAlerts.length > 0 ? (
      this.state.nonAckAlerts.slice(0, 7).map((alert) => {
        const user =
          this.state.role !== "senior"
            ? alert.senior
              ? { name: alert.senior.firstName, image: alert.senior.profileImage, phone: alert.senior.phoneNumber, }
              : { name: "", image: "", phone: "" }
            : alert.caretaker
              ? { name: alert.caretaker.firstName, image: alert.caretaker.profileImage, phone: alert.caretaker.phoneNumber, }
              : { name: "", image: "", phone: "" };
        return (
          <AlertUnreadNotification
            acknowledgeAlert={this.acknowledgeAlert}
            description={alert.description}
            alertTitle={alert.title}
            id={alert.alertId}
            time={alert.alertTime}
            role={this.state.role}
            addToTask={() => {
              // console.log("=======", alert.title, alert.alertId);
              this.props.navigation.navigate("AddTaskScreen", {
                taskName: alert.title.toString(),
                alertId: alert.alertId,
                fromAlerts: true,
              });
            }}
            user={user}
            type={alert.type}
          />
        );
      })
    ) : (
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1, }}>
          <Text style={{ color: theme.colors.grey_shade_1 }}>No new Alerts</Text>
        </View>
      );

  renderReadAlerts = (alerts) => {
    return alerts.map((alert) => (<>
        <AlertNotification
          checked={true}
          message={alert.title}
          time={alert.alertTime}
          onPress={() => {
            this.setState({ alertDetailDialog: true, alertData: alert, });
          }}
        />
      </>));
    }

  render() {
    const taskPriorityItems = [
      { label: "Low", value: "1" },
      { label: "Medium", value: "2" },
      { label: "High", value: "3" },
    ];

    // console.log("AlertsScreen()");
    

    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <NavigationHeader title={'Alerts'} leftText={'Back'} navigation={this.props.navigation} />
          <View style={{flex: 1, backgroundColor: 'white'}}>
          {this.state.spinner && <View style={{padding:50}}><Spinner visible={this.state.spinner} /></View>}
          
          <SearchBar searchFilter={this.searchFilter} />
          {this.renderAlertDialog()}

          <ShowAllDialog title={"Previous Alerts"} showDialog={this.state.ackAlertsDialog} hideDialog={() => { this.setState({ ackAlertsDialog: false }); }}>
            <FlatList
              data={this.state.ackAlerts}
              keyExtractor={(item, i) => item.alertId}
              renderItem={({ item }) => (<AlertNotification checked={true} message={item.title} time={item.alertTime} />)}
            />
          </ShowAllDialog>

          <ShowAllDialog title={"New Alerts"} showDialog={this.state.nonAckAlertsDialog} hideDialog={() => { this.setState({ nonAckAlertsDialog: false }); }}>
            <FlatList
              data={this.state.nonAckAlerts}
              // keyExtractor={(item, i) => item.alertId}
              renderItem={({ item }) => (
                <AlertNotification
                  checked={false}
                  message={item.title}
                  time={item.alertTime}
                  onPress={() => { this.setState({ alertDetailDialog: true, alertData: item, }); }}
                />
              )}
            />
          </ShowAllDialog>

          <ScrollView>
            {this.state.inviteAlerts.length > 0 ? (
              <>
                <Text style={{ ...styles.heading, margin: 10 }}>Invite Alerts</Text>
                {this.state.inviteAlerts.map((item) => (
                  <AlertInviteNotification
                    title={item.title}
                    description={`${item.description} at ${moment(new Date(item.alertTime)).format('h:mm a, Do MMM, YYYY')}`}
                    user={{
                      name: `${item.senior.firstName}  ${item.senior.lastName ? item.senior.lastName : ''}`,
                      image: item.senior.profileImage,
                    }}
                    inviteId={item.inviteId}
                    alertId={item.alertId}
                    alertTime={item.alertTime}
                    rerenderAlerts={this.getAlertsFromServer}
                  />
                ))}
              </>
            ) : null}

            <View style={styles.row}>
              <Text style={styles.heading}>New Alerts</Text>
              <TouchableOpacity onPress={() => this.marksAsReadAlerts()} >
                <Text style={(styles.smallHeading, { color: theme.colors.colorPrimary })}>Mark all as read</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ alertList: !this.state.alertList })} >
                <Text style={(styles.smallHeading, { color: theme.colors.colorPrimary })}>See All</Text>
              </TouchableOpacity>
            </View>

            {this.state.alertList ? (
              <ScrollView style={{ height: Dimensions.get("window").height / 2 - 150 }}>
                <View style={{ marginLeft: 10 }}>{this.renderReadAlerts(this.state.nonAckAlerts)}</View>
              </ScrollView>
            ) : (
                <Swiper
                  horizontal
                  dotColor={"transparent"}
                  activeDotColor={"transparent"}
                  style={{ height: 230 }}
                  showsButtons={false}
                  loop={false}
                  onIndexChanged={(index) => this.onIndexChanged(index)}
                  ref={(ref) => { this.swiper = ref; }}
                >
                  {this.renderUnreadAlerts()}
                </Swiper>
              )}


            <View style={styles.row}><Text style={styles.heading}>Acknowledged</Text></View>
            <ScrollView style={{}}>
              <View style={{ marginLeft: 10 }}>{this.renderReadAlerts(this.state.ackAlerts)}</View>
            </ScrollView>
          </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.colorPrimary
  },
  subContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 44 : 0,
    backgroundColor: theme.colors.colorPrimary
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 12,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    borderRadius: 10,
    backgroundColor: "rgba(142, 142, 147, 0.12)",
    marginTop: 20,
    paddingLeft: 10,
  },
  heading: {
    fontFamily: theme.fonts.SFProBold,
    fontSize: 22,
    letterSpacing: 0.35,
    lineHeight: 28,
  },
  smallHeading: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  card: {
    backgroundColor: theme.colors.white,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 46,
    elevation: 5,
    borderRadius: 12,
    marginLeft: 10,
    marginRight: 10,
  },
  text: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: theme.colors.black,
    opacity: 0.6,
    margin: 12,
  },
  title: {
    textAlign: "center",
    marginLeft: Dimensions.get("window").width / 2 - 80,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    lineHeight: 22,
  },
});
