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
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    props.actions.getTotalBalance();

    // Güncel tarih
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
      getTotalBalance: bindActionCreators(accountActions.getTotalBalance, dispatch)
    },
  };
}

function mapStateToProps(state) {
  return {
    totalBalance: state.totalBalanceReducer,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalAccountBalance);