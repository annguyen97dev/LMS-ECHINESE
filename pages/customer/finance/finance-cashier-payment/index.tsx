import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { Image, Tooltip } from "antd";
import SortBox from "~/components/Elements/SortBox";
import ConsultantForm from "~/components/Global/Customer/Finance/ConsultantForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import { ShoppingCart } from "react-feather";
import Link from "next/link";
import LayoutBase from "~/components/LayoutBase";
import { voucherApi, branchApi } from "~/apiBase";
import moment from "moment";
import { useWrap } from "~/context/wrap";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";

FinancePayment.layout = LayoutBase;
export default function FinancePayment() {
  const [dataTable, setDataTable] = useState<IVoucher[]>([]);
  const [dataBranch, setDataBranch] = useState([]);
  const { showNoti, pageSize } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeColumnSearch, setActiveColumnSearch] = useState("");
  const [dataFilter, setDataFilter] = useState([
    {
      name: "BranchID",
      title: "Trung tâm",
      col: "col-12",
      type: "select",
      optionList: [],
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
    BranchID: null,
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
        let res = await voucherApi.getAll(todoApi);
        if (res.status == 204) {
          showNoti("danger", "Không có dữ liệu");
          handleReset();
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

  const getDataBranch = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await branchApi.getAll({ selectAll: true });
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

    setCurrentPage(pageIndex);
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
      type: "ADD_DATA",
      status: true,
    });
    let res;
    try {
      res = await voucherApi.update(data);
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
      className: activeColumnSearch === "ID" ? "active-column-search" : "",
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "Mobile",
      // ...FilterColumn("tel")
    },
    {
      title: "Số tiền",
      dataIndex: "Price",
      // ...FilterColumn("cost"),
      render: (a) => {
        return (
          <p className="font-weight-black">
            {Intl.NumberFormat("ja-JP").format(a)}
          </p>
        );
      },
    },
    {
      title: "Lý do",
      dataIndex: "Reason",
      // ...FilterColumn("fnReasonPayment"),

      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "CreatedOn",
      // ...FilterDateColumn("regDate"),
      render: (a) => <p>{moment(a).format("DD/MM/YYYY")}</p>,
    },
    {
      title: "QR Code",
      render: (record) => (
        <>
          <Image width={50} src={record.Qrcode} />
        </>
      ),
    },
    {
      title: "",
      render: (record) => (
        <>
          <ConsultantForm
            title="Chỉnh sửa phiếu chi"
            isLoading={isLoading}
            rowData={record}
            _onSubmit={(data) => _onSubmit(data)}
          />
          <Link
            href={{
              pathname:
                "/customer/finance/finance-cashier-payment/invoice-detail/[slug]",
              query: { slug: record.ID },
            }}
          >
            <Tooltip title="Xuất phiếu chi">
              <button className="btn btn-icon exchange">
                <ShoppingCart />
              </button>
            </Tooltip>
          </Link>
        </>
      ),
    },
  ];
  useEffect(() => {
    getDataTable();
    getDataBranch();
  }, [todoApi]);

  return (
    <PowerTable
      loading={isLoading}
      currentPage={currentPage}
      totalPage={totalPage && totalPage}
      getPagination={getPagination}
      addClass="basic-header"
      TitlePage="Danh sách phiếu chi"
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
