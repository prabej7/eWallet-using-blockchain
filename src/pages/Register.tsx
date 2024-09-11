import { FormEvent, useState } from 'react';
import { generate } from 'randomstring';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import backend from '@/declarations/export';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(['token']);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await backend.register({
        username: username,
        balance: BigInt(0),
        id: generate(),
        password: password,
        transactions: [],
      });

      if (response == '404') {
        alert('User already exists.');
        setLoading(false);
      } else {
        setCookie('token', response);
        navigate('/account');
      }
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
          <h1 className="font-bold text-3xl text-slate-900">Register</h1>
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
              {loading ? 'Loading..' : 'Register'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
