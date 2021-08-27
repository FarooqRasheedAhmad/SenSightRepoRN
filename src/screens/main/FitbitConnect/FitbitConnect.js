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




export default class FitbitConnect extends Component {
constructor(props){
    super();
    const { navigation } = props.navigation
    this.state = {
        deviceName : "Fitbit",
        deviceModel: "All Models",
        deviceImage: images.fitbit,
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
                                <Text style={heading}>How To Obtain Client ID and Client Secret:</Text>
                                 
                                
                                
                                
                            </View>
                            <View style={line} />

                            <View style={{  height: 300, width: 670 }}>
                            <WebView 
                                originWhitelist={['*']}
                                allowsFullscreenVideo
                                allowsInlineMediaPlayback
                                mediaPlaybackRequiresUserAction
                                useWebKit={false}
                                source={{ 
                                    html: `
                                            
                                        <div>
                                        <iframe width="560" height="315" src="https://www.youtube.com/embed/mAS1h1OjGjI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                        </div> `

                                        }}
                            />
                        </View>
                        </View>

                        <View style={line} />

                        <View style={{ padding: 1 }}>
                                <Text style={heading}>Step 1:</Text>
                                <Text style={styles.baseText}>Open Browser</Text>

                                <Text style={heading}>Step 2:</Text>
                                <Text style={styles.baseText}>Go to https://dev.fitbit.com</Text>

                                <Text style={heading}>Step 3:</Text>
                                <Text style={styles.baseText}>Go to "Manage" on top right corner</Text>

                                <Text style={heading}>Step 4:</Text>
                                <Text style={styles.baseText}>Select "Register An App"</Text>

                                <Text style={heading}>Step 5:</Text>
                                <Text style={styles.baseText}>Login with your Fitbit Account credentials, if required</Text>

                                <Text style={heading}>Step 6:</Text>
                                <Text style={styles.baseText}>Complete the application form: </Text>

                                <Text style={heading}> </Text>
                                <Text style={styles.baseText}>- Application Name: SenSights.AI</Text>

                                <Text style={heading}></Text>
                                <Text style={styles.baseText}>- Description: Fitbit Integration with SenSights.AI</Text>

                                <Text style={heading}></Text>
                                <Text style={styles.baseText}>- Application Website: https://sensights.ai</Text>

                                <Text style={heading}></Text>
                                <Text style={styles.baseText}>- Organization: Locatemotion</Text>

                                <Text style={heading}></Text>
                                <Text style={styles.baseText}>- Organization Website: https://sensights.ai</Text>

                                <Text style={heading}></Text>
                                <Text style={styles.baseText}>- Terms Of Service Url: https://dev.fitbit.com/legal/platform-terms-of-service/</Text>

                                <Text style={heading}></Text>
                                <Text style={styles.baseText}>- Privacy Policy Url: https://www.fitbit.com/global/us/legal/privacy-policy</Text>

                                <Text style={heading}></Text>
                                <Text style={styles.baseText}>- Select "OAuth 2.0 Application Type" as "Client"</Text>

                                <Text style={heading}></Text>
                                <Text style={styles.baseText}>- Callback URL: https://dev02.sensights.ai/</Text>

                                <Text style={heading}></Text>
                                <Text style={styles.baseText}>- Read and Agree to the Terms of Service</Text>

                                <Text style={heading}></Text>
                                <Text style={styles.baseText}>- Click "Register"</Text>

                                <Text style={heading}></Text>

                                <Text style={heading}>Step 7:</Text>
                                <Text style={styles.baseText}>Copy the Client ID</Text>
                                
                                <Text style={heading}>Step 8:</Text>
                                <Text style={styles.baseText}>Go to "Edit Application Settings"</Text>
                                 
                                <Text style={heading}>Step 9:</Text>
                                <Text style={styles.baseText}>Paste the copied Client ID infront of the Callback URL and click "Save"</Text>
                                
                                <Text style={heading}>Step 10:</Text>
                                <Text style={styles.baseText}>Now copy the Client ID and Client Secret</Text>

                                <Text style={heading}>Step 11:</Text>
                                <Text style={styles.baseText}>Go to SenSights.AI app</Text>

                                <Text style={heading}>Step 12:</Text>
                                <Text style={styles.baseText}>Paste the copied Client ID and Client Secret and press "Submit"</Text>
                                
                                
                        </View>
                            
                    
                       

                        
                    
                </ScrollView>
            </View>
                
                
            </SafeAreaView>
            
        )
    }
}
