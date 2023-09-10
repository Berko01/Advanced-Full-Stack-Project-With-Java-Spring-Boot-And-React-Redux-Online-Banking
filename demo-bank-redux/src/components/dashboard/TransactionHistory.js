import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Button from "@mui/material/Button";

function TransactionHistory(props) {
  const [showAllAccounts, setShowAllAccounts] = useState(false);
  useEffect(() => {
    // transactHistory propu değiştiğinde buraya gelecek olan kodları ekleyin
  }, [props.transactHistory]);

  function dateFormatter(dateArray) {
    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2];

    return year + " : " + month + " : " + day;
  }

  return (
    <React.Fragment>
      <Title>Accounts History</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Transaction Id</TableCell>
            <TableCell>Account Id</TableCell>
            <TableCell>Transaction Type</TableCell>
            <TableCell>Amoun</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Reason Code</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.transactHistory
            .slice(0, showAllAccounts ? props.transactHistory.length : 15)
            .map((history) => (
              <TableRow key={history.transaction_id}>
                <TableCell>{history.transaction_id}</TableCell>
                <TableCell>{history.account_id}</TableCell>
                <TableCell>{history.transaction_type}</TableCell>
                <TableCell>{history.amount}</TableCell>
                <TableCell>{history.source}</TableCell>
                <TableCell>{`$${history.status}`}</TableCell>
                <TableCell>{history.reason_code}</TableCell>
                <TableCell>{dateFormatter(history.created_at)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Button onClick={() => setShowAllAccounts(!showAllAccounts)}>
        {showAllAccounts ? "Show Less Accounts" : "Show All Accounts"}
      </Button>
    </React.Fragment>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {},
  };
}

function mapStateToProps(state) {
  return {
    transactHistory: state.transactionHistoryReducer,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
