import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [FileName, setFileName] = useState(null);
  //Handle Image - to upload the image on Ipfs
  //retrieve file

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        console.log("hello");
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `
            ec831737f44683ef023b`,
            pinata_secret_api_key: `f3dcdb8ee0f981aeee29965973df604400132a75cd225d3803824797556a3d30`,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        //console.log(ImgHash)
        contract.add(account, ImgHash);
        alert("Image Uploaded : Successfully !");
        setFileName("No image Selected");
        setFile(null);
      } catch (error) {
        alert("Unable to upload image to pinata");
      }
    }
  };

  const retrieveFile = (event) => {
    const data = event.target.files[0];
    //iterate
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(event.target.files[0]);
    };
    //console.log(event.target.files[0].name);
    setFileName(event.target.files[0].name);
    event.preventDefault();
  };
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Select Images
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {FileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
