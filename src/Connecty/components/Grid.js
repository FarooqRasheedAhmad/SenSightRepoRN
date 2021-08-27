import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

export const Row = props => {
    return (<View {...props} style={{ ...styles.row, ...props.style}} />)
}

export const Col = props => {
    let _props = { ...props}
    delete _props.flex;
    delete _props.align;
    delete _props.valign;
    delete _props.style;

    let style = { ...styles.col, ...props.style}
    if (props.flex == 'auto') Object.assign(style, { flexGrow: 1, flexShrink: 1, flexBasis: `${props.flex}` });
    if (props.flex && props.flex != 'auto') Object.assign(style, { flexGrow: 0, flexShrink: 0, flexBasis: props.flex });
    if (props.valign) Object.assign(style, { display: 'flex', flexDirection: 'row', alignItems: props.valign });
    if (props.align) Object.assign(style, { display: 'flex', flexDirection: 'row', justifyContent: props.align });

    return (<View {..._props} style={style} />)
}





const styles = StyleSheet.create({
    row:{
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        // boxSizing: 'border-box',
    },
    col:{
        // display:"flex",
        position:'relative',
        maxWidth:'100%',
        // justifyContent:'center',
        // alignContent:'center',
        // borderWidth: 1,
        // minHeight:1,

        // flexGrow:1, 
        // flexShrink:1,
        // flexBasis:'auto'
    }
});


// export const Button = props => {
//     let __style = { ...props.style, borderWidth: 1, borderColor:"#EEE", backgroundColor:"#18B3FF", margin:5, padding:10, borderRadius:5 };
//     if (props.disabled) __style.backgroundColor = "#CCC";
//     // if (props.disabled) Object.assign(__style, {opacity:0.5})

//     return <TouchableOpacity {...props} style={__style} />
// }