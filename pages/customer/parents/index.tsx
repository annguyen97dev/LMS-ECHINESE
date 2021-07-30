import { Tooltip } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { Info } from "react-feather";
import { areaApi, branchApi, parentsApi } from "~/apiBase";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import SortBox from "~/components/Elements/SortBox";
import ParentsDelete from "~/components/Global/Customer/ParentsList/ParentsDelete";
import ParentsForm from "~/components/Global/Customer/ParentsList/ParentsForm";
import LayoutBase from "~/components/LayoutBase";
import PowerTable from "~/components/PowerTable";
import FilterColumn from "~/components/Tables/FilterColumn";
import { useWrap } from "~/context/wrap";

const ParentsList = () => {
  const onSearch = (data) => {
    setCurrentPage(1);
    setParams({
      ...listParamsDefault,
      FullNameUnicode: data,
    });
  };

  const handleReset = () => {
    setCurrentPage(1);
    setParams(listParamsDefault);
  };
  const columns = [
    {
      title: "Tên phụ huynh",
      dataIndex: "FullNameUnicode",
      ...FilterColumn("FullNameUnicode", onSearch, handleReset, "text"),
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },
    {
      title: "Giới tính",
      dataIndex: "Gender",
      render: (gender) => (
        <Fragment>{gender == 0 ? "Nữ" : gender == 1 ? "Nam" : "Khác"}</Fragment>
      ),
    },

    {
      title: "Ngày sinh",
      dataIndex: "DOB",
      render: (DOB) => moment(DOB).format("DD/MM/YYYY"),
    },
    {
      title: "Tên trung tâm",
      dataIndex: "Branch",
      render: (Branch) => (
        <>
          {Branch.map((item) => (
            <a href="/" className="font-weight-black d-block">
              {item.BranchName}
            </a>
          ))}
        </>
      ),
    },

    {
      title: "Khu vực",
      dataIndex: "AreaName",
    },
    {
      title: "SĐT",
      dataIndex: "Mobile",
    },

    {
      title: "Email",
      dataIndex: "Email",
    },

    {
      title: "Trạng thái",
      dataIndex: "StatusID",
      className: "text-center",
      render: (status) => (
        <>
          {
            <span className={`tag ${status == 0 ? "green" : "red"}`}>
              {status == 0 ? "Hoạt động" : "Khóa"}
            </span>
          }
        </>
      ),
    },

    {
      render: (data) => (
        <Fragment>
          <ParentsForm
            parentsDetail={data}
            parentsID={data.UserInformationID}
            reloadData={(firstPage) => {
              getDataParents(firstPage);
            }}
            currentPage={currentPage}
          />

          <Link
            href={{
              pathname: "/customer/parents/detail/[slug]",
              query: { slug: `${data.UserInformationID}` },
            }}
          >
            <Tooltip title="Xem học viên liên kết">
              <button className="btn btn-icon">
                <Info />
              </button>
            </Tooltip>
          </Link>

          <ParentsDelete
            parentsID={data.UserInformationID}
            reloadData={(firstPage) => {
              getDataParents(firstPage);
            }}
            currentPage={currentPage}
          />
        </Fragment>
      ),
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);

  const listParamsDefault = {
    pageSize: 10,
    pageIndex: currentPage,
    sort: null,
    sortType: null,
    fromDate: null,
    toDate: null,
    BranchID: null,
    StatusID: null,
    AreaID: null,
    FullNameUnicode: null,
  };

  const sortOption = [
    {
      dataSort: {
        sortType: null,
      },
      value: 1,
      text: "Mới cập nhật",
    },
    {
      dataSort: {
        sortType: true,
      },
      value: 2,
      text: "Từ dưới lên",
    },
  ];

  const [dataFilter, setDataFilter] = useState([
    {
      name: "AreaID",
      title: "Tỉnh/TP",
      col: "col-12",
      type: "select",
      optionList: null,
      value: null,
    },
    {
      name: "BranchID",
      title: "Trung tâm",
      col: "col-12",
      type: "select",
      optionList: null,
      value: null,
    },

    {
      name: "StatusID",
      title: "Trạng thái",
      col: "col-12",
      type: "select",
      optionList: [
        {
          value: 0,
          title: "Hoạt động",
        },
        {
          value: 1,
          title: "Khóa",
        },
      ],
      value: null,
    },
    {
      name: "date-range",
      title: "Ngày tạo",
      col: "col-12",
      type: "date-range",
      value: null,
    },
  ]);

  const handleFilter = (listFilter) => {
    console.log("List Filter when submit: ", listFilter);

    let newListFilter = {
      pageIndex: 1,
      fromDate: null,
      toDate: null,
      BranchID: null,
      StatusID: null,
      AreaID: null,
    };
    listFilter.forEach((item, index) => {
      let key = item.name;
      Object.keys(newListFilter).forEach((keyFilter) => {
        if (keyFilter == key) {
          newListFilter[key] = item.value;
        }
      });
    });
    setParams({ ...listParamsDefault, ...newListFilter, pageIndex: 1 });
  };

  const handleSort = async (option) => {
    setParams({
      ...listParamsDefault,
      sortType: option.title.sortType,
    });
  };

  const [params, setParams] = useState(listParamsDefault);
  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);
  const [parents, setParents] = useState<IParents[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: false,
  });

  const setDataFunc = (name, data) => {
    dataFilter.every((item, index) => {
      if (item.name == name) {
        item.optionList = data;
        return false;
      }
      return true;
    });
    setDataFilter([...dataFilter]);
  };

  const getDataCenter = async () => {
    try {
      let res = await branchApi.getAll({ pageSize: 99999, pageIndex: 1 });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.BranchName,
          value: item.ID,
        }));
        setDataFunc("BranchID", newData);
      }

      res.status == 204 && showNoti("danger", "Trung tâm Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  const getDataArea = async () => {
    try {
      let res = await areaApi.getAll({ pageSize: 99999, pageIndex: 1 });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.AreaName,
          value: item.AreaID,
        }));
        setDataFunc("AreaID", newData);
      }
      res.status == 204 && showNoti("danger", "Tỉnh/TP Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  useEffect(() => {
    getDataCenter();
    getDataArea();
  }, []);

  const getPagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setParams({
      ...params,
      pageIndex: currentPage,
    });
  };

  const getDataParents = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await parentsApi.getAll({ ...params, pageIndex: page });
        //@ts-ignore
        res.status == 200 && setParents(res.data.data);
        if (res.status == 204) {
          showNoti("danger", "Không tìm thấy dữ liệu!");
          setCurrentPage(1);
          setParams(listParamsDefault);
        } else setTotalPage(res.data.totalRow);
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

  useEffect(() => {
    getDataParents(currentPage);
  }, [params]);

  return (
    <PowerTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="DANH SÁCH PHỤ HUYNH"
      TitleCard={
        <ParentsForm
          reloadData={(firstPage) => {
            setCurrentPage(1);
            getDataParents(firstPage);
          }}
        />
      }
      dataSource={parents}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterBase
            dataFilter={dataFilter}
            handleFilter={(listFilter: any) => handleFilter(listFilter)}
            handleReset={handleReset}
          />

          <SortBox
            dataOption={sortOption}
            handleSort={(value) => handleSort(value)}
          />
        </div>
      }
    />
  );
};
ParentsList.layout = LayoutBase;
export default ParentsList;
