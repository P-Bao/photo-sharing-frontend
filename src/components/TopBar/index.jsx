import React, { useState, useEffect } from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
// import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar({ loggedInUser, onLogout, onPhotoUploaded }) {
  const location = useLocation();
  const navigate = useNavigate();
  // const path = location.pathname;
  // let context = "";

  const [context, setContext] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadMessage, setUploadMesage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const path = location.pathname;
      if (!loggedInUser) {
        setContext("Please login.");
        return;
      }
      if (path.includes("/users/") && !path.includes("/comments")) {
        const userId = path.split("/users/")[1];
        fetchModel(`user/${userId}`).then((user) => {
          setContext(`${user.first_name} ${user.last_name}`);
        });
      } else if (path.includes("/photos/")) {
        const userId = path.split("/photos/")[1];
        fetchModel(`user/${userId}`).then((user) => {
          setContext(`${user.first_name} ${user.last_name}'s photos`);
        });
      } else {
        setContext("");
      }
    };
    fetchUser();
  }, [location.pathname, loggedInUser]);

  const handleLogout = async () => {
    try {
      await fetch(`/admin/logout`, {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    } finally {
      onLogout();
      navigate("/login");
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("photo", file);

    try {
      setUploadError("");
      setUploadMesage("");

      const result = await fetchModel(`/photos/new`, {
        method: "POST",
        body: formData,
      });
      setUploadMesage(result.message);
      onPhotoUploaded();
      navigate(`/photos/${loggedInUser._id}`);
    } catch (error) {
      setUploadError(error.message);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className="topbar-toolBar">
        <Typography variant="h5" color="inherit" className="topbar-author">
          Created by: Phan Bao
        </Typography>

        <Typography variant="h5" color="inherit" className="topbar-title">
          {context}
        </Typography>

        <div className="topBar-actions">
          {loggedInUser ? (
            <>
              <Typography variant="body1" color="inherit">
                {" "}
                Hi, {loggedInUser.first_name}{" "}
              </Typography>
              <Button variant="contained" component="label" color="secondary">
                Add photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoUpload}
                />
              </Button>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Typography variant="body1" color="inherit">
              Please Login
            </Typography>
          )}
        </div>
        <div>
          {uploadError && (
            <Typography
              variant="caption"
              color="inherit"
              className="topbar-error"
            >
              uploadError
            </Typography>
          )}
          {uploadMessage && (
            <Typography
              variant="caption"
              color="inherit"
              className="topbar-mesage"
            >
              uploadMesage
            </Typography>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
