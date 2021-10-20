import moment from "moment";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { examAppointmentResultApi } from "~/apiBase";
import ExpandTable from "~/components/ExpandTable";
import { useWrap } from "~/context/wrap";

InfoTestCard.propTypes = {
  studentID: PropTypes.number,
};
InfoTestCard.defaultProps = {
  studentID: 0,
};
function InfoTestCard(props) {
  const { studentID } = props;
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: null,
    status: false,
  });
  const [exam, setExam] = useState<IExamAppointmentResult[]>(null);

  const getExamAppointmentResult = async () => {
    try {
      setIsLoading({
        type: "GET_ALL",
        status: true,
      });
      const res = await examAppointmentResultApi.getWithUserInformationID(
        studentID
      );
      if (res.status === 200) {
        setExam([res.data.data]);
      } else if (res.status === 204) {
        setExam([]);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  useEffect(() => {
    getExamAppointmentResult();
  }, []);

  const expandedRowRender = (exam: IExamAppointmentResult) => {
    return (
      <p>
        <span className="font-weight-black">Ghi chú: </span>
        {exam.Note}
      </p>
    );
  };

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
    { title: "Giáo viên test", dataIndex: "TeacherName" },
  ];

  return (
    <>
      <ExpandTable
        loading={isLoading}
        dataSource={exam}
        columns={columns}
        addClass="basic-header"
        expandable={{ expandedRowRender }}
      />
    </>
  );
}
export default InfoTestCard;
