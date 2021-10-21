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

const RippleCard = ({ dataCard }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height={75}>
        <AreaChart
          data={dataCard}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="color5" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e81a24" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FEEADA" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <Area
            dataKey="price"
            strokeWidth={0}
            stackId="2"
            stroke="#FEEADA"
            fill="url(#color5)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};
export default RippleCard;
