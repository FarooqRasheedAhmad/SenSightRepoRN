import React, { useEffect, useState } from "react";
import { VictoryLabel, VictoryPie } from "victory-native";

import { Svg } from "react-native-svg";
import { View } from "react-native";

export const ActivityScoreProgressBarChart = props => {
  const { size, label, data } = props;

  const getSize = () => {
    switch (size) {
      case "small":
        return "100";
      case "medium":
        return "150";
      case "large":
        return "250";
      default:
        return "100";
    }
  };
  const dimension = getSize();

  const getColor = value => {
    switch (value) {
      case value < 15:
        return "#2E7F18";
      case value < 30:
        return "#45731E";
      case value < 45:
        return "#675E24";
      case value < 60:
        return "#8D472B";
      case value < 75:
        return "#B13433";
      case value >= 75:
        return "#C82538";
      default:
        return "#675E24";
    }
  };

  return (
    <View
      style={{
        marginBottom: size === "small" || size === undefined ? 8 : undefined
      }}
    >
      <Svg viewBox="0 0 200 200" width={dimension} height={dimension}>
        <VictoryPie
          standalone={false}
          animate={{ easing: "exp", duration: 2000 }}
          width={200}
          height={200}
          data={data}
          innerRadius={72}
          cornerRadius={10}
          labels={() => null}
          style={{
            data: {
              fill: ({ datum }) => {
                return datum.x === 1 ? "#E0481B" : "#E7E5E5";
                // return datum.x === 1
                //   ? datum.y < 15
                //     ? "#2E7F18"
                //     : datum.y < 30
                //     ? "#45731E"
                //     : datum.y < 45
                //     ? "#675E24"
                //     : datum.y < 60
                //     ? "#8D472B"
                //     : datum.y < 75
                //     ? "#B13433"
                //     : "#C82538"
                //   : "#E7E5E5";
              }
            }
          }}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={100}
          y={100}
          text={`${Math.round(data[0].y)} %\n${label}`}
          style={{ fontSize: 24 }}
        />
      </Svg>
    </View>
  );
};
