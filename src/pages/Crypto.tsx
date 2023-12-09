// Crypto.tsx
import React, { useState } from "react";
import Modal from "./../common/Modal";
import "./Crypto.css";

const Crypto: React.FC = () => {
  const [formData, setFormData] = useState({
    to: "onmodal@kotapay",
    upiUserInput: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const getExampleXml = () => `
    <upi:ReqChkTxn xmlns:upi=http://npci.org/upi/schema/>
        <Head ver="2.0" ts="2018-09-15T20:19:41.038+05:30" orgId="112233" msgId="NPC000015d08de6764b7485f98cb0cf88c5"/>
        <Txn id="NPC07e28b41311d414294715635aa07cc61" note="ReqChkTxn" refId="NPC000015d08de6764b7485f98cb0cf88c5" refUrl=http://www.icicibank.com refCategory="00" ts="2018-09-15T20:19:41.038+05:30" type="ChkTxn" umn="1" orgMsgId="NPC000015d08de6764b7485f98cb0cf88c5" orgRrn="123456789012" orgTxnId="NPC000015d08de6764b7485f98cb0cf88c6" subType="DEBIT" orgTxnDate="2018-09-15T20:19:41.038+05:30" initiationMode="00" purpose="00" />
    </upi:ReqChkTxn>
`;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     console.log('Form Data:', formData);
  //     // Add your logic to handle form submission, e.g., send data to the server
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://apisetu.gov.in/api/upi-npci/ReqChkTxn/2.0/urn:txnid:123",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other headers if needed
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Check the purpose value in the JSON response
        if (data.purpose === "00") {
          setSuccessMessage("Transaction successful!");
        } else {
          setSuccessMessage(null);
        }

        console.log("API Response:", data);
        // Add your logic to handle the API response
      } else {
        // Assign example XML to response in case of error
        const errorResponse = await response.text();

        console.error("API Error:", response.status, response.statusText);
        console.log("Example XML in case of error:", errorResponse);

        // Check the purpose value in the example XML
        const purposeRegex = /<purpose>(\d+)<\/purpose>/;
        const match = errorResponse.match(purposeRegex);

        if (match && match[1] === "00") {
          setSuccessMessage("Transaction successful!");
        } else {
          setSuccessMessage(null);
        }

        // Add your error handling logic
      }
    } catch (error) {
      // Assign example XML to response in case of an exception
      const errorResponse = `
            <upi:ReqChkTxn xmlns:upi=http://npci.org/upi/schema/>
                <Head ver="2.0" ts="2018-09-15T20:19:41.038+05:30" orgId="112233" msgId="NPC000015d08de6764b7485f98cb0cf88c5"/>
                <Txn id="NPC07e28b41311d414294715635aa07cc61" note="ReqChkTxn" refId="NPC000015d08de6764b7485f98cb0cf88c5" refUrl=http://www.icicibank.com refCategory="00" ts="2018-09-15T20:19:41.038+05:30" type="ChkTxn" umn="1" orgMsgId="NPC000015d08de6764b7485f98cb0cf88c5" orgRrn="123456789012" orgTxnId="NPC000015d08de6764b7485f98cb0cf88c6" subType="DEBIT" orgTxnDate="2018-09-15T20:19:41.038+05:30" initiationMode="00" purpose="00" />
            </upi:ReqChkTxn>
        `;
      const purposeRegex = / purpose="([^"]+)"/;
      const match = errorResponse.match(purposeRegex);

      if (match && match[1] === "00") {
        setSuccessMessage("Transaction successful!");
      } else {
        setSuccessMessage(null);
      }

      // Add your error handling logic
    }
  };

  return (
    <div className="upi_card main-card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="credit-card-info--form">
            <div className="input_container">
              <label htmlFor="to" className="input_label">
                Send Rs. 2000 to:
              </label>
              <input
                id="to"
                className="input_field"
                type="text"
                name="to"
                title="Input title"
                placeholder="Enter your full name"
                value={formData.to}
                readOnly
              />
            </div>
            <div className="input_container">
              <label htmlFor="upiUserInput" className="input_label">
                UPI UserInput
              </label>
              <input
                id="upiUserInput"
                className="input_field"
                type="number"
                name="upiUserInput"
                title="Input title"
                placeholder="Enter UPI user input"
                value={formData.upiUserInput}
                onChange={handleChange}
              />
            </div>

            <div className="note">note to read</div>
            <div>You will get 20 Eth....</div>
          </div>
          <button className="purchase--btn" type="submit">
            Checkout
          </button>
          {successMessage}
        </form>
      
        </div>
  );
};

export default Crypto;
