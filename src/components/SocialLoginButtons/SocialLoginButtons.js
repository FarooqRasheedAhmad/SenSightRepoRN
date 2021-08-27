import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from './styles'
import { icons } from "../../assets";
import { theme } from "../../theme";


const { container, seprator, iconStyle, imageContainer,
    textStyle } = styles

export const SocialLoginButtons = () => {

    return (
        <View style={container}>
            <View style={imageContainer}>
                <Image source={icons.google_login_icon} style={iconStyle} />
                <Text style={textStyle}>{theme.strings.google_plus}</Text>
            </View>
            <View style={seprator} />
            <View style={imageContainer}>
                <Image source={icons.fb_login_icon} style={iconStyle} />
                <Text style={textStyle}>{theme.strings.facebook}</Text>
            </View>
            <View style={seprator} />
            <View style={imageContainer}>
                <Image source={icons.apple_login_icon} style={iconStyle} />
                <Text style={textStyle}>{theme.strings.apple}</Text>
            </View>
        </View>
    )
}
