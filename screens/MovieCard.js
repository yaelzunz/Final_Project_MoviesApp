import { View, Image, TouchableOpacity,Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import FavoriteScreen from "./FavoriteScreen";
import { useState, useContext, useEffect } from "react";
import { AuthenticatedUserContext } from "../App";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { fetchMovie } from "../Api";


const db = getFirestore();

export default function MovieCard({ movie, viewOnly }) {
  const [isLiked, setIsLiked] = useState(false);

  const {user} = useContext(AuthenticatedUserContext);

  useEffect(() => {
    async function fetch() {
      const docRef = await getDoc(doc(db, "users", user.uid));
      if (docRef.exists())
      {
        let temp = docRef.data().liked ? docRef.data().liked : [];
        setIsLiked(temp.some(res => res.imdbID === movie.imdbID))
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    async function fetchAndUpdate() {
      const docRef = await getDoc(doc(db, "users", user.uid));
      if (docRef.exists())
      {
        let temp = docRef.data().liked ? docRef.data().liked : [];
        console.log(temp)
        if (isLiked && !temp.some(res => res.imdbID === movie.imdbID))
          temp.push(movie);
        else if (!isLiked)
          temp = temp.filter(res => res.imdbID !== movie.imdbID)
            
        await setDoc(doc(db, "users", user.uid), {
          liked: temp
        });
      } else {
        setDoc(doc(db, "users", user.uid), {
          liked: []
        });
      }
    }  

    !viewOnly && fetchAndUpdate();
  }, [isLiked]);

  const handlePress = () => {
    if (!viewOnly)
      setIsLiked(!isLiked);
    else
      fetchMovie(movie.Title).then(res => alert('The plot: ' + res.Plot + ' || Director:  ' + res.Director + ' || Actors: ' + res.Actors + ' || Country: ' + res.Country + ' || Year: ' + res.Year));
  }

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Image 
          style={{
            width: '100%',
            height: 250,
            margin: 10,
            borderRadius: 10,
          }}
          resizeMode ="cover"
          source={{ uri: movie.Poster }}
        />
        <Text style={{fontSize:20,fontWeight: 'bold',paddingLeft:10, color: isLiked ? 'red' : undefined }}>{movie.Title}</Text>
        <Text style={{paddingLeft:10}}>{movie.Year}</Text>
        <Text style={{paddingLeft:10}}>{movie.Type}</Text>
      </TouchableOpacity>
    </View>
  );
}