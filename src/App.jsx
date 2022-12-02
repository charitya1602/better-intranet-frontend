import router from "./routes/router";
import { RouterProvider } from "react-router";
import { authContext } from "./context/authContext";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const App = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <authContext.Provider value={{ user, token, setUser, setToken }}>
          <RouterProvider router={router} />
        </authContext.Provider>
      </QueryClientProvider>
    </>
  );
};

export default App;
