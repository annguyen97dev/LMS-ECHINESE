import React from "react";
import PropTypes from "prop-types";
import PowerTable from "~/components/PowerTable";
import SortBox from "~/components/Elements/SortBox";
import LayoutBase from "~/components/LayoutBase";
const CampaignSalesDetail = (props) => {
  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: 1,
      StudentName: "Nguyễn An",
      Course: "Phát âm cơ bản",
      Center: "Cơ sở quận 1",
      Price: "2.500.000 VNĐ",
      PriceLeft: "2.500.500 VNĐ",
      CreateDate: "25-06-2021",
    });
  }

  const columns = [
    {
      title: "Học viên",
      dataIndex: "StudentName",
      key: "studentname",
    },
    {
      title: "Khóa học",
      dataIndex: "Course",
      key: "coruse",
    },
    {
      title: "Trung tâm",
      dataIndex: "Center",
      key: "center",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "price",
    },
    {
      title: "Price Left",
      dataIndex: "PriceLef",
      key: "priceleft",
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "CreateDate",
      key: "createdate",
    },
  ];

  const dataOption = [
    {
      value: "a-z",
      text: "Student A - z",
    },
    {
      value: "z-a",
      text: "Student Z - A",
    },
    {
      value: "low",
      text: "Price Left(low) ",
    },
    {
      value: "hight",
      text: "Price Left(high)",
    },
  ];

  return (
    <>
      <PowerTable
        dataSource={dataSource}
        columns={columns}
        TitlePage={"Chi tiết chiến dịch sale"}
        Extra={
          <div className="extra-table">
            <SortBox dataOption={dataOption} />
          </div>
        }
      />
    </>
  );
};

CampaignSalesDetail.layout = LayoutBase;
export default CampaignSalesDetail;
