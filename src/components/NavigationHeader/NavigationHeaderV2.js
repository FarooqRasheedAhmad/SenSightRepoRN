import * as React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, StatusBar } from "react-native";
import PropTypes from "prop-types"
// import { styles } from "./styles";
import { icons } from "../../assets";
import { theme } from "../../theme"
import { Row, Col } from '../Grid';

// const { container, subcontainer, headerLeftTextStyle, maingHeadingStyle, headerRightTextStyle } = styles

const Button = props => <TouchableOpacity style={styles.button}
        onPress={()=>props.onPress()}>
    {/* onPress={() => onBackButtonPress && onBackButtonPress() || navigation.goBack()}> */}
    {/* {showBackBtn && <Image source={icons.arrow_blue} style={{ tintColor: 'white' }} />} */}
    {props.icon || null}
    <Text style={styles.headerLeftTextStyle}>{props.text}</Text>
</TouchableOpacity>


export const NavigationHeaderV2 = props => {
    const { leftText, title, navigation, allowBack, onBackButtonPress, headerStyle } = props
    
    return (<View style={[styles.container,headerStyle]}>
        <Row>
            {(props.allowBack && !props.buttonLeft && !props.leftComponent) &&
                <Col><Button onPress={onBackButtonPress || navigation.goBack} text={props.backText || "Back"} icon={<Image source={icons.arrow_blue} style={{ tintColor: 'white' }} />} /></Col>
            }
            <Col>
                {props.leftComponent || null}
                {props.buttonLeft && <Button {...props.buttonLeft} />}
            </Col>
            <Col flex="auto" align="center"><Text style={{ ...styles.title, ...props.titleStyle }}>{title}</Text></Col>
            <Col>
                {props.rightComponent || null}
                {props.buttonRight && <Button {...props.buttonRight} />}
            </Col>
        </Row>
    </View>)

    // return (<View style={container}>
    //     <View style={subcontainer}>
    //         <Row>
    //             <Col><Button onPress={onBackButtonPress || navigation.goBack} title={leftText} /></Col>
    //             <Col><Text style={maingHeadingStyle}>{"title"}</Text></Col>
    //             <Col></Col>
    //         </Row>
    //     </View>
    // </View>)

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

NavigationHeaderV2.propTypes = {
    allowBack: PropTypes.bool,
    onBackButtonPress: PropTypes.func,
    leftText: PropTypes.string,

    buttonLeft: PropTypes.object,
    buttonRight: PropTypes.object,
}

NavigationHeaderV2.defaultProps = {
    allowBack: true,
}

const styles = StyleSheet.create({
    title:{
        color: "#FFF",
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 17,
    },

    container: {
        width: '100%',
        padding: 10,
        marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 25,
        backgroundColor: theme.colors.colorPrimary
    },
    subcontainer: { width: '100%', flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

    headerLeftTextStyle: {
        marginLeft: 5,
        color: theme.colors.white,
        fontSize: 17,
    },

    button:{
        zIndex: 999, flexDirection: "row", alignItems: 'center',
    },

});