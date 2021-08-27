import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { StorageUtils } from "../../utils";
import { icons } from "../../assets";
import { styles } from "./styles";

export const LocationItem = ({ title, name, detail, onPress, leftIcon, disabled }) => {
  
  // const [user_modules, setUser_modules] = React.useState(null);
  // StorageUtils.getValue('user_modules').then(r => setUser_modules(r));
  // const disabled = (user_modules && user_modules.indexOf(name) < 0)

  return (
    <TouchableOpacity disabled={disabled} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.root}>
        <Image source={leftIcon} />
        <View style={{ flex: 3 }}>
          <View style={{ marginLeft: 15, marginRight: 15 }}>
            <Text style={styles.name}>{title || name}</Text>
            {detail ? <Text style={styles.detail}>{detail}</Text> : null}
          </View>
        </View>
        {!disabled && <View style={{ flex: 0.15 }}><Image style={styles.image} source={icons.disclosure} /></View>}
      </View>
    </TouchableOpacity>
  );
};
