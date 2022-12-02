import Files from "../components/Files";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/authContext";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";

const FileSystems = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { isLoading, error, isError, data } = useQuery({
    queryKey: [token, "fs"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}fs`, {
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

  return (
    <>
      {!isLoading && !isError && JSON.stringify(data)}
      <Header />
      <Sidebar isLoading={isLoading} files={data?.fileSystems} onClick={(e) => navigate(`/fs/${e}`)} />
      <Files isLoading={isLoading} files={data?.fileSystems} fs />
    </>
  );
};
export default FileSystems;
