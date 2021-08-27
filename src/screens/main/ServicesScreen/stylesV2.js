import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    display:"flex",
    padding:5,
  },
  heading:{
    fontSize: 18, textAlign: "center", fontWeight: "bold", padding: 15
  },

  listItem:{
    borderRadius:12,
    backgroundColor: '#F3F3F3',
    padding:5,
    paddingVertical: 15,
    marginVertical:10,
  },
  listItem_disabled: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },
  
  itemTitle:{
    fontWeight:"bold",
    marginLeft:5,
  },
  itemTitle_disabled:{
    color: "#CCCCCC",
  },

})
