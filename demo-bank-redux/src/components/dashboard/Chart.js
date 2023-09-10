import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as accountActions from "../../redux/actions/accountActions";

function dateFormatter(dateArray) {
  const year = dateArray[0];
  const month = dateArray[1];
  const day = dateArray[2];

  return [year + ":" + month + ":" + day];
}

function Chart(props) {
  const [totalAccountRecord, setTotalAccountRecord] = useState([]);

  const [createdAtRecord, setCreatedAtRecord] = useState([]);

  const chartData = totalAccountRecord.map((total, index) => ({
    time: createdAtRecord[index],
    amount: total,
  }));

  function orderTransactionArray(array) {
    let totalAccount = 0;
    const createdAtRecord = [];
    const totalAccountRecord = [];

    array.forEach((item) => {
      if (item.status === "failed" || item.transaction_type === "Transfer") return;

      if (item.transaction_type === "deposit") {
        totalAccount += item.amount;
      } else {
        totalAccount -= item.amount;
      }

      totalAccountRecord.push(totalAccount);
      createdAtRecord.push(dateFormatter(item.created_at));
    });

    const lastNineAccountRecord = totalAccountRecord.slice(-9);
    const lastNineCreatedAtRecord = createdAtRecord.slice(-9);

    setTotalAccountRecord(lastNineAccountRecord );
    setCreatedAtRecord(lastNineCreatedAtRecord);
  }

  const getAccountTransactionHistory = async () => {
    orderTransactionArray(props.transactHistory);
  };

  useEffect(() => {
    // transactHistory propu değiştiğinde buraya gelecek olan kodları ekleyin
    orderTransactionArray(props.transactHistory);
  }, [props.transactHistory]);

  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Transaction History Chart</Title>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getAccounts: bindActionCreators(accountActions.getAccounts, dispatch),
      changeAccount: bindActionCreators(accountActions.changeAccount, dispatch),
      getTransactHistory: bindActionCreators(
        accountActions.getTransactionHistory,
        dispatch
      ),
    },
  };
}

function mapStateToProps(state) {
  return {
    currentAccount: state.changeAccountReducer,
    accounts: state.accountListReducer,
    transactHistory: state.transactionHistoryReducer,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
