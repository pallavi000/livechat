import moment from "moment";

export function getChatUser(chat, currentUser) {
  if (!chat) {
    return {};
  }
  if (chat?.sender_id?._id === currentUser?._id) {
    return chat.receiver_id;
  } else {
    return chat.sender_id;
  }
}

export function isMessageFromMe(message, currentUser) {
  if (message?.sender_id?._id === currentUser?._id) {
    return true;
  } else {
    return false;
  }
}

export function formatLastMessageTime(mongooseCreatedAt) {
  // Parse the Mongoose createdAt timestamp
  const createdAtMoment = moment(mongooseCreatedAt);

  // Get the current moment
  const currentMoment = moment();

  // Calculate the difference in hours
  const hoursDiff = currentMoment.diff(createdAtMoment, "hours");

  // Format the output based on the time difference
  if (hoursDiff < 24) {
    // If the message was sent within the last 24 hours, show the time
    return createdAtMoment.format("h:mm A");
  } else if (hoursDiff < 48) {
    // If the message was sent yesterday, show "Yesterday"
    return "Yesterday";
  } else {
    // If the message was sent more than 48 hours ago, show the date
    return createdAtMoment.format("MMM D");
  }
}
