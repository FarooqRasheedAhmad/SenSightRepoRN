import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from "../theme";
import { Row, Col } from './Grid'


export const HeaderButton = props => (<TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
    <Text style={styles.headerText}>{props.title}</Text>
</TouchableOpacity>)


export const Header = props => {
    const { title, leftButton, rightButton } = props;

    return (
        <View style={{ ...styles.container, ...props.style }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                {leftButton && <HeaderButton onPress={leftButton.onPress} title={leftButton.title} />}
                <Text style={styles.headerText}>{title}</Text>
                {rightButton && <HeaderButton onPress={rightButton.onPress} title={rightButton.title} />}
            </View>
        </View>
    )
}

export default Header;


const styles = StyleSheet.create({
    container:{
        height: 60, paddingLeft: 10, paddingRight: 10, paddingTop: 20, justifyContent: "center", backgroundColor: theme.colors.colorPrimary,
    },
    headerText: {
        fontFamily: theme.fonts.SFProRegular, fontSize: 17, lineHeight: 22, letterSpacing: -0.41, color: theme.colors.white
    },
})
