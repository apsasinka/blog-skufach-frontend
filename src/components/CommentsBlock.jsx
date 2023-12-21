import React from "react";
import { SideBlock } from "./SideBlock";
import { useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";


export const CommentsBlock = ({ items, children, isLoading = true, onDelete }) => {
  const userData = useSelector(state => state.auth.data);

  const handleDelete = (commentId) => {
    if (onDelete) {
      onDelete(commentId);
    }
  };

  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl ? `${process.env.REACT_APP_API}${obj.user.avatarUrl}` : ''} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.user.fullName}
                  secondary={obj.text}
                />
              )}
              {!isLoading && userData && userData._id === obj.user.id && (
                <IconButton onClick={() => handleDelete(obj.id)} color="default">
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
