import { theme } from "../theme";
import { StyleSheet, Platform } from "react-native";


export const commonStyles = StyleSheet.create({
    full_page_container: {
        flex: 1,
        backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ? 44 : 25
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
        // backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ? 44 : 0
    },
    subContainer: {
        flex: 1,
        backgroundColor: theme.colors.white,
        padding: 10,
        paddingBottom: 20,
    },
});
