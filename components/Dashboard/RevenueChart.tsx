import React, { useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Brush,
  LineChart,
} from "recharts";
import { Card, Radio } from "antd";
import { data, data2 } from "./data";

const RevenueChart = () => {
  const [typeView, setTypeView] = useState(true);
  const onChange = (e) => {
    setTypeView(e.target.value);
    console.log(typeView);
  };
  return (
    <>
      <Card
        title={<h4>BIỂU ĐỒ DOANH THU</h4>}
        style={{ borderRadius: 20 }}
        extra={
          <Radio.Group
            onChange={onChange}
            optionType="button"
            buttonStyle="solid"
            value={typeView}
          >
            <Radio.Button value={true}>Tháng</Radio.Button>
            <Radio.Button value={false}>Năm</Radio.Button>
          </Radio.Group>
        }
      >
        <ResponsiveContainer width="100%" height={280}>
          {typeView ? (
            <LineChart
              data={data}
              syncId="anyId"
              margin={{ top: 10, right: 0, left: -15, bottom: 0 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line
                type="natural"
                dataKey="price"
                stroke="#003366"
                fill="#003366"
              />
            </LineChart>
          ) : (
            <ComposedChart
              data={data2}
              margin={{ top: 10, right: 0, left: -15, bottom: 0 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Bar dataKey="uv" barSize={20} fill="#0080FF" />
              <Line type="monotone" dataKey="uv" stroke="#003366" />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </Card>
    </>
  );
};

export default RevenueChart;
