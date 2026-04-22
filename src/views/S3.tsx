import { CloudFile, UploadFileRequest } from '@/models/cloudStorage';
import { useState } from 'react';

const backend_url = import.meta.env.VITE_BACKEND_URL as string;

function S3() {
  const [files, setFiles] = useState([] as CloudFile[]);
  const [fileToUpload, setFileToUpload] = useState<File | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const token = window.sessionStorage.getItem("token");

  return <>
    <div className="flex justify-around w-2/4">
      <p className="cursor-pointer citrus-clickable" onClick={sendTestS3}>Test S3</p>
      <p className="cursor-pointer citrus-clickable" onClick={listS3Files}>List S3 files</p>
      {/* <p className="cursor-pointer citrus-clickable" onClick={() => uploadToS3ViaFileName("2023-09-02_11-43.png")}>Upload to S3</p> */}
    </div>
    <div className="mt-6 flex justify-around w-2/4">
      <div className="w-2/5">
        <div>
          <input className="w-full" type="file" onChange={(e) => setFileToUpload(e.target.files?.[0])}/>
        </div>
        <button className="text-red-500 border p-2 mt-2" onClick={uploadToS3}>Upload File</button>
        <div className="mt-2">
          { errorMessage }
        </div>
      </div>
      <div className="w-3/5">
        <div className="text-green-500">The following files are available on S3. Click to download.</div>
        <div>
          {files.map((file) => {
            return <div className="cursor-pointer citrus-clickable" onClick={() => downloadFromS3(file.name)} key={file.name}>{file.name}</div>
          })}
        </div>
      </div>
    </div>
  </>

  async function sendTestS3(): Promise<void> {
    const url = `${backend_url}/api/s3/test?token=${token}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json() as string;
        console.log(json);
      }
      else {
        const errorMessage = await res.text();
        setErrorMessage(errorMessage);
      }
    } catch (e: unknown) {
      console.error(e);
    }
  }

  async function listS3Files(): Promise<void> {
    const url = `${backend_url}/api/s3?token=${token}`;
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

  function uploadToS3(): void {
    const url = `${backend_url}/api/s3/upload?token=${token}`;
    if (!fileToUpload) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(fileToUpload);

      // here we tell the reader what to do when it's done reading
      reader.onload = async (readerEvent) => {
        const content = readerEvent.target?.result as string;
        const base64content = content.split("base64,")[1];
        const data: UploadFileRequest = {
          name: fileToUpload.name,
          content: base64content
        };

        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          await listS3Files();
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

  function downloadFromS3(fileName: string): void {
    const url = `${backend_url}/api/s3/download/${fileName}?token=${token}`;
    try {
      window.open(url);
    } catch (e: unknown) {
      console.error(e);
    }
  }

  // async function uploadToS3ViaFileName(fileName: string) {
  //   const url = `${backend_url}/api/s3/upload/name?token=${token}`;
  //   const data = { filePath: `/home/guan/Downloads/${fileName}`}
  //   console.log(JSON.stringify(data));

  //   try {
  //     const res = await fetch(url, {
  //       method: 'POST',
  //       body: JSON.stringify(data),
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       }
  //     });
  //     console.log(res);
  //   } catch (e: unknown) {
  //     console.error(e);
  //   }
  // }
}

export default S3;
