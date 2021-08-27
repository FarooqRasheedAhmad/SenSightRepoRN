import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  gradientContainer: {
    marginTop: 20,
    zIndex: 999,
  },
  valueRoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: -10,
  },
  valueContainer: { flexDirection: "row", alignItems: "baseline" },
  value: {
    color: theme.colors.white,
    fontSize: 32,
    fontWeight: "600",
  },
  valueUnit: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 8,
  },
});
