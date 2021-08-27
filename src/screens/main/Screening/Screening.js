import { Image, TouchableOpacity, TextInput, SafeAreaView, Text, View, Platform, StatusBar, ScrollView } from "react-native";
import React, { Component } from "react";
import RNPickerSelect from "react-native-picker-select";
import Spinner from "react-native-loading-spinner-overlay";
import { NavigationHeader, Info } from "../../../components";
import { icons, images } from "../../../assets";
import { styles } from "./styles";
import { commonStyles } from '../../../commonStyles'
import { api } from "../../../api";
import { theme } from "../../../theme";
import Snackbar from "react-native-snackbar";
import { AppConstants, StorageUtils, timeConvert } from "../../../utils";


const { steptext, selectDevice, tempNote, textInputContainer, textInputStyle, downArrow, statusLable, dropDownInput, inputFieldLable } = styles
const { container, subContainer } = commonStyles
const items = [
    { label: 'Working as normal', value: 0 },
    { label: 'Isolated', value: 1 },
    { label: 'Awaiting Test Result', value: 2 },
    { label: 'Tested Positive', value: 3 },
    { label: 'Tested Negative', value: 4 },
]

export default class Screening extends Component {

    constructor() {
        super()
        this.state = {
            selected_wrk_status: -1,
            heartRateValue: null, //140,
            o2SaturationValue: null, //98,
            selectedTempUnit: null,
            bodyTemperature: null,
            isFetchingData: false,
            user_modules: "",
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { oximterValues } = nextProps.navigation.state.params
        if (oximterValues) {
            return {
                heartRateValue: oximterValues.pulseRate,
                o2SaturationValue: oximterValues.oxigenLevel
            };
        }

        // Return null to indicate no change to state.
        return null;
    }

    async componentDidMount() {
        if (Platform.OS !== "ios") {
            StatusBar.setTranslucent(false);
            StatusBar.setBackgroundColor(theme.colors.colorPrimary);
          }
      
        const token = await this.getToken()
        StorageUtils.getValue('user_modules').then(r => this.setState({ user_modules: r || "" }));

        StorageUtils.getValue(AppConstants.SP.DEFAULT_TEMP_UNIT).then(
            (value) => {
                this.setState({ selectedTempUnit: value == 'F' ? 'Fahrenheit' : 'Celcius' });
            }
        );
    }

    navigateToDeviceScreen = () => {
        this.props.navigation.navigate("DevicesScreen", { origin: 'Screening' })
    }

    getToken = async () => {
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
        if (token) {
            return token;
        }
        return;
    }

    getTimeOffset = () => {
        const date = new Date();
        const offset = date.getTimezoneOffset() / 60;
        const offsetHours = offset < 0 ? Math.abs(offset) : -offset;
        const { hours, minutes, sign } = timeConvert(offsetHours);
        const dateISO = date.toISOString().replace("Z", "");
        const nDate = `${dateISO}${sign === "+" ? "-" : "+"}${hours}:${minutes}`;
        const localDate = new Date(nDate);

        return {
            offsetHours: offsetHours.toString(),
            clientSideDate: localDate.toISOString(),
        };
    };

    submitScreenData = async () => {
        const { selected_wrk_status, heartRateValue, o2SaturationValue, bodyTemperature } = this.state

        if (selected_wrk_status !== -1 && selected_wrk_status !== 'Status') {
            let message = theme.strings.heart_rate
            if (!heartRateValue || !o2SaturationValue) {
                Snackbar.show({ text: "Please Enter " + message, duration: Snackbar.LENGTH_LONG, })
            }
            else if (!bodyTemperature || bodyTemperature == '') {
                Snackbar.show({ text: "Please Enter " + theme.strings.temperature, duration: Snackbar.LENGTH_LONG, })
            }
            else {
                const token = await this.getToken()
                const { navigation } = this.props
                const { offsetHours, clientSideDate } = this.getTimeOffset()
                let apiPayload = {
                    temperature: bodyTemperature,
                    oxygen: o2SaturationValue,
                    hrv: 0,
                    heartRate: heartRateValue,
                    clientSideDate: clientSideDate,
                    offsetHours: offsetHours,
                    hrvStatus: selected_wrk_status
                }

                this.setState({ isFetchingData: true })
                const serviceUrl = api.addScreeningScore
                fetch(serviceUrl, {
                        method: "post",
                        headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
                        body: JSON.stringify(apiPayload),
                    })
                    .then((response) => {
                        
                        if (response.ok) return response.json();
                        else{
                            console.log("************* ERROR Response from ****************")
                            console.log(serviceUrl)
                            console.log("Payload: ")
                            console.log(JSON.stringify(apiPayload, 0, 2))
                            console.log("Response: ")
                            console.log(JSON.stringify(response, 0, 2))
                            console.log("*****************************")
                            Snackbar.show({ text: "Something went wrong ! Try again", duration: Snackbar.LENGTH_LONG, });
                        }
                        this.setState({ isFetchingData: false })
                    })
                    .then((json) => {
                        if (json) this.setState({ isFetchingData: false }, ()=> {navigation.navigate("HomeScreen", { refreshData: true }  )})                                                        
                    })
                    .catch((error) => {
                        this.setState({ isFetchingData: false })
                        Snackbar.show({ text: "Something went wrong ! Try again later", duration: Snackbar.LENGTH_LONG, })
                    })
            }
        }
        else {
            Snackbar.show({ text: "Please select working status", duration: Snackbar.LENGTH_LONG, })
        }
    }

    onChangeTempValue = (value) => {
        this.setState({ bodyTemperature: value })
    }

    getPickerComponent = () => {
        const { selected_wrk_status } = this.state
        return (
            <View style={styles.pickerRoot}>
                <RNPickerSelect
                    value={selected_wrk_status}
                    placeholder={{ label: "Status", value: "Status" }}
                    onValueChange={(val) => {
                        this.setState({ selected_wrk_status: val });
                    }}
                    items={items}
                    style={{
                        ...dropDownInput,
                        iconContainer: {
                            top: Platform.OS === 'ios' ? 7 : 20,
                            right: 20,
                        },
                        placeholder: {
                            color: theme.colors.black,
                            fontSize: 17,
                            fontWeight: 'bold',
                        },
                    }}
                    Icon={() => {
                        return <Image source={icons.down_arrow} style={downArrow} />;
                    }}
                />
            </View>
        )
    }

    onVeyetalsClick(){
        if (this.state.user_modules.indexOf('Veyetals') < 0) {
            alert("Please upgrade your package");
            return;
        }

        this.props.navigation.navigate("Streamer", {
            origin: 'Screening',
            onSaveCallback: (values) => {
                console.log("values: ", values);
                if (values) {
                    this.setState({
                        heartRateValue: values.heartRate || "",
                        o2SaturationValue: values.oxygenLevel || "",
                        // bodyTemperature: values.oxygenLevel || "",
                    })
                }
                // deviceTag, heartRate, hrv, oxygenLevel, respiratoryRate, stressLevel
            },
            onBackPress: () => this.props.navigation.goBack()
        })
    }

    render() {

        const { heartRateValue, o2SaturationValue, selectedTempUnit, selected_wrk_status, isFetchingData } = this.state

        return (<View style={[container,{paddingTop: Platform.OS === "ios" ? 40 : 25,backgroundColor: theme.colors.colorPrimary}]}>
            <NavigationHeader title={'Start Screening'} leftText={'Back'} navigation={this.props.navigation} />
            <View style={subContainer}>
                <SafeAreaView>
                    <ScrollView>
                        <View style={{ padding: 16, marginBottom: 20 }}>
                            <Spinner visible={isFetchingData} />
                            <Text style={steptext}>{theme.strings.step_1}</Text>
                            <Text style={selectDevice}>{theme.strings.select_device}</Text>
                            <Text style={tempNote}>{theme.strings.temp_note}</Text>
                            <Text style={inputFieldLable}>{theme.strings.heart_rate + ' (bpm)'}</Text>
                            <View style={textInputContainer}>
                                <TextInput
                                    style={[theme.palette.textInputRoundBg, textInputStyle]}
                                    placeholder={theme.strings.heart_rate + ' (bpm)'}
                                    placeholderTextColor={theme.colors.grey_shade_1}
                                    editable={false}
                                    value={heartRateValue ? heartRateValue + "" : heartRateValue}
                                />
                                <Info type="heart-rate-info" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />

                            </View>                        

                            <Text style={inputFieldLable}>{theme.strings.o2_saturation}</Text>
                            <View style={textInputContainer}>
                                <TextInput
                                    style={[theme.palette.textInputRoundBg, textInputStyle]}
                                    placeholder={theme.strings.o2_saturation}
                                    placeholderTextColor={theme.colors.grey_shade_1}
                                    editable={false}
                                    value={o2SaturationValue ? o2SaturationValue + "" : o2SaturationValue}
                                />
                                <Info type="oxigen-saturation" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />
                            </View>

                            <Text style={inputFieldLable}>{theme.strings.temperature + ` (${selectedTempUnit})`}</Text>
                            <View style={textInputContainer}>
                                <TextInput
                                    style={[theme.palette.textInputRoundBg, textInputStyle]}
                                    placeholder={theme.strings.temperature + ` (${selectedTempUnit})`}
                                    placeholderTextColor={theme.colors.grey_shade_1}
                                    keyboardType='decimal-pad'
                                    maxLength={5}
                                    onChangeText={this.onChangeTempValue}
                                    value={this.state.bodyTemperature}
                                />
                                <Info type="body-temperature" icon="information-outline" containerStyle={{ marginRight: 0 }} color={theme.colors.colorPrimary} />
                            </View>

                            <TouchableOpacity
                                onPress={this.navigateToDeviceScreen}
                                activeOpacity={0.8}
                                style={[theme.palette.nextButton, { width: 160, alignSelf: 'center', marginVertical: 20 }]}
                            >
                                <Text style={theme.palette.buttonText}>Connect Devices</Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8}
                                disabled={this.state.user_modules.indexOf('Veyetals') < 0}
                                onPress={() => this.onVeyetalsClick()}
                                style={[theme.palette.nextButton, { width: 160, alignSelf: 'center', marginVertical: 20, ...(this.state.user_modules.indexOf('Veyetals') < 0 ? {backgroundColor:"#CCCCCC"} : {}) }]}
                            >
                                <Text style={theme.palette.buttonText}>Veyetals</Text>
                            </TouchableOpacity>

                            <Text style={steptext}>{theme.strings.step_2}</Text>
                            <Text style={statusLable}>{theme.strings.select_wrk_status}</Text>
                            {this.getPickerComponent()}
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={this.submitScreenData}
                                style={[theme.palette.nextButton, { width: 160, alignSelf: 'center', marginVertical: 20 }]}
                            >
                                <Text style={theme.palette.buttonText}>Save Data</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>)
    }
}