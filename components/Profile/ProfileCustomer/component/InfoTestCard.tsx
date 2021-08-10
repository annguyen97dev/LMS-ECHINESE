import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { dataService } from "../../../../lib/customer/dataCustomer";
import { examAppointmentResultApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import moment from "moment";

const InfoTestCard = (props) => {
  const id = props.id;
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: null,
    status: false,
  })
  const [exam, setExam] = useState<IExamAppointmentResult[]>([]);

  const getExamAppointmentResult = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true
    })
    try {
      let res = await examAppointmentResultApi.getWithUserInformationID(id);
      if(res.status == 200) {
        let arr = [];    
        arr.push(res.data.data);
        setExam(arr);
      }
      if(res.status == 204) {
        showNoti("danger", "Không tim thấy dữ liệu");
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false
      })
    }
  }

  const columns = [
    { 
      title: "Thời gian", 
      dataIndex: "CreatedOn", 
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    { title: "Listening", dataIndex: "ListeningPoint" },
    { title: "Speaking", dataIndex: "SpeakingPoint" },
    { title: "Reading", dataIndex: "ReadingPoint" },
    { title: "Writing", dataIndex: "WritingPoint" },
    { title: "Người tư vấn", dataIndex: "CounselorsName" },
    // { title: "Vocab", dataIndex: "" },
    // { title: "Học phí tư vấn", dataIndex: "cost" },
    { title: "Giáo viên test", dataIndex: "TeacherName" },
    // { title: "Ghi chú", dataIndex: "fnReward" },
  ];

  useEffect(() => {
    getExamAppointmentResult();
  }, []);

  return (
    <>
      <PowerTable
        loading={isLoading}
        dataSource={exam}
        columns={columns}
        addClass="basic-header"
        Extra={<h5>Chi tiết bài test</h5>}
      />
    </>
  );
};
export default InfoTestCard;
