import React, { FC, Fragment, useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import randomColor from "randomcolor";
import { Tag, Tooltip, message } from "antd";
import { Info, RotateCcw } from "react-feather";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import Link from "next/link";
import LayoutBase from "~/components/LayoutBase";
import { classApi, branchApi, courseApi, roomApi } from "~/apiBase";

import is from "date-fns/esm/locale/is/index.js";
import { useWrap } from "~/context/wrap";
import ClassForm from "~/components/Global/Option/ClassModal";
import ClassModal from "~/components/Global/Option/ClassModal";

const Programs = () => {
  const [center, setCenter] = useState<IBranch[]>([]);
  const [dataCourse, setDataCourse] = useState<ICourse[]>([]);
  const [dataSource, setDataSource] = useState<IClass[]>([]);
  const [dataRoom, setDataRoom] = useState([]);
  const [ClassForm, setClassForm] = useState(false);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });

  const { showNoti } = useWrap();
  //get data Class

  const getAllData = (page: number) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    (async () => {
      try {
        const res = await classApi.getAll(page);

        res.status == 200 && setDataSource(res.data.data);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "GET_ALL",
          status: false,
        });
      }
    })();
  };

  // GET ALL BRANCH
  const getAllBranch = () => {
    (async () => {
      try {
        const res = await branchApi.getAll();

        res.status == 200 && setCenter(res.data.createAcc);
      } catch (error) {
        showNoti("danger", error.message);
      }
    })();
  };

  // GET ROOM
  const getRoom = (id: number) => {
    (async () => {
      try {
        const res = await roomApi.getWithID(id);
        res.status == 200 && setDataRoom(res.data.createAcc);
      } catch (error) {
        showNoti("danger", error.message);
      }
    })();
  };

  // GET DATA COURSE
  const getAllCourse = () => {
    (async () => {
      try {
        let res = await courseApi.getAll();
        res.status == 200 && setDataCourse(res.data.acc);
      } catch (error) {
        showNoti("danger", error.message);
      }
    })();
  };

  // SHOW MODAL AND GET ALL BRANCH
  const startShowModal = () => {
    getAllBranch();
    getAllCourse();
  };

  useEffect(() => {
    getAllData(1);
  }, []);

  const columns = [
    {
      title: "Khóa học",
      dataIndex: "ListCourseName",
      ...FilterColumn("ListCourseName"),
      render: (ListCourseName) => {
        return <p className="font-weight-black">{ListCourseName}</p>;
      },
    },
    {
      title: "Tên lớp",
      dataIndex: "ListClassName",
      ...FilterColumn("ListClassName"),
      render: (ListClassName) => {
        return <p className="font-weight-blue">{ListClassName}</p>;
      },
    },
    {
      title: "Học phí",
      dataIndex: "Price",
      ...FilterColumn("Price"),
      render: (Price) => {
        return <p className="font-weight-black">{Price}</p>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "Type",
      ...FilterColumn("Type"),
      render: (Type) => <span className="tag green">{Type}</span>,
    },

    {
      title: "ModifiedBy",
      dataIndex: "ModifiedBy",
      ...FilterColumn("ModifiedBy"),
    },
    {
      title: "ModifiedOn",
      dataIndex: "ModifiedOn",
      ...FilterColumn("ModifiedOn"),
    },

    {
      render: (value, record) => (
        <>
          <Link
            href={{
              pathname: "/option/program/program-detail/[slug]",
              query: { slug: record.ListClassName },
            }}
          >
            <Tooltip title="Chi tiết chương trình">
              <button className="btn btn-icon">
                <Info />
              </button>
            </Tooltip>
          </Link>

          <Tooltip title="Cập nhật lớp học">
            <button
              className="btn btn-icon edit"
              onClick={() => setClassForm(true)}
            >
              <RotateCcw />
            </button>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Fragment>
      <PowerTable
        loading={isLoading}
        addClass="basic-header"
        TitlePage="Danh sách chương trình"
        TitleCard={
          <ClassModal
            getRoom={(id: number) => getRoom(id)}
            dataRoom={dataRoom}
            dataCourse={dataCourse}
            dataBranch={center}
            showAdd={true}
            isLoading={isLoading}
            startShowModal={startShowModal}
          />
        }
        dataSource={dataSource}
        columns={columns}
        Extra={
          <div className="extra-table">
            <FilterTable />
            <SortBox />
          </div>
        }
      />

      {/* <ClassForm visible={ClassForm} onCancel={() => setClassForm(false)} /> */}
    </Fragment>
  );
};
Programs.layout = LayoutBase;
export default Programs;
