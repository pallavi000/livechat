import {
  Box,
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { formatLastMessageTime, getChatUser } from "../../utils/helper";

function Chatlist({ chat, currentUser, activeChat, setActiveChat }) {
  const receiver = getChatUser(chat, currentUser);

  return (
    <ListItem
      disablePadding
      selected={activeChat && activeChat?._id === chat?._id ? true : false}
      onClick={() => setActiveChat(chat)}
    >
      <ListItemButton>
        <ListItemIcon>
          <AccountCircleIcon fontSize="large" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="body" fontWeight={"500"}>
                {receiver?.name}
              </Typography>
              <Typography variant="caption" color={"text.secondary"}>
                {formatLastMessageTime(chat.updatedAt)}
              </Typography>
            </Stack>
          }
          secondary={
            <Typography
              variant="body2"
              noWrap
              textOverflow={"ellipsis"}
              color={"text.secondary"}
            >
              {chat?.last_message}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

export default Chatlist;
