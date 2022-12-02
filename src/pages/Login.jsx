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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Header from "../components/Header";
import { useState, useContext, useEffect } from "react";
import { useMutation } from "react-query";
import { authContext } from "../context/authContext";
import { useNavigate } from "react-router";

const loginWithEmailPassword = async ({ email, password }) => {
  const res = await fetch(import.meta.env.VITE_SERVER_URL + "login", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw Error(data.message ?? "Unknown Error");
  }
  return res.json();
};

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken, token } = useContext(authContext);
  const [emailError, setEmailError] = useState(false);

  const { error, isError, isLodaing, mutate } = useMutation(
    loginWithEmailPassword,
    {
      onSuccess: (data) => {
        const { token, ...rest } = data.user;
        setUser(rest);
        setToken(token);
      },
    }
  );

  const validateEmail = ({ target: { value } }) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    setEmailError(!value.match(emailRegex));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    if (emailError) {
      return;
    }
    mutate(user);
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
            <LockOutlinedIcon />
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
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
              autoComplete="current-password"
            />
            {isError && (
              <Typography
                variant="body2"
                component="span"
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
              disabled={isLodaing}
            >
              Sign In
            </Button>
          </Box>
          <Link component={RouterLink} to="/signup">
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Container>
    </>
  );
};

export default Login;
