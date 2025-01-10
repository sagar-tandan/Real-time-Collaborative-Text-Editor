import React from "react";
import Avatar from "react-avatar";

const CustomAvatar = ({ name }) => {
  return <Avatar className="rounded-full" size="40" name={name} />;
};

export default CustomAvatar;
