import { FlatList, Platform, Text, View, Alert, PermissionsAndroid } from "react-native";
import React, { Component } from "react";
import get from 'lodash/get';
import { NavigationHeader, ServiceItem } from "../../../components";
import { images, icons } from "../../../assets";
import { styles } from "./styles";
import { commonStyles } from '../../../commonStyles'
import PropTypes from 'prop-types';
// import SocketManager from '../Streamer/socketManager'
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import Logger from '../Streamer/utils/logger';
import { checkPermissions, grantAllPermissions } from '../../../utils/permissionHandler';

const { container, heading, subContainer } = styles;
const arrayHolder = [ { name: "Veyetals", image: icons.veyetals, }, ];


export default class Apps extends Component {

  constructor(props) {
    super(props);
    this.state = {
      allDevices: arrayHolder,
      userName: '',
      listLiveStream: [],
      seniorId : props.navigation.getParam("seniorId", null),
    };
    
    this.state.userName = this.state.seniorId
   
    //this.manager = new BleManager();
  }

  componentDidMount() {
  
    // SocketManager.instance.emitListLiveStream();
    // SocketManager.instance.listenListLiveStream((data) => {
    //   this.setState({ listLiveStream: data });
    // });

    this.getPermissions()

  }

  async getPermissions(){
    const granted = await grantAllPermissions();
    if (!granted){
      Alert.alert(
        "Permissions denied",
        "You need to grant required permissions to use this app properly!",
        [{ text: "Ok", onPress: () => console.log("OK") }],
        { cancelable: false }
      );

      return this.getPermissions();
    }
    
    return granted;
    // const { permissionsGranted } = this.state;
    // if (permissionsGranted) return true;

    // if (Platform.OS == 'ios'){

    // }
    // else{
    //   const granted = await PermissionsAndroid.requestMultiple(
    //     [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
    //     {
    //       title: 'vEYEtals need Camera And Microphone Permission',
    //       message: 'vEYEtals needs access to your camera and microphone.',
    //       buttonNeutral: 'Ask Me Later',
    //       buttonNegative: 'Cancel',
    //       buttonPositive: 'OK',
    //     }
    //   );

    //   if (!granted){ alert("Permissions not granted!"); return; }

    //   const grantConfirmed = granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED && granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED

    //   if (!grantConfirmed){ alert("Required permissions are not gained!"); return; }

    //   this.setState({permissionsGranted:true});
    //   return true;

    // }
  }

  onPressLiveStreamNow = async () => {
    // checkPermissions();
    // grantAllPermissions().then(r=>{
    //   console.log("All permissions granted: ", r);
    // });

    // console.log("====", PermissionsAndroid.PERMISSIONS.CAMERA);
    // return;
    // const grant = await this.getPermissions();
    // if (!grant) return;

    const { navigation: { navigate } } = this.props;
    const { userName } = this.state;

    // alert("All Permissions granted");
    navigate('Streamer', { userName, roomName: userName });

  }

  _onPressLiveStreamNow = async () => {
    console.log("onPressLiveStreamNow()")
    const { route } = this.props;
    const { userName } = this.state;
    const { navigation: { navigate } } = this.props;


    if (Platform.OS == 'ios') {
      request(PERMISSIONS.IOS.CAMERA).then((response) => {
        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        if (response == RESULTS.GRANTED) {
          request(PERMISSIONS.IOS.MICROPHONE).then((micResponse) => {
            if (micResponse == RESULTS.GRANTED) {

              const { route } = this.props;
              const userName = this.state.userName;
              
              const { navigation: { navigate }, } = this.props;
              navigate('Streamer', { userName, roomName: userName });
             
            }
            
          })
        } else {
          request(PERMISSIONS.IOS.CAMERA).then((newresponse) => {
            // Returns once the user has chosen to 'allow' or to 'not allow' access
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if (newresponse == RESULTS.GRANTED) {
              request(PERMISSIONS.IOS.MICROPHONE).then((micResponse) => {
                if (micResponse == RESULTS.GRANTED) {

                  const { route } = this.props;
                  const userName = this.state.userName;
                  const { navigation: { navigate }, } = this.props;
                  navigate('Streamer', { userName, roomName: userName });
                } else {
                  Alert.alert(
                    "Permissions denied",
                    "Please check setting and allow permission for microphone",
                    [{ text: "Ok", onPress: () => console.log("OK") }],
                    { cancelable: false }
                  );
                }
              })

            } else {
              Alert.alert(
                "Permissions denied",
                "Please check setting and allow permission for images and camera",
                [{ text: "Ok", onPress: () => console.log("OK") }],
                { cancelable: false }
              );
            }
          });
        }
      });


    } else {
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
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED && granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          
          //# navigate('Streamer', { userName , roomName: userName });

        } else {
          Alert.alert(
            "Permissions denied",
            "Please check setting and allow permission for images and camera",
            [{ text: "Ok", onPress: () => console.log("OK") }],
            { cancelable: false }
          );
        }
      } catch (err) {
        // Logger.warn(err);
      }

    }
  };
  
  renderListItem = (item) => {
    return (
      <ServiceItem
        deviceName={item.name}
        image={item.image}
        item={item}
        onItemPressCallBack={this.onPressLiveStreamNow}
      />
    );
  };
/*
  onPressCardItem = (data) => {
    const { route } = this.props;
    const userName = 'roshaan';
    const {
      navigation: { navigate },
    } = this.props;
    navigate('Viewer', { userName, data });
  };
  onWebPress = (data) => {
    const { route } = this.props;
    const userName = 'roshaan';
    const {
      navigation: { navigate },
    } = this.props;
    navigate('webRtc');

  }

  */

  render() {
    const { navigation, route } = this.props;
    const { allDevices, listLiveStream, userName } = this.state;
    // const userName = this.state.userName;

    return (
      <View style={commonStyles.full_page_container}>
        <NavigationHeader title={'Apps'} leftText={'Back'} navigation={navigation} />

        <View style={subContainer}>
          
          <Text style={heading}>Connected Apps</Text>
          <FlatList
            data={allDevices}
            renderItem={({ item }) => this.renderListItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

Apps.propTypes = {
  route: PropTypes.shape({}),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

Apps.defaultProps = {
  route: null,
};

