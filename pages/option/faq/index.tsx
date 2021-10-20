import React, { useState, useEffect } from "react";
import { faqApi } from "~/apiBase/options/faq";
import AddQuesForm from "~/components/Global/Option/Faq/AddQuesForm";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import ExpandTable from "~/components/ExpandTable";
import { Tooltip, Input, Switch } from "antd";
import { RotateCcw, X } from "react-feather";
import DeleteTableRow from "~/components/Elements/DeleteTableRow/DeleteTableRow";

const FAQ = () => {
  const { Search } = Input;
  const [dataSource, setDataSource] = useState([]);
  const [totalPage, setTotalPage] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { showNoti, pageSize } = useWrap();
  const expandedRowKeys = [1];
  const todoApiDataSource = {
    pageIndex: 1,
    pageSize: pageSize,
  };
  const [todoApi, setTodoApi] = useState(todoApiDataSource);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  let pageIndex = 1;

  const columns = [
    {
      title: "",
      dataIndex: "Expandable",
      width: 30,
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Câu hỏi",
      dataIndex: "Title",
      render: (text, data) => <p>{data.Questions}</p>,
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "Status",
    //   width: 160,
    //   render: () => (
    //     <>
    //       <Switch defaultChecked onChange={onChangeStatus} /> <span>Hiện</span>
    //     </>
    //   ),
    // },
    {
      title: "Thao tác",
      dataIndex: "Acction",
      width: 130,
      render: (text, data) => (
        <div className="d-flex">
          <AddQuesForm
            mode="edit-questions"
            onFetchData={() => {
              // getPagination(1);
              setTodoApi({ ...todoApi, pageIndex: currentPage });
            }}
            dataEdit={data}
          />
          <DeleteTableRow
            handleDelete={() => updateDataDelete(data)}
            text="câu hỏi này"
          />
        </div>
      ),
    },
  ];

  const getDataSource = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      let res = await faqApi.getAll(todoApi);
      if (res.status == 200) {
        setDataSource(res.data.data);
        setTotalPage(res.data.totalRow);
        // showNoti("success", "Thành công");
      }
      if (res.status == 204) {
        setDataSource([]);
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

  const updateDataDelete = async (data) => {
    const dataUpdate = {
      ID: data.ID,
      Questions: data.Questions,
      Answer: data.Answer,
      Enable: false,
    };
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      let res = await faqApi.update(dataUpdate);
      setTodoApi({ ...todoApi, pageIndex: currentPage });
      // getPagination(currentPage);
      showNoti("success", "Xóa thành công!");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  const getPagination = (pageNumber) => {
    pageIndex = pageNumber;
    setCurrentPage(pageNumber);
    setTodoApi({
      ...todoApi,
      // ...listFieldSearch,
      pageIndex: pageIndex,
    });
    console.log("current page: ", currentPage);
  };

  useEffect(() => {
    getDataSource();
    console.log("current page at useEffect: ", currentPage);
  }, [todoApi, currentPage]);

  const expandedRowRender = (record) => {
    return (
      <>
        <div className="expanded__row-container">
          <p className="expanded__row-title">Nội dung trả lời</p>
          <p className="expanded__row-text">{record.Answer}</p>
        </div>
      </>
    );
  };

  return (
    <>
      <ExpandTable
        totalPage={totalPage && totalPage}
        currentPage={currentPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        TitlePage="Danh sách câu hỏi thường gặp"
        TitleCard={
          <AddQuesForm
            mode="add-questions"
            currentPage={currentPage}
            onFetchData={() => {
              getPagination(1);
              setTodoApi({ ...todoApi, pageIndex: 1 });
            }}
          />
        }
        expandable={{
          expandedRowRender,
        }}
      />
    </>
  );
};
FAQ.layout = LayoutBase;
export default FAQ;
