import { Box, Grid, Stack, TextField, Tooltip } from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { formatLastMessageTime, isMessageFromMe } from "../../utils/helper";

function Message({ message, currentUser }) {
  const isFromMe = isMessageFromMe(message, currentUser);
  return (
    <>
      {!isFromMe ? (
        <Stack direction={"row"} alignItems={"center"} gap={"0.1rem"}>
          <AccountCircleIcon sx={{ fontSize: "2rem" }} />
          <Box sx={{ maxWidth: "45%" }}>
            <Tooltip title={formatLastMessageTime(message.createdAt)}>
              <Box
                sx={{
                  backgroundColor: "lightgreen",
                  paddingY: "0.2rem",
                  paddingX: "0.5rem",
                  borderRadius: "7px",
                  borderBottomLeftRadius: "0px",
                  width: "fit-content",
                  fontWeight: "500",
                  marginBottom: "1rem",
                  cursor: "pointer",
                }}
              >
                {message.message}
              </Box>
            </Tooltip>
          </Box>
        </Stack>
      ) : (
        <Stack direction={"row"} justifyContent={"flex-end"}>
          <Box sx={{ maxWidth: "45%" }}>
            <Tooltip title={formatLastMessageTime(message.createdAt)}>
              <Box
                sx={{
                  backgroundColor: "lightgray",
                  paddingY: "0.2rem",
                  paddingX: "0.5rem",
                  borderRadius: "7px",
                  borderBottomRightRadius: "0px",
                  width: "fit-content",
                  fontWeight: "500",
                  marginBottom: "1rem",
                  cursor: "pointer",
                  marginRight: 2,
                }}
              >
                {message.message}
              </Box>
            </Tooltip>
          </Box>
        </Stack>
      )}
    </>
  );
}

export default Message;
