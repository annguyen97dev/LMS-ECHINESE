import React from "react";
import PowerTable from "~/components/PowerTable";
import { dataService } from "../../../../lib/customer/dataCustomer";

const InfoTestCard = () => {
  const columns = [
    { title: "Thời gian", dataIndex: "regDate" },
    { title: "Listening", dataIndex: "listening" },
    { title: "Speaking", dataIndex: "speaking" },
    { title: "Reading", dataIndex: "reading" },
    { title: "Writing", dataIndex: "writing" },
    { title: "Người tư vấn", dataIndex: "apmConsultant" },
    { title: "Vocab", dataIndex: "" },
    { title: "Học phí tư vấn", dataIndex: "cost" },
    { title: "Giáo viên test", dataIndex: "rpLeader" },
    { title: "Ghi chú", dataIndex: "fnReward" },
  ];
  return (
    <>
      <PowerTable
        dataSource={dataService}
        columns={columns}
        Extra={<h5>Chi tiết bài test</h5>}
      />
    </>
  );
};
export default InfoTestCard;
