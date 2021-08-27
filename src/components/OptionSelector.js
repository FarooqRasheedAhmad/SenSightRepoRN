import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, ScrollView, Dimensions, Animated, Easing, TouchableOpacity, TouchableWithoutFeedback } from "react-native";

import { Icon, Overlay } from "react-native-elements";
import { Row, Col } from "./Grid";

/****** Usage:
<OptionSelector 
    data={[
        { value:"a", label:"A" },
        { value:"b", label:"B" },
        { value:"c", label:"C" },
    ]}
    value={selectedValue}
    selectedIndex={2}
    onChange={(value, index, item) => {
        changeSelectedValue(value, index, item)
    }}
/>
********/

export const OptionSelector = props => {
    const { data, value, selectedIndex } = props;
    const [showOptions, setShowOptions] = React.useState(false)
    // const [yPoz, setYPoz] = React.useState({y:new Animated.Value(-2000)});
   
    // dont show options if only one option is availabel/
    if (!data || data.length===1) return <View style={styles.container}>
        {data && <Text style={{ fontSize: props.fintSize || 18 }}>{data[0].label}</Text>}
        </View>;
    
    const onOptionClick = (_value, index, data) => {
        setShowOptions(false);
        if (props.onChange) props.onChange(_value, index, data);
    }

    const toggleOptions = args => {
        setShowOptions(!showOptions)
    }
    
    return (<>
        <TouchableOpacity disabled={!data || data.length < 1} onPress={() => toggleOptions(true)} style={{...styles.container, ...props.style}}>
            <Row>
                <Col flex="auto" valign="center">
                    {data && data.map((item, i) => {
                        if (value || value===0) return (item.value == value) ? <Text key={i} style={{ fontSize: props.fintSize || 18 }}>{item.label}</Text> : null;
                        if (selectedIndex>-1) return (i == selectedIndex) ? <Text key={i} style={{ fontSize: props.fintSize || 18 }}>{item.label}</Text> : null;
                        return null;
                    })}
                    {(data && data.length>0 && (!value && selectedIndex < 0)) && <Text style={{ fontSize: props.fintSize || 18 }}>{data[0].label}</Text>}
                </Col>
                <Col valign="center"><Icon name="angle-down" type='font-awesome' color="#999999" /></Col>
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
                {/* <View style={{ ...styles.innerlayStyle, top: Math.round(setYPoz) }}> */}
                <View style={{ ...styles.innerlayStyle }}>
                    <ScrollView contentContainerStyle={{ justifyContent: "flex-end", flex:1, backgroundColor:"transparent"}}>
                        <View style={styles.optionWrapper}>
                            {data && data.map((item, i) => {
                                if (!item || !item.label) return null;
                                return <TouchableOpacity onPress={() => onOptionClick(item.value, i, item)} style={styles.listItem} key={i}><Text style={{textAlign:"center", fontSize:18}}>{item.label}</Text></TouchableOpacity>
                            })}
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </Overlay>
            
    </>)
}

export default OptionSelector;




const styles = StyleSheet.create({
    container:{
        backgroundColor: "#F3F3F3", 
        borderRadius: 20, 
        paddingHorizontal: 20, 
        // paddingVertical: 15,
        minHeight:50,
        justifyContent:"center",
    },
    overlayStyle:{
        flex:1,
        width:"100%",
    },
    innerlayStyle:{
        // position:"relative",
        // top:200,
        // borderWidth:1, borderColor:"#FFF",
        flex:1,
        width:"100%",
        justifyContent:"flex-end"
    },
    optionWrapper:{
        backgroundColor: "#FFF",
        borderRadius:5,
        justifyContent: "flex-end",
    },
    listItem:{
        paddingHorizontal:10,
        paddingVertical:15,
        borderBottomWidth:"#EEE",
        borderBottomWidth:0.5,
    },
});