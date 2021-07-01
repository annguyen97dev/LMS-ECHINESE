import { Card } from "antd";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF00FF"];

const RateChart = ({ dataPie }) => {
  return (
    <div>
      <Card
        title={
          <>
            <div>
              <h4>ĐÁNH GIÁ</h4>
            </div>
            <div>Biểu đồ thống kê lượt đánh giá của học viên</div>
          </>
        }
        style={{
          borderRadius: 20,
        }}
      >
        <div className="row">
          <div className="col-4 col-md-4 col-lg-4">
            <div className="detail-pieChart" style={{ paddingTop: 80 }}>
              <div>
                <i className="fas fa-circle" style={{ color: "#0088FE" }} />
                <span style={{ paddingLeft: 15, color: "#585858" }}>
                  5 <i className="fas fa-star" style={{ color: "#D7DF01" }} />{" "}
                  80%
                </span>
              </div>
              <div className="pt-2">
                <i className="fas fa-circle" style={{ color: "#00C49F" }} />
                <span style={{ paddingLeft: 15, color: "#585858" }}>
                  4 <i className="fas fa-star" style={{ color: "#D7DF01" }} />{" "}
                  20%
                </span>
              </div>
              <div className="pt-2">
                <i className="fas fa-circle" style={{ color: "#FFBB28" }} />
                <span style={{ paddingLeft: 15, color: "#585858" }}>
                  3 <i className="fas fa-star" style={{ color: "#D7DF01" }} />{" "}
                  10%
                </span>
              </div>
              <div className="pt-2">
                <i className="fas fa-circle" style={{ color: "#FF8042" }} />
                <span style={{ paddingLeft: 15, color: "#585858" }}>
                  2 <i className="fas fa-star" style={{ color: "#D7DF01" }} />{" "}
                  5%
                </span>
              </div>
              <div className="pt-2">
                <i className="fas fa-circle" style={{ color: "#FF00FF" }} />
                <span style={{ paddingLeft: 15, color: "#585858" }}>
                  1 <i className="fas fa-star" style={{ color: "#D7DF01" }} />
                  5%
                </span>
              </div>
            </div>
          </div>
          <div className="col-8 col-md-8 col-lg-8 pl-2">
            <ResponsiveContainer width="117%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={dataPie}
                  cx="35%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#003366"
                  paddingAngle={5}
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RateChart;
