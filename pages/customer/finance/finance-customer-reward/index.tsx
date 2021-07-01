import React from "react";
import PowerTable from "~/components/PowerTable";
import { Image } from "antd";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import LayoutBase from "~/components/LayoutBase";
FinanceReward.layout = LayoutBase;
export default function FinanceReward() {
  const columns = [
    {
      title: "Học viên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    { title: "Số điện thoại", dataIndex: "tel", ...FilterColumn("tel") },
    { title: "Email", dataIndex: "email", ...FilterColumn("email") },
    {
      title: "Khen thưởng",
      dataIndex: "fnReward",
      align: "center",
      render: (fnReward) => {
        return (
          <>
            {fnReward == "Trao thưởng đạt đầu ra" ? (
              <span className="tag blue">{fnReward}</span>
            ) : (
              <span className="tag blue-weight">{fnReward}</span>
            )}
          </>
        );
      },
      filters: [
        {
          text: "Trao thưởng đạt đầu ra",
          value: "Trao thưởng đạt đầu ra",
        },
        {
          text: "Tài trợ thi lại",
          value: "Tài trợ thi lại",
        },
      ],
      onFilter: (value, record) => record.fnReward.indexOf(value) === 0,
    },
    {
      title: "Người tạo",
      dataIndex: "rpCreator",
      ...FilterColumn("rpCreator"),
    },
    {
      title: "Người duyệt",
      dataIndex: "rpLeader",
      ...FilterColumn("rpLeader"),
    },
    {
      title: "Điểm khóa học",
      dataIndex: "speaking",
    },
    {
      title: "Điểm đạt được",
      dataIndex: "overall",
    },
    {
      title: "Trạng thái",
      dataIndex: "fnStatus",
      align: "center",
      render: (fnStatus) => {
        return (
          <>
            {fnStatus == "Duyệt" ? (
              <span className="tag blue">{fnStatus}</span>
            ) : (
              <span className="tag red">{fnStatus}</span>
            )}
          </>
        );
      },
      filters: [
        {
          text: "Duyệt",
          value: "Duyệt",
        },
        {
          text: "Duyệt",
          value: "Duyệt",
        },
      ],
      onFilter: (value, record) => record.fnStatus.indexOf(value) === 0,
    },
    {
      title: "QR Code",
      render: () => (
        <>
          <Image alt="" />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      TitlePage="Danh sách khen thưởng"
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
