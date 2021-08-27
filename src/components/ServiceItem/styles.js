import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey_shade_3,
    marginLeft: 10,
    padding: 10,
  },
  
  listText: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.41,
    color: theme.colors.black,
    marginTop: 15,
    marginLeft: 0
    
  },
  listSubText: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 25,
    lineHeight: 25,
    letterSpacing: -0.41,
    color: theme.colors.black,
    marginLeft: 25,
    marginTop: 0
  
    
    
  },
  rightText: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: theme.colors.black,
    marginRight: 5,
    marginTop: 6
  },
  mainimage: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginLeft: 4,
    marginTop: 11,
    

  },
  subimagestyle: {
    width: 330,
    height: 60,
    marginLeft: 30,
    marginTop: 12,
    marginRight: 6
    
    

  },
});
