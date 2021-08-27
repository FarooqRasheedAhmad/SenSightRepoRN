import React from "react"
import {
    Dimensions
  } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";
const dimensions = Dimensions.get("window");
const barHeight = dimensions.height * 0.095 + 30;

export const TabBg = ({
  color = '#000',
  ...props
}) => {
  return (
    <Svg
      width={75}
      height={barHeight}
      viewBox={`0 0 75 ${barHeight}`}
      {...props}
    >
      <Path
        d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
        fill={color}
      />
    </Svg>
  )
};