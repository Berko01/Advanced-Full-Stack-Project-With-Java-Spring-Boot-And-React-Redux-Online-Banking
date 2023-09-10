import Login from "../login/Login";
import Register from "../register/Register";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard"

function App() {
  return (
    <div>
      <BrowserRouter className="App" id="light">
        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
