import { Text, View } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";
import { convertDate, timeConvert } from "../../utils";

import LinearGradient from "react-native-linear-gradient";
import React from "react";
import { StaticsDuratonTabView } from "../StaticsDuratonTabView";
import { styles } from "./styles";
import { theme } from "../../theme";

const { gradientContainer } = styles;

const tabItems = [
  { name: "Day", value: 1 },
  { name: "Week", value: 7 },
  { name: "Month", value: 30 },
  { name: "3 Months", value: 90 },
];
const barStyle = { data: { stroke: "white", fill: "#fff", fillOpacity: 0.7 } };
export const Graph = (props) => {
  const {
    gradiantColors,
    monthData,
    selectedValueType,
    onPressDaysTab,
    selectedDayTabIndex,
    deviceSettings,
    timeOffset,
    unit,
    average,
    lastValue,
    lastValueDay,
    lastValueTime,
    valueIndex,
  } = props;
  let data = [];
  const graphDays = tabItems[selectedDayTabIndex].value;

  console.log(average, lastValue, lastValueDay, lastValueTime);

  if (monthData) {
    monthData.forEach((e, index) => {
      const { hours: h, minutes: m, sign: s } = timeConvert(timeOffset);
      const d = e.uploadDate.replace("+00:00", "");
      const { time, dayTime, day, month } = convertDate(`${d}${s}${h}:${m}`);
      const xValue = graphDays > 1 ? day + "/" + month : time;

      data.push({
        x: xValue,
        y: e[selectedValueType],
        day: day,
      });
    });
  }

  const onPressTabItem = (index) => {
    onPressDaysTab(index, tabItems[index].value);
  };

  const renderVictorBar = (data) => {
    if (data.length === 0) return null;

    if (data.length === 1) {
      return (
        <VictoryBar
          data={data}
          barWidth={28}
          animate={{ duration: 300, onLoad: { duration: 200 } }}
          style={barStyle}
        />
      );
    } else
      return (
        <VictoryBar
          data={data}
          animate={{ duration: 1000, onLoad: { duration: 500 } }}
          style={barStyle}
        />
      );
  };

  const renderValue = (value, label) => (
    <View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {typeof value === "object" ? value[valueIndex] : value}
        </Text>
        <Text style={styles.valueUnit}>{unit}</Text>
      </View>
      <Text style={{ color: theme.colors.white }}>{label}</Text>
    </View>
  );

  data.reverse();

  return (
    <LinearGradient colors={gradiantColors}>
      <View style={gradientContainer}>
        <StaticsDuratonTabView
          tabItems={tabItems}
          textColor={deviceSettings.headerBgColor}
          selectedBgColor="#ffffff"
          selectedIndex={selectedDayTabIndex}
          onPressCallBack={onPressTabItem}
        />
      </View>
      <View style={styles.valueRoot}>
        {average !== undefined ? renderValue(average, "30 Day Average") : null}
        {lastValue !== undefined
          ? renderValue(
              lastValue,
              `Last Value: ${lastValueDay}, ${lastValueTime}`
            )
          : null}
      </View>
      <VictoryChart
        // adding the material theme provided with Victory
        domainPadding={20}
        responsives
        style={{ parent: { paddingLeft: 8, marginTop: -30 } }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) =>
              `${Math.floor(datum.y * 100) / 100} ${unit}
              \n${datum.day}`
            }
            labelComponent={
              <VictoryTooltip
                cornerRadius={10}
                pointerLength={10}
                pointerWidth={20}
                dy={40}
                // orientation="bottom"
                flyoutStyle={{ stroke: "none", fill: "rgba(0, 0, 0, 0.6)" }}
                style={[{ fontSize: 18, stroke: "#ffffff" }]}
              />
            }
          />
        }
      >
        <VictoryAxis
          fixLabelOverlap={true}
          style={{
            axis: { stroke: "#EBEDF0" },
            tickLabels: {
              fontSize: 12,
              padding: 15,
              stroke: "#FFFFFF",
              fill: "white",
              angle: -25,
            },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: "none" },
            tickLabels: {
              fontSize: 10,
              padding: 15,
              stroke: "#FFFFFF",
              fill: "white",
            },
            grid: { stroke: "#EBEDF0", strokeWidth: 1 },
          }}
          dependentAxis
          domain={[60, 100]}
        />
        {renderVictorBar(data)}
      </VictoryChart>
    </LinearGradient>
  );
};
