import {
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import { getChatUser, updateChatList } from "../../utils/helper";
import AxiosInstance from "../../utils/AxiosInstance";

function MessageInput({
  activeChat,
  currentUser,
  setMessages,
  socket,
  setChatLists,
}) {
  const [text, setText] = useState();
  const receiver_id = getChatUser(activeChat, currentUser);

  async function handleSendMessage(msg) {
    try {
      const data = {
        message: msg,
        sender_id: currentUser._id,
        chatlist_id: activeChat._id,
        receiver_id: receiver_id._id,
      };
      const response = await AxiosInstance.post(
        "/message/" + activeChat._id,
        data
      );
      socket.emit("message", response.data);
      setMessages((prev) => [...prev, response.data]);
      setChatLists((prev) => updateChatList(prev, response.data, currentUser));
    } catch (error) {}
  }

  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && text) {
      if (!text?.trim()) return;
      handleSendMessage(text);
      setText("");
    }
  };

  return (
    <>
      <Divider sx={{ width: "100%" }} />
      <Stack width={"100%"} padding={2} mt={1}>
        <TextField
          placeholder="Type your message"
          name="text"
          autoComplete="off"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disabled={text ? false : true}
                  onClick={() => {
                    handleSendMessage(text);
                    setText("");
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </>
  );
}

export default MessageInput;
