import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Divider,
  List,
  ListItem,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import "./styles.css";
import { Link, useParams } from "react-router-dom";
// import models from "../../modelData/models";
import fetchModel, { getApiUrl } from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos({ onCommentAdd, activityVersion = 0 }) {
  const { userId } = useParams();
  // const photos = models.photoOfUserModel(userId);
  const [photos, setPhotos] = useState([]);
  const [currentPhotoId, setCurrentPhotoId] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentError, setCommentError] = useState("");

  const loadPhotos = useCallback(() => {
    fetchModel(`photosOfUser/${userId}`).then((data) => setPhotos(data));
  }, [userId]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos, activityVersion]);

  if (!photos) {
    return null;
  }

  const handleCommentChange = (photoId) => (event) => {
    setCurrentPhotoId(photoId);
    setCommentDraft(event.target.value);
    setCommentError("");
  };

  const handleAddComment = (photoId) => async (event) => {
    event.preventDefault();

    if (photoId !== currentPhotoId) {
      setCurrentPhotoId(photoId);
      setCommentDraft("");
      setCommentError("Please enter a command");
      return;
    }

    try {
      await fetchModel(`commentsOfPhoto/${photoId}`, {
        method: "POST",
        body: { commentDraft },
      });

      loadPhotos();
      setCurrentPhotoId(null);
      setCommentDraft("");
      setCommentError("");

      if (onCommentAdd) {
        onCommentAdd();
      }
    } catch (error) {
      setCommentError(error.message || "Unable to add comment");
    }
  };

  return (
    <Box className="photos-container">
      {photos.map((photo) => (
        <Card key={photo._id} className="photo-card">
          <CardHeader title={`Posted: ${photo.date_time}`} />
          <CardMedia
            component="img"
            image={getApiUrl(`/images/${encodeURIComponent(photo.file_name)}`)}
            alt={`Photo ${photo._id}`}
          />
          <CardContent>
            <Typography>Comment:</Typography>
            <Divider />

            <List>
              {photo.comments &&
                photo.comments.map((comment) => (
                  <ListItem key={comment._id}>
                    <Typography variant="subtitle2">
                      <Link
                        to={`/users/${comment.user._id}`}
                        className="comment-author"
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                      <Typography
                        variant="caption"
                        component="span"
                        className="comment-date"
                      >
                        {comment.date_time}
                      </Typography>
                    </Typography>
                    <Typography variant="body2" className="comment-text">
                      {comment.comment}
                    </Typography>
                  </ListItem>
                ))}
            </List>
            <Box
              className="comment-form"
              component="form"
              onSubmit={handleAddComment}
            >
              {currentPhotoId !== photo._id && commentError && (
                <Alert servity="error">{commentError}</Alert>
              )}
              <TextField
                label="Add comment"
                value={photo._id === currentPhotoId ? commentDraft : ""}
                onChange={handleCommentChange(photo._id)}
                multiline
                fullWidth
              />
              <Button variant="contained" type="submit">
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>

    // <Typography variant="body1">
    //   This should be the UserPhotos view of the PhotoShare app. Since it is
    //   invoked from React Router the params from the route will be in property
    //   match. So this should show details of user:
    //   {user.userId}. You can fetch the model for the user
    //   from models.photoOfUserModel(userId):
    // </Typography>
  );
}

export default UserPhotos;
