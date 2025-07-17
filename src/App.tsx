import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import Router from './routes/Router';
import useAuthInit from './hooks/useAuthInit';
import Loader from './components/loader/Loader';

Modal.setAppElement('#root'); // '#root'는 HTML에서 React가 마운트된 id

function App() {
  const { isAuthChecked } = useAuthInit();

  if (!isAuthChecked) return <Loader />;

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
