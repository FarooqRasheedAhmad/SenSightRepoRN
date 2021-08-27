import { Text, View } from "react-native";

// import { ListItem } from "..";
import { ListItem } from "../ListItem";
import React from "react";
import { styles } from "./styles";

export const UserSettings = props => {
  const { settingList, showDivider } = props;
  return (
    <>
      {/* <View style={styles.title}>
        <Text style={styles.titleText}>SETTINGS</Text>
      </View> */}
      <View>
        {settingList.map((item, _index) => (
          <View key={_index}>
            <ListItem {...item}
            textStyle={styles.listItemTextStyle} />
            {showDivider ? <View style={styles.divider} /> : null}
          </View>
        ))}
      </View>
    </>
  );
};
