import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import FileSystems from "../pages/FileSystems";
import AuthRoute from "../components/AuthRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/fs",
    element: (
      <AuthRoute
        notAuthElement={<Navigate to="/" />}
        authElement={<FileSystems />}
      />
    ),
  },
  {
    path: "/fs/:fsId/:fileId",
    element: (
      <AuthRoute
        notAuthElement={<Navigate to="/" />}
        authElement={<FileSystems />}
      />
    ),
  },
  {
    path: "/fs/:fsId/",
    element: (
      <AuthRoute
        notAuthElement={<Navigate to="/" />}
        authElement={<FileSystems />}
      />
    ),
  },
  {
    path: "",
    element: <Navigate to="/login" />,
  },
]);

export default router;
