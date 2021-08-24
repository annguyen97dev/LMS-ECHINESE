import React, { Fragment, useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { Eye } from "react-feather";
import { Tooltip, Switch } from "antd";
import { dataService } from "lib/customer/dataCustomer";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FilterTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
import { contractCustomerListApi, courseApi } from "~/apiBase";
import moment from "moment";
import { useWrap } from "~/context/wrap";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import ExpandTable from "~/components/ExpandTable";
import Link from "next/link";
ContractList.layout = LayoutBase;
export default function ContractList() {
  const [dataTable, setDataTable] = useState<IContractCustomerList[]>([]);
  const [dataCourse, setDataCourse] = useState([]);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataFilter, setDataFilter] = useState([
    {
      name: "CourseID",
      title: "Khóa học",
      col: "col-12",
      type: "select",
      optionList: [],
      value: null,
    },
    {
      name: "Accept",
      title: "Trạng thái",
      col: "col-12",
      type: "select",
      optionList: [
        {
          title: "Đã duyệt",
          value: true,
        },
        {
          title: "Chờ duyệt duyệt",
          value: false,
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
    CourseID: null,
    Accept: null,
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
    if (Object.keys(data).length > 0) {
      dataFilter.every((item, index) => {
        if (item.name == name) {
          item.optionList = data;
          return false;
        }
        return true;
      });
      setDataFilter([...dataFilter]);
    } else {
      // setDataCourse(dataCourse);
    }
  };

  // GET DATA TABLE
  const getDataTable = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await contractCustomerListApi.getAll(todoApi);
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

  // GET DATA COURSE
  const getDataCourse = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await courseApi.getAll({ selectAll: true });
        if (res.status == 204) {
          showNoti("danger", "Không có dữ liệu");
        }
        if (res.status == 200) {
          setDataCourse(res.data.data);
          const newData = res.data.data.map((item) => ({
            title: item.CourseName,
            value: item.ID,
          }));
          setDataFunc("CourseID", newData);
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
      res = await contractCustomerListApi.update(data);
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

  // Accept or Not Accept
  const changeStatus = async (checked: boolean, idRow: number) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    let dataChange = {
      ID: idRow,
      Accept: checked,
    };

    _onSubmit(dataChange);
    // try {
    // 	let res = await sourceInfomationApi.update(dataChange);
    // 	res.status == 200 && setTodoApi(listTodoApi),
    // 	showNoti("success", res.data.message), getDataTable();
    // } catch (error) {
    // 	showNoti("danger", error.Message);
    // } finally {
    // 	setIsLoading({
    // 	type: "GET_ALL",
    // 	status: false,
    // 	});
    // }
  };

  const columns = [
    {
      title: "Học viên",
      dataIndex: "FullNameUnicode",
      ...FilterColumn("FullNameUnicode", onSearch, handleReset, "text"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    {
      title: "Khóa học",
      dataIndex: "CourseName",
      // ...FilterColumn("city")
    },
    {
      title: "Ngày tạo",
      dataIndex: "CreatedOn",
      // ...FilterDateColumn("city")
      render: (a) => <p>{moment(a).format("DD/MM/YYYY")}</p>,
    },
    {
      title: "Chấp nhận",
      dataIndex: "Accept",
      render: (Accept, record) => (
        <>
          <Switch
            checkedChildren="Có"
            unCheckedChildren="Không"
            checked={Accept}
            size="default"
            onChange={(checked) => changeStatus(checked, record.ID)}
          />
        </>
      ),
    },
    {
      title: "",
      render: (record) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Link
              href={{
                pathname:
                  "/customer/contract/contract-customer-list/contract-customer-detail/[slug]",
                query: { slug: record.ID },
              }}
            >
              <a className="btn btn-icon view">
                <Eye />
              </a>
            </Link>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    getDataTable();
    getDataCourse();
  }, [todoApi]);

  return (
    <PowerTable
      loading={isLoading}
      currentPage={currentPage}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="Danh sách học viên có hợp đồng"
      // TitleCard={<StudyTimeForm showAdd={true} />}
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
  );
}
