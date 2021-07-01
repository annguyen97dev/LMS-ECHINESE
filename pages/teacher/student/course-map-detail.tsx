import React from "react";
import { Steps, Button, message, Card } from "antd";
const { Step } = Steps;
import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";
const CourseMapDetail = () => {
  return (
    <div className="container-fluid course-map-detail">
      <div className="row">
        <div className="col-12">
          <TitlePage title="Chi tiết lộ trình học" />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Card style={{ height: 300 }}>
            <div className="row justify-content-center">
              <div className="col-2">
                <table
                  className="first-card w-100"
                  style={{ backgroundColor: "#F25767" }}
                >
                  <tr className="first-row">
                    <td colSpan={4}>GN</td>
                  </tr>
                  <tr>
                    <td>1A</td>
                    <td>1B</td>
                    <td>2A</td>
                    <td>2B</td>
                  </tr>
                  <tr className="last-row">
                    <td>1A</td>
                    <td>1B</td>
                    <td>2A</td>
                    <td>2B</td>
                  </tr>
                </table>
              </div>
              <div className="col-2">
                <table
                  style={{ backgroundColor: "GrayText" }}
                  className="w-100 second-card "
                >
                  <tr className="first-row">
                    <td colSpan={3}>TOEIC</td>
                  </tr>
                  <tr>
                    <td>400</td>
                    <td>450</td>
                    <td>500</td>
                  </tr>
                  <tr className="last-row">
                    <td>1A</td>
                    <td>1B</td>
                    <td>2A</td>
                  </tr>
                </table>
              </div>
              <div className="col-2">
                <table
                  style={{ backgroundColor: "#10CA93" }}
                  className="w-100 third-card"
                >
                  <tr className="first-row">
                    <td colSpan={3}>TOEIC</td>
                  </tr>
                  <tr>
                    <td>550</td>
                    <td>600</td>
                    <td>650</td>
                  </tr>
                  <tr className="last-row">
                    <td>1A</td>
                    <td>1B</td>
                    <td>2A</td>
                  </tr>
                </table>
              </div>
              <div className="col-2">
                <table
                  style={{ backgroundColor: "#FF9F00" }}
                  className="w-100 fourth-card "
                >
                  <tr className="first-row">
                    <td colSpan={3}>TOEIC</td>
                  </tr>
                  <tr>
                    <td>700</td>
                    <td>750</td>
                    <td>800</td>
                  </tr>
                  <tr className="last-row">
                    <td>1A</td>
                    <td>1B</td>
                    <td>2A</td>
                  </tr>
                </table>
              </div>
              <div className="col-2">
                <table
                  style={{ backgroundColor: "#181C32" }}
                  className="w-100 last-card"
                >
                  <tr className="first-row">
                    <td colSpan={3}>TOEIC</td>
                  </tr>
                  <tr>
                    <td>850</td>
                    <td>900</td>
                    <td>950</td>
                  </tr>
                  <tr className="last-row">
                    <td>1A</td>
                    <td>1B</td>
                    <td>2A</td>
                  </tr>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

CourseMapDetail.layout = LayoutBase;
export default CourseMapDetail;
