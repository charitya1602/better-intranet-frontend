import { GitHub } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { authContext } from "../context/authContext";
import { useContext, useState } from "react";
import { Button } from "@mui/material";
import AddFS from "./AddFS";

const Header = () => {
  const { token, setUser, setToken } = useContext(authContext);
  const [open, setOpen] = useState(false);
  const logout = (
    <>
      <Button
        color="inherit"
        onClick={() => {
          setUser(null);
          setToken(null);
        }}
      >
        logout
      </Button>
      <Button
        color="inherit"
        onClick={() => {
          setOpen(true);
        }}
      >
        Add FS
      </Button>
    </>
  );
  return (
    <>
      <AddFS open={open} onClose={() => setOpen(false)} />
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1400,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Better Intranet
          </Typography>
          <IconButton
            size="large"
            aria-label="github repo link"
            onClick={() => window.location.replace("https://github.com")}
            color="inherit"
          >
            <GitHub />
          </IconButton>
          {token && logout}
        </Toolbar>
      </AppBar>
    </>
  );
};
export default Header;
