import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "./page/landing";
import { Analytics } from "./page/analytics";
import axios from "axios";
import { useEffect, useState } from "react";
import { AnalyticsV2 } from "./page/analyticsv2";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
