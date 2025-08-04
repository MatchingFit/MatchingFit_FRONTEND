import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/login/Login';
import Signup from '@/pages/signup/Signup';
import Start from '@/pages/analytics/start/Start';
import Loading from '@/pages/analytics/loading/Loading';
import Report from '@/pages/analytics/report/Report';
import HRTestStart from '@/pages/hr-test/start/Start';
import HRTestQuiz from '@/pages/hr-test/quiz/Quiz';
import HRTestLoading from '@/pages/hr-test/loading/Loading';
import HRTestResult from '@/pages/hr-test/result/Result';

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/analytics/start" element={<Start />} />
      <Route path="/analytics/loading" element={<Loading />} />
      <Route path="/analytics/report" element={<Report />} />

      <Route path="/hr-test/start" element={<HRTestStart />} />
      <Route path="/hr-test/quiz" element={<HRTestQuiz />} />
      <Route path="/hr-test/loading" element={<HRTestLoading />} />
      <Route path="/hr-test/result" element={<HRTestResult />} />
    </Routes>
  );
};

export default Router;
