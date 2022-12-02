import { useAuth } from "../context/authContext"

const AuthRoute = ({ notAuthElement, authElement }) => {
  const authData = useAuth();
  return authData.token? authElement: notAuthElement;
}

export default AuthRoute;