import {
  AppConstants,
  StorageUtils,
  convertDate,
  getDayMonthYear,
  timeConvert,
  Utils
} from "../../utils";
import { Button, Card, Divider, Icon, ListItem } from "react-native-elements";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import moment from "moment";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";
import _ from 'lodash';
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { icons } from "../../assets";
import { theme } from "../../theme";

export const StatsDetailItem = (props) => {
  const { title, item, seniorId, timeOffset, selectedDeviceTag, tintColor, unit, } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  
  const uploadDate = moment(item.uploadDate, "YYYY-MM-DDThh:mm:ss")
  const measuredValue = props.selectedUnitType.formula ? props.selectedUnitType.formula(item.avgValue) : item.avgValue;

  let unitValue = `${measuredValue == 0 ? "-" : measuredValue} ${unit}`;
  if (title == "Sleep") unitValue = Utils.minToHours(measuredValue) 

  const onPressItem = async (date) => {
    // console.log("onPress selectedDeviceTag is: "+ selectedDeviceTag);
    // console.log("onPress date is: "+ date);

    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    const stDate = date;
    setLoading(true);

    let statsApiURL = ""
    let icon = icons.stats_hrv;
    switch(title) {
      case 'Heart Rate':    
        icon = icons.stats_heart_rate;
        statsApiURL = `${api.healthStatsDayValues}hr/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        break;
      case 'Step Count':
        icon = icons.stats_step_count;
        statsApiURL = `${api.healthStatsDayValues}stepsCount/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        break;
      case 'HR Variability':
        icon = icons.stats_hrv;
        statsApiURL = `${api.healthStatsDayValues}HRV/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        break;
      case 'Body Temperature':
        icon = icons.stats_temp_icon;
        statsApiURL = `${api.healthStatsDayValues}temprature/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        break;
      case 'Sleep':
        icon = icons.sleep_score;
        statsApiURL = `${api.healthStatsDayValues}sleep/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        break;
      case 'Falls':
        icon = icons.stats_hrv;
        statsApiURL = `${api.healthStatsDayValues}FallAccur/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        break;
      case 'Blood Pressure':
        icon = icons.stats_bpm_icon;
        // statsApiURL = `${api.healthStatsDayValues}BMPPulseRate/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        statsApiURL = `${api.healthStatsDayValues}bloodPressure/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        break;
      case 'Oxygen Saturation':
        icon = icons.stats_oximeter_icon;
        statsApiURL = `${api.healthStatsDayValues}oxygen/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        break;
      case 'Blood Glucose':
        icon = icons.stats_glucose_icon;
        statsApiURL = `${api.healthStatsDayValues}bloodGlucose/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        break;
      case 'Weight':
        icon = icons.stats_glucose_icon;
        statsApiURL = `${api.healthStatsDayValues}weight/${seniorId}/${stDate}?&offSetHours=${timeOffset.toString()}&deviceTag=${selectedDeviceTag}`
        break;
      default:
        statsApiURL = ``
    }
    // console.log("statsApiURL: "+ statsApiURL)
    // console.log("Token: "+ token)

    try {
      const res = await fetch(statsApiURL, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      if (res) {
        if (res.ok) {
          const json = await res.json();
          if (json) {
            let _json = _.reverse(json);
            setModalVisible(true);
            // const parseData = [];
            let parseData = _json.map((item, index) => {
              
              let itemDate = moment(item.valueDate, "YYYY-MM-DDTHH:mm:ss")
              return {
                x: itemDate.format("HH:mm"),
                y: item.value || item.bloodPressureSystolic,
                y2: item.bloodPressureDiastolic,
                time: itemDate.format("HH:mm"),
              }
            })
        
            console.log(parseData)
            setLoading(false)
            setChartData(parseData.reverse());
          }
          else{
            setLoading(false);
            Snackbar.show({
              title: "Error in getting daily data",
              duration: Snackbar.LENGTH_LONG,
            });
          }
        } else {
          setLoading(false);
          Snackbar.show({
            title: "Error in getting daily data",
            duration: Snackbar.LENGTH_LONG,
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Snackbar.show({
        title: "Error in getting daily data",
        duration: Snackbar.LENGTH_LONG,
      });
    }


  };

  const renderValue = (args) => {
    let val = unitValue;
    if(props.title == 'Blood Pressure') val = `${item.avgValueSystolic} / ${item.avgValueDiastolic} ${unit}`;

    return (
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.valueTitle}>{uploadDate.format("DD/MM/YYYY")}</Text>
        <Text style={styles.valueUnit}>{val}</Text>
      </View>
    )


    // if (props.title == 'Blood Pressure'){
    //   return (
    //     <View style={{ marginLeft: 12 }}>
    //       <Text style={styles.valueTitle}>{uploadDate.format("DD/MM/YYYY")}</Text>
    //       <Text style={styles.valueUnit}>{item.avgValueSystolic} / {item.avgValueDiastolic} {unit}</Text>
    //     </View>
    //   )
    // }

    // return(
    //   <View style={{ marginLeft: 12 }}>
    //     <Text style={styles.valueTitle}>{uploadDate.format("DD/MM/YYYY")}</Text>
    //     <Text style={styles.valueUnit}>{unitValue}</Text>
    //   </View>
    // )

  }

  const displayValue = (item, unit) => {
    if(unit == "hours")
      return Utils.minToHours(item.y) 
    else
      //return `${Math.floor(item.y)} ${unit}\n${item.time}`
      return `${item.y} ${unit}\n${item.time}`
  }

  const ModalData = args => {

    return (<Card title={`${title} (${uploadDate.format("DD/MM/YYYY")})`} containerStyle={styles.card}>
      
      {chartData.length === 0 && <View style={styles.noDataRoot}>
        <Icon name="emoticon-sad-outline" type="material-community" size={50} color={tintColor} />
        <Text style={styles.noDataText}>No Data!</Text>
      </View>}

      {chartData.length > 0 &&
        <VictoryChart
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) => displayValue(datum, unit) }
              labelComponent={
                <VictoryTooltip constrainToVisibleArea cornerRadius={10} flyoutStyle={{ stroke: "none", fill: "rgba(0, 0, 0, 0.6)", }} style={[{ fontSize: 20 }]} />
              }
            />
          }
        >

          {/* Y1 bar */}
          {chartData.length > 0 ? (
            <VictoryBar alignment="start"
              style={{ data: { stroke: tintColor, fill: tintColor, fillOpacity: 0.7 }, }}
              barWidth={chartData.length < 4 ? 20 : undefined}
              // data={chartData}
              data={chartData.map(i => ({ ...i, y: (props.selectedUnitType.formula ? props.selectedUnitType.formula(i.y) : i.y) || 0 }))}
              animate={{ duration: 1000, onLoad: { duration: 500 } }}
            />
          ) : null}

          {/* Y2 bar */}
          {(chartData && chartData.length > 0) &&
            <VictoryBar alignment="end"
              style={{ data: { stroke: "black", fill: "black", fillOpacity: 0.4 }, }}
              barWidth={chartData.length < 4 ? 20 : undefined}
              data={chartData.map(i => ({ ...i, y: i.y2 || 0 }))}
              animate={{ duration: 1000, onLoad: { duration: 500 } }}
            />
          }

          {/* {chartData.length > 0 ? (
            <VictoryBar data={chartData}
              style={{ data: { stroke: tintColor, fill: tintColor, fillOpacity: 0.7, }, }}
              animate={{ duration: 1000, onLoad: { duration: 500 }, }}
            />
          ) : null} */}
          
          <VictoryAxis dependentAxis offsetX={38}
            style={{ axis: { stroke: "none" }, axisLabel: { stroke: "none" }, tickLabels: { stroke: "none", }, }}
           tickFormat={(val) => val > 999 ? `${val.toFixed(0) / 1000}k` : val}
            domain={title === "Heart Rate" ? [60, 100] : (title === "Step Count" ? [500, 7000] : [])}
          />
          <VictoryAxis fixLabelOverlap offsetY={40}
            style={{ axis: { stroke: "none" }, axisLabel: { stroke: "none" }, tickLabels: { angle: 60, }, }}
            tickFormat={(x) => { return x; }}
          />

        </VictoryChart>
      }

      <Button onPress={() => setModalVisible(!modalVisible)} title="Close" type="outline" titleStyle={{ color: tintColor, }} buttonStyle={{ ...styles.closeButton, borderColor: tintColor, }} raised />
    </Card>)

    // return (<Card title={`${title} (${uploadDate.format("DD/MM/YYYY")})`} containerStyle={styles.card}>
    //   {chartData.length === 0 ? (
    //     <View style={styles.noDataRoot}>
    //       <Icon name="emoticon-sad-outline" type="material-community" size={50} color={tintColor} />
    //       <Text style={styles.noDataText}>No Data!</Text>
    //     </View>
    //   ) : (
    //       <VictoryChart
    //         containerComponent={
    //           <VictoryVoronoiContainer
    //             labels={({ datum }) =>
    //               //`${Math.floor(datum.y)} ${unit}\n${datum.time}`
    //               //`${datum.y} ${unit}\n${datum.time}`
    //               displayValue(datum, unit)
    //             }
    //             labelComponent={
    //               <VictoryTooltip constrainToVisibleArea cornerRadius={10} flyoutStyle={{ stroke: "none", fill: "rgba(0, 0, 0, 0.6)", }} style={[{ fontSize: 20 }]} />
    //             }
    //           />
    //         }
    //       >
    //         {chartData.length > 0 ? (
    //           <VictoryBar data={chartData}
    //             style={{ data: { stroke: tintColor, fill: tintColor, fillOpacity: 0.7, }, }}
    //             animate={{ duration: 1000, onLoad: { duration: 500 }, }}
    //           />
    //         ) : null}
    //         <VictoryAxis dependentAxis offsetX={38}
    //           style={{ axis: { stroke: "none" }, axisLabel: { stroke: "none" }, tickLabels: { stroke: "none", }, }}
    //           tickFormat={(val) => val > 999 ? `${val.toFixed(0) / 1000}k` : val.toFixed(0)}
    //           domain={title === "Heart Rate" ? [60, 100] : (title === "Step Count" ? [500, 7000] : [])}
    //         />
    //         <VictoryAxis fixLabelOverlap offsetY={40}
    //           style={{ axis: { stroke: "none" }, axisLabel: { stroke: "none" }, tickLabels: { angle: 60, }, }}
    //           tickFormat={(x) => {
    //             return x;
    //             // const { hours: h, minutes: m, sign: s } = timeConvert(
    //             //   timeOffset
    //             // );

    //             // const { time: tickTime } = convertDate(`${x}${s}${h}:${m}`);
    //             // return tickTime;
    //           }}
    //         />
    //       </VictoryChart>
    //     )}
    //   <Button raised onPress={() => setModalVisible(!modalVisible)}
    //     title="Close" type="outline" titleStyle={{ color: tintColor, }}
    //     buttonStyle={{ ...styles.closeButton, borderColor: tintColor, }}
    //   />
    // </Card>)
  }


  let key1= uploadDate.format("x")

  return (
    <>
      <Spinner visible={loading} />

      <TouchableOpacity onPress={() => onPressItem(uploadDate.format("YYYY-MM-DD")) } style={{ flexDirection: "row", height: 76, padding: 18, paddingBottom: 18, }} key={key1}>
        <Image style={{ width: 40, height: 40 }} source={ title === "Heart Rate" ? icons.stats_heart_rate  : (title === "Step Count" ? icons.stats_step_count : icons.stats_hrv)} />
        <View style={{ flex: 1 }}>
          {renderValue()}
          {/* {renderValue( uploadDate.format("DD/MM/YYYY"), `${unitValue}`,
            //`${measuredValue} • Updated ${uploadDate.format("hh:mm")}`
          )} */}
        </View>
      </TouchableOpacity>

      <Divider style={{ marginLeft: 74 }} />
   
      <Modal animated animationType="slide" transparent={true} visible={modalVisible} >
        <View style={styles.modalView}>
          {/* <Text>{"title"}</Text> */}
          <ModalData />
        </View>
      </Modal>
    </>
  );
 
};

const styles = StyleSheet.create({
  valueRoot: { flexDirection: "row", alignItems: "baseline" },
  valueTitle: { fontSize: 17, lineHeight: 22, color: theme.colors.black },
  valueUnit: {
    color: theme.colors.grey_shade_1,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    marginTop: 5,
  },
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

  modalView: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 20,
    width: "98%",
  },
  noDataRoot: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  noDataText: { fontSize: 22, fontWeight: "500", color: "grey" },
  closeButton: {
    borderRadius: 50,
    borderWidth: 2,
  },
})
