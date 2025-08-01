import { Route, Routes } from 'react-router';
import LoginPage from './pages/main';
import PrivateRoute from './private-route';
import HomePage from './pages/home';

const Routing = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route element={<PrivateRoute />}>
      <Route path="/home" element={<HomePage />} />
    </Route>
  </Routes>
);

export default Routing;
