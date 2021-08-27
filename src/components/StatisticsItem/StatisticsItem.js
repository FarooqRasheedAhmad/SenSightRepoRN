import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { ProgressBar } from "../ProgressBar";
import React from "react";
import { icons } from "../../assets";
import { theme } from "../../theme";

export const StatisticsItem = (props) => {
  const {
    title,
    description,
    progress,
    progressColor,
    avatar,
    onPress,
  } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.root}>
        <Image source={avatar} style={{ width: 40, height: 40 }} resizeMethod="resize" resizeMode="stretch" />
        <View style={{ flex: 3 }}>
          <View style={styles.body}>
            <Text style={styles.title}>{title}</Text>
            {description ? (<Text style={styles.description}>{description}</Text>) : null}
            {/* <ProgressBar progress={progress} color={progressColor} /> */}
          </View>
        </View>
        <View style={{ flex: 0.15 }}>
          <Image style={styles.image} source={icons.disclosure} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
  title: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    flexGrow: 1,
  },
  description: {
    color: "rgba(0,0,0, 0.48)",
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 13,
    flexGrow: 1,
    marginTop: 1,
  },
  body: { marginHorizontal: 16 },
  image: { alignSelf: "center" },
});
