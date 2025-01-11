import React from "react";
import Avatar from "react-avatar";

const AvatarStack = ({ className, users, limit = 4, size = 40 }) => {
  // Determine how many users to show and if we need a "+X" avatar
  const visibleUsers = users.slice(0, limit);
  const remainingCount = users.length - limit;
  const showCount = remainingCount > 0;

  return (
    <div
      className={`flex flex-row-reverse justify-end ${
        className ? "px-2" : "absolute top-[3px] bottom-0 right-[60px]"
      }`}
    >
      {visibleUsers.map((user, index) => (
        <div
          key={user.userId}
          className="relative hover:z-20 transition-transform hover:-translate-y-1"
          style={{
            marginRight: index !== 0 ? `-${size / 4}px` : "0",
            zIndex: visibleUsers.length - index,
          }}
        >
          <div className="rounded-full ring-2 ring-white">
            <Avatar
              name={user.userName}
              size={size}
              round={true}
              className="text-sm"
            />
          </div>
        </div>
      ))}

      {showCount && (
        <div
          className="relative hover:z-20 transition-transform hover:-translate-y-1"
          style={{
            marginRight: `-${size / 4}px`,
            zIndex: 0,
          }}
        >
          <div className="rounded-full ring-2 ring-white">
            <Avatar
              name={`+${remainingCount}`}
              size={size}
              round={true}
              color="#6B7280"
              className="text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarStack;
