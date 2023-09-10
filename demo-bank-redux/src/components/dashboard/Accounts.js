import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as accountActions from "../../redux/actions/accountActions";
import Button from "@mui/material/Button";
import Transact from "./Transact";

function preventDefault(event) {
  event.preventDefault();
}

function Accounts(props) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveAccount = (accountInfo) => {
    console.log("Yeni hesap bilgileri:", accountInfo);
  };


  useEffect(() => {
    props.actions.getAccounts();
  }, [props.actions]);

  function dateFormatter(dateArray) {
    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2];

    return year + " : " + month + " : " + day;
  }

  return (
    <React.Fragment>
      <Title>Your Accounts {props.currentAccount.account_name}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Account Id</TableCell>
            <TableCell>Account Name</TableCell>
            <TableCell>Account Number</TableCell>
            <TableCell>Account Type</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell>Account Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.accounts.map((account) => (
            <TableRow
              onClick={() => {
                props.actions.changeAccount(account);
              }}
              key={account.account_id}
            >
              <TableCell>{account.account_id}</TableCell>
              <TableCell>{account.account_name}</TableCell>
              <TableCell>{account.account_number}</TableCell>
              <TableCell>{account.account_type}</TableCell>
              <TableCell>{account.user_id}</TableCell>
              <TableCell>{dateFormatter(account.updated_at)}</TableCell>
              <TableCell>{`$${account.balance}`}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsFormOpen(true)}
                  sx={{ backgroundColor: "#F5BD52" }}
                >
                  Transact
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Transact
                  onSaveAccount={handleSaveAccount}
                  open={isFormOpen}
                  onClose={() => setIsFormOpen(false)}
                  
                />
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more accounts
      </Link>
    </React.Fragment>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getAccounts: bindActionCreators(accountActions.getAccounts, dispatch),
      changeAccount: bindActionCreators(accountActions.changeAccount, dispatch),
    },
  };
}

function mapStateToProps(state) {
  return {
    currentAccount: state.changeAccountReducer,
    accounts: state.accountListReducer,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
