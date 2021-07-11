import React, { useEffect, useState, useReducer } from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption";
import { Tooltip, Switch } from "antd";
import GradeForm from "~/components/Global/Option/GradeForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import LayoutBase from "~/components/LayoutBase";
import { gradeApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { Trash2 } from "react-feather";
import DecideModal from "~/components/Elements/DecideModal";

let pageIndex = 1;

const Grade = () => {
  const [dataCourse, setDataCourse] = useState<IGrade[]>([]);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [isOpen, setIsOpen] = useState({
    isOpen: false,
    status: null,
  });
  const [dataHidden, setDataHidden] = useState({
    GradeID: null,
    Enable: null,
  });
  const [rowData, setRowData] = useState<IGrade[]>();

  // GET DATA COURSE
  const getDataCourse = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    let todoApi = {
      action: "getAll",
      pageIndex: pageIndex,
    };

    try {
      let res = await gradeApi.getAll(todoApi);
      res.status == 200 && setDataCourse(res.data.data);
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  // GET DATA CORUSE WITH ID
  const getDataCourseWithID = (CourseID: number) => {
    setIsLoading({
      type: "GET_WITH_ID",
      status: true,
    });
    (async () => {
      try {
        let res = await gradeApi.getWithID(CourseID);
        res.status == 200 && setRowData(res.data.createAcc);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "GET_WITH_ID",
          status: false,
        });
      }
    })();
  };

  // _ADD DATA
  const _onSubmit = async (data: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    console.log("DATA SUBMIT: ", data);

    let res = null;

    if (data.GradeID) {
      try {
        res = await gradeApi.put(data);
        // res?.status == 200 && editRowData(data, res.data.message);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "ADD_DATA",
          status: false,
        });
      }
    } else {
      try {
        res = await gradeApi.addData(data);
        res?.status == 200 && afterPost();
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "ADD_DATA",
          status: false,
        });
      }
    }

    return res;
  };

  // DELETE COURSE
  const changeStatus = (checked: boolean, idCourse: number) => {
    setDataHidden({
      GradeID: idCourse,
      Enable: checked,
    });

    !isOpen.isOpen && checked
      ? setIsOpen({ isOpen: true, status: "hide" })
      : setIsOpen({ isOpen: true, status: "show" });
  };

  // AFTER POST SUCCESS
  const afterPost = () => {
    showNoti("success", "Thêm thành công");
    getDataCourse();
    // addDataSuccess(), setIsModalVisible(false);
  };

  // console.log("Data Course: ", dataCourse);
  // console.log("Data hidden: ", dataHidden);

  // const statusShow = async () => {
  //   setIsLoading({
  //     type: "GET_ALL",
  //     status: true,
  //   });
  //   try {
  //     let res = await gradeApi.patch(dataHidden);
  //     res.status == 200 && updateAtRow(res.data.message);
  //     isOpen.status == "hide"
  //       ? setIsOpen({ isOpen: false, status: "hide" })
  //       : setIsOpen({ isOpen: false, status: "show" });
  //   } catch (error) {
  //     showNoti("danger", error.Message);
  //   } finally {
  //     setIsLoading({
  //       type: "GET_ALL",
  //       status: false,
  //     });
  //   }
  // };

  // GET PAGE_NUMBER
  const getPagination = (pageNumber: number) => {
    console.log("Page number: ", pageNumber);
    pageIndex = pageNumber;
    console.log("Index page = ", pageIndex);
  };

  const columns = [
    {
      title: "Mã khối",
      dataIndex: "GradeCode",
      ...FilterColumn("GradeCode"),
    },
    {
      title: "Tên khối",
      dataIndex: "GradeName",
      ...FilterColumn("GradeName"),
    },
    {
      title: "Description",
      dataIndex: "Description",
    },

    {
      title: "Create on",
      dataIndex: "CreatedOn",
      ...FilterDateColumn("CreatedOn"),
    },
    {
      title: "Hidden",
      dataIndex: "Enable",
      render: (Enable, record) => (
        <>
          <Switch
            checkedChildren="Hiện"
            unCheckedChildren="Ẩn"
            checked={Enable}
            size="default"
            onChange={(checked) => changeStatus(checked, record.GradeID)}
          />
        </>
      ),
    },
    {
      render: (record) => (
        <>
          <Tooltip title="Cập nhật trung tâm">
            <GradeForm
              gradeID={record.GradeID}
              getDataCourseWithID={(CourseID: number) =>
                getDataCourseWithID(CourseID)
              }
              rowData={rowData}
              isLoading={isLoading}
              _onSubmit={(data: any) => _onSubmit(data)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    getDataCourse();
  }, []);

  // useEffect(() => {
  //   dataSuccess && getDataCourse();
  // }, [dataSuccess]);

  return (
    <>
      {/* <DecideModal
        content={`Bạn có chắc muốn ${
          isOpen.status == "hide" ? "hiện" : "ẩn"
        } không?`}
        addClass="color-red"
        isOpen={isOpen.isOpen}
        isCancel={() =>
          setIsOpen({
            ...isOpen,
            isOpen: false,
          })
        }
        isOk={() => statusShow()}
      /> */}
      <PowerTable
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        addClass="basic-header"
        TitlePage="Danh sách khối học"
        TitleCard={
          <GradeForm
            showAdd={true}
            addDataSuccess={() => getDataCourse()}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        }
        dataSource={dataCourse}
        columns={columns}
        Extra={
          <div className="extra-table">
            {/* <FilterTable /> */}
            <SortBox />
          </div>
        }
      />
    </>
  );
};
Grade.layout = LayoutBase;
export default Grade;
