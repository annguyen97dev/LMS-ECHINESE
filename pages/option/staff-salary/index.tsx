import React, { Fragment, useEffect, useState } from "react";
import SortBox from '~/components/Elements/SortBox';
import FilterStaffSalaryTable from '~/components/Global/Option/FilterTable/FilterStaffSalaryTable';
import StaffSalaryForm from '~/components/Global/Option/StaffSalaryForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {data} from '../../../lib/option/dataOption2';
import { useWrap } from "~/context/wrap";
import { staffSalaryApi } from "~/apiBase";
import { Tag, Tooltip, Switch, Input, Button, Space } from "antd";
import { Item } from "devextreme-react/file-manager";
const StaffSalary = () => {
	const [dataStaffSalary, setDataStaffSalary] = useState<IStaffSalary[]>([]);
	const [dataStaff, setDataStaff] = useState([]);
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
	  type: "",
	  status: false,
	});
	const [totalPage, setTotalPage] = useState(null);

	let pageIndex = 1;

	let listField = {
		FullName: "",
	};

	const listTodoApi = {
		pageSize: 10,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		// branchCode: null,
		// branchName: null,
	};
	
	const [todoApi, setTodoApi] = useState(listTodoApi);

	const getDataStaffSalary = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await staffSalaryApi.getAll(todoApi);
			res.status == 200 && getNewDataStaffSalary(res.data.data);
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

	const getNewDataStaffSalary = (data: any) => {
		data.forEach(item => {
			item.Salary = new Intl.NumberFormat('ja-JP').format(item.Salary);
		});

		setDataStaffSalary(data);
	}

	const getDataStaff = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await staffSalaryApi.getAllStaff();
			res.status == 200 && setDataStaff(res.data.data);
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
  
	// ADD Data
	const _onSubmit = async (data: any) => {
	  setIsLoading({
		type: "ADD_DATA",
		status: true,
	  });
  
	  let res = null;
  
	  if(data.SalaryID) {
		console.log(data);
		try {
		  res = await staffSalaryApi.update(data);
		  res?.status == 200 && afterPost("Sửa");
		} catch (error) {
		  showNoti("danger", error.message);
		} finally {
		  setIsLoading({
			type: "ADD_DATA",
			status: false,
		  });
		}
	  } else {
		try {
		  res = await staffSalaryApi.add(data);
		  res?.status == 200 && afterPost("Thêm");
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
	}
  
	const afterPost = (value) => {
	  showNoti("success", `${value} thành công`);
	  getDataStaffSalary();
	};

	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		getDataStaffSalary();
	};

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
		let clearKey = compareField(valueSearch, dataIndex);

		setTodoApi({
			...todoApi,
			...clearKey,
		});
	};

	// HANDLE RESET
	const handleReset = () => {
		setTodoApi(listTodoApi);
	};

	const columns = [
		{title: 'Full name', dataIndex: 'FullName', ...FilterColumn('FullName', onSearch, handleReset, "text")},
		{
			title: 'Username',
			dataIndex: 'UserName',
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			// ...FilterColumn("email")
		},
		{title: 'Role', dataIndex: 'RoleName',},
		{title: 'Salary', dataIndex: 'Salary'},
		{
			title: 'Type Salary',
			dataIndex: 'StyleName',
			// ...FilterColumn('StyleName'),
			filters: [
				{
					text: "Tính lương theo tháng",
					value: "Tính lương theo tháng"
				},
				{
					text: "Tính lương theo giờ",
					value: "Tính lương theo giờ"
				}
			],
			onFilter: (value, record) => record.StyleName.indexOf(value) === 0,
		},
		{title: 'Created By', dataIndex: 'CreatedBy',},
		{
			title: 'Created Date',
			dataIndex: 'CreatedOn',
			// ...FilterDateColumn('modDate'),
		},
		{
			render: (record) => (
				<>
					<StaffSalaryForm 
						showIcon={true}
						// UserID ={record.ID}
						rowData={record}
						isLoading={isLoading}
						// getDataStaffSalaryWidthID={(UserID: number) => {
						// 	getDataStaffSalaryWidthID(UserID);
						// }}
						_onSubmit={(data: any) => _onSubmit(data)}
						/>
				</>
			),
		},
	];

	useEffect(() => {
		getDataStaffSalary();
		getDataStaff();
	}, [todoApi])

	return (
		<Fragment>
			<PowerTable
				loading={isLoading}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				addClass="basic-header"
				TitlePage="Staff salary"
				TitleCard={
					<StaffSalaryForm 
						showAdd={true}
						isLoading={isLoading} 
						_onSubmit={(data: any) => _onSubmit(data)}
						dataStaff={dataStaff}
					/>}
				dataSource={dataStaffSalary}
				columns={columns}
				Extra={
					<div className="extra-table">
						<FilterStaffSalaryTable />
						<SortBox />
					</div>
				}
			/>
		</Fragment>
	);
};
StaffSalary.layout = LayoutBase;
export default StaffSalary;
