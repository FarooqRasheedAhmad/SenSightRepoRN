import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { images } from "../../assets"
import React from "react";
import { styles } from "./styles";

export const ImageProfile = props => {
  const { backgroundImage, onLogout, name, address, avatar, role, email } = props;

  const src = { uri: avatar } || images.placeholder_user;

  return (
    <ImageBackground source={backgroundImage} style={styles.imageBackground}>
      <View style={styles.root}>
        <View style={styles.logoutButtonRoot}>
          <View style={styles.logoutButton}>
            <TouchableOpacity onPress={onLogout}>
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.profileInfoRoot}>
          {(src && avatar && role == "senior") && <Image source={src} style={styles.avatar} />}
          {/* {avatar ? (
            <Image source={src} style={styles.avatar} />
            // <Image source={ avatar !== 'null' && role === "senior" ? { uri: avatar } : images.placeholder_user } style={styles.avatar} />
          ) : null} */}
          <Text numberOfLines={1} style={styles.name}>{name}</Text>
          {/* {email ? <Text style={styles.email}>{email}</Text> : null} */}
          <Text numberOfLines={1} style={styles.address}>{address}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};
