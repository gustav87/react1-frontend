import useLoginStore from '@/store/loginStore';
import { useState } from 'react';

const backend_url = import.meta.env.VITE_BACKEND_URL as string;

type LoginData = {
  username: string;
  password: string;
}

function Login() {
  const emptyCredentials = { username: "", password: "" } satisfies LoginData;
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [credentials, setCredentials] = useState<LoginData>(getEmptyCredentials());
  const [disabled, setDisabled] = useState<boolean>(false);
  const loginState = useLoginStore();
  // const setUserToken = useLoginStore((state) => state.setUserToken);

  const handleLogin = async (): Promise<void> => {
    setDisabled(true);
    const url = `${backend_url}/api/account/log-in`;

    const options = {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await fetch(url, options);
      const text = await res.text();
      if (res.ok) {
        loginState.onLoginSuccess({ username: credentials.username, userToken: text });
        setResponseMessage("Log in successful!");
      }
      else {
        setResponseMessage(text);
      }
    } catch(err: unknown) {
      console.error(err);
    } finally {
      resetLoginForm();
    }
  }

  const getCookie = async (): Promise<void> => {
    const url = `${backend_url}/api/cookie`;

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include" as RequestCredentials,
    };

    try {
      const res = await fetch(url, options);
      if (res.ok) {
        const text = await res.text();
        console.log(text);
      }
    } catch(err: unknown) {
      console.error(err);
    }
  }

  const handleSetCredentials = (credentials: LoginData): void => {
    setCredentials(credentials);
  }

  const resetLoginForm = (): void => {
    setDisabled(false);
    setCredentials(getEmptyCredentials());
  }

  function getEmptyCredentials(): LoginData {
    return { ...emptyCredentials };
  }

  const disabledClasses =  "pointer-events-none cursor-default text-gray-600";
  const submitButtonClasses = `mr-5 citrus-clickable cursor-pointer border-solid border-2 p-2 border-slate-600 ${disabled ? disabledClasses : ""}`;

  return <>
    <div>
      <label htmlFor="username">Username</label>
      <input className="w-full block text-black" id="username" type="text" placeholder="Username" value={credentials.username} onChange={(e) => handleSetCredentials({ ...credentials, username: e.target.value })} />
      <label htmlFor="password">Password</label>
      <input className="w-full block text-black" id="password" type="password" placeholder="Password" value={credentials.password} onChange={(e) => handleSetCredentials({ ...credentials, password: e.target.value })} />
      <div className="mt-5">
        <input type="submit" value="Log In" className={submitButtonClasses} onClick={handleLogin} />
      </div>
    </div>
    <div className="mt-5 font-bold">
      { responseMessage }
    </div>
    <div className="mt-5 font-bold">
      <div className="citrus-clickable" onClick={getCookie}>Get cookie</div>
    </div>
  </>
}

export default Login;
