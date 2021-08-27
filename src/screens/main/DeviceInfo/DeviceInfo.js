import React, { Component } from "react"
import {
    Text,
    SafeAreaView,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Alert
} from "react-native"
// import Snackbar from "react-native-snackbar"
import { WebView } from 'react-native-webview';
import Modal from "react-native-modal";
// import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationHeader, SearchBar, Row, Col } from "../../../components"
// import { styles as device_item_styles } from "../../../components/DeviceItem/styles"
import { DeviceItem, DeviceItemV2 } from "../../../components"
import { styles } from './styles'
// import { device } from '../../../constants'
import { theme } from "../../../theme"
// import { api } from "../../../api"
// import { fetchApiData } from '../../../apicall'

// import { calculatePulseOximeter, handshakingPacketData, calculateTemprature, calculateBloodPressure, calculateBloodGlucose, AppConstants, StorageUtils, base64ToHex } from '../../../utils'
import { getDevice } from '../../../configs'

// const { about, deviceDetails, bluetoothEnableMsg, status } = device
const { line, ovalRed, input } = styles
// const deviceArray = [ 'Samico GL', 'BPM', 'BPM_01', 'Medical', 'TEMP', ]
//const authenticateURL = "https://dev02.sensights.ai/fitbit/" + this.seniorId


const HomeMonitoringData = props => {
    const [state, setState] = React.useState({})

    const handleVayyarID = (text) => {
        setState({ ...state, vayyar_id: text })
    }

    const vayyar_submit = () => {
        // Alert.alert("Credentials Submitted");
        Alert.alert("Incomplete function!");
        console.log("values: ", state);
    }


    return (<View style={styles.container4}>
        <TextInput onChangeText={handleVayyarID} style={styles.input} underlineColorAndroid="transparent" placeholder=" Vayyar ID" placeholderTextColor="#A9A9A9" autoCapitalize="none" />

        <TouchableOpacity onPress={vayyar_submit} activeOpacity={0.8} style={[theme.palette.button, { width: 100, marginLeft: 70, marginTop: 10, height: 40 }]}>
            <Text style={theme.palette.buttonText}> Submit </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate("VayyarConnect")} activeOpacity={0.8} style={[theme.palette.button, { width: 200, marginTop: 130, height: 50 }]}>
            <Text style={theme.palette.buttonText}>How to Connect</Text>
        </TouchableOpacity>

    </View>)
}

const FitbitData = props => {
    const [state, setState] = React.useState({});
    const [modalVisible, setModalVisible] = React.useState(false);
    const [showSpinner, setShowSpinner] = React.useState(true);

    const seniorId = props.navigation.getParam("seniorId", null);
    const authenticateURL = "https://dev02.sensights.ai/fitbit/" + seniorId;

    const handelTextChange = (text, field) => {
        setState({ ...state, [field]: text })
    }

    const login = () => {
        // this.state.client_id, this.state.client_secret, this.checkClientCredentials
        Alert.alert("Incomplete function!");
        console.log("values: ", state);
    }

    // checkClientCredentials = async () => {
    //     try {
    //         //setSpinner(true);
    //         const reqBody = JSON.stringify({
    //             userId: seniorId,
    //             deviceTag: 'FitBit',
    //             identification1: client_id,
    //             identification2: client_secret
    //         });
    //         const response = await fetch('https://dev01.sensights.ai:8080/api/User/Devices', {
    //             method: "post",
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json",
    //                 Authorization: "Bearer " + token,
    //             },
    //             body: reqBody,
    //         });
    //         if (response.ok) {
    //             console.log("Added!");
    //             //setSpinner(false);
    //             showMessage("Credentials Added.");
    //         } else {
    //             console.log("Error!");
    //             //setSpinner(false);
    //             showMessage("Error adding credentials");
    //         }
    //     } catch (error) {
    //         setSpinner(false);
    //         showMessage("Error");
    //     }
    // };

    const CallButtonClickedHandler = () => {
        console.log(seniorId);
        setModalVisible(true)
    }

    const onPressFitbitHowConnectButton = () => {
        console.log('You have been clicked a button!');
        // do something
        props.navigation.navigate("FitbitConnect");
    };



    return (<>
        <View style={styles.container4}>
            <TextInput onChangeText={(text) => handelTextChange(text, 'client_id')} style={input} underlineColorAndroid="transparent" placeholder=" ClientID" placeholderTextColor="#A9A9A9" autoCapitalize="none" />
            <TextInput onChangeText={(text) => handelTextChange(text, 'client_secret')} style={input} underlineColorAndroid="transparent" placeholder=" Client Secret" placeholderTextColor="#A9A9A9" autoCapitalize="none" />

            <TouchableOpacity onPress={login} activeOpacity={0.8} style={[theme.palette.button, { width: 100, marginLeft: 70, marginTop: 10, height: 40 }]}>
                <Text style={theme.palette.buttonText}> Submit </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={CallButtonClickedHandler} activeOpacity={0.8} style={[theme.palette.button, { width: 200, marginTop: 45, height: 50 }]}>
                <Text style={theme.palette.buttonText}>Connect</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onPressFitbitHowConnectButton} activeOpacity={0.8} style={[theme.palette.button, { width: 200, marginTop: 15, height: 50 }]}>
                <Text style={theme.palette.buttonText}>How to Connect</Text>
            </TouchableOpacity>
        </View>

        <Modal animationType="slide" transparent={true} isVisible={modalVisible} onRequestClose={() => { Alert.alert("Modal has been closed."); }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <WebView
                        onLoad={() => setShowSpinner(false)}
                        // source={{ uri: 'https://dev02.sensights.ai/fitbit/145' }}
                        source={{ uri: authenticateURL }}
                        style={{ flex: 1, marginTop: 20 }}
                    />
                    {showSpinner && (<ActivityIndicator size="large" />)}
                    <View style={styles.mini}>
                        <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); }} activeOpacity={0.8} style={[theme.palette.button, { width: 200, marginTop: 7, height: 50 }]}>
                            <Text style={theme.palette.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </>)
}

const BioStrapData = props => {
    return (<TouchableOpacity onPress={() => props.navigation.navigate("BiostrapConnect")} activeOpacity={0.8} style={[theme.palette.button, { width: 200, marginVertical: 20, height: 50 }]}>
        <Text style={theme.palette.buttonText}>How to Connect</Text>
    </TouchableOpacity>)
}

export default class DeviceInfo extends Component {
    constructor(props) {
        super(props)
        // const { selectedDevice } = props.navigation.state.params
        this.seniorId = props.navigation.getParam("seniorId", null);
        this.state = {}
    }

    renderRowItem = (title, subTitle, rightItem, rightItemType) => {
        return (
            <DeviceItem deviceName={title} deviceModel={subTitle} rightItem={rightItem} rightItemType={rightItemType} />
        )
    }

    onManualConnect = async () => {
        const { selectedDevice } = this.props.navigation.state.params;

        console.log('You have been clicked a button! --> ' + selectedDevice.deviceName);
        const apiURL = "https://dev02.sensights.ai/fitbit/" + this.seniorId
        // const apiURL = "https://dev02.sensights.ai/fitbit/145"
        console.log("--> apiURL: " + apiURL)

        const res = await fetch(apiURL, {
            method: 'get',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
        if (res) {
            const json = await res.json();
            console.log('json ---  ', json)
        }
        else {
            console.log(res)
        }

    }


    render() {
        const { navigation } = this.props
        const { selectedDevice } = this.props.navigation.state.params
        // console.log("selectedDevice: ", selectedDevice);
        const deviceInfo = getDevice(selectedDevice) || selectedDevice;
        if (!deviceInfo) return <Text>No fda info...</Text>

        return (<SafeAreaView style={styles.container}>
            <NavigationHeader title={'Devices'} leftText={'Back'} navigation={navigation} />

            <ScrollView style={{ flex: 1, backgroundColor: theme.colors.white }} showsVerticalScrollIndicator={false}>
            
                <DeviceItemV2 data={deviceInfo} />

                {/* <View style={{ flexDirection: "row", height: 56, alignItems: 'center', padding: 16 }}>
                    <Image source={deviceInfo.image} style={{ width: 48, height: 48, marginRight: 6 }} />
                    <View>
                        <Text style={styles.listText}>{deviceInfo.name || deviceInfo.localName}</Text>
                        <Text style={styles.listSubText}>{(deviceInfo.localName && deviceInfo.name != deviceInfo.localName) && `${deviceInfo.localName} / `} {deviceInfo.deviceModel}</Text>
                    </View>
                </View> */}

                {deviceInfo.about && <>
                    <View style={{ padding: 16 }}>
                        <Text style={styles.heading}>About</Text>
                        <Text style={styles.aboutSummery}>{deviceInfo.about.deviceDetails}</Text>
                        <Text style={styles.heading}>{deviceInfo.about.status}</Text>
                        {/* {deviceName != "Fitbit" && deviceName != "Home Monitoring" && <Text style={heading}>{status}</Text>} */}
                    </View>
                    <View style={line} />
                </>}

                <View>{this.renderRowItem('Connnection Status', 'Not Connected', ovalRed, 'icon')}</View>

                <Row><Col flex="auto" align="center">
                    {deviceInfo.name == "Home Monitoring" && <HomeMonitoringData {...this.props} data={selectedDevice} />}
                    {deviceInfo.name == "Fitbit" && <FitbitData {...this.props} data={selectedDevice} />}
                    {deviceInfo.name == "BioStrap" && <BioStrapData {...this.props} data={selectedDevice} />}
                </Col></Row>
                {/* <View style={{ padding: 20, justifyContent: 'flex-end', alignItems: 'center' }}>
                </View> */}

                {deviceInfo.connectionType == 'manual' && <Row style={{marginVertical:20}}><Col align="center" flex="auto">
                    <TouchableOpacity onPress={()=>this.onManualConnect()} activeOpacity={0.8} style={[theme.palette.button, { width: 200, marginTop: 25, height: 50 }]}>
                        <Text style={theme.palette.buttonText}>Connect</Text>
                    </TouchableOpacity>
                </Col></Row>}


            </ScrollView>
        </SafeAreaView>)

    }
}
