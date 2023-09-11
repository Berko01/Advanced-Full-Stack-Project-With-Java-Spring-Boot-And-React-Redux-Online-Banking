import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as accountActions from "../../redux/actions/accountActions";

function Chart(props) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Redux üzerinden verileri alın ve işleyin
    const processData = () => {
      const data = props.transactHistory
        .filter(
          (item) =>
            item.status !== "failed" && item.transaction_type !== "Transfer"
        )
        .sort((a, b) => a.transaction_id - b.transaction_id) // Transaction Id'ye göre sırala
        .map((item) => ({
          time: dateFormatter(item.created_at),
          amount: calculateTotalAmount(item),
        }))
        .slice(-9); // Sadece son 9 veriyi al

      setChartData(data);
    };

    processData();
  }, [props.transactHistory]);

  function dateFormatter(dateArray) {
    const [year, month, day] = dateArray;
    return `${month}-${day}`;
  }

  function calculateTotalAmount(item) {
    return item.transaction_type === "deposit" ? item.amount : -item.amount;
  }

  return (
    <div>
      <h2>Transaction History Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    transactHistory: state.transactionHistoryReducer,
  };
}

export default connect(mapStateToProps)(Chart);






