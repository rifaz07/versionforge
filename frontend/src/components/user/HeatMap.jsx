import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 50),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

const getPanelColors = (maxCount) => {
  const colors = { 0: "#161b22" }; 
  for (let i = 1; i <= maxCount; i++) {
    const intensity = Math.floor((i / maxCount) * 255);
    colors[i] = `rgb(0, ${intensity}, 0)`;
  }
  return colors;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;

    const data = generateActivityData(startDate, endDate);
    setActivityData(data);

    const maxCount = Math.max(...data.map((d) => d.count));
    setPanelColors(getPanelColors(maxCount));
  }, []);

  return (
    <div className="heatmap-wrapper">
      <h3>Contribution Activity</h3>
      <div className="heatmap-container">
        <HeatMap
          value={activityData}
          weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          startDate={new Date(`${new Date().getFullYear()}-01-01`)}
          rectSize={12}
          space={3}
          rectProps={{ rx: 2.5 }}
          panelColors={panelColors}
          style={{
            color: "#8b949e",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default HeatMapProfile;