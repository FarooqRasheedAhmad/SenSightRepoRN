import { Image, Text, View } from "react-native";

import { icons } from "../../assets";
import React from "react";
import { styles } from "./styles";

export const AssesmentItem = props => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>{props.name}</Text>
        <Text style={styles.subHeading}>{props.date}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.text}>{props.value}</Text>
        <Image source={icons.disclosure}></Image>
      </View>
    </View>
  );
};
