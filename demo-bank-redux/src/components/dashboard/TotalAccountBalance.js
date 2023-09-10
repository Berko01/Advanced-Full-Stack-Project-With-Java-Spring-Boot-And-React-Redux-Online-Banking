import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as accountActions from "../../redux/actions/accountActions";

function preventDefault(event) {
  event.preventDefault();
}

function TotalAccountBalance(props) {
  const [totalAccountBalance, setTotalAccountBalance] = useState("0");
  const [currentDate, setCurrentDate] = useState("");

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const accessToken = userInfo.access_token;

  useEffect(() => {
    props.actions.getTotalBalance();

    const apiUrl = "http://127.0.0.1:8070/app/dashboard";
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer: " + accessToken
        },
      })
      .then((response) => {
        setTotalAccountBalance(response.data.totalBalance);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Güncel tarihi oluşturun ve formatlayın
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'long' })}, ${now.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, [props.actions]);

  return (
    <React.Fragment >
      <Title>Total Account Balance</Title>
      <Typography component="p" variant="h4">
        {props.totalBalance}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {currentDate}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getAccounts: bindActionCreators(accountActions.getAccounts, dispatch),
      changeAccount: bindActionCreators(accountActions.changeAccount, dispatch),
      getTotalBalance: bindActionCreators(accountActions.getTotalBalance, dispatch)
    },
  };
}

function mapStateToProps(state) {
  return {
    currentAccount: state.changeAccountReducer,
    accounts: state.accountListReducer,
    totalBalance: state.totalBalanceReducer,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalAccountBalance);