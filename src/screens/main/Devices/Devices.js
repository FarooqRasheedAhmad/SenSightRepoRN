import { FlatList, Platform, StatusBar, Text, View } from "react-native";
import React, { Component } from "react";
import { BleManager } from "react-native-ble-plx";
import { DeviceItem, DeviceItemV2, SearchBar, NavigationHeader, Button } from "../../../components";
import { watchPaired as checkDevice } from "../../../utils/watchPaired";
import { images } from "../../../assets";
import { styles } from "./styles";
import { theme } from "../../../theme";
import { AppConstants, StorageUtils, } from "../../../utils";
import { api } from "../../../api";

import { _deviceList, getDevice, demoDeviceData } from '../../../configs'

const { container, heading, subContainer } = styles;
const allowedDevice = _deviceList.filter(i => i.fdaApproved==true).map((item => (item.name)))

export default class Devices extends Component {

  constructor(props) {
    super();
    this.seniorId = props.navigation.getParam("seniorId", null);
    this.state = {
      allDevices: [], //arrayHolder,
      watchPaired: false,
      watchTitle: false,
      isSearching: false,
      connnectedDevices: [],
    };
    this.manager = new BleManager();
  }

  async componentDidMount() {
    if (Platform.OS !== "ios") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor(theme.colors.colorPrimary);
    }
    this.getPairedDevice();

    this.checkWatch();
    if (Platform.OS === "ios") {
      const subscription = this.manager.onStateChange((state) => {
        if (state === "PoweredOn") {
          this.search();
          subscription.remove();
        }
      }, true);
    } else {
      this.search();
    }
  }

  getPairedDevice = async () => {
    this.setState({ spinner: true });
    const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID);
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    let uri = String(api.allDevices).replace("{type}", "All");
    fetch(uri,{
      method: "get",
    headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
  })
      .then((response) => { 
         return response.json();
     
         })
      .catch((error) => {
        console.log(error)
        this.setState({ spinner: false });
      })
      .then((data) => {
        // console.log(data)
        var deviceArr = []
        for(let i=0; i < data.length;i++){
           deviceArr[i] = {
            name: data[i].title,
            localName: null,
            connectionType: "manual",
            image: data[i].deviceTag == 'ADF-BMIScale'
            ? images.bmi_scale
            : data[i].deviceTag == 'FDA-BloodPressure'
            ? images.blood_presure
            : data[i].deviceTag == 'FDA-GlucoMeter'
            ? images.blood_glucose
            : data[i].deviceTag == 'FDA-Oximeter'
            ? images.oximeter
            : data[i].deviceTag == 'FDA-ThermoMeter'
            ?  images.thermometer
            : data[i].deviceTag == 'Veyetals'
            ?  images.veyetals
            : data[i].deviceTag == 'AppleWatch'
            ? images.apple_watch
            : data[i].deviceTag == 'PloyerWatch'
            ? images.polar
            : data[i].deviceTag == 'FitBit'
            ? images.fitbit
            : data[i].deviceTag == 'monitoring'
            ? images.bmi_scale
            : data[i].deviceTag == 'bioStrap'
            ? images.biostrap
            : data[i].deviceTag == 'ScreeningScreen'
            ? images.bmi_scale
            :images.samsung_gear,
           }
        }
        for( var i = 0; i < deviceArr.length; i++){ 
          if ( deviceArr[i].name == "Manual Entry") { 
              deviceArr.splice(i, 1); 
          }
      }
        this.setState({ spinner: false, allDevices: deviceArr });
      })
  }

  search = () => {
    this.setState({ isSearching: true });
    this.scanAndConnect();
  };

  scanAndConnect = () => {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("error.message  ", error.message);
        this.setState({ error: error.message });
        return;
      }

      // do not allow other that are not in our list
      if (allowedDevice.includes(device.name)) {
        // check if connnectedDevices don't have this device
        if ( !this.state.connnectedDevices.find((d) => d.name === device.name) && device.name !== null ) {
          // get information of corresponding FDA device
          // let fdaDeviceInfo = devicesVendorInfo[device.name];
          let fdaDeviceInfo = getDevice(device);
          
          device.localName = fdaDeviceInfo.localName;
          device.deviceModel = fdaDeviceInfo.deviceModel;
          device.image = fdaDeviceInfo.image;
          
          let connnectedDevices = this.state.connnectedDevices;
          connnectedDevices.push(device);
          
          this.setState( { connnectedDevices }, this.removeConntectedDeviceFromAllDeviceList );

          device.onDisconnected((connectionError, disconnectedDevice) => {
            this.onDeviceDisconnect(connectionError, disconnectedDevice);
          });

        }
        
      }

    });

  };

  onDeviceDisconnect = (error, device) => {
    console.log("error, device ", error, device);
  };

  removeConntectedDeviceFromAllDeviceList = () => {
    const { connnectedDevices, allDevices } = this.state;
    let connnectedDeviceNames = connnectedDevices.map((connnectedItem) => {
      return connnectedItem.name;
    });
    let devicesNotConnected = allDevices.filter(
      (item) => !connnectedDeviceNames.includes(item.localName)
    );
    this.setState({ allDevices: devicesNotConnected });
  };

  stopSearch = () => {
    this.setState({ isSearching: false });
    this.manager.stopDeviceScan();
  };

  checkWatch = () => {
    checkDevice((data, error) => {
      if (data) {
        const { watchPaired, title } = data;
        this.setState({ watchPaired: watchPaired, watchTitle: title });
      }
    });
  };

  onPressDeviceItem = (selectedDevice) => {
    const { navigation } = this.props;

    navigation.navigate("DeviceReadingScreen", {
      selectedDevice: selectedDevice,
      origin: navigation.getParam('origin', '')
    });
  };
  /////
  onPressNotConnectedDeviceItem = (_device) => {
    const { navigation } = this.props;
    navigation.navigate("DeviceInfo", {
      selectedDevice: _device,
      seniorId: this.seniorId,
      //origin: navigation.getParam('origin', '')
    });

  };

  renderListItem = (item) => {
    return (
      <DeviceItem
        deviceName={item.deviceName}
        deviceModel={item.deviceModel}
        image={item.image}
        item={item}
        onItemPressCallBack={this.onPressNotConnectedDeviceItem}
      />
    );
  };

  renderConnectedListItem = (item) => {
    // console.log("Devices.js -- 211");
    // console.log("item.localName: "+item.localName);
    // console.log("item.deviceModel: "+item.deviceModel);
    // console.log("item.image: "+item.image);
    return (
      <DeviceItem
        deviceName={item.localName}
        deviceModel={item.deviceModel}
        image={item.image}
        item={item}
        onItemPressCallBack={this.onPressDeviceItem}
      />
    );
  };

  searchFilter = (text) => {
    if (!this.state.allDevices || this.state.allDevices.length<1){
      this.setState({ allDevices: _deviceList });
      return;
    }

    // console.log("this.state.allDevices: ", this.state.allDevices); return;
    const filteredList = _deviceList.filter((item) => {
      return item.name.toLowerCase().includes(text.trim().toLowerCase());
      // return item.deviceName.toLowerCase().includes(text.trim().toLowerCase());
    })

    this.setState({ allDevices: filteredList });
  };

  render() {
    const { navigation } = this.props;
    const { allDevices, watchTitle, watchPaired, connnectedDevices, } = this.state;

    return (
      <View style={container}>
        <NavigationHeader title={'Devices'} leftText={'Back'} navigation={navigation} />

        <View style={subContainer}>
          <SearchBar searchFilter={this.searchFilter} />

          <View style={{flex:1}}>

            <View style={{height:"50%"}}>
              <Text style={heading}>Connected Devices ({connnectedDevices.length})</Text>
              {watchTitle !== "Android Watch" && watchPaired ? (
                <DeviceItem
                  deviceName={watchTitle}
                  deviceModel={watchPaired ? "Paired" : "Not Paired"}
                  image={watchTitle === "Android Watch" ? images.android_watch : images.apple_watch}
                />
              ) : null}
              {connnectedDevices.length > 0 ? (
                <FlatList
                  data={connnectedDevices}
                  renderItem={({ item }) => this.renderConnectedListItem(item)}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : null}
            </View>

            <View style={{height:"50%"}}>
              <Text style={heading}>Certified Devices ({allDevices.length})</Text>
              <FlatList
                data={allDevices}
                renderItem={({ item }) => <DeviceItemV2 data={item} onPress={() => this.onPressNotConnectedDeviceItem(item)} />}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

          </View>


          
        </View>
      </View>
    );
  }
}
