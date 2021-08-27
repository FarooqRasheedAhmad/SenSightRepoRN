import { Image, Text, View } from "react-native";

import React from "react";
import { styles } from "./styles";

export const CaregiverInfo = props => {
  return (
    <>
      <Text style={styles.infoTitle}>Info</Text>
      <View>
        {props.infoList.map(item => (
          <View style={styles.infoStatsRoot}>
            <Image source={item.icon} style={styles.infoStatsIcon} />
            <Text style={styles.infoStatText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </>
  );
};
