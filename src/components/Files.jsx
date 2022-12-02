import {
  Card,
  Typography,
  CardActionArea,
  CardHeader,
  CircularProgress,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { Box } from "@mui/system";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "react-query";
import { useAuth } from "../context/authContext";

const truncate = (string, len, dots = "...") => {
  return string.length > len
    ? `${string.substr(0, len - dots.length)}${dots}`
    : string;
};

const File = ({ name, lastModified, isDirectory, onClick }) => {
  return (
    <Card sx={{ width: 200, margin: 1 }}>
      <CardActionArea onClick={onClick}>
        <CardHeader
          avatar={
            isDirectory ? (
              <FolderIcon sx={{ color: "grey.700" }} />
            ) : (
              <ArticleIcon sx={{ color: "grey.600" }} />
            )
          }
          title={truncate(name, 18)}
          subheader={lastModified}
        />
      </CardActionArea>
    </Card>
  );
};

const Files = () => {
  const { fsId, fileId } = useParams();
  const { token } = useAuth();
  const naviagte = useNavigate();
  const {
    isLoading,
    isError,
    error,
    data: files,
  } = useQuery({
    queryKey: ["fs", fsId, fileId],
    queryFn: async () => {
      const path = fileId
        ? `${import.meta.env.VITE_SERVER_URL}fs/${fsId}/${fileId}`
        : `${import.meta.env.VITE_SERVER_URL}fs/${fsId}`;
      const res = await fetch(path, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errmsg = (await res.json()).message;
        throw new Error(errmsg.message ?? "Unknown Error Occured");
      }
      return res.json();
    },
    enabled: !!(fileId ?? fsId),
  });

  const fileList = files?.fsys?.files;
  fileList?.sort((e1, e2) => Number(e2.isDirectory) - Number(e1.isDirectory));
  return (
    <Box
      sx={{
        marginTop: 8,
        marginLeft: "240px",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {isLoading ? <CircularProgress /> : null}
      {fileList && fileList.length ? (
        fileList.map((f) => (
          <File
            key={f._id}
            {...f}
            onClick={
              f.isDirectory
                ? () => naviagte(`/fs/${fsId}/${f._id}`)
                : () => window.open(f.url)
            }
          />
        ))
      ) : (
        <Typography
          variant="body1"
          component="div"
          color="grey.700"
          sx={{
            textAlign: "center",
            position: "relative",
            top: "200px",
            left: "200px",
          }}
        >
          {fileId ?? fsId
            ? "No files in the current directory"
            : "Please Select A FS"}
        </Typography>
      )}
    </Box>
  );
};
export default Files;
