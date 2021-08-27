import React, { Component } from "react"
import {
    Text,
    SafeAreaView,
    View,
    Image,
    TouchableOpacity,
    ScrollView
} from "react-native"
import Snackbar from "react-native-snackbar"
import _ from "lodash";
import { NavigationHeader, AlertHelper, Button } from "../../../components"
import { DeviceItem } from "../../../components"
import { styles } from './styles'
// import { device } from '../../../constants'

import { theme } from "../../../theme"
import { api } from "../../../api"
import { StackActions } from 'react-navigation';
import {
    calculatePulseOximeter, handshakingPacketData, calculateTemprature,
    calculateBloodPressure, calculateBloodGlucose, AppConstants, StorageUtils,
    base64ToHex, calculateBMI
} from '../../../utils'
import { _deviceList, getDevice } from '../../../configs'

// const { about, deviceDetails, bluetoothEnableMsg, status } = device
const { container, heading, aboutSummery, bluetoothMsg, line, ovalGreen } = styles
// const deviceArray = ['Samico GL', 'BPM', 'BPM_01', 'Medical', 'TEMP', 'SCALES', 'Samico Scales']
const allowedDevice = _deviceList.filter(i => i.fdaApproved == true).map((item => (item.name)))


export default class DeviceReading extends Component {
    constructor(props) {
        super(props)
        const { selectedDevice } = props.navigation.state.params
        this.state = {
            // deviceLocalName: selectedDevice.localName || '',
            // selectedDeviceName: selectedDevice.name || '',
            // deviceModel: selectedDevice.deviceModel || '',
            // deviceImage: selectedDevice.image || '',
            isSearching: false,
            canSearch: false,
            connnectedDevices: [],
            deviceMeasurement: {},
            selectedDevice: selectedDevice,
            isFetchingData: true,
            writeCharacteristicsResponse: undefined
        }
        this.userWeightUnit = 'kg'
    }

    async componentDidMount() {
        const { selectedDevice } = this.state
        this.userWeightUnit = await StorageUtils.getValue(AppConstants.SP.DEFAULT_WEIGHT_UNIT, 'kg')
        this.connectToDevice(selectedDevice)
    }

    renderRowItem = (title, subTitle, rightItem, rightItemType) => {
        return (
            <DeviceItem deviceName={title} deviceModel={subTitle} rightItem={rightItem} rightItemType={rightItemType} />
        )
    }

    componentWillUnmount() {
        const { selectedDevice } = this.state
        if (!selectedDevice.isConnected) return;

        selectedDevice.isConnected().then((connectionResult) => {
            // disconnect the device
            if (connectionResult) {
                selectedDevice.cancelConnection()
                    .then((device) => {
                        // Do work on device with services and characteristics
                    })
                    .catch((error) => {
                        // Handle errors
                    });
            }
        })
    }

    getToken = async () => {
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
        if (token) {
            return token;
        }
        return;
    }

    getUserId = async () => {
        const userId = await StorageUtils.getValue(AppConstants.SP.USER_ID)
        if (userId) {
            return userId;
        }
        return;
    }

    onPressSaveButton = async () => {
        const { selectedDevice } = this.props.navigation.state.params
        let _device = getDevice(selectedDevice);

        const { deviceMeasurement, selectedDeviceName } = this.state
        const { navigation } = this.props

        let apiPayload = {}
        let serviceUrl = ''
        if (_device.name == 'TEMP') {
            apiPayload.tempInCelsius = deviceMeasurement.temprature
            apiPayload.tempInFarrenheit = (deviceMeasurement.temprature * (9 / 5)) + 32
            serviceUrl = api.addBodyTemperature
        }
        else if (_device.name == 'BPM' || _device.name == 'BPM_01') {
            apiPayload.bmpPulseRate = deviceMeasurement.pulseRate
            apiPayload.systolic = deviceMeasurement.systolic
            apiPayload.diastolic = deviceMeasurement.diastolic
            serviceUrl = api.addBloodPressure
        }
        else if (_device.name == 'Medical') {
            apiPayload.pulseRate = deviceMeasurement.pulseRate
            apiPayload.oxigenLevel = deviceMeasurement.oxigenLevel
            apiPayload.pi = deviceMeasurement.PI / 10
            serviceUrl = api.addPulseOximeter
        }
        else if (_device.name == 'Samico GL') {
            apiPayload.glucoseValue = deviceMeasurement.glucose
            serviceUrl = api.addGlucoseMeter
        }
        else if (_device.name == 'SCALES' || _device.name == 'Samico Scales') {
            apiPayload.userId = await this.getUserId()
            apiPayload.weight = deviceMeasurement.unit == 'kg' ? deviceMeasurement.wieght : deviceMeasurement.wieght * 2.2046
            apiPayload.deviceTag = "ADF-BMIScale"
            apiPayload.weightUnit = deviceMeasurement.unit == 'kg' ? 1 : 2
            serviceUrl = api.addBMIScale
        }

        if (navigation.getParam('origin', '') === 'Screening') {
            navigation.navigate("ScreeningScreen", { oximterValues: apiPayload })
        }
        else {
            this.saveFdaDeviceData(apiPayload, serviceUrl)
        }
    }

    saveFdaDeviceData = async (payloadData, serviceUrl) => {
        const { navigation } = this.props
        const reqBody = payloadData
        const token = await this.getToken()
        this.setState({ isFetchingData: true })

        fetch(serviceUrl, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(reqBody),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    Snackbar.show({
                        text: "Something went wrong ! Try again",
                        duration: Snackbar.LENGTH_LONG,
                    })
                    AlertHelper.show({
                        description: `Oops, Something went wrong ! Try again`,
                        cancelBtn: { negativeBtnLable: 'Ok' }
                    })
                }
                this.setState({ isFetchingData: false });
            })
            .then((json) => {
                // const popAction = StackActions.pop({ n: 3, });
                if (json) {
                    AlertHelper.show({
                        description: `Data has been saved successfully`,
                        cancelBtn: { 
                            negativeBtnLable: 'Ok',
                            onPress:()=>{
                                navigation.dispatch(StackActions.pop({ n: 3, }));
                            }
                        }
                    })
                    console.log('json ', json)
                }
            })
            .catch((error) => {
                this.setState({ isFetchingData: false });
                Snackbar.show({
                    text: "Something went wrong ! Try again later",
                    duration: Snackbar.LENGTH_LONG,
                })
            })
    }

    monitorCharacteristicForUUID = (error, characteristics, deviceName) => {
        if (error) {
            this.setState({
                error: error.message,
                isFetchingData: false,
            })
        } else {
            const { value } = characteristics
            if (deviceName === 'Medical') {
                // 81ff7f00 means device has null values(pulseRate, oxigenLevel, PI)
                if (value && value.length && value !== '81ff7f00') {
                    let oximeterResult = calculatePulseOximeter(value)
                    if (oximeterResult) {
                        this.updateResult(oximeterResult)
                    }
                }
            } else if (deviceName === 'TEMP') {
                if (value && value.length) {
                    let tempratureResult = calculateTemprature(value)
                    this.updateResult(tempratureResult)
                }
            } else if (deviceName === 'BPM' || deviceName === 'BPM_01') {
                if (value && value.length > 18) {
                    let bloodPressureResult = calculateBloodPressure(value)
                    this.updateResult(bloodPressureResult)
                }
            } else if (deviceName == 'Samico GL') {
                if (value && value.length) {
                    let hexValue = base64ToHex(value)
                    if (hexValue.length === 24) {
                        let valuesObject = calculateBloodGlucose(hexValue)
                        this.updateResult(valuesObject)
                    }
                }
            }
            else if (deviceName === 'SCALES' || deviceName === 'Samico Scales') {
                if (value && value.length) {
                    let userUnitPref = this.userWeightUnit ? this.userWeightUnit : 'kg'
                    let bmiResult = calculateBMI(value, userUnitPref)
                    if (bmiResult) {
                        this.updateResult(bmiResult)
                    }
                }
            }
        }
    }

    updateResult = (result) => {
        this.setState({
            isFetchingData: false,
            deviceMeasurement: result,
        })
    }

    connectToDevice = (_device) => {
        if (_device && _device.isConnected) {
            this.setState({ isFetchingData: true })
            _device.isConnected().then((isDeviceConnected) => {
                if (!isDeviceConnected && allowedDevice.includes(_device.name)) {

                    // let deviceVendorData = devicesVendorInfo[_device.name];
                    let deviceVendorData = getDevice(_device);
                    _device
                        .connect()
                        .then((device) => {
                            return device.discoverAllServicesAndCharacteristics();
                        })
                        .then((device) => {
                            device.services().then((services) => {
                                const deviceVendorService = services.find((item) =>
                                    item.uuid
                                        .toLowerCase()
                                        .includes(deviceVendorData.serviceUDID.toLowerCase()),
                                );
                                this.setState({
                                    serviceJson: deviceVendorService
                                        ? [deviceVendorService]
                                        : services,
                                });
                                deviceVendorService &&
                                    deviceVendorService
                                        .characteristics(deviceVendorService.uuid)
                                        .then((characteristics) => {
                                            let deviceVendorCharacteristics;
                                            if (deviceVendorData.characteristicsUDID) {
                                                deviceVendorCharacteristics = characteristics.find(
                                                    (charItem) =>
                                                        charItem.uuid
                                                            .toLowerCase()
                                                            .includes(
                                                                deviceVendorData.characteristicsUDID.toLowerCase(),
                                                            ),
                                                )
                                            } else {
                                                deviceVendorCharacteristics = characteristics[0];
                                            }

                                            if (deviceVendorData.writeCharacteristicsUDID) {
                                                let writeCharacteristicsItem = characteristics.find(
                                                    (charItem) =>
                                                        charItem.uuid
                                                            .toLowerCase()
                                                            .includes(
                                                                deviceVendorData.writeCharacteristicsUDID.toLowerCase(),
                                                            ),
                                                )

                                                writeCharacteristicsItem
                                                    .writeWithoutResponse(
                                                        handshakingPacketData(),
                                                        writeCharacteristicsItem.uuid,
                                                    ).then((writeCharacteristicsResponse) => {
                                                        this.setState({
                                                            isFetchingData: true
                                                        })
                                                    })
                                            }

                                            if (
                                                deviceVendorCharacteristics &&
                                                (deviceVendorCharacteristics.isNotifiable ||
                                                    deviceVendorCharacteristics.isIndicatable)
                                            ) {
                                                deviceVendorCharacteristics.monitor(
                                                    (error, characteristic1) => {
                                                        this.monitorCharacteristicForUUID(
                                                            error,
                                                            characteristic1,
                                                            _device.name,
                                                        )
                                                    },
                                                    null,
                                                )
                                            }

                                            if (
                                                deviceVendorCharacteristics &&
                                                deviceVendorCharacteristics.isReadable
                                            ) {
                                                deviceVendorCharacteristics
                                                    .read()
                                                    .then((chacacteristicData) => {
                                                        this.setState({
                                                            characteristics: chacacteristicData,
                                                        });
                                                    });
                                            }
                                        })
                            })
                        })
                }
            })
        }
        else {
            alert('Device Not Connected')
        }
    }


    render() {
        const { navigation } = this.props
        const { selectedDevice } = this.props.navigation.state.params
        let _device = getDevice(selectedDevice);
        const { deviceMeasurement, isFetchingData } = this.state

        if(_.isEmpty(deviceMeasurement.temprature) || _.isUndefined(deviceMeasurement.temprature))
            var fahrenheit = "";
        else
            var fahrenheit = ((deviceMeasurement.temprature * (9 / 5)) + 32).toFixed(2);

        return (
            <SafeAreaView style={container}>
                {/* <Spinner visible={isFetchingData} /> */}
                <NavigationHeader title={'Devices'} leftText={'Back'} navigation={navigation} />
                <View style={{ flex: 1 }}>

                    {/* <Button onPress={()=>{
                        const popAction = StackActions.pop({ n: 3, });

                        AlertHelper.show({
                            description: `Data has been saved successfully`,
                            cancelBtn: { 
                                negativeBtnLable: 'Ok',
                                onPress: () => {
                                    console.log("OK clicked");
                                    // navigation.goBack()
                                    navigation.dispatch(popAction)
                                }
                            },
                        })
                    }}><Text>Test OK</Text></Button> */}


                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", height: 56, alignItems: 'center', padding: 16 }}>
                                <Image source={_device.image} style={{ width: 48, height: 48, marginRight: 6 }} />
                                <View>
                                    <Text style={styles.listText}>{_device.localName}</Text>
                                    <Text style={styles.listSubText}>{_device.deviceModel}</Text>
                                </View>
                            </View>
                            {_device.about && <>
                                <View style={{ padding: 16 }}>
                                    <Text style={heading}>About</Text>
                                    <Text style={aboutSummery}>{_device.about.deviceDetails}</Text>
                                    <Text style={bluetoothMsg}>{_device.about.bluetoothEnableMsg}</Text>
                                    <Text style={heading}>{_device.about.status}</Text>
                                </View>
                                <View style={line} />
                            </>}
                            {this.renderRowItem('Connnection Status', 'Connected', ovalGreen, 'icon')}
                            {_device.name == 'TEMP' && this.renderRowItem('Temperature', 'Celcius', isFetchingData ? '...' : deviceMeasurement.temprature, 'text')}
                            {_device.name == 'TEMP' && this.renderRowItem('Temperature', 'fahrenheit', isFetchingData ? '...' : fahrenheit, 'text')}
                            {_device.name == 'Samico GL' && this.renderRowItem('Glucose', 'mmol/L', isFetchingData ? '...' : deviceMeasurement.glucose, 'text')}
                            {(_device.name == 'SCALES' || _device.name == 'Samico Scales') && this.renderRowItem('Weight', deviceMeasurement.unit, !!deviceMeasurement.wieght ? (deviceMeasurement.wieght).toFixed(1) : '...', 'text')}
                            {(_device.name === 'BPM' || _device.name === 'BPM_01') &&
                                <View>
                                    {this.renderRowItem('Pulse Rate', 'Per min', isFetchingData ? '...' : deviceMeasurement.pulseRate, 'text')}
                                    {this.renderRowItem('Systolic', 'mmHg', isFetchingData ? '...' : deviceMeasurement.systolic, 'text')}
                                    {this.renderRowItem('Diastolic', 'mmHg', isFetchingData ? '...' : deviceMeasurement.diastolic, 'text')}
                                </View>}
                            {(_device.name === 'Medical') &&
                                <View>
                                    {this.renderRowItem('Pulse Rate', 'Per min', isFetchingData ? '...' : deviceMeasurement.pulseRate, 'text')}
                                    {this.renderRowItem('SpO2', 'percent', isFetchingData ? '...' : deviceMeasurement.oxigenLevel, 'text')}
                                    {this.renderRowItem('PI', 'percent', isFetchingData ? '...' : (deviceMeasurement.PI / 10), 'text')}
                                </View>}
                        </View>
                    </ScrollView>
                    <View style={{ padding: 20, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.onPressSaveButton} activeOpacity={0.8} style={[theme.palette.button, { width: 150 }]}>
                            <Text style={theme.palette.buttonText}>{theme.strings.save}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
