import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

export const SafeArea = props => {
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>{props.children}</ScrollView>
    </SafeAreaView>
}