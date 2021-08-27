import { StyleSheet } from "react-native";
import { theme } from "../../theme";
export const styles = StyleSheet.create({
  root: {
    borderRadius: 50,
    alignSelf: "flex-end",
    marginRight: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: theme.colors.red_shade_1,
    elevation: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    color: theme.colors.white,
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 6,
    alignSelf: "center",
  },
  image: {
    alignSelf: "center",
  },
  container: {
    position: 'relative',
    width: 75,
    alignItems: 'center'
  },
  background: {
    position: 'absolute',
    top: 0,
  },
  button: {
    top: -22.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 27,
    backgroundColor: '#25BEED',
  },
  buttonIcon: {
    fontSize: 16,
    color: '#F6F7EB'
  }
});
