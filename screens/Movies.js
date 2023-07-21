import { View, ScrollView, StyleSheet, SafeAreaView, Text } from "react-native";
import { useState, useEffect } from "react";
import { fetchMovies } from "../Api/index";
import { TextInput } from "react-native-paper";
import { Feather } from '@expo/vector-icons'; 
import { TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import MovieCard from "./MovieCard";
import { auth } from "../config/firebase";


export default function Movies() {

  const navigation = useNavigation();

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log(error));
  };

  useEffect(() => {
    navigation.setOptions({
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
 
  const [movies, setMovies] = useState([])
  const [showSearch, toogleSearch] = useState(false);
  const [searchMovie, setSearchMovie] = useState("Spiderman");

  const handleSearch = (value) => {
    console.log("value: ", value);
    // fetch locations
    getMovies();
    toogleSearch(!showSearch);
  };

  const getMovies = async () => {
    setMovies(await fetchMovies(searchMovie));
    setSearchMovie("");
  };
  useEffect(() => {
    getMovies();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {Object.keys(movies).length > 0 && (
        <View>
          
          <Text style={styles.Text}> Movies & Series </Text>
          <View style={{flexDirection:"row",alignSelf: 'center'}}>
            
          <TouchableOpacity
           onPress={() => navigation.navigate("FavoriteScreen")}
           style={styles.Button}>
            <Feather name="heart" size={24} color="black" /> 
          </TouchableOpacity>

      <TouchableOpacity
        onPress={() => toogleSearch(!showSearch)}
        style={styles.Button}
      >
       <Feather name="search" size={24} color="black" />
      </TouchableOpacity>

          {showSearch ? <TextInput 
          style={{
                padding: 10,
                marginBottom: 20,
                backgroundColor: showSearch
                  ? "#deb887"
                  : "transparent",
              }}
            placeholder="Search your movies here"
            value={searchMovie}
            onChangeText={(text) => setSearchMovie(text)}
            left={<TextInput.Icon name="magnify" />}
            onSubmitEditing={handleSearch}
          /> : null}
          </View> 

          

          <ScrollView>
            {movies && movies.Search.map((movie, i) => (
              <MovieCard movie={movie} key={i}  />
            ))}
          </ScrollView>
        </View>
      )}
     </SafeAreaView>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  Text:{
    fontFamily: 'Cochin',
    fontSize:30,
    textAlign:'center',
    marginBottom: 20,

  },
  Button: {
    backgroundColor: '#deb887',
    height: 50,
    width: 50,
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
})

