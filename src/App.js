import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "./page/landing";
import axios from "axios";
import { useEffect, useState } from "react";
import { AnalyticsV2 } from "./page/analyticsv2";
import { Jobs } from "./page/jobs";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://34.29.1.39:8080/fetch");
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Landing data={data} />} />
          <Route path="analytics" element={<AnalyticsV2 data={data} />} />
          <Route path="jobs" element={<Jobs data={data} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
