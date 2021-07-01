import React from "react";
import ChartCard from "~/components/Dashboard/ChartCard";
import { increamentData, lineData, dataPie } from "../../lib/dashboard/data";
import TitlePage from "~/components/TitlePage";
import RevenueChart from "~/components/Dashboard/RevenueChart";
import AcademicChart from "~/components/Dashboard/AcademicChart";
import RateChart from "~/components/Dashboard/RateChart";
import AreaCard from "../../components/Dashboard/ChartCard/AreaCard";
import ModelCard from "../../components/Dashboard/ChartCard/ModelCard";
import RippleCard from "../../components/Dashboard/ChartCard/RippleCard";
import LineCard from "components/Dashboard/ChartCard/LineCard";

import LayoutBase from "~/components/LayoutBase";

const Dashboard = () => {
  console.log(dataPie);

  return (
    <div>
      <TitlePage title="Dashboard" />
      <div className="row">
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            prize="0"
            percent="100"
            styleName="down"
            title="Khóa học đang mở"
            children={<LineCard dataCard={increamentData} />}
          />
        </div>
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            title="Học viên đang học"
            prize="20"
            percent="88"
            children={<ModelCard dataCard={increamentData} />}
            styleName="up"
          />
        </div>
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            prize="3"
            percent="8"
            children={<RippleCard dataCard={increamentData} />}
            styleName="down"
            title="Học viên mới đăng kí"
          />
        </div>
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            prize="3"
            percent="10"
            children={<AreaCard dataCard={increamentData} />}
            styleName="down"
            title="Học viên hẹn đăng kí"
          />
        </div>
        <div className="col-md-2 col-sm-4 col-6">
          {" "}
          <ChartCard
            prize="12"
            percent="23"
            styleName="up"
            title="Học viên hẹn test"
            children={<ModelCard dataCard={increamentData} />}
          />
        </div>
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            title="Học viên đến test"
            prize="19"
            percent="45"
            children={<RippleCard dataCard={increamentData} />}
            styleName="up"
          />
        </div>
      </div>
      <div className="row pt-5">
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            prize="3"
            percent="8"
            children={<AreaCard dataCard={increamentData} />}
            styleName="up"
            title="Học viên đăng kí"
          />
        </div>
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            prize="40"
            percent="85"
            children={<LineCard dataCard={lineData} />}
            styleName="up"
            title="Học viên bảo lưu"
          />
        </div>
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            prize="12"
            percent="23"
            styleName="up"
            title="Bài tập đã nộp"
            children={<ModelCard dataCard={increamentData} />}
          />
        </div>
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            title="Bài đã chấm"
            prize="4"
            percent="90"
            children={<RippleCard dataCard={increamentData} />}
            styleName="down"
          />
        </div>
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            prize="100"
            percent="100"
            children={<AreaCard dataCard={increamentData} />}
            styleName="up"
            title="Bài không đạt"
          />
        </div>
        <div className="col-md-2 col-sm-4 col-6">
          <ChartCard
            prize="12"
            percent="47"
            children={<LineCard dataCard={lineData} />}
            styleName="up"
            title="Tỷ lệ lấp đầy phòng trống"
          />
        </div>
      </div>

      <div className="row pt-5">
        <div className="col-12">
          {" "}
          <RevenueChart />
        </div>
      </div>
      <div className="row pt-5 pb-5">
        <div className="col-md-8 col-12">
          <AcademicChart />
        </div>
        <div className="col-md-4 col-12">
          <div className="chart-comment">
            <RateChart dataPie={dataPie} />
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.layout = LayoutBase;

export default Dashboard;
