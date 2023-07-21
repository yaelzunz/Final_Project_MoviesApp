import { View, ActivityIndicator } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";
import IntermediateScreen from "./screens/IntermediateScreen";
import Movies from "./screens/Movies";
import FavoriteScreen from "./screens/FavoriteScreen";

//  יכול להיות מסורבל. קונטקסט מספק דרך לשתף מידע כזה בין קומפוננטות בלי להעביר אותו באופן מפורש לכל קומפוננטה.-props
const Stack = createStackNavigator();
export const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    // כל עצם קונטקסט מגיע עם קומפוננטת ספק-פרוביידר, שנותנת לקומפוננטות שצורכות אותו להקשיב לשינויים בקונטקסט.
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {/* הספק מקבל prop value שיועבר לקומפוננטות ילד שצורכות את הספק בכל רמות העומק של העץ. */}
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function HomeStack() {
  return (
    <Stack.Navigator defaultScreenOptions={IntermediateScreen}>
      <Stack.Screen name="IntermediateScreen" component={IntermediateScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Movies" component={Movies} />
      <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} />
          
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      defaultScreenOptions={Login}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      
    </Stack.Navigator>
  );
}


function RootNavigator() {
  // נשתמש בקונטקס כדי לעדכן בהתאם את מצב המשתמש והטעינה
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);

  // נשתמש ביוז אפקט כדי להאזין לשינויים של המשתמש והטעינה בהתאם
  // כאשר מתרחש שינוי, הקוד מעדכן א   ת הקשר המשתמש ומגדיר את מצב הטעינה ל-false.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // הקוד בודק אם מצב הטעינה תקין. אם כן, הוא מציג מחוון טעינה. אחרת, הוא מציג את המסך המתאים בהתאם לשאלה אם המשתמש מאומת או לא.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    //שהוא נווט מחסנית המכיל את המסכים של תכונת הצ'אט HomeStack, .אם המשתמש מאומת, הקוד מציג את רכיב 
    //שהוא נווט מחסנית המכיל את המסכים לתהליך האימות AuthStack, .אם המשתמש אינו מאומת, הקוד מציג את רכיב 
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  //  , React. אשר נדרש על ידי ספריית הניווט  NavigationContainer עטוף ברכיב  RootNavigator לבסוף, רכיב 
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
