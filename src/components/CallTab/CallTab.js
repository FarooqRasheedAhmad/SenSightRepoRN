import { View, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { styles } from "./styles"
import { BottomView } from './BottomView'
const { container } = styles
export const CallTab = props => {

    return (
        <TouchableWithoutFeedback onPress={() => props.onPressCallBack(false)}>
            <View style={container}>
                <BottomView />
            </View>
        </TouchableWithoutFeedback>
    )
}
