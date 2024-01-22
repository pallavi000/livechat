import axios, { Axios } from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  Grid,
  List,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CachedIcon from "@mui/icons-material/Cached";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";

import ActiveUser from "../Inbox/ActiveUser";
import Message from "../Inbox/Message";
import Chatlist from "../Inbox/Chatlist";
import { io } from "socket.io-client";
import { getChatUser, updateChatList } from "../../utils/helper";
import MessageInput from "../Inbox/MessageInput";

import messageImg from "../../images/message.jfif";
import AxiosInstance from "../../utils/AxiosInstance";
import { useUserContext } from "../../context/Context";

function Chat() {
  const [allUsers, setAllUsers] = useState([]);
  const [chatLists, setChatLists] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState();
  const messageScrollToBottomRef = useRef();

  const { currentUser } = useUserContext();

  const socket = io("http://localhost:5000");

  useEffect(() => {
    if (socket && currentUser) {
      socket.on("connect", () => {
        socket.emit("addUser", currentUser);
      });
    }
  }, [socket, currentUser]);

  useEffect(() => {
    if (socket) {
      socket.on("new_message", (message) => {
        const newmessages = [...messages];
        newmessages.push(message);
        setMessages(newmessages);
        setChatLists((prev) => updateChatList(prev, message, currentUser));
      });
    }
  }, [socket, messages, setChatLists]);

  async function getChat() {
    try {
      const response = await AxiosInstance.get("/chatlist");
      setChatLists(response.data);
      console.log(response.data, "chatlistssss");
    } catch (error) {
      console.log(error.request.response);
    }
  }

  useEffect(() => {
    getChat();
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await AxiosInstance.get("/user");
      setAllUsers(response.data);
    } catch (error) {}
  };

  async function getMessage() {
    const id = activeChat._id;
    try {
      var response = await AxiosInstance.get("/message/" + id);
      console.log("message", response.data);
      setMessages(response.data);
    } catch (error) {}
  }

  useEffect(() => {
    if (activeChat) {
      getMessage();
    }
  }, [activeChat]);

  useEffect(() => {
    if (messageScrollToBottomRef.current) {
      console.log("ref");
      messageScrollToBottomRef.current.scrollTop =
        messageScrollToBottomRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card
      sx={{
        marginX: "4rem",
        marginY: "2rem",

        paddingY: "2rem",
        height: "100%",
        position: "relative",
      }}
    >
      <Grid container spacing={3}>
        <Grid
          item
          md={4}
          sx={{ borderRight: "1px solid #ddd", height: "100%" }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "700",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Messages
          </Typography>
          <List>
            {chatLists.map((chat) => {
              return (
                <Chatlist
                  chat={chat}
                  currentUser={currentUser}
                  activeChat={activeChat}
                  setActiveChat={setActiveChat}
                />
              );
            })}
          </List>
        </Grid>
        <Grid
          item
          md={6}
          sx={{ padding: "1rem", borderRight: "1px solid #ddd" }}
        >
          {activeChat && currentUser ? (
            <>
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid black",
                }}
              >
                <Grid
                  item
                  xs={8}
                  sx={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
                >
                  <AccountCircleIcon sx={{ fontSize: "3rem" }} />
                  <Stack gap={""}>
                    <Typography variant="body" fontWeight={"600"}>
                      {getChatUser(activeChat, currentUser)?.name}
                    </Typography>
                    <Typography variant="body2" color={"green"}>
                      Online
                    </Typography>
                  </Stack>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <CachedIcon />
                  <ChatIcon />
                  <MenuIcon />
                </Grid>
              </Grid>
              <Box
                sx={{
                  marginTop: "1rem",
                  height: "55vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                  paddingBottom: "1rem",
                }}
                ref={messageScrollToBottomRef}
              >
                {messages.map((message) => {
                  return (
                    <Message
                      message={message}
                      currentUser={currentUser}
                      key={message._id}
                    />
                  );
                })}
              </Box>
              {activeChat && currentUser ? (
                <MessageInput
                  activeChat={activeChat}
                  currentUser={currentUser}
                  setMessages={setMessages}
                  socket={socket}
                  setChatLists={setChatLists}
                />
              ) : null}
            </>
          ) : (
            <>
              <Typography variant="h6" fontWeight={"600"} textAlign={"center"}>
                Start Conversation with your love ones
              </Typography>
              <img src={messageImg} height={"80%"} />
            </>
          )}
        </Grid>
        <Grid item md={2}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "700", marginBottom: "1rem" }}
          >
            Active users
          </Typography>
          <List>
            {allUsers.map((user) => {
              return (
                <ActiveUser
                  user={user}
                  key={user._id}
                  currentUser={currentUser}
                  setChatLists={setChatLists}
                  setActiveChat={setActiveChat}
                />
              );
            })}
          </List>
        </Grid>
      </Grid>
    </Card>
  );
}

export default Chat;
