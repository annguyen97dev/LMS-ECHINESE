import React, { Fragment, useEffect, useRef, useState } from "react";
import PowerTable from "~/components/PowerTable";
import randomColor from "randomcolor";
import { Tag, Tooltip, Switch, Input, Button, Space } from "antd";
import { Info, RotateCcw } from "react-feather";
import SortBox from "~/components/Elements/SortBox";
// import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import Link from "next/link";
import LayoutBase from "~/components/LayoutBase";
import { branchApi } from "~/apiBase";
import CenterForm from "~/components/Global/Option/CenterForm";
import { useWrap } from "~/context/wrap";
import { FormOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { data } from "~/lib/option/dataOption2";

let indexPage = 1;

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
  const dataOption = [
    {
      value: 0,
      text: "Mã trung tâm",
    },
    {
      value: 1,
      text: "Tên trung tâm",
    },
    {
      value: 2,
      text: "Tăng dần",
    },
    {
      value: 3,
      text: "Giảm dần",
    },
  ];

  const FilterColumn = (dataIndex) => {
    const [isVisible, setIsVisible] = useState(false);
    const [valueSearch, setValueSearch] = useState<any>(null);
    const inputRef = useRef<any>(null);
    const getValueSearch = (e) => {
      setValueSearch(e.target.value);
    };

    const searchAPI = async (dataIndex) => {
      setIsLoading({
        type: "GET_ALL",
        status: true,
      });

      let todoApi = {
        action: dataIndex,
        value: valueSearch,
      };

      try {
        let res = await branchApi.getAll(todoApi);

        if (res.status == 200) {
          res.data.data.length > 0
            ? (setCenter(res.data.data), setValueSearch(null))
            : showNoti("danger", "Không tìm thấy");
        }

        setTotalPage(res.data.totalRow);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "GET_ALL",
          status: false,
        });
      }
    };

    // HANDLE SEARCH
    const handleSearch = () => {
      switch (dataIndex) {
        case "BranchCode":
          searchAPI(dataIndex);
          break;
        case "BranchName":
          searchAPI(dataIndex);
          break;
        default:
          break;
      }
      setIsVisible(false);
    };

    // HANDLE RESET
    const handleReset = () => {
      getDataCenter();
      setIsVisible(false);
    };

    useEffect(() => {
      if (isVisible) {
        setTimeout(() => {
          inputRef.current.select();
        }, 100);
      }
    }, [isVisible]);

    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            ref={inputRef}
            value={valueSearch}
            placeholder={`Search ${dataIndex}`}
            onPressEnter={() => handleSearch()}
            onChange={getValueSearch}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={handleReset} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined />,

      filterDropdownVisible: isVisible,
      onFilterDropdownVisibleChange: (visible) => {
        visible ? setIsVisible(true) : setIsVisible(false);
      },
    });

    return getColumnSearchProps(dataIndex);
  };

  // -------------- GET DATA CENTER ----------------
  const getDataCenter = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    let todoApi = {
      action: "getAll",
      pageIndex: indexPage,
    };

    try {
      let res = await branchApi.getAll(todoApi);
      res.status == 200 && setCenter(res.data.data),
        setTotalPage(res.data.totalRow);
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  // ----------- GET BRANCH DETAIL ---------------
  const getBranchDetail = async (branchId: number) => {
    setIsLoading({
      type: "GET_WITH_ID",
      status: true,
    });
    let res = null;

    try {
      res = await branchApi.getByID(branchId);
      res.status == 200 && setRowData(res.data.data);
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_WITH_ID",
        status: false,
      });
    }

    return res;
  };

  // ---------------- AFTER SUBMIT -----------------
  const afterPost = (mes) => {
    showNoti("success", mes);
    getDataCenter();
  };

  // ----------------- ON SUBMIT --------------------
  const _onSubmit = async (data: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    let res = null;

    if (data.ID) {
      try {
        res = await branchApi.update(data);
        res?.status == 200 && afterPost(res.data.message);
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
        res = await branchApi.add(data);
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

  // TURN OF
  const changeStatus = async (checked: boolean, idRow: number) => {
    console.log("Checked: ", checked);
    console.log("Branch ID: ", idRow);

    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await branchApi.changeStatus(idRow);
      res.status == 200 && getDataCenter();
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
    indexPage = pageNumber;
    getDataCenter();
  };

  const handleSort = async (value) => {
    value = value + 1;
    let todoApi = null;

    if (value > 2) {
      if (value == 3) {
        todoApi = {
          action: "sortType",
          sortType: true,
        };
      } else {
        todoApi = {
          action: "sortType",
          sortType: false,
        };
      }
    } else {
      todoApi = {
        action: "sortField",
        sort: value,
      };
    }

    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      let res = await branchApi.getAll(todoApi);

      res.status && setCenter(res.data.data);
      setTotalPage(res.data.totalRow);
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  // ============== USE EFFECT ===================
  useEffect(() => {
    getDataCenter();
  }, []);

  const columns = [
    {
      title: "Mã trung tâm",
      dataIndex: "BranchCode",
      ...FilterColumn("BranchCode"),
    },

    {
      title: "Tên trung tâm",
      dataIndex: "BranchName",
      ...FilterColumn("BranchName"),
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
      render: (data) => (
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
              branchId={data.ID}
              getBranchDetail={(branchId: number) => {
                let res = getBranchDetail(branchId);

                console.log("REs khuc nay: ", res);
                return res;
              }}
              rowData={rowData}
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
