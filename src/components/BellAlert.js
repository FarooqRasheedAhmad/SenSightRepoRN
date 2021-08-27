import React from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { icons } from "../assets";
import { theme } from "../theme";

export const BellAlert = ({onPress, alerts}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
            <Image source={icons.bell_white} style={styles.iconStyle} />
            {alerts > 0 && alerts &&
                <View style={styles.tempTextWrapper}><Text style={{ ...styles.tempText, width: (14 + ((`${alerts > 99 ? '99+' : alerts}`.length - 1) * 6)) }}>{alerts > 99 ? '99+' : alerts}</Text></View>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrapper:{
        marginRight: 5, borderWidth: 1, borderColor: theme.colors.colorPrimary, borderRadius: 4,
    },
    iconStyle: {
        width: 24,
        height: 24
    },
    tempText: {
        // margin: 2,
        textAlign: "center",
        paddingTop: 3,
        paddingRight: 0,
        paddingBottom: 1,
        // paddingLeft:1,
        // height: 18,
        width: "auto",
        // backgroundColor: theme.colors.red_shade_2,
        // borderWidth:2, borderColor:"#FFF",
        // borderRadius: 8,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        color: "#FFF",
        fontFamily: theme.fonts.Roboto,
        fontSize: 10,
        lineHeight: 12,
        position: "relative",
    },
    tempTextWrapper: {
        backgroundColor: theme.colors.red_shade_2,
        borderWidth: 2, borderColor: "#FFF",
        borderRadius: 12,
        flex: 1,
        width: "auto",
        position: "absolute",
        top: -10, right: -10,
    },

})
