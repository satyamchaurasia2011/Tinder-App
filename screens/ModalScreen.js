import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { useNavigation } from "@react-navigation/native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [data, setData] = useState({
    image: "",
    job: "",
    age: "",
  });
  const inCompleteForm = !data.image || !data.job || !data.age;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Update your profile",
      headerStyle: {
        backgroundColor: "#FF5864",
      },
      headerTitleStyle: { color: "white" },
    });
  }, []);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: data.image,
      job: data.job,
      age: data.age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      let filename = result.uri.substring(result.uri.lastIndexOf("/") + 1);

      // Add timestamp to File Name
      const extension = filename.split(".").pop();
      const name = filename.split(".").slice(0, -1).join(".");
      filename = name + Date.now() + "." + extension;

      const storageRef = ref(storage, filename);
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      const task = uploadBytes(storageRef, bytes);

      try {
        await task;
        console.log(storageRef);

        await getDownloadURL(storageRef)
          .then((url) => {
            //from url you can fetched the uploaded image easily
            setData({ ...data, image: url });
            console.log(url);
          })
          .catch((e) =>
            console.log("getting downloadURL of image error => ", e)
          );

        // Alert.alert(
        //   'Image uploaded!',
        //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
        // );
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        tw("flex-1 items-center pt-1"),
        { marginTop: StatusBar.currentHeight },
      ]}
    >
      <Image
        style={tw("h-20 w-36 -mt-4")}
        resizeMethod="resize"
        source={{ uri: "https://links.papareact.com/2pf" }}
      />

      <Text style={tw("text-xl text-gray-500 p-1 font-bold mb-4")}>
        Welcome {user.displayName}
      </Text>

      <Text style={tw("text-center p-4 text-base font-bold text-red-400")}>
        Step 1: The Profile Pic
      </Text>
      <TouchableOpacity
        onPress={pickImage}
        style={tw("bg-red-500	 rounded-xl	 p-4")}
      >
        <Text style={tw("text-center font-bold text-white")}>Select Image</Text>
      </TouchableOpacity>
      <Text style={tw("text-center p-4 text-base font-bold text-red-400")}>
        Step 2: The Job
      </Text>
      <TextInput
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your occupation"
        value={data.job}
        onChangeText={(text) => setData({ ...data, job: text })}
      />

      <Text style={tw("text-center p-4 text-base font-bold text-red-400")}>
        Step 3: The Age
      </Text>
      <TextInput
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your age"
        value={data.age}
        onChangeText={(text) => setData({ ...data, age: text })}
        keyboardType="numeric"
        maxLength={2}
      />

      <TouchableOpacity
        disabled={inCompleteForm}
        style={[
          tw("w-64 p-3 rounded-xl fixed -bottom-36"),
          inCompleteForm ? tw("bg-gray-400") : tw("bg-red-400"),
        ]}
        onPress={updateUserProfile}
      >
        <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ModalScreen;
