import React, { useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet, SafeAreaView, Text , ImageBackground} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../colors";
import { Entypo } from "@expo/vector-icons";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons'; 


const Home = () => {
  const navigation = useNavigation();


  const onSignOut = () => {
    signOut(auth).catch((error) => console.log(error));
  };



  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FontAwesome
          name="search"
          size={24}
          color={colors.gray}
          style={{ marginLeft: 15 }}
        />
      ),
    
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={onSignOut}
        >
          <AntDesign
            name="logout"
            size={24}
            color={colors.gray}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),

    });
  }, [navigation]);

  return (
  <SafeAreaView style={styles.container}>
     <ImageBackground
        source={require('../assets/login.jpg')}
        style={styles.backgroundImage}
      >
  <View style={{flexDirection: 'column', width: '100%', justifyContent: 'flex-start'}}>

      <Text style={styles.Text}> Welcome back {auth?.currentUser?.displayName}
      </Text>


    </View>
          
      <TouchableOpacity
        onPress={() => navigation.navigate("Movies")}
        style={styles.Button}
      >
      <MaterialIcons name="ondemand-video" size={35} color="black" />
      </TouchableOpacity>
      </ImageBackground>
     </SafeAreaView>

  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  Button: {
    backgroundColor: '#deb887',
    height: 100,
    width: 100,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#deb890',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: 'center',
  },

  mapButton: {
    backgroundColor: "#ffe4c4",
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 50,
  },
  Text:{
    marginTop:120,
    fontSize: 35,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.7,
    fontWeight: 'bold',
    alignSelf: 'center',
    alignItems: "center",
    justifyContent: "center",
    fontFamily: 'Cochin',
    padding: 20,
    marginBottom: 80,

       
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' for different scaling options
  },
});


