import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";

import RNPickerSelect from "react-native-picker-select";
import { showMessage } from "../../utils";
import { theme } from "../../theme";
import { careHomeOfficeAray } from '../../configs'

export const AgentInputDetails = ({ agentEmail, careHomeLocation, values }) => {
  const [email, setEmail] = useState(agentEmail || "");
  const [location, setLocation] = useState(careHomeLocation.toString() || "1");

  useEffect(() => {
    values({
      agentEmail: !email ? null : email,
      careHomeLocation: parseInt(location),
    });
  }, [email, location]);
/*
  const items = [
    {
      label: "Central Branch",
      value: "1",
      color: theme.colors.grey_shade_1,
    },
    {
      label: "North Branch",
      value: "2",
      color: theme.colors.grey_shade_1,
    },
  ];
*/
// const items = [
//   {
//     label: "Branch 1",
//     value: "1",
//     color: theme.colors.grey_shade_1,
//   },
//   {
//     label: "Branch 2",
//     value: "2",
//     color: theme.colors.grey_shade_1,
//   },
//   {
//     label: "Branch 3",
//     value: "3",
//     color: theme.colors.grey_shade_1,
//   },
// ];
  return (
    <View>
      <Text style={styles.jobTitle}>Senior Manager Email*</Text>
      <TextInput
        value={email}
        placeholder="Enter senior manager's email"
        placeholderTextColor="rgba(0,0,0,0.2)"
        style={styles.textInput}
        keyboardType={"email-address"}
        onChangeText={
          (text) => setEmail(text)
          // /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}&/.test(text) || text === ""
          //   ? setEmail(text)
          //   : showMessage("Please enter valid email address")
        }
      />
      <Text style={styles.jobTitle}>Care Home Office</Text>
      <View style={styles.pickerView}>
        <RNPickerSelect value={location} placeholder={{}} items={careHomeOfficeAray}
          onValueChange={(value) => { setLocation(value); }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  jobTitle: {
    fontFamily: theme.fonts.SFProSemibold,
    fontSize: 18,
    marginTop: 12,
    marginLeft: 23,
    color: theme.colors.black,
  },
  textInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.2)",
    color: "black",
    marginLeft: 20,
    height: Platform.OS === "ios" ? 40 : undefined,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: theme.colors.black,
    ...(Platform.OS === "android" ? { paddingTop: 15, paddingBottom: 15 } : {}),
  },
  pickerView: {
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 8,
    height: Platform.OS === "ios" ? 40 : undefined,
    justifyContent: "center",
    borderColor: theme.colors.grey_shade_1,
  },
});
