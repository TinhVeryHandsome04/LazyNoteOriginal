import { Link } from "react-router-dom";
import "../style/index.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
