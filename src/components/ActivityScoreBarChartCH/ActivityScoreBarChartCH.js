import { StyleSheet, View } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
} from "victory-native";
import { convertDate, timeConvert } from "../../utils";

import React from "react";
import { theme } from "../../theme";

export const ActivityScoreBarChartCH = ({ data, average, timeOffset }) => (
  <View style={styles.root}>
    <VictoryChart style={{ parent: { stroke: "none" } }} height={200}>
      <VictoryBar
        alignment="middle"
        data={data}
        x="day"
        y="score"
        categories={{
          x: Array.from(data, (x) => {
            if (!x.date) return null;

            const nd = x.date.replace("Z", "");
            const { sign, hours, minutes } = timeConvert(timeOffset);
            const { month, day } = convertDate(
              `${nd}${sign}${hours}:${minutes}`
            );
            return day + " " + month;
          }),
        }}
        // animate
        barRatio={0.6}
        standalone={false}
        labels={({ datum }) => `${Math.floor(datum.score)}`}
        style={{
          data: {
            fill: ({ datum }) => datum.color,
          },
          labels: { fill: "grey" },
        }}
      />
      {average ? (
        <VictoryLine
          y={() => average}
          style={{
            data: { stroke: theme.colors.colorPrimary },
          }}
        />
      ) : null}
      <VictoryAxis
        style={{
          axis: { stroke: "none" },
          axisLabel: { fontSize: 22, fill: "grey" },
          tickLabels: { angle: 30, height: 40, fill: "grey" },
        }}
      />

      {average ? (
        <VictoryAxis
          tickValues={[average]}
          style={{
            axis: { stroke: "none" },
            tickLabels: { angle: 0, fontSize: 17, fontWeight: "bold" },
          }}
          dependentAxis
        />
      ) : null}
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
