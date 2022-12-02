import {
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  List,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Article as ArticleIcon,
  CloudCircle as CloudCircleIcon
} from "@mui/icons-material";
import { useAuth } from "../context/authContext";
import { useQuery } from "react-query";

const truncate = (string, len, dots = "...") => {
  return string.length > len
    ? `${string.substr(0, len - dots.length)}${dots}`
    : string;
};

const File = ({ id , onClick}) => {
  const { token } = useAuth();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["fs", id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}fs/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errmsg = (await res.json()).message;
        throw new Error(errmsg.message ?? "Unknown Erro Occured");
      }
      return res.json();
    },
  });
  const fsData = data?.fsys;
  const fsName = fsData?.description && truncate(fsData.description, 18);
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>
          <CloudCircleIcon />
        </ListItemIcon>
        <ListItemText primary={fsName ?? "Loading"} />
      </ListItemButton>
    </ListItem>
  );
};
const FileList = ({ files, onClick }) => {
  return (
    <List>
      {files.map((e) => (
        <File key={e} id={e} onClick={() => onClick(e)} />
      ))}
    </List>
  );
};

const Sidebar = ({ files, onClick, isLoading }) => {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
        "& .MuiDrawer-paper:nth-of-type(1)": {
          marginTop: 8,
          width: 240,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open
    >
      {isLoading ? <CircularProgress /> : null}
      {files ? (
        <FileList files={files} onClick={onClick} />
      ) : (
        <Typography
          color="grey.700"
          variant="body1"
          component="div"
          sx={{
            textAlign: "center",
            margin: 2,
          }}
        >
          Empty
        </Typography>
      )}
    </Drawer>
  );
};
export default Sidebar;
