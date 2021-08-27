import { theme } from "../../theme";
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        position: 'absolute',
        paddingBottom: 120,
        ...StyleSheet.absoluteFillObject
    },
    heading: {
        fontFamily: theme.fonts.SFProBold,
        fontSize: 22,
        letterSpacing: 0.35,
        lineHeight: 28,
        margin: 14,
    },
    subContainer: {
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 10
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
      rightText: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 18,
        lineHeight: 20,
        letterSpacing: -0.24,
        color: theme.colors.black,
        marginRight: 10
      }
});
