import { ContactFields, ContactFluentValidationResult } from '@/models/backend';
import { useState } from 'react';

const backend_url = import.meta.env.VITE_BACKEND_URL as string;

type ContactData = {
  name: string;
  email: string;
  message: string;
}

function Contact() {
  const emptyContactData = { name: "", email: "", message: "" } satisfies ContactData;
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [contactData, setContactData] = useState<ContactData>(getEmptyContactData());
  const [disabled, setDisabled] = useState<boolean>(false);
  const [contactValidationErrors, setContactValidationErrors] = useState<ContactFluentValidationResult>([] satisfies ContactFluentValidationResult);

  const handleSubmit = async () => {
    setDisabled(true);
    const url = `${backend_url}/api/contact2`;

    const options = {
      method: "POST",
      body: JSON.stringify(contactData),
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await fetch(url, options);
      if (res.ok) {
        setResponseMessage("Message sent!");
        setTimeout(() => setResponseMessage(""), 5000);
        setContactData(getEmptyContactData());
        setContactValidationErrors([]);
      }
      else if (res.status === 400) {
        const json = await res.json() as ContactFluentValidationResult;
        setContactValidationErrors(json);
      }
      else {
        setResponseMessage("Something went wrong.");
      }
    } catch(err: unknown) {
      console.error(err);
      setResponseMessage("Something went wrong.");
    } finally {
      setDisabled(false);
    }
  }

  const handleSetContactData = (contactData: ContactData): void => {
    setContactData(contactData);
  }

  function getEmptyContactData(): ContactData {
    return { ...emptyContactData };
  }

  const resetForm = (): void => {
    setDisabled(false);
    setContactData(getEmptyContactData());
  }

  const renderContactValidationErrors = (propertyName: ContactFields): JSX.Element => {
    const relevantErrors = contactValidationErrors.filter((x) => x.propertyName === propertyName);
    if (relevantErrors.length === 0) return <div></div>;
    return <div className="text-red-500 text-lg">
      {relevantErrors.map((x) => <div key={x.errorMessage}>{x.errorMessage}</div>)}
    </div>;
  }

  const disabledClasses =  "pointer-events-none cursor-default text-gray-600";
  const submitButtonClasses = `mr-5 citrus-clickable cursor-pointer border-solid border-2 p-2 border-slate-600 ${disabled ? disabledClasses : ""}`;

  return <>
    <div>
      <label htmlFor="name">Name</label>
      <input className="w-full block text-black" type="text" placeholder="Name" value={contactData.name} onChange={(e) => handleSetContactData({ ...contactData, name: e.target.value })} />
      <div>{renderContactValidationErrors("Name")}</div>

      <label htmlFor="email">Email</label>
      <input className="w-full block text-black" type="email" placeholder="Email" value={contactData.email} onChange={(e) => handleSetContactData({ ...contactData, email: e.target.value })} />
      <div>{renderContactValidationErrors("Email")}</div>

      <label htmlFor="message">Message</label>
      <textarea className="w-full block text-black" rows={4} cols={40} placeholder="Message" value={contactData.message} onChange={(e) => handleSetContactData({ ...contactData, message: e.target.value })}></textarea>
      <div>{renderContactValidationErrors("Message")}</div>

      <div className="mt-5">
        <input type="submit" value="Send Message" className={submitButtonClasses} onClick={handleSubmit} />
        <input type="submit" value="Reset" className={submitButtonClasses} onClick={resetForm} />
      </div>
    </div>
    <div className="mt-5 font-bold">
      { responseMessage }
    </div>
  </>
}

export default Contact;
