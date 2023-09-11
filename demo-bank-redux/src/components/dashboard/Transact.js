import React, { useState } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import alertify from "alertifyjs";
import axios from "axios";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as accountActions from "../../redux/actions/accountActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function AccountForm({
  onSaveAccount,
  open = true,
  onClose,
  actions,
  currentAccount,
}) {
  const [amount, setAmount] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [accountInfo, setAccountInfo] = useState({
    transactionType: "", // Transaction Type seçim kutusu
    
  });
  const [paymentInfo, setPaymentInfo] = useState({
    beneficiary: "", // Transaction Type seçim kutusu
    account_number: "", // Transaction Type seçim kutusu
    reference: "", // Transaction Type seçim kutusu
    payment_amount: "", // Transaction Type seçim kutusu
    
  })

  const postRequestToApi = async (apiUrl, jsonData) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const accessToken = userInfo.access_token;

    try {
      const response = await axios.post(apiUrl, jsonData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + accessToken, // JSON verisi göndermek için content type ayarı
        },
      });

      if (response.status === 200) {
        alertify.success("Deposit transaction successfull.");
      }
    } catch (error) {
      alertify.error("Something went wrong");
    }

    actions.getAccounts();
    actions.getTotalBalance();
    actions.getTransactionHistory()

    onSaveAccount(accountInfo);
    onClose(); // Yan menüyü kapat
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });

    console.log(paymentInfo)
  };

  const handleTransactionTypeChange = (event) => {
    const { value } = event.target;
    setAccountInfo({
      ...accountInfo,
      transactionType: value,
    });
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleTargetAccountChange = (event) => {
    setTargetAccount(event.target.value);
  };

  const handleDepositMoney = async (event) => {
    event.preventDefault();

    const jsonData = {};

    jsonData["account_id"] = currentAccount.account_id;
    jsonData["deposit_amount"] = amount;

    const apiUrl = "http://127.0.0.1:8070/transact/deposit";

    postRequestToApi(apiUrl, jsonData);

    actions.getAccounts();
    actions.getTotalBalance();
    actions.getTransactionHistory()

    onSaveAccount(accountInfo);
    onClose(); // Yan menüyü kapat
  };

  const handleWithdrawMoney = (event) => {
    event.preventDefault();

    const jsonData = {};

    jsonData["account_id"] = currentAccount.account_id;
    jsonData["withdrawal_amount"] = amount;

    const apiUrl = "http://127.0.0.1:8070/transact/withdraw";

    postRequestToApi(apiUrl, jsonData);

    actions.getAccounts();
    actions.getTotalBalance();
    actions.getTransactionHistory()

    onSaveAccount(accountInfo);
    onClose(); // Yan menüyü kapat
  };

  const handleTransferMoney = (event) => {
    event.preventDefault();

    const jsonData = {};

    jsonData["sourceAccount"] = currentAccount.account_id;
    jsonData["targetAccount"] = targetAccount;
    jsonData["amount"] = amount;

    const apiUrl = "http://127.0.0.1:8070/transact/transfer";

    postRequestToApi(apiUrl, jsonData);

    actions.getAccounts();
    actions.getTotalBalance();
    actions.getTransactionHistory()

    onSaveAccount(accountInfo);
    onClose(); // Yan menüyü kapat
  };

  const handlePaymentTransaction = (event) => {
    event.preventDefault();

    const jsonData = {};

    paymentInfo["account_id"] = currentAccount.account_id;

    const apiUrl = "http://127.0.0.1:8070/transact/payment";

    postRequestToApi(apiUrl, paymentInfo);

    actions.getAccounts();
    actions.getTotalBalance();
    actions.getTransactionHistory()

    onSaveAccount(accountInfo);
    onClose(); // Yan menüyü kapat
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        disableScrollLock: true,
      }}
    >
      <div
        style={{
          width: "600px",
          padding: "16px",
        }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        <Typography variant="h6" style={{ marginTop: "60px" }}>
          Transaction
        </Typography>
        <Select
          name="transactionType"
          label="Transaction Type"
          value={accountInfo.transactionType}
          onChange={handleTransactionTypeChange}
          fullWidth
          margin="normal"
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <MenuItem value="Deposit Transaction">Deposit Transaction</MenuItem>
          <MenuItem value="Transfer Transaction">Transfer Transaction</MenuItem>
          <MenuItem value="Withdraw Transaction">Withdraw Transaction</MenuItem>
          <MenuItem value="Payment Transaction">Payment Transaction</MenuItem>
        </Select>

        {accountInfo.transactionType === "Deposit Transaction" ? (
          // Eğer "Deposit Transaction" seçildi ise bu TextField görüntülenir
          <>
            <TextField
              readonly
              disabled
              name="depositId"
              label="Account Id   "
              value={currentAccount.account_id}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />{" "}
            <TextField
              name="deposit_amount"
              label="Amount"
              value={accountInfo.additionalTextField1}
              onChange={handleAmountChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
            
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "#F5BD52" }}
              onClick={handleDepositMoney}
            >
              Transact
            </Button>

            <img src="card.jpg" alt="Deposit" style={{ marginTop: '100px', maxWidth: '100%', height: 'auto' }} />
          </>

          
        ) : null}

        {accountInfo.transactionType === "Transfer Transaction" ? (
          <>
            <TextField
              readonly
              disabled
              name="sourceAccountId"
              label="Source Account Id"
              value={currentAccount.account_id}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
            <TextField
              name="targetAccountId"
              label="Target Account Id"
              value={accountInfo.additionalTextField3}
              onChange={handleTargetAccountChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />{" "}
            <TextField
              name="transferAmount"
              label="Amount"
              value={accountInfo.additionalTextField3}
              onChange={handleAmountChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />{" "}
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "#F5BD52" }}
              onClick={handleTransferMoney}
            >
              Transact
            </Button>
            <img src="transact.jpg" alt="Deposit" style={{ marginTop: '100px', maxWidth: '100%', height: 'auto' }} />
          </>
          
        ) : null}

        {accountInfo.transactionType === "Withdraw Transaction" ? (
          <>
            {" "}
            <TextField
              readonly
              disabled
              name="withdrawId"
              label="Account Id"
              value={currentAccount.account_id}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
            <TextField
              name="withdraw_amount"
              label="Amount"
              value={accountInfo.additionalTextField5}
              onChange={handleAmountChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "#F5BD52" }}
              onClick={handleWithdrawMoney}
            >
              Transact
            </Button>

            <img src="transact.jpg" alt="Deposit" style={{ marginTop: '100px', maxWidth: '100%', height: 'auto' }} />
            
          </>
        ) : null}

        {accountInfo.transactionType === "Payment Transaction" ? (
          <>
            <TextField
              readonly
              disabled
              name="account_id"
              label="Account Id"
              value={currentAccount.account_id}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
            <TextField
              name="beneficiary"
              label="Beneficiary"
              value={accountInfo.additionalTextField7}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
                        <TextField
              name="account_number"
              label="Account Number"
              value={accountInfo.additionalTextField7}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
                        <TextField
              name="reference"
              label="Reference"
              value={accountInfo.additionalTextField7}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />
                        <TextField
              name="payment_amount"
              label="Account Number"
              value={accountInfo.additionalTextField7}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            />            <Button
            variant="contained"
            color="primary"
            sx={{ backgroundColor: "#F5BD52" }}
            onClick={handlePaymentTransaction}
          >
            Transact
          </Button>
            <img src="payment.jpg" alt="Deposit" style={{ marginTop: '100px', maxWidth: '100%', height: 'auto' }} />
          </>
        ) : null}

        <Box mt={2}></Box>
      </div>
    </Drawer>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getAccounts: bindActionCreators(accountActions.getAccounts, dispatch),
      getTotalBalance: bindActionCreators(accountActions.getTotalBalance,dispatch),
      getTransactionHistory: bindActionCreators(accountActions.getTransactionHistory,dispatch)
    },
  };
}

function mapStateToProps(state) {
  return {
    currentAccount: state.changeAccountReducer,
    
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountForm);
