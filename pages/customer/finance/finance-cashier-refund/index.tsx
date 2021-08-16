import React, { Fragment, useEffect, useState } from "react";
import TitlePage from "~/components/TitlePage";
import ExpandTable from "~/components/ExpandTable";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import { ExpandBoxService } from "~/components/Elements/ExpandBox";
import RefundForm from "~/components/Global/Customer/Finance/RefundForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FilterTable";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
import { refundsApi, branchApi } from "~/apiBase";
import moment from "moment";
import { useWrap } from "~/context/wrap";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
FinanceRefund.layout = LayoutBase;
export default function FinanceRefund() {
  const expandedRowRender = (record) => <ExpandBoxService dataRow={record} />;

  const [dataTable, setDataTable] = useState<IRefunds[]>([]);
  const [dataBranch, setDataBranch] = useState([]);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataFilter, setDataFilter] = useState([
    {
      name: "BranchID",
      title: "Trung tâm",
      col: "col-6",
      type: "select",
      optionList: [],
      value: null,
    },
    {
      name: "StatusID",
      title: "Trạng thái",
      col: "col-6",
      type: "select",
      optionList: [
        {
          title: "Chờ duyệt",
          value: 1,
        },
        {
          title: "Đã duyệt",
          value: 2,
        },
        {
          title: "Không duyệt",
          value: 3,
        },
      ],
      value: null,
    },
    {
      name: "date-range",
      title: "Từ - đến",
      col: "col-12",
      type: "date-range",
      value: null,
    },
  ]);

  let pageIndex = 1;

  // SORT
  const dataOption = [
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

  // PARAMS SEARCH
  let listField = {
    FullNameUnicode: "",
  };

  let listFieldFilter = {
    pageIndex: 1,
    fromDate: null,
    toDate: null,
    StatusID: null,
    BranchID: null,
  };

  // PARAMS API GETALL
  const listTodoApi = {
    pageSize: 10,
    pageIndex: pageIndex,
    sort: null,
    sortType: null,
    FullNameUnicode: null,
  };
  const [todoApi, setTodoApi] = useState(listTodoApi);

  const setDataFunc = (name, data) => {
    console.log(data);
    dataFilter.every((item, index) => {
      if (item.name == name) {
        item.optionList = data;
        return false;
      }
      return true;
    });
    setDataFilter([...dataFilter]);
  };

  // GET DATA TABLE
  const getDataTable = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await refundsApi.getAll(todoApi);
        if (res.status == 204) {
          showNoti("danger", "Không có dữ liệu");
        }
        if (res.status == 200) {
          setDataTable(res.data.data);
          if (res.data.data.length < 1) {
            handleReset();
          }
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
    })();
  };
  const getDataBranch = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await branchApi.getAll({ pageIndex: 1, pageSize: 9999 });
        if (res.status == 204) {
          showNoti("danger", "Không có dữ liệu");
        }
        if (res.status == 200) {
          setDataBranch(res.data.data);
          const newData = res.data.data.map((item) => ({
            title: item.BranchName,
            value: item.ID,
          }));
          setDataFunc("BranchID", newData);
        }
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

  // ON SEARCH
  const compareField = (valueSearch, dataIndex) => {
    let newList = null;
    Object.keys(listField).forEach(function (key) {
      console.log("key: ", key);
      if (key != dataIndex) {
        listField[key] = "";
      } else {
        listField[key] = valueSearch;
      }
    });
    newList = listField;
    return newList;
  };

  const onSearch = (valueSearch, dataIndex) => {
    console.log(dataTable);
    let clearKey = compareField(valueSearch, dataIndex);

    setTodoApi({
      ...todoApi,
      ...clearKey,
    });
  };

  // HANDLE RESET
  const handleReset = () => {
    setTodoApi({
      ...listTodoApi,
      pageIndex: 1,
    });
    setCurrentPage(1);
  };

  // -------------- HANDLE FILTER ------------------
  const handleFilter = (listFilter) => {
    console.log("List Filter when submit: ", listFilter);

    let newListFilter = { ...listFieldFilter };
    listFilter.forEach((item, index) => {
      let key = item.name;
      Object.keys(newListFilter).forEach((keyFilter) => {
        if (keyFilter == key) {
          newListFilter[key] = item.value;
        }
      });
    });
    setTodoApi({ ...todoApi, ...newListFilter, pageIndex: 1 });
  };
  // PAGINATION
  const getPagination = (pageNumber: number) => {
    pageIndex = pageNumber;
    setCurrentPage(pageNumber);
    setTodoApi({
      ...todoApi,
      pageIndex: pageIndex,
    });
  };
  // HANDLE SORT
  const handleSort = async (option) => {
    console.log("Show option: ", option);

    let newTodoApi = {
      ...listTodoApi,
      sort: option.title.sort,
      sortType: option.title.sortType,
    };
    setCurrentPage(1);
    setTodoApi(newTodoApi);
  };

  const _onSubmit = async (data) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });
    let res;
    try {
      res = await refundsApi.update(data);
      res?.status == 200 && showNoti("success", "Cập nhật thành công"),
        getDataTable();
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "ADD_DATA",
        status: false,
      });
    }
    return res;
  };

  const columns = [
    {
      title: "Trung tâm",
      dataIndex: "BranchName",
      // ...FilterColumn("center")
    },
    {
      title: "Học viên",
      dataIndex: "FullNameUnicode",
      ...FilterColumn("FullNameUnicode", onSearch, handleReset, "text"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    // {
    //   title: "Nguồn",
    //   dataIndex: "source",
    //   // ...FilterColumn("source")
    // },
    {
      title: "Số điện thoại",
      dataIndex: "Mobile",
      // ...FilterColumn("tel")
    },
    {
      title: "Số tiền",
      dataIndex: "Price",
      // ...FilterColumn("cost"),
      render: (Price) => {
        return (
          <p className="font-weight-black">
            {Intl.NumberFormat("ja-JP").format(Price)}
          </p>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "StatusName",
      align: "center",
      render: (fnStatus) => {
        switch (fnStatus) {
          case "Chờ duyệt":
            return <span className="tag green">{fnStatus}</span>;
          case "Không duyệt":
            return <span className="tag red">{fnStatus}</span>;
          case "Đã duyệt":
            return <span className="tag yellow">{fnStatus}</span>;
            break;
        }
      },
    },
    {
      title: "",
      render: (record) => (
        <>
          <RefundForm
            showIcon={true}
            rowData={record}
            dataBranch={dataBranch}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    getDataTable();
    getDataBranch();
  }, [todoApi]);

  return (
    <ExpandTable
      loading={isLoading}
      currentPage={currentPage}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="Danh sách yêu cầu hoàn tiền"
      dataSource={dataTable}
      // TitleCard={
      //   <StudyTimeForm showAdd={true} />
      // }
      columns={columns}
      expandable={{ expandedRowRender: (record) => expandedRowRender(record) }}
      Extra={
        <div className="extra-table">
          <FilterBase
            dataFilter={dataFilter}
            handleFilter={(listFilter: any) => handleFilter(listFilter)}
            handleReset={handleReset}
          />
          <SortBox
            handleSort={(value) => handleSort(value)}
            dataOption={dataOption}
          />
        </div>
      }
    />
  );
}
