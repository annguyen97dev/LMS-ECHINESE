import React from "react";
import TitlePage from "~/components/TitlePage";
import ExpandTable from "~/components/ExpandTable";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import { ExpandBoxService } from "~/components/Elements/ExpandBox";
import RefundForm from "~/components/Global/Customer/Finance/RefundForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
FinanceRefund.layout = LayoutBase;
export default function FinanceRefund() {
  const expandedRowRender = () => <ExpandBoxService />;

  const columns = [
    { title: "Trung tâm", dataIndex: "center", ...FilterColumn("center") },
    {
      title: "Học viên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    { title: "Nguồn", dataIndex: "source", ...FilterColumn("source") },
    { title: "Số điện thoại", dataIndex: "tel", ...FilterColumn("tel") },
    {
      title: "Số tiền",
      dataIndex: "cost",
      ...FilterColumn("cost"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Trạng thái",
      dataIndex: "fnStatus",
      align: "center",
      render: (fnStatus) => {
        return (
          <>
            {fnStatus == "Duyệt" ? (
              <span className="tag green">{fnStatus}</span>
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
          text: "Chưa duyệt",
          value: "Chưa duyệt",
        },
      ],
      onFilter: (value, record) => record.fnStatus.indexOf(value) === 0,
    },
    {
      title: "",
      render: () => (
        <>
          <RefundForm />
        </>
      ),
    },
  ];

  return (
    <ExpandTable
      addClass="basic-header"
      TitlePage="Danh sách yêu cầu hoàn tiền"
      dataSource={dataService}
      TitleCard={<StudyTimeForm showAdd={true} />}
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
