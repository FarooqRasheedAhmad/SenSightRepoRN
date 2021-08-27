import { Image, Text, TouchableOpacity, View } from "react-native";

import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import React from "react";
import Snackbar from "react-native-snackbar";
import { styles } from "./styles";

export const CallButton = props => {
  const { title, color, bordered, icon, phone } = props;

  const makeCall = () => {
    if (phone) {
      RNImmediatePhoneCall.immediatePhoneCall(phone);
    } else {
      Snackbar.show({
        title: "No phone number given",
        duration: Snackbar.LENGTH_SHORT
      });
    }
  };

  return (
    <TouchableOpacity onPress={makeCall}>
      <View
        style={{
          ...styles.root,
          ...(bordered
            ? { borderWidth: 1, borderColor: color }
            : { backgroundColor: color })
        }}
      >
        <View style={styles.container}>
          <Image style={styles.image} source={icon} />
          <Text style={{ ...styles.title, ...(bordered && { color }) }}>
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
