const backend_url = import.meta.env.VITE_BACKEND_URL as string;

function Test() {
  return <>
    <div className="flex justify-around w-2/4">
      <p className="cursor-pointer citrus-clickable" onClick={getBoyNames}>Get boy names</p>
      <p className="cursor-pointer citrus-clickable" onClick={sendTestBackendWeather}>Test backend Weather</p>
      <p className="cursor-pointer citrus-clickable" onClick={sendTestBackend1}>Test backend 1</p>
    </div>
  </>

  async function getBoyNames(): Promise<void> {
    const url = `${backend_url}/api/test/boynames`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json() as string[];
        console.log(json);
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }

  async function sendTestBackendWeather(): Promise<void> {
    const url = `${backend_url}/api/test/weather`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include" as RequestCredentials,
    };
    try {
      const res = await fetch(url, options);
      const json = await res.json() as { date: string, summary: string, temperatureC: number, temperatureF: number };
      console.log(json);
    } catch (e: unknown) {
      console.error(e);
    }
  }

  async function sendTestBackend1(): Promise<void> {
    const url = `${backend_url}/api/test/test1`;
    try {
      const res = await fetch(url);
      const json = await res.json() as { summary: string };
      console.log(json);
    } catch (e: unknown) {
      console.error(e);
    }
  }

  async function _send_await_without_try_catch(): Promise<void> {
    const res = await fetch(`${backend_url}/api/tests`);
    if (res.ok) {
      const json = await res.json() as unknown;
      console.log(json);
    } else {
      console.error("lol");
    }
  }

  function _send_promise(): void {
    fetch(`${backend_url}/api/test`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Something went wrong with the database.");
        }
      })
      .then(res => {
        if (res) {
          console.log(res);
        }
      })
      .catch(err => {
        console.error(err);
      })
  }
}

export default Test;
