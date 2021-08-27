import React, { useEffect } from "react";
import { ScrollView, View, Platform, StatusBar } from "react-native";

import { PatientDiaryRadioButton,NavigationHeader } from "../../../components";
import { theme } from "../../../theme";

export const PrivacySettings = (props) => {
  useEffect(() => {
    if (Platform.OS !== "ios") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor(theme.colors.colorPrimary);
    }
  }, []);

  return (
    <ScrollView>
      <View style={{ flex: 1, backgroundColor: "white" }}>
      <NavigationHeader title={'Privacy Setting'} leftText={'Back'} navigation={props.navigation}  style={{ marginTop: Platform.OS === 'ios' ? 10 : 25,}}/>
        <PatientDiaryRadioButton description="Share notes with other caregivers" />
      </View>
    </ScrollView>
  );
};

PrivacySettings.navigationOptions = ({ navigation }) => {
  return {
    title: "Privacy Settings",
    headerBackTitle: "",
    headerTintColor: "white",
    headerTitleStyle: {
      fontSize: 20,
    },
    headerStyle: {
      backgroundColor: theme.colors.colorPrimary,
    },
    // headerLeft: () => (
    //   <HeaderBackButton
    //     tintColor={theme.colors.colorPrimary}
    //     onPress={() => {
    //       getSeniorLocations();
    //       fetchGeofences();
    //       navigation.goBack();
    //     }}
    //   />
    // ),
  };
};
