import { StyleSheet, StatusBar, Platform } from "react-native"
import { theme } from "../../theme"

export const styles = StyleSheet.create({
    submit: {
        height: 28,
        paddingHorizontal: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        fontFamily: theme.fonts.SFProRegular
    },
    submitText: {
        color: '#fff',
        textAlign: 'center',
    }
});
