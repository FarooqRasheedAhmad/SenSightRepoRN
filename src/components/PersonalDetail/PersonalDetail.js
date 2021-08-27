import { Image, Text, TouchableOpacity, View } from "react-native";

import React from "react";
import { icons } from "../../assets";
import { styles } from "./styles";

export const PersonalDetail = (props) => {
  const { avatar, title, time, description, onPress, email } = props;
  console.log('email ', email)
  return (
    <>
      <View style={styles.root}>
        <View style={styles.left}><Image source={avatar} style={styles.avatar} /></View>
        <View style={styles.content}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text numberOfLines={1} style={styles.time}>{email}</Text>
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={onPress}><Image style={styles.rightImage} source={icons.edit_profile} /></TouchableOpacity>
          </View>
        </View>
      </View>
      {/* {(description && description !== 'null') && <Text style={styles.description}>{description && description !== 'null' ? description : ""}</Text>} */}
    </>
  );
};
