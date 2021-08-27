import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    listRoot: {
        flex: 1,
    },
    valueRoot: { flexDirection: "row", alignItems: "baseline" },
    valueTitle: { fontSize: 20, marginHorizontal: 8 },
    valueUnit: { color: theme.colors.grey_shade_1 },
    leftRoot: {
        borderRadius: 50,
        height: 60,
        width: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    leftText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        padding: 8,
    },
    week: { width: "100%", fontSize: 20, color: "white" },
    heading: {
        width: "100%",
        color: "grey",
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: "flex-start",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#f5f5f5",
    },
    headingTextStyle: {
        color: "#000000",
        fontSize: 22,
        fontWeight: "bold",
        alignSelf: "flex-start",
    },
})
