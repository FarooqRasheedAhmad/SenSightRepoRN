import { Image, TextInput, View } from "react-native";

import React from "react";
import { icons } from "../../assets";
import { styles } from "./styles";

export const SearchBar = (props) => {
  return (
    <View style={styles.searchBarContainer}>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Image source={icons.search} />
        <TextInput
          onChangeText={(text) => props.searchFilter(text)}
          style={styles.textInput}
          placeholder="Search"
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
        />
      </View>
      {/* <Image source={icons.mic}></Image> */}
    </View>
  );
};
