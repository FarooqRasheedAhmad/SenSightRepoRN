import { Text, View, Image, TouchableWithoutFeedback } from "react-native";
import { icons } from "../../assets"
import { theme } from "../../theme";
import React from "react";
import { styles } from "./styles"
import { TouchableOpacity } from "react-native-gesture-handler";

const { heading, subContainer, list, listText, listSubText } = styles
export const BottomView = props => {

    return (<View style={subContainer} disabled={true} >
        <Text style={heading}>Call Caregivers</Text>
        <TouchableWithoutFeedback>
        <View style={list}>
            <View style={{ flexDirection: "row" }}>
                <Image style={{ width: 48, height: 48, marginRight: 6 }} source={icons.contact_img} />
                <View>
                    <Text style={listText}>Lily Jones</Text>
                    <Text style={listSubText}>Secondary Caregiver</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => alert('hi')}>
                <Image style={{ marginRight: 15, tintColor: theme.colors.green_color }} source={icons.call_blue}></Image>
            </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
    </View>
    )
}
