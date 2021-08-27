import { Dimensions, ScrollView, View } from "react-native";

import Dialog from "react-native-dialog";
import React from "react";

export const ShowAllDialog = props => {
  return (
    <View style={{ flex: 1 }}>
    <Dialog.Container visible={props.showDialog} contentStyle={{}}>
      <Dialog.Title style={{ textAlign: "center" }}>{props.title}</Dialog.Title>
      <ScrollView
        style={{
          height: Dimensions.get("screen").height - 300,
        }}
      >
        {props.children}
      </ScrollView>
      <Dialog.Button label="Cancel" onPress={props.hideDialog} />
    </Dialog.Container>
    </View>
  )
};
