import { SignUpValidationErrors, ValidationResult } from '@/models/backend';
import { SignUpData } from '@/models/login';
import { useState } from 'react';

const backend_url = import.meta.env.VITE_BACKEND_URL as string;

function SignUp() {
  const emptySignUpData = { username: "", password: "", favoriteAnimal: "", favoriteColor: "", favoriteNumber: 0 } satisfies SignUpData;
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [signUpData, setSignUpData] = useState<SignUpData>(getEmptySignUpData());
  const [disabled, setDisabled] = useState<boolean>(false);
  const [signUpValidationErrors, setSignUpValidationErrors] = useState<SignUpValidationErrors>({} as SignUpValidationErrors);

  const handleSignUp = async () => {
    setDisabled(true);
    const url = `${backend_url}/api/account/sign-up`;

    const options = {
      method: "POST",
      body: JSON.stringify(signUpData),
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await fetch(url, options);
      if (res.ok) {
        const text = await res.text();
        setResponseMessage(text);
        resetValidationErrors();
        resetForm();
      }
      else if (res.status === 400) {
        const json = await res.json() as ValidationResult;
        if (json.title === "One or more validation errors occurred.") {
          setSignUpValidationErrors(json.errors);
          resetPassword();
        }
      }
      else if (res.status === 401) {
        const text = await res.text();
        setResponseMessage(text);
        resetValidationErrors();
        resetPassword();
      }
      else {
        setResponseMessage("Something went wrong.");
        resetValidationErrors();
        resetPassword();
      }
    } catch(err: unknown) {
      console.error(err);
      setResponseMessage("Something went wrong.");
      resetValidationErrors();
      resetPassword();
    }
  }

  const renderSignUpValidationErrors = (validationErrors: Array<string> | undefined): JSX.Element => {
    if (!validationErrors) return <div></div>;
    return <div className="text-red-500 text-lg">
      {validationErrors.map((errorText) => <div key={errorText}>{errorText}</div>)}
    </div>;
  }

  const handleSetSignUpData = (signUpData: SignUpData): void => {
    setSignUpData(signUpData);
  }

  const resetForm = (): void => {
    setDisabled(false);
    setSignUpData(getEmptySignUpData());
  }

  const resetPassword = (): void => {
    setDisabled(false);
    setSignUpData({ ...signUpData, password: "" });
  }

  const resetValidationErrors = (): void => {
    setSignUpValidationErrors({} as SignUpValidationErrors);
  }

  function getEmptySignUpData(): SignUpData {
    console.log(emptySignUpData);
    
    return { ...emptySignUpData };
  }

  const disabledClasses =  "pointer-events-none cursor-default text-gray-600";
  const submitButtonClasses = `citrus-clickable cursor-pointer border-solid border-2 p-2 border-slate-600 ${disabled ? disabledClasses : ""}`;

  return <>
    <div>
      <label htmlFor="username">Username</label>
      <input className="w-full block text-black" id="username" type="text" placeholder="Username" value={signUpData.username} onChange={(e) => handleSetSignUpData({ ...signUpData, username: e.target.value })} />
      <div>{renderSignUpValidationErrors(signUpValidationErrors.Username)}</div>

      <label htmlFor="password">Password</label>
      <input className="w-full block text-black" id="password" type="password" placeholder="Password" value={signUpData.password} onChange={(e) => handleSetSignUpData({ ...signUpData, password: e.target.value })} />
      <div>{renderSignUpValidationErrors(signUpValidationErrors.Password)}</div>

      <label htmlFor="password">Favorite animal</label>
      <input className="w-full block text-black" id="favoriteAnimal" type="text" placeholder="Favorite animal" value={signUpData.favoriteAnimal} onChange={(e) => handleSetSignUpData({ ...signUpData, favoriteAnimal: e.target.value })} />
      <div>{renderSignUpValidationErrors(signUpValidationErrors.FavoriteAnimal)}</div>

      <label htmlFor="password">Favorite color</label>
      <input className="w-full block text-black" id="favoriteColor" type="text" placeholder="Favorite color" value={signUpData.favoriteColor} onChange={(e) => handleSetSignUpData({ ...signUpData, favoriteColor: e.target.value })} />
      <div>{renderSignUpValidationErrors(signUpValidationErrors.FavoriteColor)}</div>

      <label htmlFor="password">Favorite number</label>
      <input className="w-full block text-black" id="favoriteNumber" type="number" placeholder="Favorite number" value={signUpData.favoriteNumber} onChange={(e) => handleSetSignUpData({ ...signUpData, favoriteNumber: parseInt(e.target.value) })} />
      <div>{renderSignUpValidationErrors(signUpValidationErrors.FavoriteNumber)}</div>

      <div className="mt-5 flex justify-around">
        <input type="submit" value="Sign Up" className={submitButtonClasses} onClick={handleSignUp} />
        <input type="submit" value="Reset" className={submitButtonClasses} onClick={resetForm} />
      </div>
    </div>
    <div className="mt-5 font-bold">
      { responseMessage }
    </div>
  </>
}

export default SignUp;
