import { ButtonGroup, ListItem } from "react-native-elements";
import React, { useState } from "react";

import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const TempratureUnit = ({ onChange }) => {
  const [unit, setUnit] = useState(0);
  const buttons = ["C", "F"];

  return (
    <ListItem
      title="Temprature Unit"
      containerStyle={styles.listRoot}
      titleStyle={styles.title}
      rightElement={
        <ButtonGroup
          selectedIndex={unit}
          buttons={buttons}
          onPress={(index) => {
            setUnit(index);
            onChange(buttons[index]);
          }}
          containerStyle={styles.buttonRoot}
          buttonStyle={{ backgroundColor: "transparent" }}
          textStyle={styles.buttonGroupText}
          selectedButtonStyle={styles.selectedButton}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  listRoot: { height: 48, padding: 0 },
  title: { fontFamily: theme.fonts.SFProRegular },
  buttonRoot: {
    borderWidth: 0,
    width: 84,
    height: 32,
    borderRadius: 12,
    backgroundColor: theme.colors.grey_shade_3,
  },
  buttonGroupText: { color: theme.colors.white },
  selectedButton: { backgroundColor: theme.colors.colorPrimary },
});
