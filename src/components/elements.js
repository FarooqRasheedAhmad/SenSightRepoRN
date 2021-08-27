import React from "react"
import { 
    Overlay as _Overlay, 
    Icon as _Icon, 
    Input as _Input, 
    ListItem as _ListItem,
    Divider as _Divider,
    Button as _Button, 
} from 'react-native-elements';
import { View, Text, Switch as _Switch, StyleSheet } from "react-native";
import { Row, Col } from './Grid'


export const Overlay = props => <_Overlay {...props} />
export const Icon = props => <_Icon {...props} />
export const Input = props => <_Input {...props} />
// export const ListItem = props => <_ListItem {...props} />
export const Divider = props => <_Divider {...props} />
export const Button = props => <_Button {...props} />
export const Switch = props => <_Switch {...props} />

export const ListItem = (props) => {
    const {
        title, subtitle, subtitleStyle, titleStyle, underlayColor, style, containerStyle,
    } = props

    const _value = (props.switch && (!props.switch.value || props.switch.value=='false' || props.switch.value=='0')) ? false : true;

    return (<View style={{...li_styles.container ,...style}}>
        <Row style={containerStyle}>
            <Col flex="auto">
                <Text style={titleStyle}>{title}</Text>
                {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
            </Col>
            {props.switch && <Col style={{paddingLeft:20}} valign="center">
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={props.switch.value ? "#FFFFFF" : "#EEE"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={props.switch.onChange}
                    value={_value}
                />
            </Col>}
        </Row>
    </View>)
}


const li_styles = StyleSheet.create({
    container:{
        backgroundColor: "#FFF",
        borderBottomWidth:1, borderBottomColor:"#CCC",
        paddingVertical:5,
    },
    // container:{},
})