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
import axios from "axios";
import { getChatUser } from "../../utils/helper";

function MessageInput({ activeChat, currentUser, setMessages, socket }) {
  const [text, setText] = useState();
  const receiver_id = getChatUser(activeChat, currentUser);

  const config = {
    headers: {
      authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  async function handleSendMessage(msg) {
    try {
      const data = {
        message: msg,
        sender_id: currentUser._id,
        chatlist_id: activeChat._id,
        receiver_id: receiver_id._id,
      };
      const response = await axios.post(
        "/message/" + activeChat._id,
        data,
        config
      );
      console.log(response.data);
      socket.emit("message", response.data);
      setMessages((prev) => [...prev, response.data]);
      // props.socket.emit("message", response.data);
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
