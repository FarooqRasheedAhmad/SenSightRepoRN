import { StyleSheet, Text, View } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryLine, VictoryTooltip, VictoryVoronoiContainer, } from "victory-native";
import { convertDate, showMessage, timeConvert, Utils } from "../../utils";
import { Icon } from "react-native-elements";
import _ from 'lodash';
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import React from "react";
import { StaticsDuratonTabView } from "../StaticsDuratonTabView";
import { theme } from "../../theme";

const tabItems = [
  { name: "Day", value: 1 },
  { name: "Week", value: 7 },
  { name: "Month", value: 30 },
  { name: "3 Months", value: 90 },
];

export const StatisticsChart = (props) => {
  let { gradiantColors, title, unit, monthData, timeOffset, average, lastValue, lastValueDate, valueIndex, onPressCallBack, selectedIndex,bpSysStartLimt,bpSysEndLimit } = props;

  let _data = _.reverse(monthData);

  let data = _data.map((item, index) => {
    return {
      x: item.uploadDate,
      y: item.avgValue || item.avgValueDiastolic || 0,
      y2: item.avgValueSystolic || item.avgValueSystolic || 0,
      // y2: (item.avgValue && item.avgValue > 0) ? item.avgValue - 30 : item.avgValue,
      day: moment(item.uploadDate, "YYYY-MM-DDThh:mm:ss").format("MMM D"),
    }
  })

  const renderValue = (value, label) => {
    let averageValue = ''
    if (value && typeof value === "object") {
      averageValue = value[valueIndex] ? (value[valueIndex]) : '-'
      // averageValue = value[valueIndex] ? twoDecimals(value[valueIndex]) : 0
    }
    else if (value != undefined && value != null && value !=  "0 / 0") {
      averageValue = (value)
      // averageValue = twoDecimals(value)
    }else {
      averageValue = '-'
    }

    if (unit == "hours") {
    const displayValue =   Utils.minToHours(value)
      return (<View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueUnit}>{displayValue != '0 hr 0 min'? displayValue: '- min'}</Text>
        </View>
        <Text style={{ color: theme.colors.white }}>{label}</Text>
      </View>
      )
    }
    else {
      // console.log("================", props.selectedUnitType.formula);
      
      return (<View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            {(props.selectedUnitType && props.selectedUnitType.formula) ? props.selectedUnitType.formula(averageValue) : averageValue != null? averageValue: "-"}
            {/* {averageValue} */}
          </Text>
          <Text style={styles.valueUnit}>{unit}</Text>
        </View>
        <Text style={{ color: theme.colors.white }}>{label}</Text>
      </View>
      )
    }


  }

  const displayValue = (item, unit,limitText) => {
    if (unit == "hours") return Utils.minToHours(item.y) + `\n${item.day|| limitText == "lower"? "Lower Boundary":"Upper Boundary"}`
    else{
      let val = (props.selectedUnitType && props.selectedUnitType.formula) ? props.selectedUnitType.formula(item.y) : item.y
      return `${val||""} ${unit||""}\n${item.day|| limitText == "lower"? 
      bpSysStartLimt? "Lower Boundary \n Diastolic": "Lower Boundary":
      bpSysStartLimt? "Upper Boundary \n Diastolic": "Upper Boundary"}`
    }
    
    // else return `${item.y} ${unit}\n${item.day}`
  }

  const hoverDisplayValue = (item, unit) => {
    debugger
    if (unit == "hours") return `${item.day}\n` + Utils.minToHours(item.y) 
    else{
      let val = (props.selectedUnitType && props.selectedUnitType.formula) ? props.selectedUnitType.formula(item.y) : item.y
      return ` ${item.day? item.day: ''} \n ${val||""} ${unit||""}`
    }
    
  }

  const displayBpSysLimits = (item, unit,limitText) => {
    let val = (props.selectedUnitType && props.selectedUnitType.formula) ? props.selectedUnitType.formula(item.y) : item.y
    return `${val||""} ${unit||""}\n${item.day|| limitText == "lower"? "Lower Boundary \n Systolic":"Upper Boundary \n Systolic"}`
  }


  return (<>
    <LinearGradient colors={gradiantColors}>
      <View style={styles.gradientContainer}>
        <StaticsDuratonTabView
          tabItems={tabItems}
          onPressCallBack={(index) => onPressCallBack(index)}
          selectedIndex={selectedIndex}
          textColor={gradiantColors[0]} selectedBgColor="#ffffff"
        />
      </View>
      <View style={styles.valueRoot}>
        {average !== undefined ? renderValue(average, "30 Day Average") : null}
        { 
           renderValue(
           ( lastValue && lastValue == undefined)? '-': lastValue,
             `Last Value: ${lastValueDate? moment(lastValueDate, "YYYY-MM-DDThh:mm:ss").format("DD MMM, hh:mm a"): '  '}`
            // `Last Value: ${moment(lastValueDate, "YYYY-MM-DDThh:mm:ss").format("ddd DD, hh:mm")}`
          )
          }
      </View>
      
      <VictoryChart
        domainPadding={20}
        responsives
        style={{ parent: { paddingLeft: 8, marginTop: -30 } }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) =>
              //`${Math.floor(datum.y)} ${unit}\n${datum.day}`
              hoverDisplayValue(datum, unit)
            }
            labelComponent={
              <VictoryTooltip cornerRadius={10} flyoutStyle={{ stroke: "none", fill: "rgba(0, 0, 0, 0.8)" }} style={[{ fontSize: 18, stroke: "#ffffff" }]} />
            }
          />
        }
      >
        {/* Y1 bar */}
        {data.length > 0 ? (
          <VictoryBar alignment="start"
            style={{ data: { stroke: "white", fill: "#fff", fillOpacity: 0.7 }, }}
            barWidth={data.length < 4 ? 20 : undefined}
            data={data}
            animate={{ duration: 500, onLoad: { duration: 300 } }}
          />
        ) : null}

        {/* Y2 bar */}
        {(data && data.length > 0) &&
          <VictoryBar alignment="end"
            style={{ data: { stroke: "black", fill: "#c91800", fillOpacity: 0.4 }, }}
            barWidth={data.length < 4 ? 20 : undefined}
            data={data.map(i => ({ ...i, y: i.y2 || 0 }))}
            animate={{ duration: 500, onLoad: { duration: 300 } }}
          />
        }

        {/* <VictoryLine
          data={[ { x: 0, y: 90 }, { x: 30, y: 90 } ]}
          standalone={false}
          style={{ data: { stroke: "#0000FF", strokeWidth: 5 } }}
        /> */}

        <VictoryAxis
          style={{
            axis: { stroke: "none" },
            tickLabels: { fontSize: 10, padding: 15, stroke: "#FFFFFF", fill: "white", },
            grid: { stroke: "#EBEDF0", strokeWidth: 1 },
          }}
          tickFormat={(t) =>
            t && t > 999 ? `${t.toFixed(0) / 1000}k` : t.toFixed(0)
          }
          dependentAxis
          // label={`${title} (${unit})`}
          axisLabelComponent={<VictoryLabel dy={-16} />}
          offsetX={38}
          domain={
              title === "Heart Rate" ? [60, 100]
              : title === "Step Count" ? [500, 6500]
              : []
          }
        />

        <VictoryAxis fixLabelOverlap fixLabelOverlap={true}
          domain={[-0, 0]}
          style={{
            axis: { stroke: "#EBEDF0" },
            tickLabels: { fontSize: 12, padding: 15, stroke: "#FFFFFF", fill: "white", angle: -25, },
          }}
          tickFormat={(x) => {
            const { hours: h, minutes: m, sign: s } = timeConvert(timeOffset);
            const { day: tickDay, month: tickMonth } = convertDate(
              `${x}${s}${h}:${m}`
            );
            const tickValue = tickDay && tickMonth ? tickDay + " " + tickMonth : "";
            return tickValue;
          }}
        />

        {(props.startLimit && props.startLimit>0) ? <VictoryLine name="startLimit"
          data={[{ x: 0, y: props.startLimit }, { x: 100, y: props.startLimit }]}
          // standalone={false}
          style={{ data: { stroke: "#FFFF00", strokeWidth: 1 } }}
          labelComponent={<VictoryLabel  dy={-5}  dx={85}/>}
            labels={({ datum }) =>
              displayValue(datum, unit,"lower")
            }
        /> : null}
         
        {((props.endLimit && props.endLimit>0 && props.endLimit < 100000) || title == "Falls") ? <VictoryLine name="endLimit"
          data={[{ x: 0, y: title == "Falls"? 5: props.endLimit }, { x: 100, y:  title == "Falls"? 5: props.endLimit }]}
          // standalone={false}
          style={{ data: { stroke: title == "Falls"? "white": "#FFFF00", strokeWidth: 1 } }}
          labelComponent={<VictoryLabel dy={30}  dx={210}/>}
          labels={({ datum }) =>
          props.endLimit < 100000? displayValue(datum, unit, "upper"):''
        }
        /> : null}


    { (bpSysStartLimt&& bpSysStartLimt > 0) ? <VictoryLine name="startLimit"
          data={[{ x: 0, y: bpSysStartLimt }, { x: 100, y: bpSysStartLimt }]}
          style={{ data: { stroke: "#FFFF00", strokeWidth: 1 } }}
          labelComponent={<VictoryLabel dy={-5}  dx={100}/>}
            labels={({ datum }) =>
            displayBpSysLimits(datum, unit,"lower")
            }
        /> : null}
         
        {(bpSysEndLimit  && bpSysEndLimit >0 && bpSysEndLimit < 100000 ) ? <VictoryLine name="endLimit"
          data={[{ x: 0, y: bpSysEndLimit }, { x: 100, y: bpSysEndLimit }]}
          style={{ data: { stroke: "#FFFF00", strokeWidth: 1 } }}
          labelComponent={<VictoryLabel dy={30}  dx={240}/>}
          labels={({ datum }) =>
          bpSysEndLimit < 100000? displayBpSysLimits(datum, unit, "upper"):''
        }
        /> : null}

      </VictoryChart>

    </LinearGradient>
  
    {/* <Text>valueIndex: {props.valueIndex}</Text> */}

  </>);
};

const styles = StyleSheet.create({
  valueRoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: -10,
  },
  valueContainer: { flexDirection: "row", alignItems: "baseline", alignItems: "center" },
  value: {
    color: theme.colors.white,
    fontSize: 24,
    fontWeight: "600",
  },
  valueUnit: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  chartLabelRoot: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -16,
    marginBottom: 8,
  },
  chartLabelText: {
    color: "white",
    marginLeft: 4,
    fontSize: 20,
    fontWeight: "500",
  },
  gradientContainer: {
    marginTop: 12,
    zIndex: 999,
  },
});
