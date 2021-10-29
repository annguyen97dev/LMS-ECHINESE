import React from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  XAxis,
  YAxis,
} from "recharts";

const LineCard = ({ dataCard }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height={75}>
        <LineChart
          data={dataCard}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <Line
            dataKey="price"
            stroke="#003366"
            dot={{ stroke: "#0080FF", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LineCard;
