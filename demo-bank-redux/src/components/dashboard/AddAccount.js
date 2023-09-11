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

function AccountForm({ onSaveAccount, open = true, onClose, actions}) {
  const [accountInfo, setAccountInfo] = useState({
    accountName: "",
    accountType: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAccountInfo({
      ...accountInfo,
      [name]: value,
    });
  };

  const handleSaveAccount = async (event) => {
    event.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const accessToken = userInfo.access_token;

    const jsonData = {};

    jsonData["account_name"] = accountInfo.accountName;
    jsonData["account_type"] = accountInfo.accountType;

    console.log(jsonData);
    console.log(accessToken);

    try {
      const apiUrl = "http://127.0.0.1:8070/account/create_account";
      const response = await axios.post(apiUrl, jsonData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + accessToken, // JSON verisi göndermek için content type ayarı
        },
      });

      if (response.status === 200) {
        alertify.success("New account added.");
      }
    } catch (error) {
      // İstek başarısız olduğunda hata 
      alertify.error("Something went wrong");
    }

    actions.getAccounts();
    
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
          width: "300px", // Yan menünün genişliğini ayarla
          padding: "16px",
        }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        <Typography variant="h6" style={{ marginTop: "60px" }}>Add Account</Typography>
        <TextField
          style={{ marginTop: "60px" }}
          name="accountName"
          label="Account Name"
          value={accountInfo.accountName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          onClick={(event) => {
            // Tıklama olayını engelleme
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            // Klavye olaylarını engelleme
            event.stopPropagation();
          }}
        />
        <TextField
          name="accountType"
          label="Account Type"
          value={accountInfo.accountType}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          onClick={(event) => {
            // Tıklama olayını engelleme
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            // Klavye olaylarını engellemek
            event.stopPropagation();
          }}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAccount}
            sx={{ backgroundColor: "#EB3D13" }}
          >
            Create Account
          </Button>
        </Box>
      </div>
    </Drawer>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getAccounts: bindActionCreators(accountActions.getAccounts, dispatch)
    },
  };
}

export default connect(null,mapDispatchToProps)(AccountForm);
