import React from 'react'
import { View, ActivityIndicator } from 'react-native'

export const Loader = (props) => {
    return (<View style={{ position: "relative" }}>
        {props.children}
        {props.loading && <View style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999, backgroundColor: "rgba(0,0,0, 0.5)", display: "flex", flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <ActivityIndicator size={props.size || 20} style={{ alignSelf: "center" }} color="#FFF" />
        </View>}
    </View>)
}
export default Loader;