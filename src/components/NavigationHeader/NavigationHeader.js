import * as React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, StatusBar } from "react-native";
import PropTypes from "prop-types"
// import { styles } from "./styles";
import { icons } from "../../assets";
import { Row, Col } from '../Grid';
import { theme } from "../../theme"

// const { container, subcontainer, headerLeftTextStyle, maingHeadingStyle, headerRightTextStyle } = styles

export const NavigationHeader = props => {
    const { leftText, title, navigation, showBackBtn, onBackButtonPress } = props

    return (<View style={{...styles.container, ...props.style}}>
        <Row>
            <Col flex={70} valign="center">
                <TouchableOpacity onPress={() => onBackButtonPress && onBackButtonPress() || navigation.goBack()}>
                    <Row>
                        <Col valign="center">{showBackBtn && <Image source={icons.arrow_blue} style={{ tintColor: 'white' }} />}</Col>
                        <Col valign="center"><Text style={styles.headerLeftTextStyle}>{leftText}</Text></Col>
                    </Row>
                </TouchableOpacity>
            </Col>
            <Col flex="auto" align="center" valign="center" style={{paddingHorizontal:10}}><Text style={{color:"#FFF", fontSize:18, textAlign:"center"}}>{props.title}</Text></Col>
            <Col flex={props.title ? 70 : undefined} valign="center" align="flex-end">{props.right}</Col>
        </Row>
    </View>)

    // return (
    //     <View style={container}>
    //         <View style={subcontainer}>
    //             <TouchableOpacity 
    //                 style={{ zIndex: 999, flexDirection: "row", alignItems: 'center' }}
    //                 onPress={() => onBackButtonPress && onBackButtonPress() || navigation.goBack()}>
    //                 {showBackBtn && <Image source={icons.arrow_blue} style={{ tintColor: 'white' }} />}
    //                 <Text style={headerLeftTextStyle}>{leftText}</Text>
    //             </TouchableOpacity>
    //             <Text style={maingHeadingStyle}>{title}</Text>
    //         </View>
    //     </View>
    // )
}

NavigationHeader.propTypes = {
    showBackBtn: PropTypes.bool,
    onBackButtonPress: PropTypes.func,
    leftText: PropTypes.string,
    
    leftButton: PropTypes.object,
    rightButton: PropTypes.object,
}

NavigationHeader.defaultProps = {
    showBackBtn: true,
}

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 25,
        backgroundColor: theme.colors.colorPrimary
    },

    headerLeftTextStyle: {
        marginLeft: 5,
        color: theme.colors.white,
        fontSize: 17,
    },

});