import { Card } from "antd";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { data2 } from "./data";

const AcademicChart = () => {
  return (
    <>
      <Card
        title={
          <div>
            <h4>HỌC VIÊN</h4>
            <div>Số lượng học viên</div>
          </div>
        }
        style={{borderRadius: 20}}
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data2}
            margin={{ top: 10, right: 0, left: -15, bottom: 0 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="price" fill="#0080FF" name="Học viên đã đăng kí" />
            <Bar dataKey="uv" fill="#003366" name="Học viên đang theo học" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
};

export default AcademicChart;
