import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './features/auth/login';
import { ToastContainer } from "react-toastify";
import Layout from './features/dashboard/layout';
import PrivateRoutes from './features/auth/privateRoute';
import Dashboard from './features/dashboard/dashboard';
import Journals from './features/dashboard/journal';

function App() {
  return (
    <><Router>
      <Routes>
        <Route index path="/login" element={<LogIn />} />
        <Route path="/" element={<PrivateRoutes>
          <Layout />
        </PrivateRoutes>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journals" element={<Journals />} />
        </Route>
      </Routes>
    </Router>
    <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover /></>
  );
}

export default App;
