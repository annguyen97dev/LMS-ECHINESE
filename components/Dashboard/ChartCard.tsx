import React, { useState, useEffect } from "react";
import AreaCard from "./ChartCard/AreaCard";
import LineCard from "./ChartCard/LineCard";
import ModelCard from "./ChartCard/ModelCard";
import RippleCard from "./ChartCard/RippleCard";
import { data } from "./data";

import Widget from "./Widget";

const ChartCard = ({
  prize,
  title,
  children,
  styleName,
  percent,
  statisticalTotal,
  typeChart,
}) => {
  const [dataSource, setDataSource] = useState({
    current: 0,
    pre: 0,
    percent: 0,
    styleName: "",
  });
  const [dataChart, setDataChart] = useState([]);

  const renderChart = () => {
    switch (typeChart) {
      // real data: dataChart
      case 1:
        return <ModelCard dataCard={data} />;
      case 2:
        return <AreaCard dataCard={data} />;
      case 3:
        return <RippleCard dataCard={data} />;
      case 4:
        return <LineCard dataCard={data} />;

      default:
        break;
    }
  };
  const handleCalculation = (preValue, currentValue) => {
    let percent = 0;
    if (currentValue === 0 && preValue === 0) {
      setDataSource({
        ...dataSource,
        percent: 0,
        styleName: "up",
        pre: preValue,
        current: currentValue,
      });
      setDataChart([
        { name: "Last month", price: preValue },
        { name: "This month", price: currentValue },
      ]);
    } else if (preValue === 0) {
      setDataSource({
        ...dataSource,
        percent: 100,
        styleName: "up",
        pre: preValue,
        current: currentValue,
      });
      setDataChart([
        { name: "Last month", price: preValue },
        { name: "This month", price: currentValue },
      ]);
    } else if (currentValue === 0) {
      setDataSource({
        ...dataSource,
        percent: 100,
        styleName: "down",
        pre: preValue,
        current: currentValue,
      });
      setDataChart([
        { name: "Last month", price: preValue },
        { name: "This month", price: currentValue },
      ]);
    } else if (currentValue > preValue) {
      percent = Math.round(((currentValue - preValue) / preValue) * 100);
      setDataSource({
        ...dataSource,
        percent: percent,
        styleName: "up",
        pre: preValue,
        current: currentValue,
      });
      setDataChart([
        { name: "Last month", price: preValue },
        { name: "This month", price: currentValue },
      ]);
    } else if (currentValue < preValue) {
      percent = Math.round(((preValue - currentValue) / preValue) * 100);
      setDataSource({
        // ...dataSource,s
        percent: percent,
        styleName: "down",
        pre: preValue,
        current: currentValue,
      });
      setDataChart([
        { name: "Last month", price: preValue },
        { name: "This month", price: currentValue },
      ]);
    }
  };

  const handleDataSource = () => {
    switch (title) {
      case "H???c vi??n h???n test":
        handleCalculation(
          statisticalTotal.PreTestAppointment,
          statisticalTotal.TestAppointment
        );
        break;

      case "H???c vi??n ?????n test":
        handleCalculation(
          statisticalTotal.PreTestDone,
          statisticalTotal.TestDone
        );
        break;

      case "H???c vi??n h???n ????ng k??":
        handleCalculation(
          statisticalTotal.PreRegisterAppointment,
          statisticalTotal.RegisterAppointment
        );
        break;

      case "H???c vi??n ??ang h???c":
        handleCalculation(
          Number(statisticalTotal.PreStudying),
          Number(statisticalTotal.Studying)
        );
        break;

      case "H???c vi??n ????ng k??":
        handleCalculation(
          Number(statisticalTotal.PreCustomer),
          Number(statisticalTotal.Customer)
        );
        break;

      case "B??i t???p ???? n???p":
        handleCalculation(0, Number(statisticalTotal.Submittopic));

      case "B??i ???? ch???m":
        handleCalculation(0, Number(statisticalTotal.Marktopic));
        break;

      case "B??i kh??ng ?????t":
        handleCalculation(0, Number(statisticalTotal.Remaketopic));
        break;

      case "H???c vi??n b???o l??u":
        handleCalculation(
          statisticalTotal.Prereserve,
          statisticalTotal.Reserve
        );
        break;

      case "H???c vi??n chuy???n kh??a":
        handleCalculation(
          statisticalTotal.PreChangecourse,
          statisticalTotal.Changecourse
        );
        break;

      case "Gi??o vi??n":
        handleCalculation(
          statisticalTotal.PreTeacher,
          statisticalTotal.Teacher
        );
        break;

      case "Nh??n vi??n":
        handleCalculation(
          statisticalTotal.PreEmployee,
          statisticalTotal.Employee
        );
        break;

      default:
        break;
    }
  };
  useEffect(() => {
    handleDataSource();
  }, [statisticalTotal]);

  return (
    <div className="style-card">
      <Widget styleName="gx-card-full dashboard__chart-container">
        <div className="row">
          <div className="col-12">
            <h6 className="dashboard__chart-title">{title}</h6>
          </div>
        </div>
        <div className="row ">
          <div className="col-4">
            <h4>{dataSource.current}</h4>
          </div>
          <div className="col-8 d-flex align justify-content-between align-items-center">
            <b>
              <span
                className={`gx-mb-0 gx-ml-2 gx-pt-xl-2 gx-fs-lg gx-chart-${dataSource.styleName}`}
              >
                {dataSource.percent}%{" "}
                <i className={`fas fa-angle-${dataSource.styleName}`}></i>
              </span>
            </b>
          </div>
        </div>
        {renderChart()}
        {/* {<ModelCard dataCard={dataChart} />} */}
      </Widget>
    </div>
  );
};

export default ChartCard;
