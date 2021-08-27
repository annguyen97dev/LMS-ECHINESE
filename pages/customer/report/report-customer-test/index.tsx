import React, { Fragment, useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { Eye } from "react-feather";
import { Tooltip } from "antd";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import Link from "next/link";
import FilterColumn from "~/components/Tables/FilterColumn";
import LayoutBase from "~/components/LayoutBase";
import { examComingSoonApi } from "~/apiBase";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";
import { useWrap } from "~/context/wrap";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
ReportTest.layout = LayoutBase;

export default function ReportTest() {
	const [dataTable, setDataTable] = useState<IExamComingSoon[]>([]);
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
		name: "date-range",
		title: "Từ - đến",
		col: "col-12",
		type: "date-range",
		value: null,
		},
	])
	const [activeColumnSearch, setActiveColumnSearch] = useState('');

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

	// GET DATA TABLE
	const getDataTable = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await examComingSoonApi.getAll(todoApi);
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
		setActiveColumnSearch('');
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
		  pageSize: pageSize
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


	const columns = [
		// { 
		//   title: "Tỉnh/TP", dataIndex: "AreaName", 
		//   // ...FilterColumn("AreaName", onSearch, handleReset, "select", dataArea) 
		// },
		{
		title: "Họ và tên",
		dataIndex: "FullNameUnicode",
		...FilterColumn('FullNameUnicode', onSearch, handleReset, "text"),
		className: activeColumnSearch === 'UserInformationID' ? 'active-column-search' : '',
		render: (a) => <p className="font-weight-blue">{a}</p>,
		},
		{ title: "SĐT", dataIndex: "Mobile"},
		{ title: "Email", dataIndex: "Email"},
		// { 
		//   title: "Nguồn", 
		//   dataIndex: "SourceInformationName"},
		// {
		//   title: "Tư vấn viên",
		//   dataIndex: "CounselorsName",
		//   // ...FilterColumn("apmConsultant"),
		// },
		{
		title: "Ngày thi",
		dataIndex: "DayOfExam",
		render: (a) => <p className="font-weight-black">{moment(a).format("DD/MM/YYYY")}</p>,
		},
		{
		title: "",
		render: () => (
			<>
			<Link
				href={{
				pathname:
					"/customer/report/report-customer-test/student-detail/[slug]",
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
		console.log(dataFilter);
	}, [todoApi]);

  return (
    <PowerTable
      loading={isLoading}
	  currentPage={currentPage}
	  totalPage={totalPage && totalPage}
	  getPagination={getPagination}
      addClass="basic-header"
      TitlePage="Danh sách học viên sắp thi"
      dataSource={dataTable}
      columns={columns}
      // TitleCard={<StudyTimeForm showAdd={true} />}
      Extra={
        <div className="extra-table">
          <FilterBase            
            dataFilter={dataFilter}
            handleFilter={(listFilter: any) => handleFilter(listFilter)}
            handleReset={handleReset}/>
          <SortBox 
            handleSort={(value) => handleSort(value)}
            dataOption={dataOption} />
        </div>
      }
    />
  );
}
