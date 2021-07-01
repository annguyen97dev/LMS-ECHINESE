import React from "react";
import PowerTable from "~/components/PowerTable";
import { Eye } from "react-feather";
import { Tooltip } from "antd";
import { dataService } from "lib/customer/dataCustomer";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
ContractList.layout = LayoutBase;
export default function ContractList() {
  const columns = [
    {
      title: "Học viên",
      dataIndex: "nameStudent",
      ...FilterColumn("city"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    { title: "Khóa học", dataIndex: "rpCourse", ...FilterColumn("city") },
    {
      title: "Trạng thái",
      dataIndex: "cntStatus",
      render: (cntStatus) => {
        return (
          <>
            {cntStatus == "Đã có hợp đồng" ? (
              <span className="tag green">{cntStatus}</span>
            ) : (
              <span className="tag red">{cntStatus}</span>
            )}
          </>
        );
      },
      filters: [
        {
          text: "Đã có hợp đông",
          value: "Đã có hợp đông",
        },
        {
          text: "Chưa soạn hợp đông",
          value: "Chưa soạn hợp đông",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    { title: "Ngày tạo", dataIndex: "regDate", ...FilterDateColumn("city") },
    {
      title: "",
      render: () => (
        <>
          <Tooltip title="Xem chi tiết">
            <button className="btn btn-icon view">
              <Eye />
            </button>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Danh sách học viên có hợp đồng"
      TitleCard={<StudyTimeForm showAdd={true} />}
      dataSource={dataService}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={dataService} />
        </div>
      }
    />
  );
}
