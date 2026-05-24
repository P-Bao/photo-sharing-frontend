import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";
import "./styles.css";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList({ loggedInUser, activityVersion = 0 }) {
  // const users = models.userListModel();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!loggedInUser) {
      setUsers([]);
      return;
    }
    fetchModel("user/list").then((data) => {
      setUsers(data);
    });
  }, [loggedInUser, activityVersion]);

  if (!users) {
    return null;
  }

  return (
    <div>
      {/* <Typography variant="body1">
          This is the user list, which takes up 3/12 of the window. You might
          choose to use <a href="https://mui.com/components/lists/">Lists</a>{" "}
          and <a href="https://mui.com/components/dividers/">Dividers</a> to
          display your users like so:
        </Typography> */}
      <List component="nav">
        {users.map((item) => (
          <>
            <ListItem>
              <ListItemButton component={Link} to={`/users/${item._id}`}>
                <ListItemText primary={item.first_name} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
      {/* <Typography variant="body1">
          The model comes in from models.userListModel()
        </Typography> */}
    </div>
  );
}

export default UserList;
