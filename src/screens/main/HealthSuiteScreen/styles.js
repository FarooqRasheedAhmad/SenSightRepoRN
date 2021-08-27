import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ?  44 : 0
    },
    subContainer: {
        flex: 1,
        backgroundColor: theme.colors.white
    },
    heading: {
        
        fontFamily: theme.fonts.SFProBold,
        fontSize: 21,
        letterSpacing: 0.35,
        lineHeight: 28,
        justifyContent: 'center',
        textAlign: 'justify',
        margin: 20,
        marginTop: 80
    },
    heading1: {
        
        fontFamily: theme.fonts.SFProBold,
        fontSize: 21,
        letterSpacing: 0.35,
        lineHeight: 28,
        justifyContent: 'center',
        textAlign: 'justify',
        margin: 20,
        
    },
    bullet: {
        
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 16,
        marginLeft: 50,
        lineHeight: 28,
        textAlign: 'justify',
        marginRight: 20
        
        
    },
    health: {
        width: 350,
        height: 130,
        marginRight: 10,
        marginLeft: 20,
        marginTop: 20
        
        
    },
    roundButton1: {
        width: 50,
        height: 50,
        padding: 10,
        marginTop: 10,
        marginRight: 100,
        marginBottom: 6,
        borderRadius: 100,
        backgroundColor: theme.colors.colorPrimary,
        
      },
      roundButton2: {
        width: 40,
        height: 40,
        padding: 10,
        marginTop: 2,
        marginRight: 10,
        marginBottom: 6,
        borderRadius: 100,
        backgroundColor: theme.colors.white,
      },

      mini: {
        flexDirection: 'row',
        justifyContent: 'center',
        
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        marginLeft: 20,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'center'
        
      },
      image: {
        marginLeft: 10,
        marginRight: 10,
        width: 250,
        height: 100
    },
    roundButton: {
        width: 40,
        height: 40,
        padding: 10,
        marginTop: 10,
        marginRight: 10,
        marginBottom: 6,
        borderRadius: 100,
        backgroundColor: theme.colors.colorPrimary,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
    openButton: {
        backgroundColor: theme.colors.colorPrimary,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 70,
        flexDirection: 'row',
        height: 40,
        marginTop: 10
        
      },
    

})