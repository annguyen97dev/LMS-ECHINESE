import React, { useState, useEffect } from "react";
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
import { Card, Select, Button, Table } from "antd";
import { TableOutlined } from "@ant-design/icons";
import ExpandTable from "../ExpandTable";

const CourseChart = ({ setTodoApi, isLoading, todoApi, statisticalCourse }) => {
  const [typeView, setTypeView] = useState(5);
  const { Option } = Select;
  const [rowTotal, setRowTotal] = useState({
    Month: "Total",
    CompletedClass: 0,
    OnGoingClass: 0,
    PlannedClass: 0,
    RepeatedCustomer: 0,
    UniqueCustomer: 0,
  });
  const [dataSource, setDataSource] = useState(statisticalCourse);
  const formatYAxis = (tickItem) => {
    return new Intl.NumberFormat("de-DE").format(tickItem);
  };

  const formatTooltip = (value, name, props) => {
    return new Intl.NumberFormat("de-DE").format(value);
  };

  const formatLabel = (value) => {
    return `Tháng ${value}`;
  };

  const onChangeSelect = (value) => {
    setTypeView(value);
  };

  const renderTotal = () => {
    return (
      <>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart
            data={statisticalCourse}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <XAxis dataKey="Month" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip
              formatter={formatTooltip}
              label="tháng"
              labelFormatter={formatLabel}
            />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
              type="monotone"
              dataKey="CompletedClass"
              activeDot={{ r: 8 }}
              stroke="#0088FE"
              name="- Lớp học kết thúc trong tháng"
            />
            <Line
              type="monotone"
              dataKey="OnGoingClass"
              activeDot={{ r: 8 }}
              stroke="#003366"
              name="- Lớp học diễn ra trong tháng"
            />
            <Line
              type="monotone"
              dataKey="PlannedClass"
              activeDot={{ r: 8 }}
              stroke="#00C49F"
              name="- Lớp học dự kiến mở trong tháng"
            />
            <Line
              type="monotone"
              dataKey="RepeatedCustomer"
              activeDot={{ r: 8 }}
              stroke="#FFBB28"
              name="- Khách hàng sử dụng lại dịch vụ từ lần 2"
            />
            <Line
              type="monotone"
              dataKey="UniqueCustomer"
              activeDot={{ r: 8 }}
              stroke="#FF8042"
              name="- Khách hàng sử dụng dịch vụ lần đầu"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  };

  const renderDetail = () => {
    return (
      <>
        {typeView == 6 ? (
          renderTable()
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart
              data={statisticalCourse}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <XAxis dataKey="Month" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={formatTooltip}
                label="tháng"
                labelFormatter={formatLabel}
              />
              <CartesianGrid stroke="#f5f5f5" />
              {typeView == 0 && (
                <Line
                  type="monotone"
                  dataKey="CompletedClass"
                  activeDot={{ r: 8 }}
                  stroke="#0088FE"
                  name="- Lớp học kết thúc trong tháng"
                />
              )}
              {typeView == 1 && (
                <Line
                  type="monotone"
                  dataKey="OnGoingClass"
                  activeDot={{ r: 8 }}
                  stroke="#003366"
                  name="- Lớp học diễn ra trong tháng"
                />
              )}
              {typeView == 2 && (
                <Line
                  type="monotone"
                  dataKey="PlannedClass"
                  activeDot={{ r: 8 }}
                  stroke="#00C49F"
                  name="- Lớp học dự kiến mở trong tháng"
                />
              )}
              {typeView == 3 && (
                <Line
                  type="monotone"
                  dataKey="RepeatedCustomer"
                  activeDot={{ r: 8 }}
                  stroke="#FFBB28"
                  name="- Khách hàng sử dụng lại dịch vụ từ lần 2"
                />
              )}
              {typeView == 4 && (
                <Line
                  type="monotone"
                  dataKey="UniqueCustomer"
                  activeDot={{ r: 8 }}
                  stroke="#FF8042"
                  name="- Khách hàng sử dụng dịch vụ lần đầu"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </>
    );
  };

  const columns = [
    {
      title: "Tháng",
      dataIndex: "Month",
      key: "Month",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Lớp học kết thúc trong tháng",
      dataIndex: "CompletedClass",
      key: "CompletedClass",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Lớp học diễn ra trong tháng",
      dataIndex: "OnGoingClass",
      key: "OnGoingClass",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Lớp học dự kiến mở trong tháng",
      dataIndex: "PlannedClass",
      key: "PlannedClass",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Khách hàng sử dụng lại dịch vụ từ lần 2",
      dataIndex: "RepeatedCustomer",
      key: "RepeatedCustomer",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Khách hàng sử dụng dịch vụ lần đầu",
      dataIndex: "UniqueCustomer",
      key: "UniqueCustomer",
      render: (text) => <a>{text}</a>,
    },
  ];

  const handleSetRowTotal = () => {
    setRowTotal({
      Month: "Total",
      CompletedClass: statisticalCourse?.reduce(
        (a, b) => a + b.CompletedClass,
        0
      ),
      OnGoingClass: statisticalCourse?.reduce((a, b) => a + b.OnGoingClass, 0),
      PlannedClass: statisticalCourse?.reduce((a, b) => a + b.PlannedClass, 0),
      RepeatedCustomer: statisticalCourse?.reduce(
        (a, b) => a + b.RepeatedCustomer,
        0
      ),
      UniqueCustomer: statisticalCourse?.reduce(
        (a, b) => a + b.UniqueCustomer,
        0
      ),
    });
  };
  const renderTable = () => {
    return (
      <>
        <ExpandTable
          columns={columns}
          dataSource={dataSource}
          pagination={{ current: 1, pageSize: 20 }}
          size="small"
        />
      </>
    );
  };

  useEffect(() => {
    handleSetRowTotal();
  }, [statisticalCourse]);

  useEffect(() => {
    console.log(rowTotal);
    setDataSource([...statisticalCourse, rowTotal]);
  }, [rowTotal]);

  useEffect(() => {
    console.log(dataSource);
  }, [dataSource]);

  return (
    <>
      <Card
        title={<h4>BIỂU ĐỒ KHÓA HỌC</h4>}
        style={{ borderRadius: 20 }}
        extra={
          <div className="extra-table">
            <Select
              style={{ width: 280 }}
              onChange={onChangeSelect}
              value={typeView}
            >
              <Option value={0}>Lớp học kết thúc trong tháng</Option>
              <Option value={1}>Lớp học diễn ra trong tháng</Option>
              <Option value={2}>Lớp học dự kiến mở trong tháng</Option>
              <Option value={3}>Khách hàng sử dụng lại dịch vụ lần 2</Option>
              <Option value={4}>Khách hàng sử dụng dịch vụ lần đầu</Option>
              <Option value={5}>Xem tất cả thống kê</Option>
              <Option value={6}>Bảng thống kê</Option>
            </Select>
            <Button
              className="ml-2"
              type="primary"
              onClick={() => {
                setTypeView(6);
              }}
            >
              <TableOutlined />
            </Button>
          </div>
        }
      >
        {typeView == 5 ? renderTotal() : renderDetail()}
      </Card>
    </>
  );
};
export default CourseChart;
