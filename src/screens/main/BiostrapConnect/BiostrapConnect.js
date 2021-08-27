import React, { Component } from "react"
import {
    Text,
    SafeAreaView,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Platform,
   
} from "react-native"
import Snackbar from "react-native-snackbar"
import { NavigationHeader } from "../../../components"
// import devicesVendorInfo from '../../../utils/FDADeviceInfo'
import { DeviceItem } from "../../../components"
import { styles } from './styles'
// import { device } from '../../../constants'
import { theme } from "../../../theme"
// import { api } from "../../../api"
import { images, icons } from "../../../assets";
import { WebView } from "react-native-webview";


// import {
//     calculatePulseOximeter, handshakingPacketData, calculateTemprature,
//     calculateBloodPressure, calculateBloodGlucose, AppConstants, StorageUtils, base64ToHex
// } from '../../../utils'

const { container, heading, aboutSummery, bluetoothMsg, line, ovalRed, WebViewStyle } = styles




export default class BiostrapConnect extends Component {
constructor(props){
    super();
    const { navigation } = props.navigation
    this.state = {
        deviceName : "BioStrap",
        deviceModel: "All Models",
        deviceImage: images.biostrap,
    }
}


    renderRowItem = (title, subTitle, rightItem, rightItemType) => {
        return (
            <DeviceItem deviceName={title} deviceModel={subTitle} rightItem={rightItem} rightItemType={rightItemType} />
        )
    }

    

    onPressConnectButton = () => {
        console.log('You have been clicked a button!');
        // do something
      };



    updateResult = (result) => {
        this.setState({
            isFetchingData: false,
            deviceMeasurement: result,
        })
    }


    render() {
        const { navigation } = this.props
        const { deviceLocalName, deviceName, selectedDeviceName, deviceModel, deviceMeasurement,
            deviceImage, isFetchingData } = this.state

        return (
            <SafeAreaView style={container}>
                {/* <Spinner visible={isFetchingData} /> */}
                <NavigationHeader title={'Devices'} leftText={'Back'} navigation={navigation} />
                
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{ flex: 1, backgroundColor: theme.colors.white }}
                        showsVerticalScrollIndicator={false}
                    >
                        
                        <View style={{ flex: 1 }}>  
                            <View style={{ flexDirection: "row", height: 56, alignItems: 'center', padding: 16 }}>
                                <Image source={deviceImage} style={{ width: 48, height: 48, marginRight: 6 }} />
                                <View>
                                    <Text style={styles.listText}>{deviceName}</Text>
                                    <Text style={styles.listSubText}>{deviceModel}</Text>
                                </View>
                            </View>
                            <View style={{ padding: 16 }}>
                                <Text style={heading}>How To Connect</Text>
                                 
                                
                                
                                
                            </View>
                            <View style={line} />

                            <View style={{  height: 600, width: 670 }}>
                            <WebView 
                                originWhitelist={['*']}
                                allowsFullscreenVideo
                                allowsInlineMediaPlayback
                                mediaPlaybackRequiresUserAction
                                useWebKit={false}
                                source={{ 
                                    html: `
                                            
                                                <div>
                                                <iframe width="560" height="315" src="https://www.youtube.com/embed/1LEMamtD72w" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 
                                        </div> `

                                        }}
                            />
                        </View>
                        </View>

                        
                    
                </ScrollView>
            </View>
                
                
            </SafeAreaView>
            
        )
    }
}
