import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const emptyRegister = {
  login_name: "",
  password: "",
  confirm_password: "",
  first_name: "",
  last_name: "",
  location: "",
  description: "",
  occupation: "",
};

function LoginRegister({ onLogin }) {
  const navigate = useNavigate();
  const loginForm = useForm({
    defaultValues: {
      login_name: "",
      password: "",
    },
  });
  const registerForm = useForm({
    defaultValues: emptyRegister,
  });
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handleLogin = async (loginData) => {
    try {
      const user = await fetchModel(`/admin/login`, {
        method: "POST",
        body: loginData,
      });
      onLogin(user);
      navigate(`/users/${user._id}`);
    } catch (error) {
      loginForm.setError("root.server", {
        type: "server",
        message: error.message || "Login failed.",
      });
    }
  };

  const handleRegister = async (registerData) => {
    if (registerData.password !== registerData.confirm_password) {
      registerForm.setError("confirmPassword", {
        type: "validate",
        message: "Password must match",
      });
      return;
    }

    try {
      const { confirm_password, ...payload } = registerData;
      const result = fetchModel(`/user`, {
        method: "POST",
        body: payload,
      });
      registerForm.reset(emptyRegister);
      setRegisterSuccess(
        `${result.message}: ${result.login_name}. You can now login.`
      );
    } catch (error) {
      registerForm.setError("root.server", {
        type: "server",
        message: error.message || "Registration failed.",
      });
    }
  };

  return (
    <Paper className="login-register-container">
      <Box
        className="login-section"
        component="form"
        onSubmit={loginForm.handleSubmit(handleLogin)}
      >
        <Typography variant="h5">Login</Typography>
        {loginForm.formState.errors.root?.server && (
          <Alert severity="error">
            {loginForm.formState.errors.root.server.message}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Login name"
          {...loginForm.register("login_name", {
            required: true,
            onChange: () => loginForm.clearErrors("root.server"),
          })}
        />
        {loginForm.formState.errors.login_name && (
          <p className="form-error">login_name is required</p>
        )}
        <TextField
          fullWidth
          label="Password"
          type="password"
          {...loginForm.register("password", {
            required: true,
            onChange: () => loginForm.clearErrors("root.server"),
          })}
        />
        {loginForm.formState.errors.password && (
          <p className="form-error">password is required</p>
        )}
        <Button variant="contained" type="submit">
          Login
        </Button>

        <Divider />

        <Box
          className="register-section"
          component="form"
          onSubmit={registerForm.handleSubmit(handleRegister)}
        >
          <Typography variant="h5">Register</Typography>
          {registerForm.formState.errors.root?.server && (
            <Alert severity="error">
              {registerForm.formState.errors.root.server.message}
            </Alert>
          )}
          {registerSuccess && (
            <Alert severity="success">{registerSuccess}</Alert>
          )}
          <TextField
            fullWidth
            label="Login name"
            {...registerForm.register("login_name", {
              required: true,
              onChange: () => {
                registerForm.clearErrors("root.server");
                setRegisterSuccess("");
              },
            })}
          />
          {registerForm.formState.errors.login_name && (
            <p className="form-error">login_name is required</p>
          )}
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...registerForm.register("password", {
              required: true,
              onChange: () => {
                registerForm.clearErrors("root.server");
                setRegisterSuccess("");
              },
            })}
          />
          {registerForm.formState.errors.password && (
            <p className="form-error">password is required</p>
          )}
          <TextField
            label="Confirm password"
            type="password"
            {...registerForm.register("confirmPassword", {
              required: true,
              onChange: () => {
                registerForm.clearErrors(["root.server", "confirmPassword"]);
                setRegisterSuccess("");
              },
            })}
            fullWidth
          />
          {registerForm.formState.errors.confirmPassword && (
            <p className="form-error">
              {registerForm.formState.errors.confirmPassword.message ||
                "confirm password is required"}
            </p>
          )}
          <TextField
            label="First name"
            {...registerForm.register("first_name", {
              required: true,
              onChange: () => {
                registerForm.clearErrors("root.server");
                setRegisterSuccess("");
              },
            })}
            fullWidth
          />
          {registerForm.formState.errors.first_name && (
            <p className="form-error">first_name is required</p>
          )}
          <TextField
            label="Last name"
            {...registerForm.register("last_name", {
              required: true,
              onChange: () => {
                registerForm.clearErrors("root.server");
                setRegisterSuccess("");
              },
            })}
            fullWidth
          />
          {registerForm.formState.errors.last_name && (
            <p className="form-error">last_name is required</p>
          )}
          <TextField
            fullWidth
            label="Location"
            {...registerForm.register("location")}
          />
          <TextField
            fullWidth
            label="Description"
            {...registerForm.register("description")}
          />
          <TextField
            fullWidth
            label="Occupation"
            {...registerForm.register("occupation")}
          />
          <Button variant="contained" type="submit">
            Register
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default LoginRegister;
