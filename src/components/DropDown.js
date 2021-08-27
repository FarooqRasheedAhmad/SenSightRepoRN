import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, ScrollView, Dimensions, Animated, Easing, TouchableOpacity, TouchableWithoutFeedback } from "react-native";

import { Icon, Overlay } from "react-native-elements";
import { Row, Col } from "./Grid";

/****** Usage:
<DropDown
    data={[
        { value:"a", label:"A" },
        { value:"b", label:"B" },
        { value:"c", label:"C" },
    ]}
    value={selectedValue} OR selectedIndex={2}
    onChange={(value, index, item) => {
        changeSelectedValue(value, index, item)
    }}
    noDataText="string"
/>
********/

export const DropDown = props => {
    const { data, value, selectedIndex } = props;
    const [showOptions, setShowOptions] = React.useState(false)
    // const [yPoz, setYPoz] = React.useState({y:new Animated.Value(-2000)});

    // dont show options if only one option is availabel/
    // if (!data || data.length === 1) return <View style={styles.container}>
    //     {data && <Text style={{ fontSize: props.fontSize || 18 }}>{data[0].label}</Text>}
    // </View>;

    const onOptionClick = (_value, index, data) => {
        setShowOptions(false);
        if (props.onChange) props.onChange(_value, index, data);
    }

    const toggleOptions = args => {
        setShowOptions(!showOptions)
    }

    const textStyle = { ...styles.textStyle, ...styles.textStyleLarge, ...props.textStyle }
    const ddStyle = { ...styles.container, ...styles.containerLarge, ...props.style };
    const placeholderStyle = { ...styles.placeholder, ...props.placeholderStyle}
    if (props.size=='small'){
        Object.assign(ddStyle, {...styles.containerSmall})
        Object.assign(textStyle, { ...styles.textStyleSmall })
    }
    if (props.fontSize) Object.assign(textStyle, { fontSize: props.fontSize })

    if (!data || data.length<1) return(<>
            <TouchableOpacity disabled={true} onPress={()=>{}} style={ddStyle}>
                <Row>
                    <Col flex="auto" valign="center" style={{ paddingHorizontal: 5 }}>
                        <Text style={styles.placeholder}>{props.noDataText ? props.noDataText : `No Data available  ${props.placeholder || ""}`}</Text>
                    </Col>
                    {/* <Col valign="center"><Icon name="angle-down" type='font-awesome' color="#999999" size={textStyle.fontSize + 2} /></Col> */}
                </Row>
            </TouchableOpacity>
        </>)

    return (<>
        <TouchableOpacity disabled={!data || data.length < 1} onPress={() => toggleOptions(true)} style={ddStyle}>
            <Row>
                <Col flex="auto" valign="center" style={{paddingHorizontal:5}}>
                    {data && data.map((item, i) => {
                        if (value || value === 0) return (item.value == value) ? <Text key={i} style={textStyle}>{item.label}</Text> : null;
                        if (selectedIndex && selectedIndex > -1) return (i == selectedIndex) ? <Text key={i} style={textStyle}>{item.label}</Text> : null;
                        return null;
                    })}
                    {!props.placeholder && (data && data.length > 0 && (!value && selectedIndex < 0)) && <Text style={textStyle}>{data[0].label}</Text>}
                    {(!value && (!selectedIndex || selectedIndex < 0) && props.placeholder) && <Text style={placeholderStyle}>{props.placeholder}</Text>}
                </Col>
                <Col valign="center"><Icon name="angle-down" type='font-awesome' color="#999999" size={textStyle.fontSize+2} /></Col>
            </Row>
        </TouchableOpacity>

        <Overlay
            onBackdropPress={() => toggleOptions(false)}
            isVisible={showOptions}
            windowBackgroundColor="rgba(0, 0, 0, .8)"
            overlayBackgroundColor="transparent"
            overlayStyle={styles.overlayStyle}
            width="auto"
            height="auto"
        >
            <TouchableWithoutFeedback onPress={() => toggleOptions(false)}>
                <View style={{flex:1, justifyContent:"flex-end"}}>
                    <View style={{ ...styles.innerlayStyle }}>
                        {/* <ScrollView contentContainerStyle={{ justifyContent: "flex-end", flex: 1, backgroundColor: "transparent" }}> */}
                        <ScrollView contentContainerStyle={{ backgroundColor: "transparent", }}>
                            <View style={styles.optionWrapper}>
                                {data && data.map((item, i) => {
                                    if (!item || !item.label) return null;
                                    return <TouchableOpacity onPress={() => onOptionClick(item.value, i, item)} style={styles.listItem} key={i}><Text style={{ textAlign: "center", fontSize: 18 }}>{item.label}</Text></TouchableOpacity>
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Overlay>

    </>)
}

export default DropDown;




const styles = StyleSheet.create({
    container:{
        alignSelf: "center",
        // alignSelf:"auto",
        justifyContent: "center",
        borderRadius: 20,
        paddingHorizontal:5,
        backgroundColor: "#F3F3F3",
        minWidth: 70,
    },
    textStyle:{
        color: "#000",
        // paddingLeft: 5,
        // paddingVertical: 5
    },
    placeholder:{
        color: "#BBB",

    },

    containerSmall:{
        minHeight: 30,
        padding: 0,
        paddingVertical: 0,
    },
    textStyleSmall:{
        fontSize: 14,
    },

    containerLarge: {
        // paddingVertical: 15,
        minHeight: 50,
    },
    textStyleLarge: {
        fontSize: 18
    },


    overlayStyle: {
        flex: 1,
        width: "100%",
    },
    innerlayStyle: {
        // flex: 1,
        width: "100%",
        justifyContent: "flex-end"
    },
    optionWrapper: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        justifyContent: "flex-end",
    },
    listItem: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: "#EEE",
        borderBottomWidth: 0.5,
    },
});