import React from "react";
import {
    Text, View, TouchableOpacity
} from "react-native"
import { styles } from "./styles"
import { theme } from "../../theme";


export const CustomSwitch = (props) => {

    const { tabItems, selectedIndex, width } = props
    // const extraWidth = 2 * width + 12

    let containerStyle = { ...styles.container}
    if (width) Object.assign(containerStyle, { width: (2 * width + 12 )})

    let tabItemStyle = { ...styles.tabItem}
    if (width) Object.assign(tabItemStyle, {width});

    const renderSwitchTab = () => {
        return tabItems.map((item, index) => {
            return (
                <View style={{ ...tabItemStyle}} key={index}>
                    <TouchableOpacity disabled={props.disabled}
                        onPress={() => index === selectedIndex ? ()=>{} : props.onPressCallBack(index)}
                        style={[
                            styles.textContainer, { backgroundColor: index === selectedIndex ? theme.colors.colorPrimary : theme.colors.white }
                        ]} key={item.name}>
                        <Text allowFontScaling={true} adjustsFontSizeToFit={true} numberOfLines={1}
                            style={[ styles.textStyle, { color: index === selectedIndex ? theme.colors.white : theme.colors.black, fontSize: props.textSize || 17 }, ]}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        })
    }

    return (<View style={{ ...containerStyle}}>
        {renderSwitchTab()}
    </View>)
}
