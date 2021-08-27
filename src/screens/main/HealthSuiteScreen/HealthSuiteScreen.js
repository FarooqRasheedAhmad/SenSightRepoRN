import { FlatList, Platform, StatusBar, Text, TouchableHighlight, TouchableOpacity, View, Image } from "react-native";
import React, { Component } from "react";
import { BleManager } from "react-native-ble-plx";
import { DeviceItem, SearchBar, NavigationHeader } from "../../../components";
import { watchPaired as checkDevice } from "../../../utils/watchPaired";
import { images, icons } from "../../../assets";
import { styles } from "./styles";
import { theme } from "../../../theme";
import Modal from "react-native-modal";

import RNImmediatePhoneCall from "react-native-immediate-phone-call";

const { container, heading, subContainer, health, heading1, bullet, roundButton, roundButton1, roundButton2, modalView, centeredView, image } = styles;



export default class HealthSuiteScreen extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible:false,
    };
    this.manager = new BleManager();
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  makeCall = (phone) => () => {
    if (phone) {
      RNImmediatePhoneCall.immediatePhoneCall(phone);
    } else {
      showMessage("No phone number given", "short");
    }
  };

  CallButtonClickedHandler = () => {
    console.log('You have been clicked a button!');
    // do something
    this.setModalVisible(true)
  };


  MainCallbuttonClickedHandler = () => {
    console.log('You are calling!');
    // do something
    this.makeCall("4168288085");
  };


  EmailButtonClickedHandler = () => {
    console.log('You have been clicked a button!');
    
     
  };



  render() {
    const { navigation } = this.props;
    const {
     modalVisible

    } = this.state;

    return (
      <View style={container}>
        <NavigationHeader title={'Health Suite'} leftText={'Back'} navigation={navigation} />
        
        <View style={subContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          isVisible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image 
                style= {styles.image} 
                source={images.health_suite_icon}/>
                <View style={styles.mini}>
                <TouchableOpacity
                  onPress={this.MainCallbuttonClickedHandler}
                  style={styles.roundButton}>
                   <Image source={icons.call_blue} style={{ tintColor: 'white', width: 20, height: 20 }} />
                </TouchableOpacity> 
                <TouchableOpacity
                  style={styles.openButton}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              </View>
           
            </View>
          </View>
        </Modal>
          <Image style={health} source={images.health_suite_icon}/>
          <Text style={heading}>
            Please Call or Email us using the buttons below if you need any support 
            and we will guide you through the process
          </Text>
          <Text style={heading1}>Services:</Text>
          <Text style={bullet}>
            - Nursing and Personal Support {"\n"}
            - Wound and Foot Care {"\n"}
            - Home Making and Companion Care {"\n"}
            - Respite and Overnight Support {"\n"}
            - Occupational and Physio Therapy {"\n"}
            - 24/7 Hands On Care For You or Your {"\n"} Loved One {"\n"}
          </Text>
          
          <View style={styles.mini}>
          <TouchableOpacity
              onPress={this.CallButtonClickedHandler}
              style={styles.roundButton1}>
              <Image source={icons.call_blue} style={{ tintColor: 'white', width: 25, height: 30 }} />
          </TouchableOpacity> 
          <TouchableOpacity
            onPress={this.EmailButtonClickedHandler}
            style={styles.roundButton2}>
            <Image source={icons.email} style={{ width: 50, height: 50, alignContent: 'center' }} />
          </TouchableOpacity> 
          </View>


          
        </View>
      </View>
    );
  }
}
