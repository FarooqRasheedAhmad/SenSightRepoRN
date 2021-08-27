import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ?  44 : 0
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
    ovalRed: {
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.red_shade_1,
        marginRight: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    modalView: {
        backgroundColor : 'white',
        width : '100%',
        height : '100%',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
    },
    mini: {
        flexDirection: 'row',
        justifyContent: 'center',
      },
    openButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 70,
        flexDirection: 'row',
        height: 40,
        marginTop: 9,
        marginBottom: 5,
        
    },
    close: {
        color: 'black',
        fontSize: 16,
        textAlign: "center",
        justifyContent: "center",
        fontFamily: theme.fonts.SFProSemibold,
        height: 45,
        backgroundColor: theme.colors.colorPrimary,
        borderRadius: 10,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: { width: 1, height: 5 },
        marginLeft: 25,
        marginRight: 25,
    },
    modalView2: {
        backgroundColor : 'white',
        width : '200%',
        height : '2000%',
        //shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1
        },
        
    },
    container4: {
        paddingTop: 5
     },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#000000',
        borderWidth: 1
     },
     submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        margin: 15,
        height: 40,
     },
     submitButtonText:{
        color: 'white'
     }
    
})