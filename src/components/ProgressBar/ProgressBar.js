import { Platform, ProgressBarAndroid, ProgressViewIOS } from "react-native";

import React from "react";

export const ProgressBar = props => {
  const { color } = props;

  return Platform.OS === "ios" ? (
    <ProgressViewIOS
      progressTintColor={color}
      style={{
        height: 12,
        transform: [{ scaleX: 1.0 }, { scaleY: 1.8 }]
      }}
      progressViewStyle="default"
      {...props}
    />
  ) : (
    <ProgressBarAndroid
      styleAttr="Horizontal"
      indeterminate={false}
      animating
      {...props}
    />
  );
};
