import backend from '@/declarations/export';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Transactions, User } from '../declarations/backend/backend.did';
import Card from '@/components/user/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generate } from 'randomstring';
import Table from '@/components/user/Table';
const Account: React.FC = () => {
  const [accountid, setAccountId] = useState<string>('');
  const [ammount, setAmount] = useState<BigInt>(0n);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUser] = useState<User>({
    balance: BigInt(0),
    id: '',
    password: '',
    username: '',
    transactions: [],
  });
  const [cookie, setCookie] = useCookies(['token']);
  const navigate = useNavigate();
  const [transactions, setTransations] = useState<Transactions[]>([]);
  useEffect(() => {
    if (!cookie.token) return navigate('/login');
    (async () => {
      const response = await backend.getUser(String(cookie.token));

      if (response.length) return setUser(response[0]);
      navigate('/login');
    })();
  }, []);

  const [tMsg, setTMsg] = useState<string>('');
  const handleTransfer = async () => {
    setLoading(true);
    try {
      const response = await backend.transfer(
        String(cookie.token),
        BigInt(Number(ammount)),
        accountid,
        generate(),
      );

      console.log(response);
      let msg = '';
      if (response == '200') {
        msg = 'Successfully transfered!';
      } else if (response == '404') {
        msg = 'No such accounts!';
      } else if (response == '404') {
        msg = "You can't do that!";
      } else {
        msg = response;
      }

      setTMsg(msg);
    } catch (e) {
      setTMsg('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
  const [cLoading, setCLoading] = useState<boolean>(false);
  const [cMsg, setCMsg] = useState<string>('');
  const handleClaim = async () => {
    setCLoading(true);
    try {
      let response: Number = Number(
        await backend.checkClaim(String(cookie.token)),
      );
      let msg: string = '';
      switch (response) {
        case 404:
          msg = 'Something went wrong!';
          break;
        case 201:
          msg = 'Already Claimed.';
          break;
        default:
          msg = 'Claimed!';
          break;
      }
      setCMsg(msg);
    } catch (e) {
      alert('Something went wrong!');
    } finally {
      setCLoading(false);
    }
  };

  const [BLoading, setBLoading] = useState<boolean>(false);
  const [BMsg, setBMsg] = useState<string>('');

  const checkBalance = async () => {
    setBLoading(true);
    try {
      const response = await backend.checkBalance(String(cookie.token));
      if (response == 404n) {
        setBMsg('Something went wrong!');
        return alert('Something went wrong!');
      }
      setUser((prev) => ({
        ...prev,
        balance: response,
      }));
      setBMsg('Your current balance is ' + Number(response));
    } catch (e) {
      setBMsg('Something went wrong!');
    } finally {
      setBLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await backend.getAllTransactions(String(cookie.token));
      if (response[0]) setTransations(response[0]);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 p-12 ">
        <div className="flex gap-1">
          <p>Account ID : </p>
          <p className="font-bold">{userData.id}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <Card
            title="Claim Credit"
            description="Claim your first $100 credit."
            content={
              <div className="flex flex-col gap-6">
                <p className="font-black text-4xl">
                  {String(userData.balance) ? '---' : ''}
                </p>
                <Button disabled={cLoading} onClick={handleClaim}>
                  {cLoading ? 'Loading..' : 'Claim Credits'}
                </Button>
              </div>
            }
            footer={cMsg ? cMsg : 'Info message will appear here.'}
          />
          <Card
            title="Current Balance"
            description="Check your balance here."
            content={
              <div className="flex flex-col gap-6">
                <p className="font-black text-4xl">
                  ${String(userData.balance)}
                </p>
                <Button onClick={checkBalance} disabled={cLoading}>
                  {BLoading ? 'Loading...' : 'Check Balance'}
                </Button>
              </div>
            }
            footer={BMsg ? BMsg : 'Info messages will appear here!'}
          />
          <Card
            title="Transfer Balance"
            description="Transfer your balance here."
            content={
              <div className="flex flex-col gap-6">
                <Input
                  placeholder="Account ID"
                  value={accountid}
                  onChange={(e) => setAccountId(e.target.value)}
                />
                <Input
                  placeholder="Amount"
                  onChange={(e) => setAmount(BigInt(e.target.value))}
                  value={String(ammount)}
                />
                <Button disabled={loading} onClick={handleTransfer}>
                  {loading ? 'Loading...' : 'Transfer'}
                </Button>
              </div>
            }
            footer={tMsg ? tMsg : 'Info messages will appear here!'}
          />
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="font-bold text-xl">Transactions</h2>
          <Table transactions={transactions} />
        </div>
      </div>
    </>
  );
};

export default Account;
