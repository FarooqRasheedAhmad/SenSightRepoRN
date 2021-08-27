import React from "react";

import { View, Text, Image } from "react-native";
import { icons } from "../../assets";
import { styles } from "./styles";
import { theme } from "../../theme";

export const Contact = props => {

  const profileImage = props.thumbnailPath ? props.thumbnailPath : icons.tab_profile

  return (
    <View style={styles.container}>
      <Image source={profileImage} style={styles.imageContainer}></Image>
      <View style={styles.textContainer}>
        <Text style={{...styles.text, ...props.titleStyle}}>{props.givenName}</Text>
        {props.desc && <Text style={{color:"#999"}}>{props.desc}</Text>}
      </View>
    </View>
  );
};
