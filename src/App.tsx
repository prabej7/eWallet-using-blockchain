import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Button } from './components/ui/button';
import Register from './pages/Register';
import Login from './pages/Login';
import Account from './pages/Account';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </div>
  );
}

export default App;
