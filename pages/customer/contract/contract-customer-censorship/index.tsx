import React, { useState } from "react";
import ExpandTable from "~/components/ExpandTable";
import { Edit, Printer } from "react-feather";
import { Switch, Tooltip } from "antd";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";

export default function ContractCensorship() {
  const expandedRowRender = () => {
    <></>;
  };

  const columns = [
    {
      title: "Học viên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    { title: "Khóa học", dataIndex: "rpCourse", ...FilterColumn("rpCourse") },
    {
      title: "Trạng thái",
      dataIndex: "censorShipStatus",
      render: () => {
        const [censorShipStatus, setCensorShipStatus] =
          useState("Not accepted");
        function onChange(checked) {
          if (checked == true) {
            setCensorShipStatus("Accepted");
          } else setCensorShipStatus("Not accepted");
        }
        return (
          <>
            {censorShipStatus == "Accepted" ? (
              <span className="tag green">{censorShipStatus}</span>
            ) : (
              <span className="tag red">{censorShipStatus}</span>
            )}

            <Switch onChange={onChange} />
          </>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "testDate",
      ...FilterDateColumn("testDate"),
    },
    {
      title: "Người tạo",
      dataIndex: "apmConsultant",
      ...FilterColumn("apmConsultant"),
    },
    {
      title: "",
      render: () => (
        <>
          <Tooltip title="Chỉnh sửa">
            <button className="btn btn-icon exchange">
              <Edit />
            </button>
          </Tooltip>
          <Tooltip title="In hợp đồng">
            <button className="btn btn-icon">
              <Printer />
            </button>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <ExpandTable
      addClass="basic-header"
      TitlePage="Duyệt hợp đồng học viên"
      TitleCard={<StudyTimeForm showAdd={true} />}
      dataSource={dataService}
      columns={columns}
      expandable={{ expandedRowRender }}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={dataService} />
        </div>
      }
    />
  );
}

ContractCensorship.layout = LayoutBase;
