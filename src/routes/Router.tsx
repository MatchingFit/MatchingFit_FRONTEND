import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/login/Login';
import Signup from '@/pages/signup/Signup';
import Start from '@/pages/analytics/start/Start';
import Loading from '@/pages/analytics/loading/Loading';
import Report from '@/pages/analytics/report/Report';

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/analytics/start" element={<Start />} />
      <Route path="/analytics/loading" element={<Loading />} />
      <Route path="/analytics/report" element={<Report />} />
    </Routes>
  );
};

export default Router;
