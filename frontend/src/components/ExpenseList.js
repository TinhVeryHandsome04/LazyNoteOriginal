import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import "../style/index.css";

const Dashboard = () => {
  return (
    <div>
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <Outlet /> {}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
