import React, { Fragment, useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import FilterColumn from "~/components/Tables/FilterColumn";
import LayoutBase from "~/components/LayoutBase";
import { serviceCustomerExamResultApi } from "~/apiBase";
import ServiceCustomerExamResult from "~/components/Global/Customer/Service/ServiceCustomerExamResult";
import moment from "moment";
import { useWrap } from "~/context/wrap";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";

CustomerServiceResult.layout = LayoutBase;
export default function CustomerServiceResult() {
  const [dataTable, setDataTable] = useState<IServiceCustomerExamResult[]>([]);
  const { showNoti, pageSize } = useWrap();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeColumnSearch, setActiveColumnSearch] = useState("");
  const [dataFilter, setDataFilter] = useState([
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
  };

  // PARAMS API GETALL
  const listTodoApi = {
    pageSize: pageSize,
    pageIndex: pageIndex,
    sort: null,
    sortType: null,
    FullNameUnicode: null,
  };
  const [todoApi, setTodoApi] = useState(listTodoApi);

  // GET DATA TABLE
  const getDataTable = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await serviceCustomerExamResultApi.getAll(todoApi);
        if (res.status == 204) {
          showNoti("danger", "Không có dữ liệu");
          setDataTable([]);
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
    setActiveColumnSearch("");
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
  const getPagination = (pageNumber: number, pageSize: number) => {
    if (!pageSize) pageSize = 10;
    pageIndex = pageNumber;
    setCurrentPage(pageNumber);
    setTodoApi({
      ...todoApi,
      //   ...listFieldSearch,
      pageIndex: pageIndex,
      pageSize: pageSize,
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
      type: "UPDATE_DATA",
      status: true,
    });
    let res;
    try {
      res = await serviceCustomerExamResultApi.update(data);
      res?.status == 200 && showNoti("success", "Cập nhật thành công"),
        getDataTable();
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "UPDATE_DATA",
        status: false,
      });
    }
    return res;
  };
  const columns = [
    {
      title: "Ngày",
      dataIndex: "ExamDate",
      // ...FilterDateColumn("testDate")
      render: (a) => <p className="">{moment(a).format("DD/MM/YYYY")}</p>,
    },
    {
      title: "Họ và tên",
      dataIndex: "FullNameUnicode",
      className:
        activeColumnSearch === "UserInformationID"
          ? "active-column-search"
          : "",
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "Mobile",
      //  ...FilterColumn("tel")
    },
    {
      title: "Bài test",
      dataIndex: "ExamOfServiceName",
      // ...FilterColumn("pkgName"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Kỹ năng",
      dataIndex: "Skills",
      // ...FilterColumn("pkgSkill"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Listening",
      dataIndex: "ListeningPoint",
      render: (a) => {
        if (a) {
          return <span className="tag blue">{a}</span>;
        } else {
          return <span className="tag gray">...</span>;
        }
      },
    },
    {
      title: "Reading",
      dataIndex: "ReadingPoint",
      render: (a) => {
        if (a) {
          return <span className="tag blue">{a}</span>;
        } else {
          return <span className="tag gray">...</span>;
        }
      },
    },
    {
      title: "Writing",
      dataIndex: "WritingPoint",
      render: (a) => {
        if (a) {
          return <span className="tag blue">{a}</span>;
        } else {
          return <span className="tag gray">...</span>;
        }
      },
    },
    {
      title: "Speaking",
      dataIndex: "SpeakingPoint",
      render: (a) => {
        if (a) {
          return <span className="tag blue">{a}</span>;
        } else {
          return <span className="tag gray">...</span>;
        }
      },
    },
    {
      title: "Overall",
      dataIndex: "OverAll",
      render: (overall) => {
        // Làm tròn
        let n = parseFloat(overall);
        overall = Math.round(n * 10) / 10;

        if (overall >= 8) {
          return <span className="tag green">{overall}</span>;
        } else if (overall >= 5) {
          return <span className="tag yellow">{overall}</span>;
        } else {
          return <span className="tag red">{overall}</span>;
        }
      },
    },
    {
      render: (record) => (
        <>
          <ServiceCustomerExamResult
            showIcon={true}
            rowData={record}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    getDataTable();
  }, [todoApi]);

  return (
    <>
      <PowerTable
        loading={isLoading}
        currentPage={currentPage}
        totalPage={totalPage && totalPage}
        getPagination={getPagination}
        addClass="basic-header"
        TitlePage="Danh sách kết quả đợt thi"
        // TitleCard={<StudyTimeForm showAdd={true} isLoading={isLoading}/>}
        dataSource={dataTable}
        columns={columns}
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
    </>
  );
}
