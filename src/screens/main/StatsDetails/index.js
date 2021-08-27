import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, StatusBar, Platform, ActivityIndicator, Dimensions, ScrollView } from 'react-native'
import moment from 'moment'
import _ from "lodash";
import Snackbar from "react-native-snackbar";
import { NavigationHeader, CustomSwitch, Row, Col, DropDown } from "../../../components";
import { icons, images } from "../../../assets";
import { theme } from "../../../theme";
import { getLocalDate, AppConstants, StorageUtils, Utils, showMessage } from "../../../utils";
import Updater from "../../../utils/updater";
import { api } from "../../../api";
import { fetchApiData } from '../../../apicall'
import { unitList, alertList } from '../../../configs'
import { getDeviceList } from '../../../utils/fetcher';
import { commonStyles } from '../../../commonStyles'

const Hr = props => <View style={{ borderBottomWidth: 1, borderColor: "#BCBCBC", marginHorizontal: 10, marginVertical: 10 }} />

const { timeOffset, dateString } = getLocalDate();

const Loader = props => props.loading ? <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", top: 0, left: 0, padding: 50, alignItems: "center", justifyContent: "center", width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1, position: "absolute", borderBottomColor: "#BCBCBC", }}><ActivityIndicator size="large" color="#FFFFFF" animating={true} /></View> : null;


export class StatsDetails extends Component {
    constructor(props) {
        super(props)
        this.title = props.navigation.getParam("title", "Statistics");
        this.seniorId = props.navigation.getParam("seniorId", null);
        this.subHeading = props.navigation.getParam("subHeading", "DAILY AVERAGE");
        // this.unit = props.navigation.getParam("unit", "");
        this.average = props.navigation.getParam("average", undefined);
        this.lastValue = props.navigation.getParam("lastValue", undefined);
        this.lastValueDate = props.navigation.getParam("lastValueDate", undefined);
        this.gradiantColors = props.navigation.getParam("gradiantColors", "");
        this.headerColor = props.navigation.getParam("headerColor", theme.colors.colorPrimary);
        this.screenType = props.navigation.getParam("screenType", "");
        this.infoType = props.navigation.getParam("infoType", "");

        this.state = {
            loading: true,

            disableHistory:false,
            timeOffsetState: null,
            statsDateState: null,
            // heartRateType: 0,
            selectedDeviceTag: null,
            selectedDurationTab: 2,
            apiDataresult: null,
            deviceApiDataResult: [],
            startDate: moment().subtract(3, 'months').add(1, 'days').format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
            last30DayAvg: null,
            lastCapturedValue: null,
            lastCapturedDate: null,
            fallLastValue: '',
            fallLastValueDate: '',
            unit: props.navigation.getParam("unit", ""), //'mmol/L',
            
            selectedUnitIndex: this.getCurrentIndex(), //0,

            deviceList:null,
            defaultSelectedDevice: null,
        }
        this.token = ''
        this.valueUnit = ''
        this.selectedUnit = '0'

        this.getCurrentUnits = this.getCurrentUnits.bind(this);
        this.getSelectedUnit = this.getSelectedUnit.bind(this);
        this.avalableUnitsSelector = this.avalableUnitsSelector.bind(this);

    }

    async componentDidMount() {
        if (Platform.OS !== "ios") {
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor("transparent");
        }
        this.token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN)
        this.selectedUnit = await StorageUtils.getValue(AppConstants.SP.DEFAULT_GLUCOSE_UNIT)
        this.role = await StorageUtils.getValue(AppConstants.SP.ROLE)

        const selectedDeviceTag = this.props.navigation.getParam("selectedDeviceTag", "")
        this.focusListener = this.props.navigation.addListener("didFocus", async () => {
        this.setState({ selectedDeviceTag }, () => this.getGraphStats());     
        })
    }

    getCurrentIndex() {
        let unit = this.props.navigation.getParam("unit", "");
        let _currentUnits = this.getCurrentUnits();
        let index = _currentUnits.findIndex(o => o['name'] == unit);
        return index || 0;
    }

    getGraphStats = async () => {
        const selectedTitle = this.title
        const seniorId = this.seniorId
        const { timeOffsetState, statsDateState, selectedDeviceTag, startDate, endDate, } = this.state;

        if (!selectedDeviceTag){
            // alert("No device tag found");
            console.log("ERROR: ", "No device tag found");
            this.setState({ loading: false });
            return;
        }

        const _selectedDeviceTag = selectedDeviceTag ? selectedDeviceTag : (defaultSelectedDevice ? defaultSelectedDevice.value : null);

        this.setState({ loading: true });

        await getDeviceList(this.seniorId, this.title, _selectedDeviceTag).then(response => {
            const { defaultSelectedDevice, deviceList } = response;
            this.setState({ defaultSelectedDevice, deviceList });
            return response;
        });

        // generate api URL
        let serviceUrl = null;
        switch (selectedTitle) {
            case 'Heart Rate':
                serviceUrl = `${api.healthStatsDayAvg}hr/${seniorId}/${startDate}/${endDate}?deviceTag=${_selectedDeviceTag}&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`
                break;
            case 'Step Count':
                serviceUrl = `${api.healthStatsDayAvg}stepsCount/${seniorId}/${startDate}/${endDate}?deviceTag=${_selectedDeviceTag}&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`
                break;
            case 'HR Variability':
                serviceUrl = `${api.healthStatsDayAvg}HRV/${seniorId}/${startDate}/${endDate}?deviceTag=${_selectedDeviceTag}&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`
                break;
            case 'Body Temperature':
                serviceUrl = `${api.healthStatsDayAvg}temprature/${seniorId}/${startDate}/${endDate}?deviceTag=${_selectedDeviceTag}&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`
                break;
            case 'Sleep':
                serviceUrl = `${api.healthStatsDayAvg}sleep/${seniorId}/${startDate}/${endDate}?deviceTag=${_selectedDeviceTag}&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`
                break;
            case 'Falls':
                serviceUrl = `${api.healthStatsDayAvg}FallAccur/${seniorId}/${startDate}/${endDate}?deviceTag=${_selectedDeviceTag}&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`
                break;
            case 'Blood Pressure':
                serviceUrl = `${api.healthStatsDayAvg}BloodPressure/${seniorId}/${startDate}/${endDate}?deviceTag=${_selectedDeviceTag}&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`
                break;
            case 'Oxygen Saturation':
                serviceUrl = `${api.healthStatsDayAvg}oxygen/${seniorId}/${startDate}/${endDate}?deviceTag=${_selectedDeviceTag}&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`
                break;
            case 'Blood Glucose':
                serviceUrl = `${api.healthStatsDayAvg}bloodGlucose/${seniorId}/${startDate}/${endDate}?deviceTag=${_selectedDeviceTag}&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`
                break;
            case 'Weight':
                serviceUrl = `${api.healthStatsDayAvg}weight/${seniorId}/${startDate}/${endDate}?deviceTag=${_selectedDeviceTag}&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`
                break;
            default:
                serviceUrl = null
        }
        const payload = { token: this.token, serviceUrl, method: 'get' }
        
        const statsDataResult = await fetchApiData(payload);
        if (!statsDataResult || statsDataResult.error){
            this.setState({ error: true, loading: false, apiDataresult: null });
            return;
        }

        if (selectedTitle == 'Falls'){
            const uri = `${api.healthStatsLastCaptured}${seniorId}?OffSetHours=${timeOffset}`;
            const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
            const res = await fetch(uri, {
              method: "get",
              headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
            })
              .then(jsonData => jsonData.json())
              .then(r => {
                return r;
              })
              .catch(err => {
                console.log({ error: "API Call Error" }, err)
                return { error: err }
              });
              debugger
            this.setState({fallLastValue: res.fallAccur,fallLastValueDate: res.fallAccurDate})
        }

        let last30DayAvg = null;
        let lastCapturedValue = null;
        let lastCapturedDate = null;


        if (selectedTitle == 'Blood Pressure') {
            // console.log("statsDataResult.data.lastCapturedDateSystolic: ", statsDataResult.data.lastCapturedDateSystolic == "0001-01-01T00:00:00" ? "NULL" : "NOT NuLL");
            last30DayAvg = `${statsDataResult.data.last30DayAvgSystolic} / ${statsDataResult.data.last30DayAvgDiastolic}`
            lastCapturedValue = `${statsDataResult.data.lastCapturedValueSystolic} / ${statsDataResult.data.lastCapturedValueDiastolic}`
            if (statsDataResult.data.lastCapturedDateSystolic == "0001-01-01T00:00:00" || statsDataResult.data.lastCapturedDateDiastolic == "0001-01-01T00:00:00") {
                // lastCapturedDate = null;
            } else {
                lastCapturedDate = `${statsDataResult.data.lastCapturedDateSystolic} / ${statsDataResult.data.lastCapturedDateDiastolic}`;
            }
        } else {
            last30DayAvg = statsDataResult.data.last30DayAvg == 0 ? null : _.round(statsDataResult.data.last30DayAvg, 1)
            lastCapturedValue = statsDataResult.data.lastCapturedValue == 0 ? null : statsDataResult.data.lastCapturedValue;
            lastCapturedDate = (statsDataResult.data.lastCapturedDate == "0001-01-01T00:00:00" || !statsDataResult.data.lastCapturedDate) ? null : statsDataResult.data.lastCapturedDate;
        }

        this.setState({
            last30DayAvg,
            lastCapturedValue,
            lastCapturedDate,
            apiDataresult: statsDataResult.data,
            loading: false,
        })

    }

    getTimeOffset = () => {
        const { timeOffset, dateString } = getLocalDate()
        this.setState({ timeOffsetState: timeOffset, statsDateState: dateString })
    }

    onClickTabItem = (value, index, item) => {
        this.setState({ selectedDeviceTag: value }, () => this.getGraphStats());
    }

    onClickDurationTab = (type) => {
        let startDate = moment().format("YYYY-MM-DD");

        if (type == 1) startDate = moment().subtract(1, 'week').add(1, 'days').format("YYYY-MM-DD")
        else if (type == 2) startDate = moment().subtract(1, 'months').add(1, 'days').format("YYYY-MM-DD")
        else if (type == 3) startDate = moment().subtract(3, 'months').add(1, 'days').format("YYYY-MM-DD")

        this.setState({ startDate, selectedDurationTab: type }, () => this.getGraphStats())
    }

    getCurrentUnits(args = {}) {
        let infoKey = args.title || this.title; // this.props.navigation.getParam("infoType", "");
        let key = infoKey.toLowerCase().replace(" ", "_");
        return unitList[key] || [{ value: 1, name: this.props.navigation.getParam("unit", "") }];
    }
    getSelectedUnit(args = {}) {
        let units = this.getCurrentUnits(args);
        return units ? units[this.state.selectedUnitIndex] : false;
    }
    avalableUnitsSelector(args = {}) {
        let units = this.getCurrentUnits(args);
        if (!units) return null;
        if (units.length == 1) return null;

        if (!this.state.selectedUnitIndex && this.state.selectedUnitIndex !== 0) this.setState({ selectedUnitIndex: 0 })

        return <CustomSwitch tabItems={units} textSize={12}
            selectedIndex={this.state.selectedUnitIndex}
            onPressCallBack={(selectedUnitIndex) => {
                // const formula = unitList[this.state.selectedUnitIndex].formula;
                this.setState({ selectedUnitIndex })
            }} />

    }

    RenderHeader = () => {
        let { lastCapturedValue, lastCapturedDate, selectedDeviceTag, fallLastValue,fallLastValueDate } = this.state;
        // const selectedDeviceTag = this.state.selectedDevice ? this.state.selectedDevice.value : this.selectedDeviceTag;
        
        const title = this.title
        let unitData = this.getSelectedUnit()
        let lastValue = lastCapturedValue; //unitData.formula ? unitData.formula(lastCapturedValue) : lastCapturedValue;
        // let lastValueDate = lastCapturedDate;

        var icon = null;
        if (this.infoType == 'heart-rate') icon = icons.stats.hrx90;
        if (this.infoType == 'stepe-count') icon = icons.stats.scx90;
        if (this.infoType == 'heart-rate-variation') icon = icons.stats.hrvx90;
        if (this.infoType == 'body-temp') icon = icons.stats.btx90;
        if (this.infoType == 'oxygen') icon = icons.stats.osx90;
        if (this.infoType == 'blood-pressure') icon = icons.stats.bpx90;
        if (this.infoType == 'blood-sugar') icon = icons.stats.bgx90;
        if (this.infoType == 'sleep') icon = icons.stats.sleepx90;
        if (this.infoType == 'weight') icon = icons.stats.weightx90;
        if (this.infoType == 'falls') icon = icons.stats.fallx90;

        let timeObj = null;
        if (this.infoType == 'sleep' && lastValue){
            // timeObj = Utils.minToHours(lastValue, true);
            timeObj = lastValue > 59 ? Utils.minToHours(lastValue, true) : { minutes: lastValue, hours: 0 };
        }

        let units = this.getCurrentUnits()[this.state.selectedUnitIndex];
        let convertedValus = (units.formula && lastValue) ? units.formula(lastValue, units.name) : lastValue;

        return (<View style={styles.head}>
            {/* <Text>seniorId: {this.seniorId}</Text> */}
            <View><Image source={icon} /></View>
            {this.infoType != 'sleep' && this.infoType !== 'falls' &&
                <Text style={{ fontSize: 50, fontWeight: "bold", marginTop: 20, marginBottom: 20,textAlign: 'center', }}>{convertedValus || "-"}{lastValue ? <Text style={{ fontSize: 32 }}> {unitData.name}</Text> : null}</Text>
                // <Text style={{ fontSize: 50, fontWeight: "bold", marginTop: 20, marginBottom: 20 }}>{lastValue || "-"}{lastValue ? <Text style={{ fontSize: 32 }}> {unitData.name}</Text> : null}</Text>
            }
            {/* {!timeObj && <Text style={{ fontSize: 25, fontWeight: "bold", marginTop: 20, marginBottom: 20 }}></Text>} */}
            {(this.infoType == 'sleep') &&
                <Text style={{ fontSize: 25, fontWeight: "bold", marginTop: 20, marginBottom: 20 }}>
                    <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{(!timeObj || (!timeObj.hours && !timeObj.minutes)) ? "-" : timeObj.hours || "0"}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "normal" }}>hrs</Text>
                    <Text style={{ fontWeight: "bold",  }}> - </Text>
                    <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{(timeObj && timeObj.minutes || "00")}</Text>
                    <Text style={{ fontSize: 14, fontWeight: "normal", textAlign: "center" }}>min</Text>
                    {/* {(timeObj && timeObj.hours) ? <>{timeObj.hours || "-"} <Text style={{ fontSize: 16, fontWeight: "normal" }}>hrs</Text></> : null}
                    {(timeObj && timeObj.minutes) ? <>{!timeObj.hours ? "-" : (timeObj.minutes || "00")}<Text style={{ fontSize: 16, fontWeight: "normal" }}> min</Text></> : null} */}
                </Text>
            }

{ this.infoType == 'falls' &&
             <>
                <View style={{width: '60%', flexDirection: 'row', fontSize: 25, fontWeight: "bold", marginTop: 20, marginBottom: 20 }}>
                    <Text style={{width: '60%', fontSize: 21, fontWeight: "bold", }}>Falls:</Text>
                    <Text>
                    <Text style={{fontSize: 21, fontWeight: "bold", textAlign: "center" }}>{fallLastValue > 0?  fallLastValue: '-'}</Text>
                    { fallLastValue > 0 && <Text style={{ fontSize: 10,fontWeight: "bold", textAlign: "center" }}>/24hrs</Text>}
                    </Text>
                </View>    
                {/* <View style={{width: '60%',flexDirection: 'row', fontSize: 25, fontWeight: "bold", marginBottom: 20 }}>
                    <Text style={{width: '60%', fontSize: 21, fontWeight: "bold" }}>Fall Risk:</Text>
                    <Text style={{ fontSize: 21, fontWeight: "bold", textAlign: "center" }}>Medium</Text>
                </View>     */}
                </>
            }

         {  this.infoType == 'falls'?
               (fallLastValue > 0 && <Row>
                    <Col flex="auto" >
                        <Text style={{ fontSize: 16, color: "#979797", textAlign: "center" }}>Last updated: {moment(fallLastValueDate, "YYYY-MM-DDThh:mm:ss").format("Do MMM, YYYY - hh:mm A")}</Text>
                    </Col>
                </Row>):
                (lastCapturedDate!=null && <Row>
                    <Col flex="auto" >
                        <Text style={{ fontSize: 16, color: "#979797", textAlign: "center" }}>Last updated: {moment(lastCapturedDate, "YYYY-MM-DDThh:mm:ss").format("Do MMM, YYYY - hh:mm A")}</Text>
                    </Col>
                </Row>
                )}
                
            {lastCapturedDate!=null && <>
           
                {selectedDeviceTag &&
                    <Row style={{ marginTop: 30, width: "100%" }}><Col flex="auto">
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom:3 }}>Connected Devices:</Text>
                        <DropDown 
                            textStyle={{color:"#000"}} style={{ paddingHorizontal: 15, width: "100%"}}
                            data={this.state.deviceList}
                            value={selectedDeviceTag}
                            onChange={(value, index, item) => {
                                this.onClickTabItem(value, index, item);
                                // changeSelectedValue(value, index, item)
                            }}
                        />
                    </Col></Row>
                }
            </>}
            

        </View>
        )
    }

    getProfileData = async () => {
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN)
        const payload = { token, serviceUrl: api.profile, method: 'get' }
        const profileData = await fetchApiData(payload);

        if (!profileData || profileData.error) {
            showMessage("Unable to update at the moment");
            return false;
        }
        else return profileData;
    }
    updateProfile = async (_args) => {
        const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN)
        let __profile = await this.getProfileData();
        console.log("__profile: ", __profile);
        if (!__profile || __profile.error) return false;
        
        const _profile = __profile.data;
        const args = _args || {};
        
        let fieldsString = "firstName,lastName,jobTitle,shiftStartTime,shiftEndTime,email";
        fieldsString += ",imagePath,profileDescription,address,phone,height,weight,heightInFeet,heightInInches,dateOfBirth";
        fieldsString += ",heightUnit,weightUnit,clockUnit,temperatureUnit,roleName,agentEmail,state,gender,country,bloodSugarUnit";
        fieldsString += ",isFamilyDetailShared,isAllergyShared,isDailyIterationShared,isGeofenceShared,isMedicationShared,isAssessmentShared,careHomeOffice";
        
        const formData = new FormData();
        // formData.append("firstName", args.firstName || _profile.firstName);
        let fieldsArray = fieldsString.split(",");
        for (let a = 0; a < fieldsArray.length; a++){
            if (args[fieldsArray[a]] || _profile[fieldsArray[a]]) formData.append(fieldsArray[a], args[fieldsArray[a]] || _profile[fieldsArray[a]]);
        }

        // console.log("formData: ", formData); return false;

        var isSuccess = false;

        await fetch(api.profile, {
                method: "put",
                headers: { Accept: "application/json", "Content-Type": "multipart/form-data", Authorization: ("Bearer " + token) },
                body: formData
            })
            .then((response) => {
                console.log('Profile update response: ', response)
                if (!response.ok && response.status === 413) {
                    isSuccess=false;
                    showMessage("File size too large!");
                    throw Error("File size too large!");
                } else {
                    isSuccess=true;
                    return response.json();
                }
            })
            .then((json) => {
                // this.setState({ spinner: false })
                if (json.errors) {
                    isSuccess = false;
                    setTimeout(
                        function () {
                            Snackbar.show({
                                text: `Error in updating profile${json.errors.AgentEmail ? ": " + json.errors.AgentEmail
                                    : ( json.errors[0] ? ": " + json.errors[0].description : "" )
                                    }`,
                                duration: Snackbar.LENGTH_LONG,
                            });
                        }.bind(this),
                        200
                    );
                    return;
                }
                if (json) {
                    isSuccess = true;
                    StorageUtils.storeInStorage(AppConstants.SP.FIRST_NAME,json.firstName);
                    StorageUtils.storeInStorage(AppConstants.SP.LAST_NAME,json.lastName);
                    StorageUtils.storeInStorage(AppConstants.SP.PHONE, json.phone);
                }
                // this.goBackToProfileScreen()
            })
            .catch((error) => {
                isSuccess = false;
                // this.setState({ spinner: false });
                setTimeout(
                    function () {
                        Snackbar.show({ text: "" + error, duration: Snackbar.LENGTH_LONG, });
                    }.bind(this),
                    200
                )
            })

        return isSuccess;

    }

    onUnitchange = async selectedUnitIndex => {
        this.setState({ selectedUnitIndex });

        let units = this.getCurrentUnits()
        let unit = units[selectedUnitIndex];
        
        let fields = {}
        if (this.infoType == 'body-temp') Object.assign(fields, { temperatureUnit: unit.value })
        if (this.infoType == 'blood-sugar') Object.assign(fields, { bloodSugarUnit: unit.value })
        if (this.infoType == 'weight') Object.assign(fields, { weightUnit: unit.value })

        let updated = await Updater.updateProfile({input:fields});
        if (!updated) showMessage("Unable to update at the moment");
    }


    render() {
        const { loading, busy, selectedDeviceTag } = this.state;
        const { navigation } = this.props;
        var alertData,alertData_BP_Sys;
        if(this.infoType == 'blood-pressure'){
        alertData = alertList.find(o => o.infoType == 'blood-pressure-dis')
        alertData_BP_Sys = alertList.find(o => o.infoType == 'blood-pressure-sys')
        }else{
        alertData = alertList.find(o => o.infoType == navigation.getParam('infoType', ''))
        }
        
        if (this.state.fatelError) return <Text style={{textAlign:"center", padding:30}}>{this.state.fatelError}</Text>

        return (<View style={commonStyles.full_page_container}>
            <NavigationHeader title={'Health Data'} leftText={'Back'} navigation={navigation} />

            <ScrollView style={commonStyles.container}><View style={commonStyles.subContainer}>
                <this.RenderHeader />

                {(this.state.lastCapturedValue && this.getCurrentUnits().length > 1) &&
                <Row style={{marginBottom:10}}>
                    <Col align="center" flex="auto">
                        <CustomSwitch tabItems={this.getCurrentUnits()} textSize={12}
                            selectedIndex={this.state.selectedUnitIndex}
                            onPressCallBack={(selectedUnitIndex) => this.onUnitchange(selectedUnitIndex)}
                        />
                    </Col>
                </Row>
                    }

                <View style={{ backgroundColor: "#F3F3F3", padding: 10, borderRadius: 5 }}>

                {this.role !=='caretaker' &&  this.infoType !== 'falls' &&<>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate("DevicesScreen", { seniorId: this.seniorId, /*watchPaired, watchTitle, */ })} 
                            style={{borderRadius:5 }}
                        >
                            <Row>
                                <Col valign="center"><Image source={icons.stats.adddevice_blue_corner} /></Col>
                                <Col valign="center" flex="auto"><Text style={{ padding: 10,}}>Take Readings via Device</Text></Col>
                                <Col valign="center"><Image source={icons.disclosure} /></Col>
                            </Row>
                        </TouchableOpacity>
                        <Hr />
                    </>}


                    {this.role !=='caretaker' &&<>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate("ManuallyReadingsScreen", { seniorId: this.seniorId, /*watchPaired, watchTitle, */ })} 
                            style={{ borderRadius:5 }}
                        >
                            <Row>
                                <Col valign="center"><Image source={icons.stats.addManual_blue_corner} /></Col>
                                <Col valign="center" flex="auto"><Text style={{ padding: 10, }}>Take Readings Manually</Text></Col>
                                <Col valign="center"><Image source={icons.disclosure} /></Col>
                            </Row>
                        </TouchableOpacity>
                        <Hr />
                    </>}

                    <TouchableOpacity disabled={this.state.disableHistory || !selectedDeviceTag} 
                        style={{ opacity: (selectedDeviceTag ? 1 : 0.5) }}
                        onPress={() =>
                            // navigation.navigate("StatsDetails", {
                            navigation.navigate("StatisticsScreen", { ...navigation.state.params, infoType:alertData, infoTypeBpSys: alertData_BP_Sys  })
                        }
                    >
                        <Row>
                            <Col valign="center"><Image source={icons.stats.history_blue_corner} /></Col>
                            <Col valign="center" flex="auto"><Text style={{ padding: 10 }}>History</Text></Col>
                            {!this.state.disableHistory && selectedDeviceTag && <Col valign="center"><Image source={icons.disclosure} /></Col>}
                        </Row>
                    </TouchableOpacity>
                    <Hr />
                    {/* <TouchableOpacity onPress={() => navigation.navigate("StatisticAlerts")}><Row> */}
                    <TouchableOpacity onPress={() => alertData.infoType != 'blood-pressure-dis' ? navigation.navigate("SetAlertPreferences", { ...navigation.state.params, alertData}) : navigation.navigate("StatisticAlerts",{ seniorId:this.seniorId })}><Row>
                        <Col valign="center"><Image source={icons.stats.alerts_blue_corner} /></Col>
                        <Col valign="center" flex="auto"><Text style={{ padding: 10 }}>Set Alert Settings</Text></Col>
                        <Col valign="center"><Image source={icons.disclosure} /></Col>
                    </Row></TouchableOpacity>
                </View>
            </View></ScrollView>
            <Loader loading={loading} />
        </View>)
    }

}


export default StatsDetails;


export const styles = StyleSheet.create({
    container: {
        // flex:1,
        backgroundColor: "#FFFFFF",
        padding: 10,
        paddingBottom: 20,
    },
    head: {
        // borderWidth:1,
        minHeight: 200,
        paddingHorizontal: 20,
        marginVertical: 20,
        alignItems: "center"
    },
})


// StatsDetails.navigationOptions = ({ navigation }) => {
//     // const title = navigation.getParam("title", "Statistics Details");
//     return {
//         title: "Health Data", // title === title,
//         // headerBackTitle: "",
//         // headerTintColor: "white",
//         // headerTitleStyle: { fontSize: 17 },
//         // headerStyle: {
//         //     backgroundColor: theme.colors.colorPrimary,
//         //     shadowRadius: 0,
//         //     shadowOffset: { height: 0 },
//         // },
//         // headerRight: () => (
//         //     <Icon
//         //         name={title === "Heart Rate" ? "settings" : "upload"}
//         //         type="material-community"
//         //         size={24}
//         //         color="white"
//         //         style={{ marginRight: 16 }}
//         //     />
//         // ),
//         // headerRightContainerStyle: { marginRight: 12 },
//     }
// }
