import React from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import Header from "../components/Header";
import tw from "tailwind-rn";
import ChatList from "../components/ChatList";
const ChatScreen = () => {
  return (
    <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
      <Header title={"Chat"} />
      <ChatList />
    </SafeAreaView>
  );
};

export default ChatScreen;
