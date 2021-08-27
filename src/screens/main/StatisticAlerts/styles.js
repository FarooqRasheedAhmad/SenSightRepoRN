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
    titleContainer: {
        flex: 1,
        borderBottomColor: theme.colors.grey_shade_3,
        flexDirection: 'row',
        borderBottomWidth: 1,
        height: 60,
        marginLeft: 16,
        alignItems: 'center',
        paddingRight: 16
    },
    root: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginLeft: 16,
    },
    title: {
        color: theme.colors.black,
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 15,
    },
    image: { alignSelf: "center" },
})