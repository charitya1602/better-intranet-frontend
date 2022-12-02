import {
  Modal,
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../context/authContext";

const addFileSystem = async ({ url, name, token }) => {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}fs`, {
    method: "POST",
    mode: "cors",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, url }),
  });
  if (!res.ok) {
    const errormsg = (await res.json()).message;
    throw new Error(errormsg ?? "Unknown Error");
  }
  return res.json();
};

const AddFS = ({ open, onClose }) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      url: formData.get("url"),
      name: formData.get("name"),
    };
    mutate({ url: data.url, description: data.name, token });
  };
  const { error, isError, isLoading, mutate } = useMutation(addFileSystem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [token, "fs"] });
      onClose();
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          margin: "auto",
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 400,
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="url"
            label="Url"
            name="url"
            autoComplete="url"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="name"
            label="Name"
            id="name"
            autoComplete="dbname"
          />
          {isError && (
            <Typography variant="body2" component="span" sx={{ color: "red" }}>
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
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddFS;
