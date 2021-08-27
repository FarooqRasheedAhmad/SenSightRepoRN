import { Icon } from "react-native-elements";
// import DropDownPicker from 'react-native-dropdown-picker';
// import { Dropdown } from 'react-native-material-dropdown';
// import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { NavigationHeader, NoDataState, StaticsDuratonTabView, StatisticsChart, StatsDetailItem, CustomSwitch, Row, Col, DropDown } from "../../../components";
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View, Button } from "react-native";
import React, { Component } from "react";
import Snackbar from "react-native-snackbar";
import moment from "moment";
import _ from "lodash";
import { fetchApiData } from '../../../apicall'
import { api } from "../../../api";
import { getLocalDate, AppConstants, StorageUtils } from "../../../utils";
import { theme } from "../../../theme";
import { unitList } from '../../../configs'
import { getDeviceList } from '../../../utils/fetcher';
import { commonStyles } from '../../../commonStyles'

const options = [{ name: "Watch" }, { name: "Polar Strap" }, { name: "Oximeter" }];


const { timeOffset, dateString } = getLocalDate();
var that = null
export class StatisticsScreen extends Component {
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

    // this.infoType = props.navigation.getParam("infoType", "");

    this.state = {
      startLimit:null, endLimit:null,
      bpSysStartLImit: null, bpSysEndLimit: null,
      loading: true,
      selectedDeviceTag: null,
      selectedDevice: null,
      defaultSelectedDevice: null,

      timeOffsetState: null,
      statsDateState: null,
      // heartRateType: 0,
      selectedDurationTab: 2,
      apiDataresult: null,
      // deviceApiDataResult: [],
      startDate: moment().subtract(1, 'months').add(1, 'days').format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      last30DayAvg: null,
      lastCapturedValue: null,
      lastCapturedDate: null,
      unit: props.navigation.getParam("unit", ""), //'mmol/L',
      selectedUnitIndex:0,

    }
    that = this
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

    const selectedDeviceTag = this.props.navigation.getParam("selectedDeviceTag", "")
    this.setState({ selectedDeviceTag }, () => this.getGraphStats());

    this.getAlertsSettings();

  }

  getAlertsSettings = async () => {
    console.log("getAlertsSettings()");
    
    const seniorId = this.props.navigation.getParam("seniorId");
    const infoType = this.props.navigation.getParam("infoType");
    const infoTypeBpSys = this.props.navigation.getParam("infoTypeBpSys");
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);

    if (!seniorId || !infoType || !token){
      console.log("not enough info available to fetch upper/lower limit");
      return;
    }

    const serviceUrl = `${api.setPatientActivity}/${seniorId}/${infoType.activityName}`;
    const statsDataResult = await fetchApiData({ token, serviceUrl, method: 'get' });

     if(infoTypeBpSys){
      const serviceUrl = `${api.setPatientActivity}/${seniorId}/${infoTypeBpSys.activityName}`;
      const  statsData_BP_Sys = await fetchApiData({ token, serviceUrl, method: 'get' });
      console.log("BPsystolic..........",statsData_BP_Sys)
      const { startLimit, endLimit } = statsData_BP_Sys.data
      this.setState({bpSysStartLImit:startLimit,bpSysEndLimit:endLimit})
     }

    if (!statsDataResult) {
      console.log("statsDataResult: ", statsDataResult);
      this.setState({ error: "Unable to communicate with server!" });
      return;
    }
    const { startLimit, endLimit, redAlertSetting } = statsDataResult.data

    this.setState({ startLimit, endLimit })
    
  }

  getGraphStats = async () => {
    const selectedTitle = this.title
    const seniorId = this.seniorId
    const { timeOffsetState, statsDateState, selectedDeviceTag, startDate, endDate, } = this.state;

    if (!selectedDeviceTag) {
      alert("No device tag found");
      return;
    }

    const _selectedDeviceTag = selectedDeviceTag ? selectedDeviceTag : (defaultSelectedDevice ? defaultSelectedDevice.value : null);

    this.setState({ loading: true });

    await getDeviceList(this.seniorId, this.title, _selectedDeviceTag).then(response => {
      const { defaultSelectedDevice, deviceList } = response;
      this.setState({ defaultSelectedDevice, deviceList, selectedDeviceTag: _selectedDeviceTag });

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
    if (!statsDataResult || statsDataResult.error) {
      this.setState({ error: true, loading: false, apiDataresult: null });
      return;
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

  onClickTabItem = (value, index, item) => {
    this.setState({ selectedDeviceTag: value, selectedDevice: { index, ...item } }, () => this.getGraphStats());
  }

  onClickDurationTab = (type) => {
    let startDate = moment().format("YYYY-MM-DD");

    if (type == 1) startDate = moment().subtract(1, 'week').add(1, 'days').format("YYYY-MM-DD")
    else if (type == 2) startDate = moment().subtract(1, 'months').add(1, 'days').format("YYYY-MM-DD")
    else if (type == 3) startDate = moment().subtract(3, 'months').add(1, 'days').format("YYYY-MM-DD")

    this.setState({ startDate, selectedDurationTab: type }, () => this.getGraphStats())
  }

  renderList = (list) => {
    const title = this.title
    
    return (
      <View style={{ flex: 1 }}>
        <Row style={{margin:10, marginBottom:0, position:"relative", zIndex:999}}>
          <Col flex="auto" valign="center"><Text style={styles.headingTextStyle}>History</Text></Col>
          <Col style={{paddingRight:5}}>{this.avalableUnitsSelector()}</Col>
          <Col flex={140} align="flex-end">
              {/* <DropDown size={'small'} style={{width:"100%"}}
                data={this.state.deviceList}
                value={this.state.selectedDevice ? this.state.selectedDevice.value : null}
                // value={selectedValue} OR selectedIndex={2}
                onChange={(value, index, item) => {
                  this.onClickTabItem(value, index, item);
                }}
              /> */}
              <DropDown size={'small'} textStyle={{ color: "#000" }} style={{ width: "100%" }}
                data={this.state.deviceList}
                value={this.state.selectedDeviceTag}
                onChange={(value, index, item) => {
                  this.onClickTabItem(value, index, item);
                  // changeSelectedValue(value, index, item)
                }}
              />

              {/* <Dropdown 
                containerStyle={{ borderWidth: 0, height: 40, width: 140, margin:0, padding:0 }} 
                dropdownOffset={{top:0, left:0}}
                pickerStyle={{ borderWidth: 0, borderBottomWidth: 0}}
                itemTextStyle={{borderWidth:0, borderBottomWidth:0}}
                overlayStyle={{borderWidth:0, borderBottomWidth:0}}
                // dropdownMargins={{ min: 0, max: 0}}
                // value={this.selectedDeviceTag}
                value={this.state.selectedDevice ? this.state.selectedDevice.value : null}
                // data={deviceApiDataResult}
                data={this.state.deviceList}
                onChangeText={(value, index, data)=>{
                  this.onClickTabItem(data[index])
                }}
              /> */}

          </Col>
        </Row>

        <ScrollView style={{ flex: 1, position: "relative", zIndex: 100 }}>
          <View style={styles.listRoot}>
            {list.length > 0 ? (
              list.map((item, index) => {
                return (
                  <StatsDetailItem
                    key={'StatsDetailItem_' + index}
                    title={title}
                    item={item}
                    seniorId={this.seniorId}
                    timeOffset={timeOffset}
                    selectedDeviceTag={this.state.selectedDeviceTag}
                    tintColor={this.headerColor}
                    // unit={this.state.unit}
                    unit={this.getSelectedUnit() ? this.getSelectedUnit().name : this.state.unit}
                    selectedUnitType={this.getSelectedUnit()}

                  />
                );
              })
            ) : (
                <NoDataState text="No Item" />
              )}
          </View>
        </ScrollView>

      </View>
    )
  };

  getCurrentUnits(args = {}) {
    let title = args.title || this.title;
    let key = title.toLowerCase().replace(" ", "_");
    // return unitList[key] || false;
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


  render() {

    let { apiDataresult, selectedDevice, timeOffsetState, selectedDurationTab, loading, last30DayAvg, lastCapturedValue, lastCapturedDate } = this.state

    let data = _.isNull(apiDataresult) ? [] : apiDataresult.records

    if (this.title == 'Blood Glucose' && this.selectedUnit == '1') {
      data = !!data && data.map(item => {
        return { avgValue: item.avgValue * 0.0555, uploadDate: item.uploadDate }
      })
     
      lastCapturedValue = lastCapturedValue * 0.0555
      last30DayAvg = last30DayAvg * 0.0555
    }

    
    return (
      <View style={commonStyles.full_page_container}>
        {/* <Text>seniorId: {this.seniorId}</Text> */}
        <NavigationHeader title={'Statistics'} leftText={'Back'} navigation={this.props.navigation} />

        <ScrollView style={commonStyles.container}><View style={commonStyles.subContainer}>
          <StatisticsChart
            title={this.title}
            // unit={this.state.unit}
            unit={this.getSelectedUnit().name}
            selectedUnitType={this.getSelectedUnit()}
            monthData={data}
            gradiantColors={this.gradiantColors}
            timeOffset={timeOffsetState ? timeOffsetState : timeOffset.toString()}
            // type={selectedDevice}
            average={last30DayAvg}
            selectedIndex={selectedDurationTab}
            valueIndex={this.state.deviceList ? this.state.deviceList.findIndex(o => (o.value==this.state.selectedDeviceTag)) : 0}
            // valueIndex={selectedDevice ? selectedDevice.index : 0}
            lastValue={lastCapturedValue}
            lastValueDate={lastCapturedDate}
            onPressCallBack={(type) => this.onClickDurationTab(type)}

            startLimit={!loading ?this.state.startLimit: -1}
            endLimit={!loading ?this.state.endLimit:-1}
            bpSysStartLimt= {this.state.bpSysStartLImit}
            bpSysEndLimit={this.state.bpSysEndLimit}
          />
          {loading ? <NoDataState text="Loading..." /> : this.renderList(_.reverse(data))}
        </View></ScrollView>

      </View>
    );
  }

}

// StatisticsScreen.navigationOptions = ({ navigation }) => {
//   const title = navigation.getParam("title", "Statistics");

//   return {
//     title: title === "Step Count" ? "Step Count Details" : title,
//     headerBackTitle: "",
//     headerTintColor: "white",
//     headerTitleStyle: { fontSize: 17 },
//     headerStyle: {
//       backgroundColor: theme.colors.colorPrimary,
//       shadowRadius: 0,
//       shadowOffset: { height: 0 },
//     },
//     // headerRight: () => (
//     //   <Icon
//     //     name={title === "Heart Rate" ? "settings" : "upload"}
//     //     type="material-community"
//     //     size={24}
//     //     color="white"
//     //     style={{ marginRight: 16 }}
//     //   />
//     // ),
//     // headerRightContainerStyle: { marginRight: 12 },
//   }
// }

const styles = StyleSheet.create({
  listRoot: {
    flex: 1,
    paddingBottom: 40
  },
  valueRoot: { flexDirection: "row", alignItems: "baseline" },
  valueTitle: { fontSize: 20, marginHorizontal: 8 },
  valueUnit: { color: theme.colors.grey_shade_1 },
  leftRoot: {
    borderRadius: 50,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  leftText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    padding: 8,
  },
  week: { width: "100%", fontSize: 20, color: "white" },
  heading: {
    width: "100%",
    color: "grey",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
  },
  buttonGroupText: {
    fontSize: 14,
    color: theme.colors.grey_shade_1,
    fontFamily: theme.fonts.SFProBold,
  },
  selectedButton: {
    backgroundColor: "transparent",
    borderBottomColor: "#EB5757",
    borderBottomWidth: 1,
  },
  selectedButtonText: {
    color: "#EB5757",
    fontFamily: theme.fonts.SFProBold,
  },
  headingTextStyle: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  bottomRoot: {
    backgroundColor: theme.colors.white,
    paddingVertical: 10,
  },
})
