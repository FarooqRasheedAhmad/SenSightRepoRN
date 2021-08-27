import {
  AppConstants,
  StorageUtils,
  convertDate,
  measurmentValues,
  timeConvert,
} from "../../../utils";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import {
  Graph,
  GraphListItem,
  Info,
  NoDataState,
  StaticsDuratonTabView,
} from "../../../components";
import React, { Component } from "react";

import { Icon } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import { api } from "../../../api";
import { icons } from "../../../assets";
import { styles } from "./styles";
import { theme } from "../../../theme";

const getTimeDay = (date) => {
  const d = new Date();
  const n = d.getTimezoneOffset() / 60;
  const timeOffset = n < 0 ? Math.abs(n) : -n;
  const { hours, minutes, sign } = timeConvert(timeOffset);
  const { time, dayName } = date
    ? convertDate(`${date}${sign}${hours}:${minutes}`)
    : {};
  return { time, dayName };
};

export class FDAStaticsScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    (this.date = props.navigation.getParam("lastValueDate", "")),
      (this.deviceSettings = props.navigation.getParam(
        "deviceSettings",
        "Statistics"
      )),
      (this.valueTabsDataArray = this.deviceSettings); // default set

    this.lastValueTime = this.date ? getTimeDay(this.date).time : null;
    this.lastValueDay = this.date ? getTimeDay(this.date).dayName : null;
    (this.lastValue = props.navigation.getParam("lastValue", undefined)),
      (this.average = props.navigation.getParam("average", undefined)),
      (this.state = {
        title: navigation.getParam("title", "Statistics"),
        seniorId: props.navigation.getParam("seniorId", null),
        statsDataItems: [],
        isLoading: false,
        numberOfDay: 1,
        selectedTabIndex: 0,
        selectedDayTabIndex: 0,
      });
    this.tabWidth = "80%";
  }

  async componentDidMount() {
    const { seniorId, numberOfDay, title } = this.state;
    const { navigation } = this.props;
    let url = "";
    const timeOffSet = this.getTimeOffset();
    const d = new Date();
    const n = d.getTimezoneOffset() / 60;
    const timeOffset = n < 0 ? Math.abs(n) : -n;
    const { hours, minutes, sign } = timeConvert(timeOffset);
    const p = d.toISOString().replace("Z", "");
    const nDate = `${p}${sign === "+" ? "-" : "+"}${hours}:${minutes}`;
    const t = new Date(nDate);

    if (title === theme.strings.temperature) {
      url =
        api.fdaStatsTemperatureToday +
        `${seniorId}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      this.tabWidth = "45%";
      this.valueTabsDataArray = measurmentValues["temp"];
      await StorageUtils.getValue(AppConstants.SP.DEFAULT_TEMP_UNIT).then(
        (value) => {
          this.setState({ selectedTabIndex: value == "F" ? 1 : 0  });
        }
      );
    } else if (title === theme.strings.bloodPressure) {
      url =
        api.fdaStatesBloodPressure +
        `${seniorId}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      this.tabWidth = "100%";
      this.valueTabsDataArray = measurmentValues["bpm"];
    } else if (title === theme.strings.pulseOximeter) {
      url =
        api.statsOximeterToday +
        `${seniorId}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      this.tabWidth = "50%";
      this.valueTabsDataArray = measurmentValues["oximeter"];
    } else if (title === theme.strings.glucometer) {
      url =
        api.statsGlucometerToday +
        `${seniorId}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      this.valueTabsDataArray = measurmentValues["glucometer"];
    }
    this.getStaticData(url);
  }

  getServiceURl = (numberOfDay) => {
    const { seniorId, title } = this.state;
    let serviceUrl = "";
    const t = new Date();
    const timeOffSet = this.getTimeOffset();

    if (title === theme.strings.temperature) {
      if (numberOfDay == 1) {
        serviceUrl =
          api.fdaStatsTemperatureToday +
          `${seniorId}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      } else {
        serviceUrl =
          api.fdaTemperatureNumberOfDays +
          `${seniorId}/${numberOfDay}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      }
    } else if (title === theme.strings.bloodPressure) {
      if (numberOfDay == 1) {
        serviceUrl =
          api.fdaStatesBloodPressure +
          `${seniorId}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      } else {
        serviceUrl =
          api.statsBloodPressureNumberOfDays +
          `${seniorId}/${numberOfDay}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      }
    } else if (title === theme.strings.pulseOximeter) {
      if (numberOfDay == 1) {
        serviceUrl =
          api.statsOximeterToday +
          `${seniorId}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      } else {
        serviceUrl =
          api.statsOximeterNumberOfDays +
          `${seniorId}/${numberOfDay}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      }
    } else if (title === theme.strings.glucometer) {
      if (numberOfDay == 1) {
        serviceUrl =
          api.statsGlucometerToday +
          `${seniorId}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      } else {
        serviceUrl =
          api.statsGlucometerNumberOfDays +
          `${seniorId}/${numberOfDay}?uploadDate=${t.toISOString()}&OffSetHours=${timeOffSet}`;
      }
    }

    return serviceUrl;
  };

  getTimeOffset = () => {
    const d = new Date();
    const n = d.getTimezoneOffset() / 60;
    const timeOffset = n < 0 ? Math.abs(n) : -n;
    return timeOffset.toString();
  };

  getStaticData = async (serviceUrl) => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    try {
      const res = await fetch(serviceUrl, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (res) {
        console.log("res ", res);
        if (res.ok) {
          const json = await res.json();
          if (json) {
            this.setState({ statsDataItems: json, isLoading: false });
          }
        } else {
          this.setState({ statsDataItems: [], isLoading: false });
          Snackbar.show({
            text: "Error in getting daily data",
            duration: Snackbar.LENGTH_LONG,
          });
        }
      }
    } catch (error) {
      this.setState({ statsDataItems: [], isLoading: false });
      Snackbar.show({
        text: "Error in getting daily data",
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  onPressTabItem = (index) => {
    this.setState({ selectedTabIndex: index });
    this.props.navigation.setParams({
      headerBgColor: this.valueTabsDataArray[index].headerBgColor,
    });
  };

  onPressDaysTab = (index, numberOfDay) => {
    this.setState({ selectedDayTabIndex: index });
    this.getStaticData(this.getServiceURl(numberOfDay));
  };

  renderDateList = (list) => {
    const { title, selectedTabIndex, seniorId } = this.state;
    const { headerBgColor, value, icon, unit } = this.valueTabsDataArray[
      selectedTabIndex
    ];
    const avatar = icons[icon];

    return list.length > 0 ? (
      <>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              paddingLeft: 18,
              paddingRight: 18,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.headingTextStyle}>History</Text>
            </View>
            {this.valueTabsDataArray && this.valueTabsDataArray.length > 1 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  marginLeft: 20,
                  alignItems: "flex-end",
                }}
              >
                <StaticsDuratonTabView
                  tabItems={this.valueTabsDataArray}
                  selectedIndex={selectedTabIndex}
                  textColor="#ffffff"
                  selectedBgColor={headerBgColor}
                  fontSize={12}
                  tabWidth={this.tabWidth}
                  onPressCallBack={this.onPressTabItem}
                />
              </View>
            )}
          </View>
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GraphListItem
                title={title}
                item={item}
                chartTintColor={headerBgColor}
                avatar={avatar}
                selectedValueType={value}
                seniorId={seniorId}
                unit={unit}
                timeOffset={this.getTimeOffset()}
              />
            )}
          />
        </View>
      </>
    ) : (
      <NoDataState text="No Item" />
    );
  };

  render() {
    const {
      title,
      statsDataItems,
      seniorId,
      selectedTabIndex,
      isLoading,
      selectedDayTabIndex,
    } = this.state;

    const selectedUnitTab = this.valueTabsDataArray[selectedTabIndex];
    const { value, bgGradient, unit } = selectedUnitTab;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <Graph
          title={title}
          monthData={statsDataItems || []}
          selectedValueType={value}
          deviceSettings={selectedUnitTab}
          gradiantColors={bgGradient}
          onPressDaysTab={this.onPressDaysTab}
          timeOffset={this.getTimeOffset()}
          selectedDayTabIndex={selectedDayTabIndex}
          unit={unit}
          average={this.average}
          lastValue={this.lastValue}
          lastValueDay={this.lastValueDay}
          lastValueTime={this.lastValueTime}
          valueIndex={selectedTabIndex}
        />
        <View style={{ flex: 1, backgroundColor: "white" }}>
          {isLoading ? (
            <NoDataState text="Loading..." />
          ) : (
            this.renderDateList(statsDataItems || [])
          )}
        </View>
      </SafeAreaView>
    );
  }

  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam("title", "Statistics");
    const deviceSettings = navigation.getParam("deviceSettings", "Statistics");
    const headerBgColor = navigation.state.params.headerBgColor;

    return {
      title: title,
      headerBackTitle: "",
      headerTintColor: "white",
      headerTitleStyle: { fontSize: 17 },
      headerStyle: {
        backgroundColor: theme.colors.colorPrimary, //headerBgColor || deviceSettings[0].headerBgColor
        shadowRadius: 0,
        shadowOffset: { height: 0 },
      },
      headerRight: () => (
        <Icon
          name="upload"
          type="material-community"
          size={24}
          color="white"
          style={{ marginRight: 16 }}
        />
        //<Info type="" color="white" containerStyle={{ marginRight: 8 }} />
      ),
      headerRightContainerStyle: { marginRight: 12 },
    };
  };
}
