import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

//helper
import {
  formatLastMessageTime,
  getChatUser,
  isMessageFromMe,
  updateMessageStatus,
} from "../../utils/helper";

function Chatlist({
  chat,
  currentUser,
  activeChat,
  setActiveChat,
  setChatLists,
  socket,
}) {
  const receiver = getChatUser(chat, currentUser);
  const isFromMe = isMessageFromMe(chat.last_message, currentUser);

  const handleClick = () => {
    setActiveChat(chat);
    setChatLists((prev) => updateMessageStatus(chat, prev));
    socket.emit("seen", { chat, socketUserId: receiver._id });
  };

  return (
    <ListItem
      disablePadding
      selected={activeChat && activeChat?._id === chat?._id ? true : false}
      onClick={() => handleClick()}
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
              <Typography
                variant="body"
                fontWeight={"500"}
                sx={{ textTransform: "capitalize" }}
              >
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
              fontWeight={chat.last_message?.is_read ? "400" : "600"}
              noWrap
              textOverflow={"ellipsis"}
              color={"text.secondary"}
            >
              {isFromMe ? (
                <>You: {chat?.last_message?.message}</>
              ) : (
                chat?.last_message?.message
              )}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

export default Chatlist;
