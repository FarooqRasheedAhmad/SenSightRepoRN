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
// import { checkPermissions, grantAllPermissions } from '../../../utils/permissionHandler';

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

    // this.getPermissions()

  }

  // async getPermissions(){
  //   const granted = await grantAllPermissions();
  //   if (!granted){
  //     Alert.alert(
  //       "Permissions denied",
  //       "You need to grant required permissions to use this app properly!",
  //       [{ text: "Ok", onPress: () => console.log("OK") }],
  //       { cancelable: false }
  //     );

  //     return this.getPermissions();
  //   }
    
  //   return granted;
  // }

  onPressLiveStreamNow = async () => {
    const { navigation: { navigate } } = this.props;
    const { userName } = this.state;
    navigate('Streamer', { userName, roomName: userName });
  }

  
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

