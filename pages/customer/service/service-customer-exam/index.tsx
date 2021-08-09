import React, { Fragment, useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { Eye, AlertTriangle, X, Edit } from "react-feather";
import { Tooltip } from "antd";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import Link from "next/link";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import ServiceCustomerExam from "~/components/Global/Customer/Service/ServiceCustomerExam";
import LayoutBase from "~/components/LayoutBase";
import { serviceCustomerExamApi, serviceCustomerExamResultApi, serviceApi } from "~/apiBase";
import moment from "moment";
import { useWrap } from "~/context/wrap";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";

CustomerServiceExam.layout = LayoutBase;

export default function CustomerServiceExam() {
	const [dataTable, setDataTable] = useState<IServiceCustomerExam[]>([]);
  const [dataService, setDataService] = useState([]);
	const { showNoti } = useWrap();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
		type: "",
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [dataFilter, setDataFilter] = useState([
    {
      name: "ServiceID",
      title: "Đợt thi",
      col: "col-6",
      type: "select",
      optionList: [],
      value: null,
    },
    {
      name: "isResult",
      title: "Điểm bài thi",
      col: "col-6",
      type: "select",
      optionList: [
        {
          title: "Chưa nhập điểm",
          value: false
        },
        {
          title: "Đã nhập điểm",
          value: true
        }
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
	])

	let pageIndex = 1;

	// SORT
	const dataOption = [
		{
			dataSort: {
				sort: 2,
				sortType: false,
			},
			value: 3,
			text: 'Tên giảm dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: true,
			},
			value: 4,
			text: 'Tên tăng dần ',
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
    isResult: null,
    ServiceID: null,
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
			let res = await serviceCustomerExamApi.getAll(todoApi);
			if (res.status == 204) {
				showNoti("danger", "Không có dữ liệu");
			}
			if(res.status == 200){
				setDataTable(res.data.data);
				if(res.data.data.length < 1) {
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

  const getDataService = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await serviceApi.getAll({selectAll: true});
			if (res.status == 204) {
				showNoti("danger", "Không có dữ liệu");
			}
			if(res.status == 200){
        const newData = res.data.data.map((item) => ({
          title: item.ServiceName,
          value: item.ID,
        }));
        setDataFunc("ServiceID", newData);
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
		console.log('Show option: ', option);

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
      status: true
    });
    let res;
    try {
      res = await serviceCustomerExamResultApi.add(data);
      res?.status == 200 && showNoti("success", "Cập nhật thành công"), getDataTable();
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "ADD_DATA",
        status: false
      })
    }
    return res;
  }

  const columns = [
    {
      title: "Học viên",
      dataIndex: "FullNameUnicode",
      ...FilterColumn('FullNameUnicode', onSearch, handleReset, "text"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    {
      title: "Đợt thi",
      dataIndex: "ServiceName",
      // ...FilterColumn("testTime"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Hình thức thi",
      dataIndex: "ExamOfServiceStyleName",
      render: (typeTest) => {
        return (
          <>
            {typeTest == "Thi Thử" ? (
              <span className="tag blue">{typeTest}</span>
            ) : (
              <span className="tag green">{typeTest}</span>
            )}
          </>
        );
      }
    },
    // {
    //   title: "Nhà cung cấp",
    //   dataIndex: "SupplierServicesName",
    //   // ...FilterColumn("provider"),
    // },
    {
      title: "Giá tiền",
      dataIndex: "Price",
      // ...FilterColumn("testCost"),
      render: (Price) =>  { return <p className="font-weight-black">{Intl.NumberFormat('ja-JP').format(Price)}</p> }
    },
    {
      title: "Ngày thi",
      dataIndex: "DayOfExam",
      // ...FilterDateColumn("testDate"),
      render: (a) => <p className="font-weight-black">{moment(a).format("DD/MM/YYYY")}</p>,
    },
    {
      title: "Ngày đăng kí",
      dataIndex: "CreatedOn",
      // ...FilterDateColumn("regDate"),
      render: (a) => <p className="font-weight-black">{moment(a).format("DD/MM/YYYY")}</p>,
    },
    {
      render: (record) => (
        <>
          <ServiceCustomerExam 
              showIcon={true}
              rowData={record}
              isLoading={isLoading}
              _onSubmit={(data: any) => _onSubmit(data)}
              isResult={record.isResult}
          />
          <Link
            href={{
              pathname:
                "/customer/service/service-customer-exam/student-detail/[slug]",
              query: { slug: 2 },
            }}
          >
            <Tooltip title="Xem chi tiết">
              <button className="btn btn-icon view">
                <Eye />
              </button>
            </Tooltip>
          </Link>
        </>
      ),
    },
  ];

  useEffect(() => {
    getDataTable();
    getDataService();
  }, [todoApi]);

  return (
    <>
      <PowerTable
        loading={isLoading}
        currentPage={currentPage}
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        addClass="basic-header"
        TitlePage="Danh sách đăng kí đi thi"
        dataSource={dataTable}
        // TitleCard={<ServiceCustomerExam showAdd={true} isLoading={isLoading} />}
        columns={columns}
        Extra={
          <div className="extra-table">
            <FilterBase            
              dataFilter={dataFilter}
              handleFilter={(listFilter: any) => handleFilter(listFilter)}
              handleReset={handleReset} />
            <SortBox 
              handleSort={(value) => handleSort(value)}
              dataOption={dataOption} />
          </div>
        }
      />
    </>

  );
}
