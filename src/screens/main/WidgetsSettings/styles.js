import { StyleSheet, StatusBar, Platform } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    headingContainer: {
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    heading: {
        fontSize: 22,
        fontWeight: '500',
        color: theme.colors.black,
    },

});
