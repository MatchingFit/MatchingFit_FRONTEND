import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import Router from './routes/Router';

Modal.setAppElement('#root'); // '#root'는 HTML에서 React가 마운트된 id

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
