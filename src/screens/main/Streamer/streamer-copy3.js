import React from 'react';
import PropTypes from 'prop-types';
import { AppConstants, StorageUtils,} from "../../../utils";
import { View, Image, TouchableOpacity, SafeAreaView, Alert, PermissionsAndroid, Dimensions, Text, Platform, ActivityIndicator } from 'react-native';
import ProgressBar from './bar'
import { NodeCameraView } from 'react-native-nodemediaclient';
import get from 'lodash/get';
import { LIVE_STATUS, videoConfig, audioConfig } from "./utils/constants";
import SocketManager from './socketManager';
import styles from './styles';
import LiveStreamActionButton from './LiveStreamActionButton';
import ChatInputGroup from './components/ChatInputGroup';
import MessagesList from './components/MessagesList/MessagesList';
import FloatingHearts from './components/FloatingHearts';
import { RTMP_SERVER } from './config';
import Logger from './utils/logger';
import { api } from "../../../api";
import { NavigationHeader, AlertHelper, Row, Col } from "../../../components";
import Snackbar from "react-native-snackbar";

import { result } from 'lodash';
import { theme } from "../../../../src";

let { width, height } = Dimensions.get('window');

export default class Streamer extends React.Component {
  constructor(props) {
    super(props);
    const { route } = props;
    const roomName = props.navigation.getParam("userName", null)
    const userName = props.navigation.getParam("userName", null);//get(route, 'params.userName', '');

    this.state = {
      currentLiveStatus: LIVE_STATUS.PREPARE,
      messages: [],
      countHeart: 0,
      progress: 0,
      isVisibleMessages: true,
      serverStatus: false,
      setListener: false,
      valueGot: false,
      bpm: '',
      timerState: '',
      showButton: false,
      hrv: '',
      respRate: '',
      sat: '',
      stress: '',
      data: '',
    };
    this.roomName = roomName;

    this.userName = userName;

    this.timeoutInstance = null;

  }

  async UNSAFE_componentWillMount() {
    console.log("COM WILL MOUNTTT")

    this.state.timerState = setInterval(() => {
      if (this.state.progress <= 0.95) {

        this.setState({ progress: this.state.progress + Math.floor(Math.random() * 1) + (Math.random() * 0.05) + 0.01 })

        if (this.nodeCameraViewRef) this.nodeCameraViewRef.start();
        this.setState({ currentLiveStatus: 1, showButton: false });

      } else {
        clearInterval(this.state.timerState)
      }
    }, 1700)
  }

  async componentDidMount() {
    console.log("COM DID MOUNT")

    this.requestCameraPermission();

    SocketManager.instance.emitPrepareLiveStream({
      userName: this.userName,
      roomName: this.roomName,
    });

    SocketManager.instance.emitJoinRoom({
      userName: this.userName,
      roomName: this.roomName,
    });
    SocketManager.instance.listenBeginLiveStream((data) => {
      const currentLiveStatus = get(data, 'liveStatus', '');
      this.setState({ currentLiveStatus });
    });
    SocketManager.instance.listenFinishLiveStream((data) => {
      const currentLiveStatus = get(data, 'liveStatus', '');
      this.setState({ currentLiveStatus });
    });
    SocketManager.instance.listenSendHeart(() => {
      this.setState((prevState) => ({ countHeart: prevState.countHeart + 1 }));
    });
    SocketManager.instance.listenSendMessage((data) => {
      const messages = get(data, 'messages', []);
      this.setState({ messages });
    });

    this.timeoutInstance = setTimeout(() => {
      this.onPressLiveStreamButton()
    }, 1000)
  }

  componentWillUnmount() {
    console.log("componenetWillUNMOUNT")

    if (this.timeoutInstance) clearTimeout(this.timeoutInstance)

    if (this.nodeCameraViewRef) this.nodeCameraViewRef.stop();
    SocketManager.instance.emitLeaveRoom({
      userName: this.userName,
      roomName: this.roomName,
    });
  }

  onPressHeart = () => {
    SocketManager.instance.emitSendHeart({
      roomName: this.roomName,
    });
  };

  onPressSend = (message) => {
    SocketManager.instance.emitSendMessage({
      roomName: this.roomName,
      userName: this.userName,
      message,
    });
    this.setState({ isVisibleMessages: true });
  };

  getToken = async () => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    if (token) {
      return token;
    }
    return;
  }

  saveFdaDeviceData = async (payloadData, serviceUrl) => {
    console.log("saveFdaDeviceData(): ", payloadData);
    
    const reqBody = payloadData
    const token = await this.getToken()
    console.log(token);
    this.setState({ isFetchingData: true })

    fetch(serviceUrl, {
      method: "post",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        console.log("saveFdaDeviceData > response: ", response);
        
        if (response.ok) {
          return response.json();
        } else {
          Snackbar.show({ text: "Something went wrong ! Try again", duration: Snackbar.LENGTH_LONG, })
          // AlertHelper.show({ description: `Oops, Something went wrong ! Try again`, cancelBtn: { negativeBtnLable: 'Ok' } })
        }
        this.setState({ isFetchingData: false });
      })
      .then((json) => {
        if (json) {
          // AlertHelper.show({ description: `Data has been saved successfully`, cancelBtn: { negativeBtnLable: 'Ok' } })
          Snackbar.show({ text: "Data has been saved successfully", duration: Snackbar.LENGTH_LONG })
        }
      })
      .catch((error) => {
        console.log("ERROR 3: ", error);

        this.setState({ isFetchingData: false });
        Snackbar.show({
          text: "Something went wrong ! Try again later",
          duration: Snackbar.LENGTH_LONG,
        })
      })
  }

  onEndEditing = () => this.setState({ isVisibleMessages: true });

  onFocusChatGroup = () => {
    this.setState({ isVisibleMessages: false });
  };

  onPressClose = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };


  onPressLiveStreamButton = () => {
    console.log("onPressLiveStreamButton()");
    console.log("STREAMER LIVE STREAM BUTTON")
    let apiPayload = {}
    let serviceUrl = ''
    const { navigation, route } = this.props;
    const userName = navigation.getParam("userName", null)

    const { currentLiveStatus } = this.state;
    if (Number(currentLiveStatus) === Number(LIVE_STATUS.PREPARE)) {
      /**
       * Waiting live stream
       */

      SocketManager.instance.emitBeginLiveStream({ userName, roomName: userName });
      SocketManager.instance.emitJoinRoom({ userName, roomName: userName });

      if (this.nodeCameraViewRef) this.nodeCameraViewRef.start();
      this.setState({ currentLiveStatus: 1, showButton: false });
      setTimeout(() => {
        this.setState({ serverStatus: true })

        fetch(`https://us-central1-rppg-project.cloudfunctions.net/run?user_id=${this.userName}`, {
          method: "get",
          headers: { "Content-Type": "application/json" }
        }).then((response) => response.json())
          //If response is in json then in success
          .then((responseJson) => {
            //Success 
            console.log("onPressLiveStreamButton > responseJson: ", responseJson);

            if (responseJson.HR != 1) {
              //console.log("success!")
              this.setState({ valueGot: true, bpm: Math.round(responseJson.HR), progress: 1, sat: responseJson.O2, hrv: responseJson.HRV, stress: responseJson.SL, respRate: responseJson.RR })
              // apiPayload = {
              //   deviceTag: "Veyetals",
              //   heartRate: responseJson.HR,
              //   hrv: responseJson.HRV,
              //   oxygenLevel: responseJson.O2,
              //   respiratoryRate: responseJson.RR,
              //   stressLevel: responseJson.SL
              // }
              // serviceUrl = api.addBMIScale
              // this.saveFdaDeviceData(apiPayload, serviceUrl)
            }
            else {
              console.log("fail")
              clearInterval(this.state.timerState)
              this.setState({ showButton: true, currentLiveStatus: 0, progress: 0 })
            }

          }).catch(err=>{ console.log("ERROR 1: ", err); })
        //If response is not in json then in error

      }, 4000)



    } else if (Number(currentLiveStatus) === Number(LIVE_STATUS.ON_LIVE)) {
      /**
       * Finish live stream
       */
      // SocketManager.instance.emitFinishLiveStream({ userName, roomName: userName });
      // if (this.nodeCameraViewRef) this.nodeCameraViewRef.stop();

      // Alert.alert(
      //   'Alert ',
      //   'Thanks for your live stream',
      //   [
      //     {
      //       text: 'Okay',
      //       onPress: () => {
      //         navigation.goBack();
      //         SocketManager.instance.emitLeaveRoom({ userName, roomName: userName });
      //       },
      //     },
      //   ],
      //   { cancelable: false }
      // );

    }
  };
  onPressLiveButton = () => {
    console.log("onPressLiveButton()");
    console.log("ON PRESS LIVE BUTTON")
    
    let apiPayload = {}
    let serviceUrl = ''
    this.state.timerState = setInterval(() => {
      if (this.state.progress <= 0.95) {
        console.log("progressing");
        this.setState({ progress: this.state.progress + Math.floor(Math.random() * 1) + (Math.random() * 0.05) + 0.01 })
      } else {
        console.log("interval cancled");
        clearInterval(this.state.timerState)
      }
    }, 1700)
    const { navigation, route } = this.props;
    const userName = navigation.getParam("userName", null)

    const { currentLiveStatus } = this.state;
    if (Number(currentLiveStatus) === Number(LIVE_STATUS.PREPARE)) {
      /**
       * Waiting live stream
       */
      SocketManager.instance.emitBeginLiveStream({ userName, roomName: userName });
      SocketManager.instance.emitJoinRoom({ userName, roomName: userName });
      if (this.nodeCameraViewRef) this.nodeCameraViewRef.start();
      this.setState({ currentLiveStatus: 1, showButton: false });
      setTimeout(() => {
        this.setState({ serverStatus: true })

        fetch(`https://us-central1-rppg-project.cloudfunctions.net/run?user_id=${this.userName}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json"
          }
        }).then((response) => response.json())
          //If response is in json then in success
          .then((responseJson) => {
            //Success 
            console.log("onPressLiveButton > responseJson: ", responseJson);
            if (responseJson.HR != 1) {
              console.log("success!")
              this.setState({ valueGot: true, bpm: Math.round(responseJson.HR), progress: 1, sat: responseJson.O2, hrv: responseJson.HRV, stress: responseJson.SL, respRate: responseJson.RR })
              apiPayload.deviceTag = "Veyetals"
              apiPayload.heartRate = responseJson.HR
              apiPayload.hrv = responseJson.HRV
              apiPayload.oxygenLevel = responseJson.O2
              apiPayload.respiratoryRate = responseJson.RR
              apiPayload.stressLevel = responseJson.SL
              serviceUrl = api.addBMIScale
              // this.saveFdaDeviceData(apiPayload, serviceUrl)
            }
            else {
              console.log("fail")
              clearInterval(this.state.timerState)
              this.setState({ showButton: true, currentLiveStatus: 0, progress: 0 })
            }

          }).catch(err => { console.log("ERROR 2: ", err); })

      }, 4000)

    } else if (Number(currentLiveStatus) === Number(LIVE_STATUS.ON_LIVE)) {
      /**
       * Finish live stream
       */
      SocketManager.instance.emitFinishLiveStream({ userName, roomName: userName });
      if (this.nodeCameraViewRef) this.nodeCameraViewRef.stop();
      Alert.alert(
        'Alert ',
        'Thanks for your live stream',
        [
          {
            text: 'Okay',
            onPress: () => {
              navigation.goBack();
              SocketManager.instance.emitLeaveRoom({ userName, roomName: userName });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
  requestCameraPermission = async () => {
    if (Platform.OS != 'android') return null;

    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
        {
          title: 'vEYEtals need Camera And Microphone Permission',
          message: 'vEYEtals needs access to your camera and microphone.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED

      ) {
        if (this.nodeCameraViewRef) this.nodeCameraViewRef.startPreview();
      } else {
        Logger.log('Camera permission denied');
      }
    } catch (err) {
      // Logger.log('ERROR getting permissions!', JSON.stringify(err));
      Logger.warn(err);
    }
  };

  renderChatGroup = () => {
    return (
      <ChatInputGroup
        onPressHeart={this.onPressHeart}
        onPressSend={this.onPressSend}
        onFocus={this.onFocusChatGroup}
        onEndEditing={this.onEndEditing}
      />
    );
  };

  renderListMessages = () => {
    const { messages, isVisibleMessages } = this.state;
    if (!isVisibleMessages) return null;
    return <MessagesList messages={messages} />;
  };

  setCameraRef = (ref) => {
    this.nodeCameraViewRef = ref;
  };
  errorHandler = () => {
    this.state.bpm = 'NA'
    Alert.alert("Face not detected")
    this.onPressClose()
  }

  onSavePress(){
    this.setState({savingData:true})

    const apiPayload = {
      deviceTag: "Veyetals",
      heartRate: this.state.bpm,
      hrv: this.state.hrv,
      oxygenLevel: this.state.sat,
      respiratoryRate: this.state.respRate,
      stressLevel: this.state.stress
    }
    this.saveFdaDeviceData(apiPayload, api.addBMIScale).then(r=>{
      this.setState({ 
        savingData: false,
        countHeart: 0,
        progress:0,
        bpm: '',
        timerState: '',
        hrv: '',
        respRate: '',
        sat: '',
        stress: '',
        data: ''
      });
    });

  }

  render() {
    console.log("this.state: ", this.state);
    
    const { navigation, route } = this.props;
    //const { userName } = this.state
    const { currentLiveStatus, countHeart } = this.state;
    const userName = navigation.getParam("userName", null)
    const onSaveCallback = navigation.getParam("onSaveCallback")
    const onBackPress = navigation.getParam("onBackPress")
    const origin = navigation.getParam("origin")

    const saveEnabled = this.state.valueGot == true && this.state.bpm != 1;

    const outputUrl = `${RTMP_SERVER}/live/${userName}`;

    const info = {
      bpm: (!this.state.bpm || this.state.bpm == 'NA' || isNaN(parseInt(this.state.bpm))) ? '--' : parseInt(this.state.bpm),
      bpm: (!this.state.bpm || this.state.bpm == 'NA' || isNaN(parseInt(this.state.bpm))) ? '--' : parseInt(this.state.bpm),
      hrv: (!this.state.hrv || this.state.hrv == 'NA' || isNaN(parseInt(this.state.hrv))) ? '--' : parseInt(this.state.hrv),
      sat: (!this.state.sat || this.state.sat == 'NA' || isNaN(parseInt(this.state.sat))) ? '--' : parseInt(this.state.sat),
      respRate: (!this.state.respRate || this.state.respRate == 'NA' || isNaN(parseInt(this.state.respRate))) ? '--' : parseInt(this.state.respRate),
      stress: (!this.state.stress || this.state.stress == 'NA' || isNaN(parseInt(this.state.stress))) ? '--' : parseInt(this.state.stress),
    }


    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader title={''} leftText={'Back'} navigation={navigation} />

        <NodeCameraView
          style={styles.streamerView}
          ref={this.setCameraRef}
          outputUrl={outputUrl}
          camera={{ cameraId: 1, cameraFrontMirror: true }}
          audio={audioConfig}
          video={videoConfig}
          smoothSkinLevel={3}
          autopreview={Platform.OS == 'android' ? false : true}
        />
        <View style={{ position: 'absolute', alignSelf: 'center', width: (width * 2.7), height: (width * 2.7), left: -(width * 0.85), top: -(width * width / height), borderWidth: width, borderRadius: 5000, borderColor: 'rgba(1, 1, 1, 1)' }} />
        {this.state.showButton && <LiveStreamActionButton currentLiveStatus={currentLiveStatus} onPress={this.onPressLiveButton} />}

        <SafeAreaView style={styles.contentWrapper}>
          <View style={styles.header}>

            {origin && origin == 'Screening' && 
            <TouchableOpacity 
              style={saveEnabled ? styles.btnSave : styles.btnSave_disabled} 
              disabled={!saveEnabled} 
              onPress={()=>{
                // onSaveCallback({ heartRate: 80, oxygenLevel:85 });
                onSaveCallback({
                  heartRate: parseInt(this.state.hrv),
                  oxygenLevel: parseInt(this.state.sat),
                });
                navigation.goBack();
              }}>
              <Text style={{ color: "#FFFFFF" }}>Save</Text>
            </TouchableOpacity>}

            {origin != 'Screening' && 
              <TouchableOpacity 
                style={this.state.bpm ? styles.btnSave : styles.btnSave_disabled} 
                disabled={!this.state.bpm} 
                onPress={()=>this.onSavePress()}>
                {this.state.savingData && <ActivityIndicator animating={true} />}
                {!this.state.savingData && <Text style={{ color: "#FFFFFF" }}>Save</Text>}
              </TouchableOpacity>
            }

            <TouchableOpacity style={styles.btnClose} onPress={onBackPress || this.onPressClose}>
              <Image style={{ width: styles.icoClose.width, height: styles.icoClose.height}} source={require('./assets/Header.png')} tintColor="#25BEED" />
            </TouchableOpacity>

            <View style={{ alignItems: 'flex-end', top: 150, justifyContent: 'flex-start', zIndex: 10 }}>
              {this.state.showButton == false &&
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, marginLeft: 30, marginRight: 30, height: Platform.OS == 'ios' ? 50 : null, top: Platform.OS == 'ios' ? null : 30 }}>Position your head in the circle as we grab your digital vitals</Text>
              }
              {this.state.showButton == true &&
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, marginLeft: 30, marginRight: 30, height: Platform.OS == 'ios' ? 70 : null, top: Platform.OS == 'ios' ? null : 70 }}>Your face was not detected. Position your face in the circle and start measurement again</Text>
              }
              {this.state.showButton == false &&
                <View style={{ height: 150, width: 300, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', top: Platform.OS == 'ios' ? 20 : 50, right: Platform.OS == 'ios' ? Dimensions.get('screen').width > 380 ? 55 : 20 : 45, }}>
                  <View style={{ height: 0.1 }}></View>
                  <React.Fragment>
                    <View>
                      <Text style={{ position: 'absolute', zIndex: 10, alignSelf: 'center', bottom: 0.1 }}>{parseInt(this.state.progress * 100)}%</Text>
                      <ProgressBar progress={this.state.progress} width={300} borderColor='white' animated={true} borderWidth={0} color="#25BEED" borderRadius={0} height={14} />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                      {this.state.valueGot == true && this.state.bpm != 1 &&
                        <React.Fragment >
                          <View style={{ flexDirection: 'column' }}>
                            <Text style={{ color: 'black', top: 20, left: 0 }}>{info.bpm} bpm</Text>
                            <Text style={{ color: 'black', top: 20, left: 0 }}>{info.hrv} ms</Text>
                            <Text style={{ color: 'black', top: 20, left: 0 }}>{info.sat} %</Text>
                            <Text style={{ color: 'black', top: 20, left: 0 }}>{info.respRate} bpm</Text>
                            <Text style={{ color: 'black', top: 20, left: 0 }}>{info.stress}</Text>
                          </View>
                        </React.Fragment>
                      }
                      {this.state.valueGot == false &&
                        <View style={{ flexDirection: 'column' }}>
                          <Text style={{ color: 'black', top: 20, left: 0 }}>- -</Text>
                          <Text style={{ color: 'black', top: 20, left: 0 }}>- -</Text>
                          <Text style={{ color: 'black', top: 20, left: 0 }}>- -</Text>
                          <Text style={{ color: 'black', top: 20, left: 0 }}>- -</Text>
                          <Text style={{ color: 'black', top: 20, left: 0 }}>- -</Text>
                        </View>
                      }
                      <View style={{ flexDirection: 'column' }}>
                        <Text style={{ color: theme.colors.colorPrimary, top: 20, left: 10 }}>Heart Rate</Text>
                        <Text style={{ color: theme.colors.colorPrimary, top: 20, left: 10 }}>HR Variability</Text>
                        <Text style={{ color: theme.colors.colorPrimary, top: 20, left: 10 }}>Oxygen Saturation</Text>
                        <Text style={{ color: theme.colors.colorPrimary, top: 20, left: 10 }}>Respiratory Rate</Text>
                        <Text style={{ color: theme.colors.colorPrimary, top: 20, left: 10 }}>Stress Level</Text>
                      </View>

                    </View>
                  </React.Fragment>


                </View>
              }

            </View>
          </View>
          <View style={styles.center} />
          <View style={styles.footer}>
            {this.renderChatGroup()}
            {this.renderListMessages()}
          </View>
        </SafeAreaView>
        <FloatingHearts count={countHeart} />
      </SafeAreaView>
    );
  }
}

Streamer.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
  route: PropTypes.shape({}),
};

Streamer.defaultProps = {
  navigation: {
    goBack: null,
  },
  route: null,
};

