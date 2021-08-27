import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ? 44 : 0
    },
    subContainer: {
        flex: 1,
        backgroundColor: theme.colors.white
    },
    row:{
        borderBottomWidth:1,
        borderColor: "#CCC",
        // marginBottom: 20,
        paddingHorizontal:15,
        paddingVertical:20,
        // paddingBottom:20,
    },
    inputField:{
        width:"100%",
        borderWidth:1,
        borderColor:"#CCC",
        borderRadius:3,
        padding:5
    },
    heading:{
        fontSize:20,
        textTransform:"capitalize"
    },
})