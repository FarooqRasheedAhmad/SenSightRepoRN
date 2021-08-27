import React from "react";
import { StyleSheet, Text } from "react-native";
import { theme } from "../../theme";

export const ShowWeather = ({ temperature, weather, cityName }) => {
  return (
    <Text style={styles.weather}>
      {!!temperature ? `${temperature}˚C ${weather} - ${cityName}` : "" }
    </Text>
  )
}

const styles = StyleSheet.create({
  weather: {
    fontFamily: theme.fonts.SFProSemibold,
    marginTop: 20,
    textAlign: 'right',
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
  },
})
