import { AppConstants, StorageUtils, getAppUsers, showMessage, } from "../../../utils";
import { Avatar, Icon, Button, Divider, ListItem, } from "react-native-elements";
import Icons from 'react-native-vector-icons/FontAwesome';
import { ConfirmationDialog, NoDataState, PrimaryCheckbox, Row, Col } from "../../../components";
import { ImageBackground, Linking, RefreshControl, ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import { api } from "../../../api";
import { theme } from "../../../theme";
import { useFetch } from "../../../hooks";
import { AuthService } from '../../../Connecty/services';
import { EventRegister } from 'react-native-event-listeners'
import { set } from "react-native-connectycube/lib/cubeConfig";
import { icons } from "../../../assets";


export const CaregiverDetailScreen = (props) => {
  const id = props.navigation.getParam("id", null);
  const fetchUsers = props.navigation.getParam("fetchUsers", () => { });
  const refreshSOS = props.navigation.getParam("refreshSOS", () => { });
  const url = `${api.caregiverDetail}/${id}`;

  const profileData = props.navigation.getParam('profileData');

  const { data, error, loading, fetchData } = useFetch(url);
  const [refreshing, setRefreshing] = useState(false);

  const [loadingRemove, setLoadingRemove] = useState(false);
  const [dialog, setDialog] = useState(false);

  const [user, setUser] = useState(["", ""]);
  const [userPackageModule, setUserPackageModule] = useState(null);
  const [videoCall, setVideoCall] = useState(false);
  const [audioCall, setAudioCall] = useState(false);
  const [role, setRole] = useState("")

  useEffect(() => {
    getAppUsers((u) => {
      setUser(u);
    });
  }, []);

  useEffect(() => {

    const getPackgeModule = async () => {

      const role = await StorageUtils.getValue(AppConstants.SP.ROLE);
      setRole(role)
      await StorageUtils.getValue('getPackageModuleResponse').then(getPackageModuleResponse => {
        if (getPackageModuleResponse) {
          console.log("getPackageModuleResponse:", JSON.parse(getPackageModuleResponse));
          setUserPackageModule(JSON.parse(getPackageModuleResponse).getModuleDetail)
        }
      })
      if (userPackageModule != null) {
        for (let i = 0; i < userPackageModule.length; i++) {
          userPackageModule[i].moduleTag == "VCall" ? setVideoCall(true) : userPackageModule[i].moduleTag == "ACall" ? setAudioCall(true) : ''
          if (videoCall && audioCall) break;
        }
      }

    }
    getPackgeModule()

  }, [userPackageModule, setUserPackageModule, setVideoCall, setVideoCall, setRole]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [refreshing]);

  if (error) {
    showMessage("Error!", "long");
    return <NoDataState text={"Error: " + error} />;
  }

  if (loading) {
    return <NoDataState text="Loading..." />;
  }

  const removeCaregiver = async () => {
    setDialog(false);
    setLoadingRemove(true);
    const url = api.baseURL + `Seniors/${id}`;
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);

    fetch(url, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          setLoadingRemove(false);
          showMessage("Error!", "long");
          return;
        }
        return response.json();
      })
      .catch((error) => {
        setLoadingRemove(false);
        showMessage("Error!", "long");
      })
      .then((data) => {
        setLoadingRemove(false);
        props.navigation.goBack();
        fetchUsers();
        refreshSOS();
      });
  };

  const renderItem = (title, icon, topDivider) => (
    <ListItem
      topDivider={topDivider}
      title={title}
      containerStyle={{ width: "100%" }}
      leftIcon={{ name: icon, color: theme.colors.colorPrimary }}
      bottomDivider
    />
  );

  const renderContactButton = (firstName, type, phone) => (
    <Button
      title={firstName && firstName.substr(0, 7)}
      icon={{ name: type, color: "white" }}
      // titleStyle={styles.contactTitle}
      // buttonStyle={{ ...styles.contactButton, backgroundColor: type === "sms" ? "#03a9f4" : "#66bb6a", }}
      buttonStyle={{ paddingHorizontal: 15, borderRadius: 10, backgroundColor: type === "sms" ? "#2550EA" : "#34C759", }}
      raised
      onPress={type === "sms" ? sendSMS(firstName, phone) : makeCall(phone)}
    />
  );

  const renderProfileImage = ({
    firstName,
    lastName,
    profileImage,
    isOnline,
  }) => (
    <View style={styles.imageRoot}>
      <ImageBackground
        style={styles.image}
        source={{
          uri: profileImage
            ? profileImage
            : "https://www.uni-hildesheim.de/sustainability/wp-content/uploads/2018/05/platzhalter-bild.png",
        }}
      >
        <View style={styles.imageInner}>
          <View style={styles.header}>
            <Button
              type="clear"
              title="Back"
              titleStyle={styles.backButton}
              containerStyle={{ marginTop: 32 }}
              icon={{
                name: "arrow-back",
                color: "white",
                size: 28,
              }}
              onPress={() => props.navigation.goBack()}
            />
          </View>
          <View style={{ alignSelf: "center", alignItems: "center", paddingHorizontal: 15 }}>
            <Text style={styles.name}>{firstName && firstName + " " + lastName && lastName}</Text>
            <Text style={styles.status}>
              <Text>
                status:
                {isOnline ? "    online" : "    offline"}
              </Text>
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  const makeCall = (phone) => () => {
    if (phone) {
      RNImmediatePhoneCall.immediatePhoneCall(phone);
    } else {
      showMessage("No phone number given", "short");
    }
  };

  const chatNavigation = args => {
    props.navigation.navigate('Chat')
}


  const sendSMS = (name, phone) => () => {
    const msgBody = `Hi ${name}, \n`;
    if (phone) {
      if (Platform.OS === "ios") Linking.openURL(`sms:${phone}&body=${msgBody}`);
      else Linking.openURL(`sms:${phone}?body=${msgBody}`);
    } else {
      showMessage("No phone number given", "short");
    }
  };


  const makeVideoCall = args => {
    console.log("makeVideoCall()");
    if (!AuthService.isLoggedIn) {
      alert("You are not logged into VDO server")
      return;
    }
    EventRegister.emit('onMakeConnectyVideoCall', { ...profileData })
  }

  const makeAudioCall = args => {
    console.log("makeAudioCall()");
    if (!AuthService.isLoggedIn) {
      alert("You are not logged into Audio server")
      return;
    }
    EventRegister.emit('onMakeConnectyAudioCall', { ...profileData })
  }




  if (data) {
    const { firstName, lastName, profileImage, isOnline, profileDescription, email, phone, address, priority, } = data;

    return (
      <View style={styles.root}>
        {renderProfileImage(data)}
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
          <View style={{ alignItems: "center", flex: 1 }}>

            <View style={{ flexDirection: 'row', width: '100%', backgroundColor: "#f5f5f5", alignItems: 'center' }}>
              <Text style={styles.callHeading}>CALL / MESSAGE</Text>
              <Image source={icons.info} />
            </View>

            <Divider style={{ width: "100%" }} />


            {/* <View style={styles.contactRoot}>
                <Row style={{ marginHorizontal: 10 }}>
                  <Col flex="50%">{renderContactButton('Call', "call", phone)}</Col>
                  <Col flex="auto">{renderContactButton('Message', "sms", phone)}</Col>
                  <Col flex="30%"><Button disabled={true} onPress={() => makeAudioCall()} title="Voice Call" /></Col>
                </Row>
              </View> */}

            {/* <Text>callerId : {profileData.callerId}</Text> */}

            <View style={styles.contactRoot}>
              {renderContactButton('CALL', "call", phone)}
              {renderContactButton('MESSAGE', "sms", phone)}

            </View>
            {/* <View style={{ marginBottom:15 }}>
                <Button title="Video Call"
                  // icon={{ name: type, color: "white" }}
                  // titleStyle={styles.contactTitle} buttonStyle={{ ...styles.contactButton, }}
                  buttonStyle={{borderRadius:10}}
                  raised
                  onPress={() => makeVideoCall()}
                />
              </View> */}

            <View style={{ flexDirection: 'row', width: '100%', backgroundColor: "#f5f5f5", alignItems: 'center' }}>
              <Text style={styles.callHeading}>VIRTUAL VISIT</Text>
              <Image source={icons.info} />
            </View>
            <Divider style={{ width: "100%" }} />

            <View style={{
              flexDirection: "row",
              width: "100%",
              paddingVertical: 20,
              paddingHorizontal: 10,
              backgroundColor: "white",
              justifyContent: 'space-between'
            }}>

              <Button title="AUDIO VISIT" buttonStyle={{ borderRadius: 10, backgroundColor: '#F29812' }} raised
                disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn || (role == "senior" && !audioCall)}
                icon={{ name: 'call', color: "white", size:20 }} // icon={{ name: type, color: "white" }}
                onPress={() => makeAudioCall()}
              />

              <Button title="CHAT"
                buttonStyle={{ borderRadius: 10, backgroundColor: "#2550EA", }} raised
                disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn}
                icon={{ name: 'chat', color: "white" , size:20}}
                onPress={() => chatNavigation()}
              />

              <Button title="VIDEO VISIT" buttonStyle={{ borderRadius: 10, backgroundColor: '#BA7001' }} raised
                disabled={!profileData || !profileData.callerId || !AuthService.isLoggedIn || (role == "senior" && !videoCall)}
                // icon={{ name: "fa-camera", color: "white" }}
                icon={<Icons name="video-camera" size={15} color="white" style={{ marginRight: 5 }} />}
                onPress={() => makeVideoCall()}
              />
            </View>

            {/* <Avatar
              title={firstName.charAt(0) + lastName.charAt(0)}
              source={{ uri: profileImage }}
              rounded
              size={200}
              containerStyle={{ marginVertical: 8 }}
            />
            <ListItem
              title={firstName + " " + lastName}
              titleStyle={styles.name}
              containerStyle={{ width: "100%" }}
              rightTitle={isOnline ? "active" : "not active"}
            />
            */}
            {profileDescription ? (
              <>
                <Text style={styles.heading}>DESCRIPTION</Text>
                <Text style={styles.description}>{profileDescription}</Text>
              </>
            ) : null}

            <Text style={styles.heading}>DETAIL</Text>

            {renderItem(email, "email", true)}
            {renderItem(phone, "phone")}
            {renderItem(address, "home")}

            <PrimaryCheckbox value={priority === 1} id={id} fetchUsers={() => fetchUsers()} />
            <TouchableOpacity onPress={() => {
              props.navigation.navigate("TaskForm", { seniorId: id, });
            }}
              style={styles.taskBtn}>
              <Icon type="material-community" name="square-edit-outline" color={theme.colors.colorPrimary} />
              <Text style={{ marginLeft: 20 }}>Assign Task</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>REMOVE</Text>

            <Divider style={{ width: "100%" }} />
            <Button
              title={`Remove ${firstName ? firstName : ''}`}
              type="outline"
              icon={{ name: "delete", color: "#E53935" }}
              onPress={() => setDialog(true)}
              raised
              titleStyle={{ color: "#E53935" }}
              buttonStyle={styles.removeButton}
              containerStyle={{ marginTop: 16, marginBottom: 32 }}
              loading={loadingRemove}
              loadingStyle={{ width: 170 }}
              loadingProps={{ color: "#E53935" }}
              disabled={loadingRemove}
            />

            <ConfirmationDialog
              visible={dialog}
              title={`Remove ${user[1] && user[1]}`}
              description={`Are you sure you want to remove this ${user[1].toLowerCase()}?`}
              onCancel={() => setDialog(false)}
              onSave={removeCaregiver}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
  return <View />;
};

CaregiverDetailScreen.navigationOptions = ({ navigation }) => ({
  title: `${navigation.getParam("name", "") + "'s" || "User"}'s Profile`,
  headerBackTitle: "",
  headerTintColor: theme.colors.colorPrimary,
  headerTitleStyle: { fontSize: 18 },
  headerStyle: { backgroundColor: "white" },
  headerShown: false,
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "white" },
  imageRoot: { width: "100%", height: "35%" },
  image: {
    height: "100%",
    width: "100%",
    backgroundColor: "#D0D0D0",
  },
  imageInner: {
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
  },
  header: {
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,.15)",
    alignItems: "flex-start",
  },
  backButton: {
    color: "white",
    fontWeight: "600",
    fontSize: 19,
  },
  name: {
    fontFamily: theme.fonts.SFProSemibold,
    fontSize: 26,
    color: "white",
    textShadowRadius: 8,
    textShadowColor: "black",
  },
  status: {
    fontFamily: theme.fonts.SFProBold,
    fontSize: 16,
    color: "white",
    marginBottom: 8,
    textShadowRadius: 8,
    textShadowColor: "black",
  },
  // name: {
  //   fontSize: 24,
  //   fontWeight: "500",
  //   color: theme.colors.colorPrimary,
  // },
  description: {
    marginVertical: 8,
    fontSize: 15,
    color: "grey",
    marginHorizontal: 16,
    width: "92%",
  },
  heading: {
    width: "100%",
    color: "grey",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
  },
  contactRoot: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "96%",
    paddingVertical: 20,
    backgroundColor: "white",
  },
  contactTitle: {
    color: "white",
    fontSize: 16,
    paddingHorizontal: 10,
    maxWidth: '80%',
  },
  contactButton: {
    borderRadius: 10,
    maxWidth: Dimensions.get("window").width * 0.40
  },
  removeButton: {
    borderColor: "#E53935",
    borderRadius: 50,
    borderWidth: 1.8,
  },
  taskBtn: {
    color: "grey",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    flexDirection: 'row',
    width: '96%',
    alignItems: 'center',
    marginBottom: 15
  },
  callHeading: {
    color: "grey",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingLeft: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    paddingRight: 4
  },
});
