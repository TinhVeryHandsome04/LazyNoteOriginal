import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../src/components/ExpenseList";
import Home from "../src/pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
