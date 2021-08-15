import React, { useEffect, useState } from "react";
import { Button, Collapse, Divider, Tag } from "antd";
import PowerTable from "~/components/PowerTable";
import { dataService } from "../../../../lib/customer/dataCustomer";
import ExpandTable from "~/components/ExpandTable";
import { Info } from "react-feather";
import { courseStudentApi, rollUpApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import moment from "moment";
const expandedRowRender = () => {
  return (
    <>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic magni,
      obcaecati optio, autem sapiente itaque eligendi deleniti dolor cumque
      suscipit iste incidunt quasi eveniet a laborum! Amet exercitationem nisi
      aspernatur.
    </>
  );
};

const RollUpTable = (props) => {
  const { showNoti } = useWrap();
  const [rollUp, setRollUp] = useState([])

  const getRollUp = async () => {
    try {
      let res = await rollUpApi.getAll({CourseID: props.idCourse});
      if(res.status == 200) {
        setRollUp(res.data.data);
      }
      if(res.status == 204) {
        showNoti("danger", "Không tim thấy dữ liệu");
      }
    } catch (error) {
      showNoti("danger", error.message);
    }
  }

  const columns = [
    { title: "Ngày", dataIndex: "testDate" },
    { title: "Môn học", dataIndex: "pfSubject" },
    {
      title: "Học lực",
      dataIndex: "pfRank",
      render: (pfRank) => {
        let tag = pfRank == "Giỏi" ? "tag blue" : "tag red";
        if (pfRank == "Khá") {
          tag = "tag yellow";
        }
        return <span className={tag}>{pfRank}</span>;
      },
    },
    { title: "Giáo viên", dataIndex: "nameStudent" },
    {
      title: "Điểm danh",
      dataIndex: "pfRollCall",
      render: (pfRollCall) => {
        let tag = pfRollCall == "Có" ? "tag green" : "tag black";
        return (
          <span className={tag} key={pfRollCall}>
            {pfRollCall}
          </span>
        );
      },
    },
    { title: "Ghi chú" },
    { title: "Cảnh báo" },
  ];

  useEffect(() => {
    getRollUp();
  }, []);

  return (
    <PowerTable
    noScroll
    dataSource={rollUp}
    columns={columns}
    Extra={<h5>Điểm danh</h5>}
  />
  )
}

const InfoCourseCard = (props) => {
  const id = props.id;
  const { Panel } = Collapse;
  const [courseStudent, setCourseStudent] = useState<ICourseOfStudent[]>([]);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: null,
    status: false,
  })

  const getCourseStudent = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true
    })
    try {
      let res = await courseStudentApi.getAll({UserInformationID: id});
      if(res.status == 200) {
        setCourseStudent(res.data.data);
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



  const columns2 = [
    { title: "Nhóm bài", dataIndex: "pfSubject" },
    { title: "Ngày tạo", dataIndex: "testDate" },
    {
      title: "Trạng thái",
      dataIndex: "pfRollCall",
      render: (pfRollCall) => {
        let tag = pfRollCall == "Có" ? "tag green" : "tag black";

        return (
          <Tag className={tag} key={pfRollCall}>
            {pfRollCall}
          </Tag>
        );
      },
    },
    {
      title: "Điểm",
      dataIndex: "listening",

      render: (listening) => {
        return <span className="tag blue">{listening}</span>;
      },
    },
    {
      dataIndex: "",
      render: () => (
        <>
          <button className="btn btn-icon">
            <Info />
          </button>
        </>
      ),
    },
  ];
  const columns3 = [
    {
      title: "Exam",
      dataIndex: "pkgName",
    },

    {
      title: "Listening",
      dataIndex: "listening",
      render: (listening) => {
        return <span className="tag blue">{listening}</span>;
      },
    },
    {
      title: "Reading",
      dataIndex: "reading",
      render: (reading) => {
        return <span className="tag blue">{reading}</span>;
      },
    },
    {
      title: "Writing",
      dataIndex: "writing",
      render: (writing) => {
        return <span className="tag blue">{writing}</span>;
      },
    },
    {
      title: "Speaking",
      dataIndex: "speaking",
      render: (speaking) => {
        return <span className="tag blue">{speaking}</span>;
      },
    },
    {
      title: "Ghi chú",
    },
  ];

  useEffect(() => {
    getCourseStudent();
  }, [])

  return (
    <>
      <Collapse accordion>
        {courseStudent.map((item, index) => (
        <Panel
          header={item.BranchName}
          key={index}
        >
          <RollUpTable idCourse={item.ID}/>
          <Divider />

          <ExpandTable
            noScroll
            Extra={<h5>Bài tập</h5>}
            expandable={{ expandedRowRender }}
            dataSource={dataService}
            columns={columns2}
          />

          <Divider />

          <PowerTable
            noScroll
            dataSource={dataService}
            columns={columns3}
            Extra={<h5>Điểm thi</h5>}
          />
        </Panel>
        ))}
      </Collapse>
    </>
  );
};
export default InfoCourseCard;
