import { theme } from "../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    valueRoot: { flexDirection: "row" },
    valueTitle: { fontSize: 17, lineHeight: 22, color:  theme.colors.black},
    valueUnit: { color: theme.colors.grey_shade_1, fontSize: 15, lineHeight: 20, letterSpacing: -0.24, marginTop: 5 },
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
  
    modalView: {
      backgroundColor: "rgba(0,0,0,0.5)",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      borderRadius: 20,
      width: "98%",
    },
    noDataRoot: {
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    noDataText: { fontSize: 22, fontWeight: "500", color: "grey" },
    closeButton: {
      borderRadius: 50,
      borderWidth: 2,
    },
})
