import { AssesmentItem, SearchBar } from "../../components";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, StatusBar, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { theme } from "../../theme";
import { icons, images } from "../../assets";

export const AssesmentScreen = props => {
  useEffect(() => {
    if (Platform.OS !== "ios") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor(theme.colors.colorPrimary);
    }
  }, []);

  const arrayHolder = [
    {
      name: "MIMSE",
      date: "Thursday, 29th April 2018",
      value: "79/100"
    },
    {
      name: "DDSE",
      date: "Thursday, 29th April 2018",
      value: "79/100"
    }
  ];
  const [assesments, setAssesments] = useState(arrayHolder);
  const searchFilter = text => {
    const newData = arrayHolder.filter(item => {
      return item.name.toLowerCase().includes(text.toLowerCase());
    });
    setAssesments(newData);
  };

  return (
    <View>
      <TouchableOpacity style={{ marginTop: 35, marginLeft: 10 }} activeOpacity={0.8} onPress={() => { props.navigation.goBack(null); }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <Image source={icons.arrow_blue} />
            <Text style={[ styles.locStatsItemDetail, { marginLeft: 5, color: theme.colors.colorPrimary, fontSize: 15 } ]}>Back</Text>
          </View>
          <Text style={{ textAlign: "center", marginLeft: Dimensions.get("window").width / 2 - 120, fontFamily: theme.fonts.SFProRegular, fontSize: 17, lineHeight: 22 }}>
            Assesment Results
          </Text>
        </View>
      </TouchableOpacity>
      
      <SearchBar searchFilter={searchFilter} />

      <FlatList
        data={assesments}
        renderItem={({ item }) => (
          <AssesmentItem name={item.name} date={item.date} value={item.value} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />

    </View>
  );
};

const styles = StyleSheet.create({});
