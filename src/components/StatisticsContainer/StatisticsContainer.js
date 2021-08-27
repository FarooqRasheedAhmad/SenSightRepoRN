import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { NoDataState, StatisticsItem, StatisticsItemV2 } from "..";
import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { convertDate, getLocalDate, measurmentValues, timeConvert, AppConstants, StorageUtils, Utils, HEALTHDATA_WIDGETS } from "../../utils";
import { Divider } from "react-native-elements";
import { api } from "../../api";
import { icons } from "../../assets";
import { theme } from "../../theme";
import { useFetch } from "../../hooks";
import { fetchApiData } from '../../apicall'
import { Row, Col } from '../Grid'

// import { unitList } from '../../screens/main/StatisitcsScreen/StatisticsScreen'
import { unitList } from '../../configs'

const { temp, heartRate, bpm, oximeter, glucometer, } = measurmentValues;



const fetchData = async (url, type = "get", body, options) => {
  const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);

  // console.log("url: ", url);
  

  const res = await fetch(url, {
    // signal,
    method: type,
    headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer " + token, },
    body,
    ...options,
  })
    .then(jsonData => jsonData.json())
    .then(r => {
      // console.log("JSON: ", r);
      return r;
    })
    .catch(err => {
      console.log({ error: "API Call Error" }, err)
      return { error: err }
    });

  return res;
};

const getProfileData = async () => {
  const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN)

  const payload = {
    token: token,
    serviceUrl: api.profile,
    method: 'get'
  }
  const profileData = await fetchApiData(payload)
  
  if (!profileData || profileData.error) return { error: "Error in getting profile data" }
  else return profileData.data
}



export const StatisticsContainer = (props) => {
  const { timeOffset: tOffset } = getLocalDate();
  const [showStaticsView, setShowHideStaticsView] = useState(true);
  const [busy, setBusy] = useState(true);
  const [profileData, setProfileData] = useState(true);
  const [data, setData] = useState(true);
  const [error, setError] = useState(true);
  const [defaultUnits, setDdefaultUnits] = useState(null);
  const [statsVisibility, setStatsVisibility] = useState([]);
  // const [loading, setLoading] = useState(true);

  const { navigation, seniorId, statsDate, timeOffset, refreshStats } = props;
  
  // const { data, error, loading, fetchData } = useFetch(
  //   `${api.healthStatsLastCaptured}${seniorId}?OffSetHours=${timeOffset ? timeOffset : tOffset}`
  // )

  useEffect(() => {
    refreshStats(() => {
      collectData();
      // fetchData();
    })
    // fetchData();
    collectData();
  }, [statsDate, timeOffset])


  // const timeConvert = (n) => {
  //   var num = n;
  //   var hours = (num / 60);
  //   var rhours = Math.floor(hours);
  //   var minutes = (hours - rhours) * 60;
  //   var rminutes = Math.round(minutes);
  //   return rhours + " hr " + rminutes + " min";
  //   //return num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).";
  // }

  const collectData = async args => {
    // await fetchData();
    const uri = `${api.healthStatsLastCaptured}${seniorId}?OffSetHours=${timeOffset ? timeOffset : tOffset}`;
    const fetchedData = await fetchData(uri)
      .then(r => {
        if (r && !r.error) {
          // console.log(">>>>>>>>>>>>>>>>> ", r);
          setData(r);
          setError(null)
        } else {
          setError(r.error);
          setData(null);
        }
        return r;
      })
      .catch(err => {
        setError("Request Error!");
        setData(null);
        return err;
      })
    console.log("fetchedData: ", fetchedData);


    const profileData = await getProfileData()
      .then(r => {
        if (r && !r.error) {
          setProfileData(r);
          setError(null)
        } else {
          setError(r.error);
          setProfileData(null);
        }
        return r;
      })
      .catch(err => {
        setError("Request Error!");
        setProfileData(null);
        return err;
      })

    // console.log(">>>>>>>>>>>>>>>>>>>>>>>> profileData:", profileData);


    let weightUnit = unitList.weight.find(o => o['value'] == profileData.weightUnit);
    if (!weightUnit) weightUnit = unitList.weight.find(o => o['value'] == 1)
    // let weightUnit = unitList.weight[profileData.weightUnit ? profileData.weightUnit - 1 : 0] || unitList.weight[0];
    // console.log("weightUnit: ", weightUnit);

    let temperatureUnit = unitList.body_temperature.find(o => o['value'] == profileData.temperatureUnit);
    if (!temperatureUnit) temperatureUnit = unitList.body_temperature.find(o => o['value'] == 1)
    // let temperatureUnit = unitList.body_temperature[profileData.temperatureUnit ? profileData.temperatureUnit - 1 : 0] || profileData.temperatureUnit[0];
    // console.log("temperatureUnit: ", temperatureUnit);

    let bloodSugarUnit = unitList.blood_glucose.find(o => o['value'] == profileData.bloodSugarUnit);
    if (!bloodSugarUnit) bloodSugarUnit = unitList.blood_glucose.find(o => o['value'] == 1)
    // let bloodSugarUnit = unitList.blood_glucose[profileData.bloodSugarUnit ? profileData.bloodSugarUnit - 1 : 0] || profileData.bloodSugarUnit[0];
    // console.log("bloodSugarUnit: ", bloodSugarUnit);

    setDdefaultUnits({
      weight: weightUnit,// || 'kg',
      temperature: temperatureUnit,// || 'C',
      glucose: bloodSugarUnit,// || 'mg/dL',
    })

    // profileData.bloodSugarUnit
    // profileData.weightUnit
    // profileData.temperatureUnit

    // const staticsPref = await StorageUtils.getValue(AppWidgets.STATICS)
    // HEALTHDATA_WIDGETS
    let promiseArray = HEALTHDATA_WIDGETS.map(row => {
      return new Promise((resolve, reject) => {
        // let info = await StorageUtils.getValue(row.widgetName)
        StorageUtils.getValue(row.widgetName).then(r=>{
          resolve({ [row.widgetName]:r!="false" })
        })
      })
    });

    await Promise.all(promiseArray).then(r=>{
      console.log("HEALTHDATA_WIDGETS: ", r);
      // statsVisibility
      setStatsVisibility(r)
      // let _statsVisibility = {}
      // for (let a in r){
      //   r[a]
      // }
    })
    // promiseArray.push(new Promise((resolve, reject) => {
    //   setTimeout(resolve, 100, 'foo');
    // }))


    setBusy(false)
  }

  const getDescription = (val, unit, date) => {
    const { time, month, day } = getTimeDay(date);

    let unitValue = `${val} ${unit}`;
    if (unit == "hours")
      unitValue = Utils.minToHours(val)
    else if (unit == 'mmHg')
      return `${unitValue} • ${day} ${month}, ${time} (Last Value)`;

    if (typeof val === "number" && !_.isNull(date) && date != "0001-01-01T00:00:00")
      return `${unitValue} • ${day} ${month}, ${time} (Last Value)`;
    else
      "";

  };

  const getTimeDay = (date) => {
    const { hours, minutes, sign } = timeConvert(timeOffset);
    const { time, month, day } = date
      ? convertDate(`${date}${sign}${hours}:${minutes}`)
      : {};
    return { time, day, month };
  }

  const getHeartRate = (data) => {
    const { hr, hrDate, hrDeviceTag, hrTrafficColor } = data;

    return (<StatisticsItemV2
      bg_color={hrTrafficColor}
      avatar={icons.stats.hr}
      title={theme.strings.heart_rate}
      // description={getDescription(hr, "bpm", hrDate)}
      // progressColor={theme.colors.green_shade_1}
      // progress={0.6}
      onPress={() =>
        // navigation.navigate("StatisticsScreen", {
        navigation.navigate("StatsDetails", {
          title: "Heart Rate",
          deviceSettings: heartRate,
          seniorId,
          timeOffset,
          subHeading: "DAILY AVERAGE",
          unit: "bpm",
          gradiantColors: ["rgba(249, 98, 37, 0.610205)", "#EB5757"],
          headerColor: "#EB5757",
          infoType: "heart-rate",
          statsDate,
          average: [hr, hr],
          lastValue: [hr, hr],
          lastValueDate: [hr, hr],
          selectedDeviceTag: hrDeviceTag,
          bg_color: hrTrafficColor,
        })
      }
    >
      {/* <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{hr}<Text style={{ fontSize: 14, fontWeight: "normal" }}> BPM</Text></Text> */}
      <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{hr || "-"}</Text>
      <Text style={{ fontSize: 14, fontWeight: "normal" }}> bpm</Text>
    </StatisticsItemV2>)

  }

  const getStepCounts = (data) => {
    const { stepsCount, stepsCountDate, stepsCountDeviceTag, stepsCountTrafficColor } = data;

    return (<StatisticsItemV2
      avatar={icons.stats.sc}
      title={theme.strings.steps_count}
      bg_color={stepsCountTrafficColor}
      // description={getDescription(hr, "bpm", hrDate)}
      // progressColor={theme.colors.green_shade_1}
      // progress={0.6}
      onPress={() =>
        navigation.navigate("StatsDetails", {
          title: "Step Count",
          deviceSettings: stepsCount,
          seniorId,
          statsDate,
          timeOffset,
          subHeading: "DAILY TOTAL",
          unit: "steps",
          gradiantColors: ["#C86DD7", "#683EBC"],
          headerColor: "#683EBC",
          infoType: "stepe-count",
          average: stepsCount,
          lastValue: stepsCount,
          lastValueDate: stepsCountDate,
          selectedDeviceTag: stepsCountDeviceTag,
          bg_color: stepsCountTrafficColor
        })
      }
    >
      {/* <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{stepsCount}<Text style={{ fontSize: 14, fontWeight: "normal" }}> steps</Text></Text> */}
      <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{stepsCount || "-"}</Text>
      <Text style={{ fontSize: 14, fontWeight: "normal" }}> steps</Text>
    </StatisticsItemV2>)

  }

  const getHRVStats = (data) => {
    const { hrv, hrvDate, hrvDeviceTag, hrvTrafficColor } = data
    return (<StatisticsItemV2
      avatar={icons.stats.hrv}
      bg_color={hrvTrafficColor}
      title={"HR Variability"} titleSize={14}
      // description={getDescription(hrv, "ms", hrvDate)}
      // progressColor={theme.colors.orange_shade_1}
      // progress={0.8}
      onPress={() =>
        navigation.navigate("StatsDetails", {
          title: "HR Variability", // "Heart Rate Variability",
          seniorId,
          statsDate,
          timeOffset,
          subHeading: "DAILY AVERAGE",
          unit: "ms",
          gradiantColors: ["#007AFF", "#0151A8"],
          headerColor: "#0151A8",
          infoType: "heart-rate-variation",
          screenType: "hrv",
          average: hrv,
          lastValue: hrv,
          lastValueDate: hrvDate,
          selectedDeviceTag:hrvDeviceTag,
          bg_color: hrvTrafficColor,
        })
      }
    >
      {/* <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{hrv}<Text style={{ fontSize: 14, fontWeight: "normal" }}> ms</Text></Text> */}
      <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{hrv || "-"}</Text>
      <Text style={{ fontSize: 14, fontWeight: "normal" }}> ms</Text>
    </StatisticsItemV2>)

  }

  const getBodyTempStats = (data) => {

    const { bodyTemp, bodyTempDate, bodyTempDeviceTag, bodyTempTrafficColor } = data
    return (<StatisticsItemV2
      avatar={icons.stats.bt}
      title={theme.strings.temperature}
      bg_color={bodyTempTrafficColor}
      // description={getDescription(bodyTemp, "C", bodyTempDate)}
      // progressColor={theme.colors.green_shade_1}
      // progress={0.8}
      onPress={() =>
        navigation.navigate("StatsDetails", {
          title: "Body Temperature",
          // deviceSettings: temp,
          seniorId,
          statsDate,
          timeOffset,
          subHeading: "DAILY AVERAGE",
          unit: defaultUnits.temperature.name, // "C",
          gradiantColors: ["#E30E0E", "#994040"],
          headerColor: "#C42323",
          infoType: "body-temp",
          screenType: "body-temp",
          average: bodyTemp,
          lastValue: bodyTemp,
          lastValueDate: bodyTempDate,
          selectedDeviceTag: bodyTempDeviceTag,
          bg_color: bodyTempTrafficColor,
        })
      }
    >
      {/* <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{defaultUnits.temperature.formula(bodyTemp)}<Text style={{ fontSize: 14, fontWeight: "normal" }}> °{defaultUnits.temperature.name}</Text></Text> */}
      <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{defaultUnits.temperature.formula(bodyTemp) || "-"}</Text>
      <Text style={{ fontSize: 14, fontWeight: "normal" }}> °{defaultUnits.temperature.name}</Text>
    </StatisticsItemV2>)

  }

  const getOxygenStats = (data) => {
    const { o2, o2Date, o2DeviceTag, o2TrafficColor } = data
    return (<StatisticsItemV2
      avatar={icons.stats.os}
      title="Oxygen Saturation"
      bg_color={o2TrafficColor}
      // description={getDescription(o2, "%", o2Date)}
      // progressColor={theme.colors.green_shade_1}
      // progress={0.8}
      onPress={() =>
        navigation.navigate("StatsDetails", {
          title: "Oxygen Saturation",
          seniorId,
          statsDate,
          timeOffset,
          subHeading: "DAILY AVERAGE",
          unit: "%",
          gradiantColors: ["#47CA5D", "#1CA556"],
          headerColor: "#47CA5D",
          infoType: "oxygen",
          screenType: "oxygen",
          average: o2,
          lastValue: o2,
          lastValueDate: o2Date,
          selectedDeviceTag: o2DeviceTag,
          bg_color: o2TrafficColor,
        })
      }
    >
      {/* <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{o2}<Text style={{ fontSize: 14, fontWeight: "normal" }}> %</Text></Text> */}
      <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{o2 || "-"}</Text>
      <Text style={{ fontSize: 14, fontWeight: "normal" }}> %</Text>
    </StatisticsItemV2>)

  }

  const getBloodPressureStats = (data) => {
    const { bloodPressure, bloodPressureSystolicDate, bloodPressureSystolic, bloodPressureDiastolic, bloodPressureSystolicDeviceTag, bloodPressureDiastolicTrafficColor, bloodPressureSystolicTrafficColor } = data
    return (<StatisticsItemV2
      avatar={icons.stats.bp}
      title={theme.strings.bloodPressure}
      bg_color={(bloodPressureDiastolicTrafficColor == "#f12b2c" || bloodPressureSystolicTrafficColor ==  "#f12b2c")?"#f12b2c":
      (bloodPressureDiastolicTrafficColor == "#f2994a" || bloodPressureSystolicTrafficColor ==  "#f2994a")?"#f2994a": bloodPressureSystolicTrafficColor}
      bg_color2={bloodPressureSystolicTrafficColor}
      // description={getDescription(`${bloodPressureSystolic || 0} / ${bloodPressureDiastolic || 0}`, "mmHg", bloodPressureSystolicDate)}
      // description={`${bloodPressureSystolic || 0} / ${bloodPressureDiastolic || 0} mmHg`}
      // progressColor={theme.colors.green_shade_1}
      // progress={0.8}
      onPress={() =>
        navigation.navigate("StatsDetails", {
          title: theme.strings.bloodPressure,
          seniorId,
          statsDate,
          timeOffset,
          subHeading: "DAILY AVERAGE",
          unit: "mmHg",
          gradiantColors: ["#E702DD", "#DD61D8"],
          headerColor: "#E702DD",
          infoType: "blood-pressure",
          screenType: "blood-pressure",
          average: bloodPressure,
          lastValue: bloodPressure,
          lastValueDate: bloodPressureSystolicDate,
          selectedDeviceTag: bloodPressureSystolicDeviceTag,
          // bloodPressureSystolic, bloodPressureDiastolic,
          bg_color:bloodPressureDiastolicTrafficColor,
          bg_color2:bloodPressureSystolicTrafficColor,
        })
      }
    >
      <Row style={{ marginHorizontal: 10 }}>
        <Col flex={50} valign="center"><Text>Sys:</Text></Col>
        <Col flex='auto'><Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>{bloodPressureSystolic || "-"}<Text style={{ fontSize: 14, fontWeight: "normal" }}> mmHg</Text></Text></Col>
      </Row>
      <Row style={{ marginHorizontal: 10 }}>
        <Col flex={50} valign="center"><Text>Dia:</Text></Col>
        <Col flex='auto'><Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>{bloodPressureDiastolic || "-"}<Text style={{ fontSize: 14, fontWeight: "normal" }}> mmHg</Text></Text></Col>
      </Row>
      {/* <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{o2}<Text style={{ fontSize: 14, fontWeight: "normal" }}> %</Text></Text> */}
    </StatisticsItemV2>)

  }

  const getBloodGlucoseStats = (data) => {
    const { bloodSugar, bloodSugarDate, bloodSugarDeviceTag, bloodSugarTrafficColor } = data
    return (<StatisticsItemV2
      avatar={icons.stats.bg}
      title="Blood Glucose"
      bg_color={bloodSugarTrafficColor}
      // description={getDescription(bloodSugar, "mg/dL", bloodSugarDate)}
      // progressColor={theme.colors.green_shade_1}
      // progress={0.8}
      onPress={() =>
        navigation.navigate("StatsDetails", {
          title: "Blood Glucose",
          seniorId,
          statsDate,
          timeOffset,
          subHeading: "DAILY AVERAGE",
          unit: defaultUnits.glucose.name, // "mg/dL",
          gradiantColors: ["#E702DD", "#DD61D8"],
          headerColor: "#E702DD",
          infoType: "blood-sugar",
          screenType: "blood-sugar",
          average: bloodSugar,
          lastValue: bloodSugar,
          lastValueDate: bloodSugarDate,
          selectedDeviceTag: bloodSugarDeviceTag,
          bg_color: bloodSugarTrafficColor,
        })
      }
    >
      {/* <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{defaultUnits.glucose.formula(bloodSugar)}<Text style={{ fontSize: 14, fontWeight: "normal" }}>{defaultUnits.glucose.name}</Text></Text> */}
      <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{defaultUnits.glucose.formula(bloodSugar) || "-"}</Text>
      <Text style={{ fontSize: 14, fontWeight: "normal" }}>{defaultUnits.glucose.name}</Text>
    </StatisticsItemV2>)

  }

  const getSleepStats = (data) => {
    const { sleep, sleepDate, sleepDeviceTag, sleepTrafficColor } = data

    let timeObj = sleep > 59 ? Utils.minToHours(sleep, true) : { minutes: sleep, hours:0 };

    let hrs = null
    if (timeObj.hours > 0) hrs = timeObj.hours;
    let min = null
    if (timeObj.hours > 0 || timeObj.minutes > 0) min = timeObj.minutes || '0';



    return (<StatisticsItemV2
      avatar={icons.stats.sleep}
      title="Sleep"
      bg_color={sleepTrafficColor}
      onPress={() =>
        navigation.navigate("StatsDetails", {
          title: "Sleep",
          seniorId,
          statsDate,
          timeOffset,
          subHeading: "DAILY AVERAGE",
          unit: "hours",
          gradiantColors: ["#E702DD", "#DD61D8"],
          headerColor: "#E702DD",
          infoType: "sleep",
          screenType: "sleep",
          average: sleep,
          lastValue: sleep,
          lastValueDate: sleepDate,
          selectedDeviceTag: sleepDeviceTag,
          bg_color: sleepTrafficColor,
        })
      }
    >
      <Row>
        <Col align="center">
          <View>
            <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{hrs || ' '}</Text>
            <Text style={{ fontSize: 14, fontWeight: "normal", textAlign: "center" }}>hrs</Text>
          </View>
        </Col>
        <Col align="center">
          <View>
            <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>-</Text>
            <Text style={{ fontSize: 14, fontWeight: "normal", textAlign: "center" }}> </Text>
          </View>
        </Col>
        <Col align="center">
          <View>
            <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{min || ' '}</Text>
            <Text style={{ fontSize: 14, fontWeight: "normal", textAlign: "center" }}>min</Text>
          </View>
        </Col>
      </Row>
      

    </StatisticsItemV2>)


  }

  const getWeightStats = (data) => {
    if (!defaultUnits) return null;

    const { weight, weightDate, weightDeviceTag, weightTrafficColor } = data

    return (<StatisticsItemV2
      avatar={icons.stats.weight}
      title="Weight"
      bg_color={weightTrafficColor}
      onPress={() =>
        navigation.navigate("StatsDetails", {
          title: "Weight",
          seniorId,
          statsDate,
          timeOffset,
          subHeading: "DAILY AVERAGE",
          unit: defaultUnits.weight.name, // "kg",
          gradiantColors: ["#4478FF", "#42418D"],
          headerColor: "#E702DD",
          infoType: "weight",
          screenType: "weight",
          average: weight,
          lastValue: weight,
          lastValueDate: weightDate,
          selectedDeviceTag: weightDeviceTag,
          bg_color: weightTrafficColor,
        })
      }
    >
      {/* <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{defaultUnits.weight.formula(weight)}<Text style={{ fontSize: 14, fontWeight: "normal" }}> {defaultUnits.weight.name}</Text></Text> */}
      <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{defaultUnits.weight.formula(weight, defaultUnits.weight.name) || "-"}</Text>
      <Text style={{ fontSize: 14, fontWeight: "normal" }}> {defaultUnits.weight.name}</Text>
    </StatisticsItemV2>)

  }

  const getFallStats = (data) => {
    if (!defaultUnits) return null;

    const { fallAccur, fallAccurDate, fallAccurDeviceId, fallAccurDeviceTag, fallAccurTrafficColor, } = data;
    // const { falls, weight, weightDate, weightDeviceTag, weightTrafficColor } = data

    return (<StatisticsItemV2
      avatar={icons.stats.fall}
      title="Falls"
      bg_color={fallAccur > 0 ? fallAccurTrafficColor:'#dcdcdf'}
      onPress={() =>
        navigation.navigate("StatsDetails", {
          title: "Falls",
          seniorId,
          statsDate,
          timeOffset,
          subHeading: "DAILY AVERAGE",
          unit: "falls",
          gradiantColors: ["rgba(249, 98, 37, 0.610205)", "#EB5757"],
          headerColor: "#E702DD",
          infoType: "falls",
          screenType: "fall",
          average: fallAccur < 0 ? 0 : fallAccur,
          lastValue: fallAccur < 0 ? 0 : fallAccur,
          lastValueDate: fallAccurDate,
          selectedDeviceTag: fallAccurDeviceTag,
          bg_color: fallAccurTrafficColor,
        })
      }
    >
      
      <Text>
        <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>{fallAccur > 0 ?  fallAccur: '-' }</Text>
        {fallAccur > 0 && <Text style={{ fontSize: 10,fontWeight: "bold", textAlign: "center" }}>/24hrs</Text>}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: "normal" }}> {defaultUnits.falls?.name || 'falls'}</Text>
    </StatisticsItemV2>)

  }


  const getFDAStats = (data) => {

    const { bloodSugar, bloodSugarDate, } = data


    return (
      <>
        <Divider style={styles.divider} />
        <StatisticsItem
          avatar={icons.stats_glucose_icon}
          title={theme.strings.glucometer}
          description={getDescription(
            bloodSugar,
            "mmol/L",
            bloodSugarDate
          )}
          progressColor={theme.colors.green_shade_1}
          progress={0.6}
          onPress={() =>
            navigation.navigate("FDAStaticsScreen", {
              title: theme.strings.glucometer,
              deviceSettings: glucometer,
              seniorId,
              statsDate,
              timeOffset,
              avatar: icons.stats_oximeter_icon,
              average: bloodSugar,
              lastValue: bloodSugar,
              lastValueDate: bloodSugarDate,
            })
          }
        />
      </>
    )
  }

  const showHideStaticsView = () => {
    setShowHideStaticsView(showStaticsView ? false : true);
  }


  if (busy) return <View style={styles.headerLocStatsView}>
    <Text style={styles.headerLocStatsTitle}>{theme.strings.statistics}</Text>
    <ActivityIndicator animating={true} />
  </View>

  return (
    <>
      <View style={styles.headerLocStatsView}>
        <Text style={styles.headerLocStatsTitle}>{theme.strings.statistics}</Text>
        <TouchableOpacity onPress={() => showHideStaticsView()}>
          <Image source={showStaticsView ? icons.accordian_minus : icons.accordian_plus} style={{ width: 26, height: 26 }} />
        </TouchableOpacity>
      </View>
      {//error && covidError ? (
        error ? (<NoDataState text="Error in getting Stats" />) : null}

      {showStaticsView && (<>
        {/* <Text>seniorId: {seniorId}</Text> */}
        <Row style={{ display: "flex", marginHorizontal: 15 }}>
          {statsVisibility.find(o => o['hdw-heart-rate'] == true) && <Col flex="50%">{data && getHeartRate(data)}</Col>}
          {statsVisibility.find(o => o['hdw-hr-variability'] == true) && <Col flex="50%">{data && getHRVStats(data)}</Col>}
          {statsVisibility.find(o => o['hdw-blood-pressure'] == true) && <Col flex="50%">{data && getBloodPressureStats(data)}</Col>}
          {statsVisibility.find(o => o['hdw-blood-glucose'] == true) && <Col flex="50%">{data && getBloodGlucoseStats(data)}</Col>}
          {statsVisibility.find(o => o['hdw-body-temperature'] == true) && <Col flex="50%">{data && getBodyTempStats(data)}</Col>}
          {statsVisibility.find(o => o['hdw-oxygen-satuartion'] == true) && <Col flex="50%">{data && getOxygenStats(data)}</Col>}
          {statsVisibility.find(o => o['hdw-step-count'] == true) && <Col flex="50%">{data && getStepCounts(data)}</Col>}
          {statsVisibility.find(o => o['hdw-sleep'] == true) && <Col flex="50%">{data && getSleepStats(data)}</Col>}
          {statsVisibility.find(o => o['hdw-weight'] == true) && <Col flex="50%">{data && getWeightStats(data)}</Col>}
          {statsVisibility.find(o => o['hdw-fall'] == true) && <Col flex="50%">{data && getFallStats(data)}</Col>}
        </Row>

      </>)}
    </>
  )
}

const styles = StyleSheet.create({
  headerLocStatsSeeAll: {
    color: theme.colors.colorPrimary,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    textAlign: "center",
  },
  headerLocStatsTitle: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProBold,
    fontSize: 21,
    flexGrow: 1,
  },
  headerLocStatsView: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  statsRoot: {
    paddingTop: 16,
    marginHorizontal: 16,
    backgroundColor: theme.colors.bg_grey,
    borderRadius: 12,
  },
  divider: {
    marginLeft: 100,
    marginVertical: 12,
  },
})
