import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(null); // Reset dữ liệu cũ để hiện loading khi chuyển user
    fetchModel(`user/${userId}`)
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error(err));
  }, [userId]);

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="user-detail-container" component={Paper}>
      <Typography variant="h4" className="user-name">
        {user.first_name} {user.last_name}
      </Typography>

      <Box className="user-info-item">
        <span className="info-label">Occupation:</span> {user.occupation}
      </Box>
      <Box className="user-info-item">
        <span className="info-label">Location:</span> {user.location}
      </Box>
      <Box className="user-description-box">
        <span className="info-label">Description:</span> {user.description}
      </Box>

      <Box className="photo-link-container">
        <Button
          variant="contained"
          className="photo-link-button"
          component={Link}
          to={`/photos/${userId}`}
        >
          View {user.first_name}'s Photos
        </Button>
      </Box>
    </Box>
  );
}

export default UserDetail;
