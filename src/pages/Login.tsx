import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import backend from '@/declarations/export';

import { FormEvent, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [_, setCookie] = useCookies(['token']);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await backend.login(username, password);

      if (response == '404') {
        return alert("User doesn't exists.");
      } else if (response == '401') {
        return alert('Either username or password is wrong!');
      }
      setCookie('token', response);
      navigate('/account');
    } catch (e) {
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col gap-6 justify-center items-center">
          <h1 className="font-bold text-3xl text-slate-900">Login</h1>
          <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
            <Input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button disabled={loading}>
              {loading ? 'Loading..' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
