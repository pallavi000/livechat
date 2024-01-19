import {
  Stack,
  Typography,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import axios from "axios";

function ActiveUser({ user, currentUser, setChatlists, setActiveChat }) {
  const config = {
    headers: {
      authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const startChat = async () => {
    try {
      const data = {
        sender_id: currentUser._id,
      };
      const response = await axios.post(
        `/chatlist/chat/${user._id}`,
        data,
        config
      );
      setActiveChat(response.data);

      setChatlists((prev) => {
        const existingChat = prev.find(
          (chat) => chat._id === response.data._id
        );
        if (!existingChat) {
          return [...prev, response.data];
        }
        return prev;
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ListItem
      disablePadding
      onClick={startChat}
      secondaryAction={
        <FiberManualRecordIcon sx={{ fontSize: "12px" }} color="success" />
      }
    >
      <ListItemButton>
        <ListItemIcon>
          <AccountCircleIcon fontSize="large" />
        </ListItemIcon>
        <ListItemText primary={user.name} />
      </ListItemButton>
    </ListItem>
  );
}

export default ActiveUser;
