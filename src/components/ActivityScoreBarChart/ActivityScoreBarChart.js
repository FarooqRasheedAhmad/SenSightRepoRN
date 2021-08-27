import { StyleSheet, Text, View } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory-native";
import { convertDate, timeConvert } from "../../utils";

import React from "react";

export const ActivityScoreBarChart = ({ data, timeOffset }) => (
  <View style={styles.root}>
    <VictoryChart animate style={{ parent: { stroke: "none" } }} height={200}>
      <VictoryBar
        alignment="middle"
        data={data}
        x="day"
        y="activityScore"
        cornerRadius={{ top: 12, bottom: 12 }}
        categories={{
          x: Array.from(data, (x) => {
            const { hours, minutes, sign } = timeConvert(timeOffset);
            const statDate = x.statsDate && x.statsDate.replace("Z", "");
            const { day, month } = convertDate(
              `${statDate}${sign}${hours}:${minutes}`
            );
            return statDate ? day + " " + month : "";
          }),
        }}
        animate
        barRatio={0.6}
        standalone={false}
        labels={({ datum }) => `${Math.floor(datum.activityScore)}`}
        style={{
          data: {
            fill: "#25BEED",
            fillOpacity: 0.8,
            width: 20,
          },
          labels: { fill: "grey" },
        }}
      />
      <VictoryAxis
        style={{
          axis: { stroke: "none" },
          axisLabel: { fontSize: 22, fill: "grey" },
          tickLabels: { angle: 30, height: 40, fill: "grey" },
        }}
        offsetY={35}
      />
    </VictoryChart>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    paddingTop: 8,
    alignSelf: "center",
    fontSize: 20,
    color: "grey",
  },
});
