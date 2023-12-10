import React, { useState } from "react"
import lighthouse from "@lighthouse-web3/sdk"
import './App.css'
import { ethers } from 'ethers';
// import fs from 'fs';
import {mintNFT} from './mintNFT.mjs'

function App() {
  const [file, setFile] = useState(null)
  const [mintMsg,setMintMsg]=useState("")

  // Define your API Key (should be replaced with secure environment variables in production)
  const apiKey = "530c7202.e2796d3c57ed49c78094efd6bb066da8"

  // Function to sign the authentication message using Wallet
  const signAuthMessage = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        if (accounts.length === 0) {
          throw new Error("No accounts returned from Wallet.")
        }
        const signerAddress = accounts[0]
        const { message } = (await lighthouse.getAuthMessage(signerAddress)).data
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, signerAddress],
        })
        return { signature, signerAddress }
      } catch (error) {
        console.error("Error signing message with Wallet", error)
        return null
      }
    } else {
      console.log("Please install Wallet!")
      return null
    }
  }

  // Function to upload the encrypted file
  const uploadEncryptedFile = async () => {
    if (!file) {
      console.error("No file selected.")
      return
    }

    try {
      // This signature is used for authentication with encryption nodes
      // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
      const encryptionAuth = await signAuthMessage()
      if (!encryptionAuth) {
        console.error("Failed to sign the message.")
        return
      }

      const { signature, signerAddress } = encryptionAuth

      // Upload file with encryption
      const output = await lighthouse.uploadEncrypted(
        file,
        apiKey,
        signerAddress,
        signature,
        () => { }
      )
      console.log("Encrypted File Status:", output)
      if(output){
        setMintMsg("File Uploaded successfully")
      }
      /* Sample Response
        {
          data: [
            Hash: "QmbMkjvpG4LjE5obPCcE6p79tqnfy6bzgYLBoeWx5PAcso",
            Name: "izanami.jpeg",
            Size: "174111"
          ]
        }
      */
      // If successful, log the URL for accessing the file
      console.log(
        `Decrypt at https://decrypt.mesh3.network/evm/${output.data[0].Hash}`
      )
    } catch (error) {
      console.error("Error uploading encrypted file:", error)
    }
  }

  // Function to handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const infuraProjectEndpoint = "0e4858b4811142ea923560c46cdab969"

// async function mintNFT() {
//     const provider = new ethers.JsonRpcProvider(`https://goerli.infura.io/v3/${infuraProjectEndpoint}`);
//     const signer = new ethers.Wallet('f73d60156cfa54d497c22e384253e2ce9fedc399f414088a798beea374273e56', provider);
//     const contractAddress = '0x2605429849FD4B82Efc4B1A62d51f397D2daCFD9';
//     const contractABI = JSON.parse(fs.readFileSync('./ABI.json').toString());

//     const contract = new ethers.Contract(contractAddress, contractABI, signer);
//     const tokenId = await contract.createNFT('QmQUTc5ooP6GZtKY2YdW4jJiSdzt2egBNPSmo43EuFPrgu');
//     console.log('NFT Minted, Token ID:', tokenId.toString());
// }

  return (
    <> <div className="App" style={{ backgroundImage: 'url("/landNft.png")', backgroundSize: 'cover', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="main-card kyc_card">

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <input type="file" onChange={handleFileChange} />
          <button onClick={uploadEncryptedFile} disabled={!file}>
            Upload Encrypted File
          </button>
        </div>
        {mintMsg && <>✅ {mintMsg}
        <br/>
        <button onClick={()=>{
          const token=  mintNFT;
          setMintMsg("NFT Minted Successfully!!!")
          }}>Mint NFT</button>
        </>}
      </div>
    </div>
    </>

  )
}

export default App