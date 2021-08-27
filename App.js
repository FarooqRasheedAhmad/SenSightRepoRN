import { AppConstants, StorageUtils, showMessage } from "./src/utils";
import { AppContainer, api, theme } from "./src";
import { Platform, StatusBar, Text, TouchableOpacity, View, DeviceEventEmitter,Alert } from "react-native";
import React, { Component } from "react";
import { AlertHelper } from './src/components'
import RNDialog from "react-native-dialog";
import Spinner from "react-native-loading-spinner-overlay";
import Snackbar from "react-native-snackbar";
import { VERSION } from "./version";
// import firebase from "react-native-firebase";
import ActivityScore from './src/screens/main/ActivityScore';
import Pushy from 'pushy-react-native';
import { ScrollView } from "react-native";
import { AuthService } from './src/Connecty/services';
import Connecty from './src/Connecty'

import { grantAllPermissions } from './src/utils/permissionHandler';
import { NavigationActions } from 'react-navigation';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

/**********************************
 * Pushy one time execution
 * c62f26b93e2276c89a6b58

RECEIVING
 {
  "title": "this is message title",
  "aps": {
    "badge": 1,
    "sound": "ping.aiff",
    "alert": "IOS specific message"
  },
  >>>> Android & IOS foreground
  "message": "{\"message\":\"MESSAGE JSON message\",\"title\":\"MESSAGE JSON title\"}"
}

 {
  "title": "this is message title",
  "aps": {
    "badge": 1,
    "sound": "ping.aiff",
    "alert": "IOS specific message"
  },
  >>>> Android & IOS foreground
  "message": JSON.stringify({message:"your message here", title:"your title here", params:"some other params"})
}

SENDING
{
    "to": "a6345d0278adc55d3474f5",
    >>>> Android & IOS foreground
    "data": {
        "message": "{\"message\":\"MESSAGE JSON message\",\"title\":\"MESSAGE JSON title\"}"
    },
    >>>>> IOS background message
    "notification": {
        "body": "IOS specific message",
        "badge": 1,
        "sound": "ping.aiff"
    }
}




 *  */
// Pushy.setNotificationHandler(true)
Pushy.setNotificationListener(async (data) => {
  console.log('Received notification: ' + JSON.stringify(data, 0, 2));

  var payload = {
    title: "Sensight Notification",
    message: data.message || "..."
  };

  if (data.message) {
    try {
      payload = JSON.parse(data.message);
    } catch (error) {
      console.log("No JSON received");
    }
  }

  console.log("payload: ", payload);
  // Display basic system notification

 if (Platform.OS === 'android') Pushy.notify(payload.title, payload.message, data);

  // Clear iOS badge count
  // LocalNotification()
  Pushy.setBadge && Pushy.setBadge(0);
});

// Set pushy Notification Icon
if (Platform.OS === 'android') Pushy.setNotificationIcon('ic_launcher');



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      alertId: "",
      inviteId: "",
      inviteTitle: "",
      inviteDescription: "",
      visibleUpdate: false,
      msg: "Hello world"
    };

    AuthService.init();
  }

async  componentDidMount() {
    // Start the Pushy service
    Pushy.listen();
  await this.initPushy().then(r=>{
      console.log("initPushy.result: ", r);
      // Snackbar.show({ text: `Notification Token Generated`, duration: Snackbar.LENGTH_SHORT, });
    }).catch(err=>{
      console.log("initPushy.error: ", err);
      Snackbar.show({ text: `Unexected Error while Generating Notification token`, duration: Snackbar.LENGTH_SHORT, });
    });

    PushNotificationIOS.addEventListener('localNotification', this.onLocalNotification);

    this.getPermissions();
  }

  async getPermissions() {
    const granted = await grantAllPermissions();

    // if (!granted) {
    //   // Alert.alert(
    //   //   "Permissions denied",
    //   //   "You need to grant required permissions to use this app properly!",
    //   //   [{ text: "Ok", onPress: () => console.log("OK") }],
    //   //   { cancelable: false }
    //   // );

    //   return this.getPermissions();
    // }

    return granted;
  }
  notificationNavigation=() =>{
    // call navigate for AppNavigator here:
    this.navigator &&
      this.navigator.dispatch(
        NavigationActions.navigate({ routeName: "AlertsScreen" })
      );
  }

  initPushy = async (props) => {
    // Register the user for push notifications
    await  Pushy.register().then(async (pushy_token) => {
      // Display an alert with device token
      // alert('Pushy device token: ' + pushy_token);
      console.log("pushy_token: ", pushy_token);

      StorageUtils.storeInStorage('pushy_token', `${pushy_token}`)
      // Snackbar.show({ text: `Notification Token generated (${pushy_token})`, duration: Snackbar.LENGTH_SHORT, });

      // Send the token to your backend server via an HTTP GET request
      //await fetch('https://your.api.hostname/register/device?token=' + pushy_token);

      // Succeeded, optionally do something to alert the user
    }).catch((err) => {
      // Handle registration errors
      Snackbar.show({ text: `Unable to generate notification Token`, duration: Snackbar.LENGTH_SHORT, });
      console.log("ERROR: ", err);
      this.setState({msg:JSON.stringify(err)})
      Snackbar.show({ text: `Unable to generate Notification Token : ${err.message || JSON.stringify(err)}`, duration: Snackbar.LENGTH_SHORT, });
    });

    // Read click on pushy notification
    Pushy.setNotificationClickListener(async (data) => {

      StorageUtils.storeInStorage('OpenAppNotiClik', 'yes');
      // Display basic alert
      console.log('Notification click: ', data.message);
     this.notificationNavigation()
      var payload = false;

      if (data.message) {
        try {
          payload = JSON.parse(data.message);
        } catch (error) {
          console.log("No JSON received");
        }
      }
      if (!payload) return;

      const { title, message, InviteId } = payload;

      if (message && title) {
        if (InviteId && title.startsWith("Added By")) {
          this.showDialog(title, message, payload);
        }
      }

    });

    // Register pushy to a specific topic
   await Pushy.isRegistered().then((isRegistered) => {
      if (isRegistered) {
        // Subscribe the user to a topic
        Pushy.subscribe('sensightglobal').then(() => {
          // Subscribe successful
          console.log('Subscribed to topic successfully: /topics/sensightglobal');
        }).catch((err) => {
          // Handle errors
          console.error(err);
        });
      }
    });

  }

  showDialog = (Title, Body, { InviteId, AlertId }) => {
    this.setState({
      visible: true,
      inviteId: InviteId,
      alertId: AlertId,
      inviteTitle: Title,
      inviteDescription: Body,
    });
  };

  onAction = async (type) => {
    this.setState({ loading: true, visible: false });
    try {
      const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
      const url = `${api.invites}/${this.state.inviteId}/${type}`;

      const response = await fetch(url, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json) {
          this.acknowledgeAlert(token);
          showMessage(`Request ${type === "Accept" ? "accepted" : "rejected"}`);
        }
      } else {
        this.setState({ loading: false });
        showMessage(
          `Error in ${type === "Accept" ? "accepting" : "rejecting"} invite`
        );
      }
    } catch (error) {
      this.setState({ loading: false });
      showMessage(
        `Error in ${type === "Accept" ? "accepting" : "rejecting"} invite`
      );
    }
  };

  acknowledgeAlert = async (token) => {
    try {
      const url = `${api.alerts}/${this.state.alertId}/Acknowledge`;
      const response = await fetch(url, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const json = await response.json();
        if (json) {
          this.setState({ loading: false });
        }
      } else {
        this.setState({ loading: false });
        showMessage(`Error in acknowledging alert`);
      }
    } catch (error) {
      this.setState({ loading: false });
      showMessage(`Error in acknowledging alert`);
    }
  };

  checkVersion = async () => {
    fetch(api.version)
      .then((response) => response.json())
      .then((result) => {
        if (result && result.versionNumber !== VERSION) {
          console.log('result.versionNumber ', result.versionNumber)
          this.setState({ visibleUpdate: true });
        }
      })
      .catch((e) => {
        showMessage("Error in gettin app version");
      });
  };


  onLocalNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;

    Alert.alert(
      'Local Notification Received',
      `Alert title:  ${notification.getTitle()},
      Alert subtitle:  ${notification.getSubtitle()},
      Alert message:  ${notification.getMessage()},
      Badge: ${notification.getBadgeCount()},
      Sound: ${notification.getSound()},
      Thread Id:  ${notification.getThreadID()},
      Action Id:  ${notification.getActionIdentifier()},
      User Text:  ${notification.getUserText()},
      Notification is clicked: ${String(isClicked)}.`,
      [
        {
          text: 'Dismiss',
          onPress: this.notificationNavigation(),
        },
      ],
    );
  };



  render() {

    // console.disableYellowBox = true;
    
    // return <ScrollView>
    //   <Text style={{padding:20, fontSize:20, color:"#000"}}>{this.state.msg}</Text>
    // </ScrollView>


    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.loading} />
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.colorPrimary} />
        <View style={{ flex: 1 }}>
          <AppContainer  ref={nav => {
          this.navigator = nav;
        }}/>
        </View>
        <AlertHelper />
        {/* Request Dialog */}
        <RNDialog.Container visible={this.state.visible} style={this.state.visible ? {} : { height: 0 }} >
          <RNDialog.Title>{this.state.inviteTitle}</RNDialog.Title>
          <RNDialog.Description>
            {this.state.inviteDescription}
          </RNDialog.Description>
          <RNDialog.Button label={"Reject"} onPress={() => this.onAction("Reject")} bold />
          <RNDialog.Button label={"Approve"} onPress={() => this.onAction("Accept")} bold />
          <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 8, }}>
            <TouchableOpacity onPress={() => this.setState({ visible: false })}>
              <Text style={{ color: Platform.OS === "ios" ? "#007ff9" : "#169689", fontSize: 18, }}>Ignore</Text>
            </TouchableOpacity>
          </View>
        </RNDialog.Container>

        {/* Update Dialog */}
        <RNDialog.Container visible={this.state.visibleUpdate} style={this.state.visibleUpdate ? {} : { height: 0 }}>
          <RNDialog.Title>Update</RNDialog.Title>
          <RNDialog.Description>Please update your app, A newer version is available.</RNDialog.Description>
          <RNDialog.Button label={"Cancel"} onPress={() => this.setState({ visibleUpdate: false })} />
        </RNDialog.Container>

        <ActivityScore />

        <Connecty />

      </View>
    );
  }
}
