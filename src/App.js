import "./App.css";

import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import { fetchModel } from "./lib/fetchModelData";

function ProtectedRoute({ authChecked, loggedInUser, children }) {
  if (!authChecked) {
    return null;
  }
  if (!loggedInUser) {
    <Navigate to="/login" replace />;
  }
  return children;
}

const App = (props) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activityVersion, setActivityVersion] = useState(0);

  const refreshActivity = () => setActivityVersion(activityVersion + 1);

  useEffect(() => {
    fetchModel("admin/current")
      .then((user) => setLoggedInUser(user))
      .catch(() => setLoggedInUser(null))
      .finally(setAuthChecked(true));
  }, []);

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              loggedInUser={loggedInUser}
              onLogout={() => setLoggedInUser(null)}
              onPhotoUploaded={refreshActivity}
            />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList
                loggedInUser={loggedInUser}
                activityVersion={activityVersion}
              />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route
                  path="/login"
                  element={
                    loggedInUser ? (
                      <Navigate to={`/users/${loggedInUser._id}`} replace />
                    ) : (
                      <LoginRegister onLogin={setLoggedInUser} />
                    )
                  }
                />
                <Route
                  path="/users/:userId"
                  element={
                    <ProtectedRoute
                      authChecked={authChecked}
                      loggedInUser={loggedInUser}
                    >
                      <UserDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/photos/:userId"
                  element={
                    <ProtectedRoute
                      authChecked={authChecked}
                      loggedInUser={loggedInUser}
                    >
                      <UserPhotos
                        activityVersion={activityVersion}
                        onCommentAdded={refreshActivity}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute
                      authChecked={authChecked}
                      loggedInUser={loggedInUser}
                    >
                      <UserList
                        loggedInUser={loggedInUser}
                        activityVersion={activityVersion}
                      />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Navigate
                      to={
                        loggedInUser ? `/users/${loggedInUser._id}` : "/login"
                      }
                      replace
                    />
                  }
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
