import { Image, Platform, Text, TouchableOpacity, View } from "react-native";

import { icons } from "../../assets";
import React from "react";
import { styles } from "./styles";

export const ListItem = props => {
  const { title, left, right, onPress, textStyle } = props;
  const getPasswordDots = () => {
    let password = "";
    for (let _val in right) {
      password += "\u2B24";
    }
    return password;
  };

  const textFontStyle = textStyle ? textStyle : styles.title

  return (
    <TouchableOpacity onPress={onPress} key={title}>
      <View style={styles.root}>
        {left && <View style={styles.left}>{left}</View>}
        <View style={styles.content}>
          {typeof title === "string" ? (
            <Text style={textFontStyle}>{title}</Text>
          ) : (
            title
          )}
          <View style={styles.right}>
            <Text
              style={{
                ...styles.rightText,
                ...(Platform.OS === "ios" && title === "Password"
                  ? { fontSize: 8 }
                  : {})
              }}
            >
              {title === "Password" ? getPasswordDots() : right}
            </Text>
            <Image style={styles.rightImage} source={icons.disclosure} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
