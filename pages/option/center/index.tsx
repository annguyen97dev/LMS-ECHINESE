import React, { Fragment, useEffect, useRef, useState } from "react";
import PowerTable from "~/components/PowerTable";
import randomColor from "randomcolor";
import { Tag, Tooltip, Switch, Input, Button, Space } from "antd";
import { Info, RotateCcw } from "react-feather";
import SortBox from "~/components/Elements/SortBox";

import FilterTable from "~/components/Global/CourseList/FitlerTable";
import Link from "next/link";
import LayoutBase from "~/components/LayoutBase";
import { branchApi } from "~/apiBase";
import CenterForm from "~/components/Global/Option/CenterForm";
import { useWrap } from "~/context/wrap";
import { FormOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import FilterColumn from "~/components/Tables/FilterColumn";

let pageIndex = 1;

let listFieldSearch = {
  pageIndex: 1,
  branchCode: null,
  branchName: null,
};

const Center = () => {
  const [center, setCenter] = useState<IBranch[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [isOpen, setIsOpen] = useState({
    isOpen: false,
    status: null,
  });
  const { showNoti } = useWrap();
  const [rowData, setRowData] = useState<IBranch>();
  const [totalPage, setTotalPage] = useState(null);
  const [indexRow, setIndexRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const listTodoApi = {
    pageSize: 10,
    pageIndex: pageIndex,
    sort: null,
    sortType: null,
    branchCode: null,
    branchName: null,
  };

  const [todoApi, setTodoApi] = useState(listTodoApi);

  console.log("List field search: ", listFieldSearch);

  const dataOption = [
    {
      dataSort: {
        sort: 1,
        sortType: false,
      },
      value: 1,
      text: "Mã giảm dần",
    },
    {
      dataSort: {
        sort: 1,
        sortType: true,
      },
      value: 2,
      text: "Mã tăng dần",
    },
    {
      dataSort: {
        sort: 2,
        sortType: false,
      },
      value: 3,
      text: "Tên giảm dần",
    },
    {
      dataSort: {
        sort: 2,
        sortType: true,
      },
      value: 4,
      text: "Tên tăng dần ",
    },
  ];

  // const FilterColumn = (dataIndex) => {
  //   const [isVisible, setIsVisible] = useState(false);
  //   const [valueSearch, setValueSearch] = useState<any>(null);
  //   const inputRef = useRef<any>(null);
  //   const getValueSearch = (e) => {
  //     setValueSearch(e.target.value);
  //   };

  //   // HANDLE SEARCH
  //   const handleSearch = () => {
  //     switch (dataIndex) {
  //       case "BranchCode":
  //         setTodoApi({
  //           ...todoApi,
  //           branchName: "",
  //           branchCode: valueSearch,
  //         });
  //         break;
  //       case "BranchName":
  //         setTodoApi({
  //           ...todoApi,
  //           branchCode: "",
  //           branchName: valueSearch,
  //         });
  //         break;
  //       default:
  //         break;
  //     }
  //     setValueSearch("");
  //     setIsVisible(false);
  //   };

  //   // HANDLE RESET
  //   const handleReset = () => {
  //     setTodoApi(listTodoApi);
  //     setIsVisible(false);
  //   };

  //   useEffect(() => {
  //     if (isVisible) {
  //       setTimeout(() => {
  //         inputRef.current.select();
  //       }, 100);
  //     }
  //   }, [isVisible]);

  //   const getColumnSearchProps = (dataIndex) => ({
  //     filterDropdown: () => (
  //       <div style={{ padding: 8 }}>
  //         <Input
  //           ref={inputRef}
  //           value={valueSearch}
  //           placeholder={`Search ${dataIndex}`}
  //           onPressEnter={() => handleSearch()}
  //           onChange={getValueSearch}
  //           style={{ marginBottom: 8, display: "block" }}
  //         />
  //         <Space>
  //           <Button
  //             type="primary"
  //             onClick={() => handleSearch()}
  //             icon={<SearchOutlined />}
  //             size="small"
  //             style={{ width: 90 }}
  //           >
  //             Search
  //           </Button>
  //           <Button onClick={handleReset} size="small" style={{ width: 90 }}>
  //             Reset
  //           </Button>
  //         </Space>
  //       </div>
  //     ),
  //     filterIcon: (filtered) => <SearchOutlined />,

  //     filterDropdownVisible: isVisible,
  //     onFilterDropdownVisibleChange: (visible) => {
  //       visible ? setIsVisible(true) : setIsVisible(false);
  //     },
  //   });

  //   return getColumnSearchProps(dataIndex);
  // };

  // -------------- GET DATA CENTER ----------------
  const getDataCenter = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await branchApi.getAll(todoApi);
      res.status == 200 && setCenter(res.data.data);
      if (res.data.data.length < 1) {
        showNoti("danger", "Không có dữ liệu");
        setCurrentPage(pageIndex);
      } else {
        setTotalPage(res.data.totalRow);
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

  // ---------------- AFTER SUBMIT -----------------
  const afterPost = (mes) => {
    showNoti("success", mes);
    setTodoApi({
      ...listTodoApi,
      pageIndex: 1,
    });
    setCurrentPage(1);
  };

  // ----------------- ON SUBMIT --------------------
  const _onSubmit = async (dataSubmit: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    let res = null;

    if (dataSubmit.ID) {
      try {
        res = await branchApi.update(dataSubmit);

        if (res.status == 200) {
          let newDataCenter = [...center];
          newDataCenter.splice(indexRow, 1, dataSubmit);
          setCenter(newDataCenter);
          showNoti("success", res.data.message);
        }
      } catch (error) {
        console.log("error: ", error);
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "ADD_DATA",
          status: false,
        });
      }
    } else {
      try {
        res = await branchApi.add(dataSubmit);
        res?.status == 200 && afterPost(res.data.message);
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

  // ----------------- TURN ON/OF ------------------------
  const changeStatus = async (checked: boolean, idRow: number) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await branchApi.changeStatus(idRow);
      res.status == 200 && setTodoApi(listTodoApi),
        showNoti("success", res.data.message);
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
    pageIndex = pageNumber;
    setCurrentPage(pageNumber);
    setTodoApi({
      ...todoApi,
      ...listFieldSearch,
      pageIndex: pageIndex,
    });
  };

  const handleSort = async (option) => {
    let newTodoApi = {
      ...listTodoApi,
      sort: option.title.sort,
      sortType: option.title.sortType,
    };

    setTodoApi(newTodoApi);
  };

  // -------------- CHECK FIELD ---------------------
  const checkField = (valueSearch, dataIndex) => {
    let newList = { ...listFieldSearch };
    Object.keys(newList).forEach(function (key) {
      console.log("key: ", key);
      if (key != dataIndex) {
        if (key != "pageIndex") {
          newList[key] = null;
        }
      } else {
        newList[key] = valueSearch;
      }
    });

    return newList;
  };

  // ------------ ON SEARCH -----------------------
  const onSearch = (valueSearch, dataIndex) => {
    let clearKey = checkField(valueSearch, dataIndex);

    setTodoApi({
      ...todoApi,
      ...clearKey,
    });
  };

  // HANDLE RESET
  const resetListFieldSearch = () => {
    Object.keys(listFieldSearch).forEach(function (key) {
      if (key != "pageIndex") {
        listFieldSearch[key] = null;
      }
    });
  };

  const handleReset = () => {
    setTodoApi({
      ...listTodoApi,
      pageIndex: 1,
    });
    resetListFieldSearch();
  };

  // ============== USE EFFECT - FETCH DATA ===================
  useEffect(() => {
    getDataCenter();
  }, [todoApi]);

  const columns = [
    {
      title: "Mã trung tâm",
      dataIndex: "BranchCode",
      // ...FilterColumn("BranchCode"),
      ...FilterColumn("BranchCode", onSearch, handleReset, "text"),
    },

    {
      title: "Tên trung tâm",
      dataIndex: "BranchName",
      // ...FilterColumn("BranchName"),
    },
    { title: "Địa chỉ", dataIndex: "Address" },
    {
      title: "Số điện thoại",
      dataIndex: "Phone",
      // ...FilterColumn("BranchName"),
    },
    {
      title: "Trạng thái",
      dataIndex: "Enable",
      render: (Enable, record) => (
        <>
          <Switch
            checkedChildren="Hiện"
            unCheckedChildren="Ẩn"
            checked={Enable}
            size="default"
            onChange={(checked) => changeStatus(checked, record.ID)}
          />
        </>
      ),
    },
    {
      render: (text, data, index) => (
        <>
          <Link
            href={{
              pathname: "/option/center/rooms-detail/[slug]",
              query: { slug: `${data.ID}` },
            }}
          >
            <Tooltip title="Xem phòng">
              <button className="btn btn-icon">
                <Info />
              </button>
            </Tooltip>
          </Link>

          <Tooltip title="Cập nhật trung tâm">
            <CenterForm
              getIndex={() => setIndexRow(index)}
              index={index}
              branchId={data.ID}
              rowData={data}
              isLoading={isLoading}
              _onSubmit={(data: any) => _onSubmit(data)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Fragment>
      <PowerTable
        currentPage={currentPage}
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        addClass="basic-header"
        TitlePage="Danh sách trung tâm"
        TitleCard={
          <CenterForm
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        }
        dataSource={center}
        columns={columns}
        Extra={
          <div className="extra-table">
            <SortBox
              handleSort={(value) => handleSort(value)}
              dataOption={dataOption}
            />
          </div>
        }
      />
    </Fragment>
  );
};
Center.layout = LayoutBase;
export default Center;
