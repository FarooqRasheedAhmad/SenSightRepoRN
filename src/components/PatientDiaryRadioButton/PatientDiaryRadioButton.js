import React, { useState } from "react";

// import { ListItem } from "react-native-elements";
import { ListItem } from '../elements'
import { theme } from "../../theme";

export const PatientDiaryRadioButton = (props) => {
  const { description } = props;
  const [value, setValue] = useState(false);

  const onChange = (val) => {alert("Coming Soon!")};

  console.log('value ', value)

  return (
    <ListItem
      title="Patient Diary"
      subtitle={description}
      // subtitleStyle={{ color: "grey" }}
      titleStyle={{ fontSize: 20 }}
      switch={{
        value,
        // trackColor: {
        //   true: !disabled ? theme.colors.colorPrimary : "grey",
        //   false: "grey",
        // },
        onChange: (switchValue) => {
          setValue(switchValue), onChange(switchValue);
        },
      }}
      underlayColor="#25BEED"
      style={{
        borderRadius: 12,
        marginHorizontal: 8,
        marginTop: 8,
        height: 90,
      }}
      containerStyle={{
        borderRadius: 12,
        height: 90,
      }}
    />
  );
};
