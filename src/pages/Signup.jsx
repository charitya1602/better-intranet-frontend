import {
  Avatar,
  Box,
  CssBaseline,
  TextField,
  Typography,
  Button,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Container from "@mui/material/Container";
import PersonAddAlt1 from "@mui/icons-material/PersonAddAlt1";
import Header from "../components/Header";
import { useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { authContext } from "../context/authContext";
import { useNavigate } from "react-router";

const registerWithEmailPassword = async ({ username, email, password }) => {
  const res = await fetch(import.meta.env.VITE_SERVER_URL + "register", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, username }),
  });
  if (!res.ok) {
    throw Error((await res.json()).message ?? "Unknown Error");
  }
  return res.json();
};

const Signup = () => {
  const [pwdError, setPwdError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const { setUser, setToken, token } = useContext(authContext);
  const navigate = useNavigate();
  const {
    isLoading,
    mutate: register,
    isError,
    error,
  } = useMutation(registerWithEmailPassword, {
    onSuccess: (data) => {
      const { token, ...rest } = data.user;
      setUser(rest);
      setToken(token);
    },
  });

  const validateEmail = ({ target: { value } }) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    setEmailError(!value.match(emailRegex));
  };
  const validatePassword = (password, confirmPassword) => {
    setPwdError(password !== confirmPassword);
    return password === confirmPassword;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm-password"),
    };
    if (!validatePassword(user.password, user.confirmPassword) || emailError) {
      return;
    }
    register(user);
  };
  useEffect(() => {
    if (token) {
      navigate("/fs");
    }
  }, [token]);
  return (
    <>
      <Header />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          border: 1,
          borderColor: "grey.500",
          borderRadius: 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          margin: "auto",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonAddAlt1 />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={emailError}
              onBlur={validateEmail}
            />
            {emailError && (
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "red" }}
              >
                Please enter a valid email
              </Typography>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              error={pwdError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              error={pwdError}
            />
            {pwdError && (
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "red" }}
              >
                The passwords don't match
              </Typography>
            )}
            {isError && (
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "red" }}
              >
                {error.message}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              Sign In
            </Button>
          </Box>
          <Link component={RouterLink} to="/login">
            Already have an account? Log In
          </Link>
        </Box>
      </Container>
    </>
  );
};

export default Signup;
