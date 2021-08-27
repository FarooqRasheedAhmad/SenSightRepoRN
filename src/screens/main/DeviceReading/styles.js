import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heading: {
        fontFamily: theme.fonts.SFProBold,
        fontSize: 24,
        letterSpacing: 0.35,
        lineHeight: 22,
        letterSpacing: -0.41,
        marginTop: 21
    },
    aboutSummery: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 14,
        letterSpacing: 0.35,
        lineHeight: 22,
        letterSpacing: -0.41,
        marginTop: 12,
    },
    bluetoothMsg: {
        fontFamily: theme.fonts.SFProBold,
        fontSize: 14,
        letterSpacing: 0.35,
        lineHeight: 22,
        letterSpacing: -0.41
    },
    line: {
        backgroundColor: theme.colors.grey_shade_3,
        height: 1,
        marginTop: 10
    },
    ovalGreen: {
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.green_shade_1,
        marginRight: 10
    },


    listSubText: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: -0.41,
        color: theme.colors.grey_shade_1,
    },
    listText: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.41,
        color: theme.colors.black
    },
    list: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.grey_shade_3,
        marginLeft: 12,
        padding: 10,
    },


})




// export const styles = StyleSheet.create({
    // list: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "space-between",
    //     borderBottomWidth: 1,
    //     borderBottomColor: theme.colors.grey_shade_3,
    //     marginLeft: 12,
    //     padding: 10,
    // },
//     listSubText: {
//         fontFamily: theme.fonts.SFProRegular,
//         fontSize: 14,
//         lineHeight: 22,
//         letterSpacing: -0.41,
//         color: theme.colors.grey_shade_1,
//     },
//     listText: {
//         fontFamily: theme.fonts.SFProRegular,
//         fontSize: 17,
//         lineHeight: 22,
//         letterSpacing: -0.41,
//         color: theme.colors.black
//     },
//     rightText: {
//         fontFamily: theme.fonts.SFProRegular,
//         fontSize: 18,
//         lineHeight: 20,
//         letterSpacing: -0.24,
//         color: theme.colors.black,
//         marginRight: 10
//     }
// });
