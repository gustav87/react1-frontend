import { CloudFile } from '@/models/cloudStorage';
import { useState } from 'react';

const backend_url = import.meta.env.VITE_BACKEND_URL as string;

function Alibaba() {
  const [files, setFiles] = useState([] as CloudFile[]);
  const [fileToUpload, setFileToUpload] = useState<File | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const token = window.sessionStorage.getItem("token");

  return <>
    <div className="flex justify-around w-2/4">
      <p className="cursor-pointer citrus-clickable" onClick={listAlibabaFiles}>List Alibaba files</p>
    </div>
    <div className="mt-6 flex justify-around w-2/4">
      <div>
        <div>
          <input type="file" onChange={(e) => setFileToUpload(e.target.files?.[0])}/>
        </div>
        <button className="text-red-500 border p-2 mt-2" onClick={uploadToAlibaba}>Upload File</button>
        <div className="mt-2">
          { errorMessage }
        </div>
      </div>
      <div>
        <div className="text-green-500">The following files are available on OSS. Click to download.</div>
        <div>
          {files.map((file) => {
            return <div className="flex justify-content-center" key={file.name}>
              <div className="cursor-pointer citrus-clickable mr-5" onClick={() => downloadFromAlibaba(file.name)}>{file.name}</div>
              <button className="hover:text-red-500 active:text-red-800" onClick={() => deleteFileOnAlibaba(file.name)}>Delete</button>
            </div>
          })}
        </div>
      </div>
    </div>
  </>

  async function listAlibabaFiles(): Promise<void> {
    const url = `${backend_url}/api/alibaba?token=${token}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const files = await res.json() as CloudFile[];
        setFiles(files);
      }
      else {
        const errorMessage = await res.text();
        setErrorMessage(errorMessage);
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }

  function uploadToAlibaba(): void {
    const url = `${backend_url}/api/alibaba/upload?token=${token}`;
    if (!fileToUpload) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(fileToUpload);

      // here we tell the reader what to do when it's done reading
      reader.onload = async (readerEvent) => {
        const content = readerEvent.target?.result as string;
        const base64content = content.split("base64,")[1];
        const data = {name: fileToUpload.name, content: base64content};

        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          await listAlibabaFiles();
        }
        else {
          const errorMessage = await res.text();
          setErrorMessage(errorMessage);
        }
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }

  function downloadFromAlibaba(fileName: string): void {
    const url = `${backend_url}/api/alibaba/download/${fileName}?token=${token}`;
    try {
      window.open(url);
    } catch (e: unknown) {
      console.error(e);
    }
  }

  async function deleteFileOnAlibaba(fileName: string): Promise<void> {
    const url = `${backend_url}/api/alibaba/${fileName}?token=${token}`;
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        await listAlibabaFiles();
      }
      else {
        const errorMessage = await res.text();
        setErrorMessage(errorMessage);
      }
    } catch (e: unknown) {
      console.error(e);
    } 
  }
}

export default Alibaba;
