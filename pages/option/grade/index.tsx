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
import { courseApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { Trash2 } from "react-feather";
import DecideModal from "~/components/Elements/DecideModal";

let indexPage = 1;

const Grade = () => {
  const [dataCourse, setDataCourse] = useState<ICourse[]>([]);
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
    ListCourseID: null,
    Enable: null,
  });
  const [rowData, setRowData] = useState<ICourse[]>();

  // GET DATA COURSE
  const getDataCourse = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await courseApi.getAll();
        res.status == 200 && setDataCourse(res.data.acc);
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

  // GET DATA CORUSE WITH ID
  const getDataCourseWithID = (CourseID: number) => {
    setIsLoading({
      type: "GET_WITH_ID",
      status: true,
    });
    (async () => {
      try {
        let res = await courseApi.getWithID(CourseID);
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

  // EDIT ROW DATA
  const editRowData = (dataEdit: any, mes: string) => {
    let space = indexPage * 10;
    let limit = space < dataCourse.length ? space : dataCourse.length;
    let dataClone = [...dataCourse];

    for (let i = space - 10; i <= limit; i++) {
      if (dataClone[i].ListCourseID == dataEdit.ListCourseID) {
        dataClone[i].ListCourseCode = dataEdit.ListCourseCode;
        dataClone[i].ListCourseName = dataEdit.ListCourseName;
        dataClone[i].Description = dataEdit.Description;
        break;
      }
    }
    setDataCourse(dataClone);
    showNoti("success", mes);
  };

  // _ADD DATA
  const _onSubmit = async (data: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    let res = null;

    if (data.ListCourseID) {
      try {
        res = await courseApi.put(data);
        res?.status == 200 && editRowData(data, res.data.message);
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
        res = await courseApi.post(data);
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
      ListCourseID: idCourse,
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

  // UPDATE ROW
  const updateAtRow = (mes: string) => {
    let dataClone = [...dataCourse];
    dataClone.forEach((item, index) => {
      if (item.ListCourseID == dataHidden.ListCourseID) {
        console.log("run it");
        item.Enable = dataHidden.Enable;
        return false;
      }
      return true;
    });

    setDataCourse(dataClone);
    showNoti("success", mes);
  };

  // console.log("Data Course: ", dataCourse);
  // console.log("Data hidden: ", dataHidden);

  const statusShow = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      let res = await courseApi.patch(dataHidden);
      res.status == 200 && updateAtRow(res.data.message);
      isOpen.status == "hide"
        ? setIsOpen({ isOpen: false, status: "hide" })
        : setIsOpen({ isOpen: false, status: "show" });
    } catch (error) {
      showNoti("danger", error.Message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  // GET PAGE_NUMBER
  const getPagination = (pageNumber: number) => {
    console.log("Page number: ", pageNumber);
    indexPage = pageNumber;
    console.log("Index page = ", indexPage);
  };

  const columns = [
    {
      title: "Grade",
      dataIndex: "ListCourseName",
      ...FilterColumn("ListCourseName"),
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
            onChange={(checked) => changeStatus(checked, record.ListCourseID)}
          />
        </>
      ),
    },
    {
      render: (record) => (
        <>
          <Tooltip title="Cập nhật trung tâm">
            <GradeForm
              showIcon={true}
              CourseID={record.ListCourseID}
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
      <DecideModal
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
      />
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
