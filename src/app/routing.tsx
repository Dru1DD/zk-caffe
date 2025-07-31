import { Route, Routes } from "react-router";
import LoginPage from "./pages/login";
import PrivateRoute from "./private-route";
import HomePage from "./pages/home";

const Routing = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<HomePage />} />
    </Route>
  </Routes>
);

export default Routing;
