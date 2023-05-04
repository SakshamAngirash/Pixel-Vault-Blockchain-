import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState(" ");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const Wallet = async () => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);

        window.ethereum.on("accountChanged", () => {
          window.location.reload();
        });
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(address);
        setAccount(address);

        //paste your live contract address here

        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(signer);
      } else {
        alert("METMASK DOWNLOAD Required !!!");
      }
    };
    provider && Wallet();
  }, []);

  return (
    <>
      <div class="theme">
        <nav>
          <div class="nav-left">
            <h1 class="heading">PIXEL VAULT</h1>
          </div>
          <div class="nav-right">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </div>
        </nav>
        <div className="App">
          <div class="lbutton">
            {!modalOpen && (
              <button
                className="share-button"
                onClick={() => setModalOpen(true)}
              >
                SHARE
              </button>
            )}
            {modalOpen && (
              <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
            )}
            <p class="acc">
              <b>ACCOUNT : {account ? account : "Not connected"}</b>
            </p>
          </div>

          <div class="bg"></div>
          <div class="bg bg2"></div>
          <div class="bg bg3"></div>
          <FileUpload
            account={account}
            provider={provider}
            contract={contract}
          ></FileUpload>

          <Display contract={contract} account={account}></Display>
        </div>
      </div>
    </>
  );
}

export default App;
