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

const AreaCard = ({ dataCard }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height={75}>
        <AreaChart
          data={dataCard}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="color3" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#163469" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#FE9E15" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <Area
            dataKey="price"
            strokeWidth={0}
            stackId="2"
            stroke="#AEB404"
            fill="url(#color3)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};
export default AreaCard;
