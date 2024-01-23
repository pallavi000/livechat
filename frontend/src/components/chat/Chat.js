import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
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

//components
import ActiveUser from "../Inbox/ActiveUser";
import Message from "../Inbox/Message";
import Chatlist from "../Inbox/Chatlist";
import MessageInput from "../Inbox/MessageInput";

//socket
import { io } from "socket.io-client";

//helper
import {
  getChatUser,
  updateChatList,
  updateMessageStatus,
} from "../../utils/helper";
import AxiosInstance from "../../utils/AxiosInstance";

//context
import { useUserContext } from "../../context/Context";

//images
import messageImg from "../../images/message.jfif";
import emptyChatImg from "../../images/emptyChat.png";

function Chat() {
  const [allUsers, setAllUsers] = useState([]);
  const [chatLists, setChatLists] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState();
  const messageScrollToBottomRef = useRef();
  const [isTyping, setIsTyping] = useState(false);

  const { currentUser } = useUserContext();

  //socket
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

      socket.on("seen_message", (chat) => {
        setChatLists((prev) => updateMessageStatus(chat, prev));
      });

      socket.on("typing", (chat) => {
        if (chat._id === activeChat?._id) {
          setIsTyping(true);
        }
      });

      socket.on("not_typing", (chat) => {
        if (chat._id === activeChat?._id) {
          setIsTyping(false);
        }
      });
    }
  }, [socket, messages, setChatLists, activeChat]);

  useEffect(() => {
    setIsTyping(false);
  }, [activeChat]);

  async function getChat() {
    try {
      const response = await AxiosInstance.get("/chatlist");
      setChatLists(response.data);
    } catch (error) {}
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
      <Grid container>
        <Grid
          item
          md={4}
          xs={12}
          sx={{
            borderRight: "1px solid #ddd",
            minHeight: "100vh",
            maxHeight: "100%",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "600",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Chats
          </Typography>
          {chatLists && chatLists.length > 0 ? (
            <List>
              {chatLists.map((chat) => {
                return (
                  <Chatlist
                    chat={chat}
                    currentUser={currentUser}
                    activeChat={activeChat}
                    setActiveChat={setActiveChat}
                    setChatLists={setChatLists}
                    socket={socket}
                  />
                );
              })}
            </List>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Avatar
                src={emptyChatImg}
                variant="square"
                sx={{ width: "50%", height: "auto", textAlign: "center" }}
              />
              <Typography variant="h6">No Chats !!</Typography>
            </Box>
          )}
        </Grid>
        <Grid item md={6} xs={12} sx={{ borderRight: "1px solid #ddd" }}>
          {activeChat && currentUser ? (
            <>
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 2,
                  paddingY: 1,
                  borderBottom: "1px solid #ddd",
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
              {isTyping &&
                `${getChatUser(activeChat, currentUser)?.name} is typing ....`}
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
              <Stack justifyContent={"center"} alignItems={"center"}>
                <img src={messageImg} width={"80%"} height={"auto"} />
              </Stack>
            </>
          )}
        </Grid>
        <Grid item md={2} xs={12} sx={{ width: "100%" }}>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              textAlign={"center"}
              sx={{
                fontWeight: "600",
                marginBottom: "1rem",
                textAlign: "center",
              }}
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
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default Chat;
