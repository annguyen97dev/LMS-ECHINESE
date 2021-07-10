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
const StaffSalary = () => {
	const [dataStaffSalary, setDataStaffSalary] = useState([]);
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
	  type: "",
	  status: false,
	});
	const [isOpen, setIsOpen] = useState({
	  isOpen: false,
	  status: null,
	});
	const [dataHidden, setDataHidden] = useState({
	  ListCourseId: null,
	  Enable: null,
	});
	const [rowData, setRowData] = useState();
	const [totalPage, setTotalPage] = useState(null);

	let indexPage = 1;
  
	const getDataStaffSalary = () => {
	  setIsLoading({
		type: "GET_ALL",
		status: true,
	  });
	  (async () => {
		try {
		  let res = await staffSalaryApi.getAll(10, indexPage);
		  res.status == 200 && setDataStaffSalary(res.data.data);
		  setTotalPage(res.data.TotalRow);
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
  
	const getDataStaffSalaryWidthID = (UserID: number) => {
	  setIsLoading({
		type: "GET_WITH_ID",
		status: true,
	  });
	  (async () => {
		try {
		  let res = await staffSalaryApi.getByID(UserID);
		  res.status == 200 && setRowData(res.data.data); 
		} catch (error) {
		  showNoti("danger", error.message);
		} finally {
		  setIsLoading({
			type: "GET_WITH_ID",
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
  
	  if(data.ID) {
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
  
	// DELETE COURSE
	// const changeStatus = async (checked: boolean, idRow: number) => {
	//   console.log("Checked: ", checked);
	//   console.log("Branch ID: ", idRow);
  
	//   setIsLoading({
	// 	type: "GET_ALL",
	// 	status: true,
	//   });
  
	//   try {
	// 	let res = await serviceApi.changeStatus(idRow);
	// 	res.status == 200 && getDataService();
	//   } catch (error) {
	// 	showNoti("danger", error.Message);
	//   } finally {
	// 	setIsLoading({
	// 	  type: "GET_ALL",
	// 	  status: false,
	// 	});
	//   }
	// };
  
	const afterPost = (value) => {
	  showNoti("success", `${value} thành công`);
	  getDataStaffSalary();
	  // addDataSuccess(), setIsModalVisible(false);
	};

	const getPagination = (pageNumber: number) => {
		indexPage = pageNumber;
		getDataStaffSalary();
	};

	const columns = [
		{title: 'Full name', dataIndex: 'FullName', ...FilterColumn('FullName')},
		{
			title: 'Username',
			dataIndex: 'UserName',
			...FilterColumn('UserName'),
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			// ...FilterColumn("email")
		},
		{title: 'Role', dataIndex: 'Role', ...FilterColumn('Role')},
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
		{title: 'Modified By', dataIndex: 'ModifiedBy', ...FilterColumn('ModifiedBy')},
		{
			title: 'Modified Date',
			dataIndex: 'ModifiedDate',
			// ...FilterDateColumn('modDate'),
		},
		{
			render: (record) => (
				<>
					<StaffSalaryForm 
						showIcon={true}
						UserID ={record.ID}
						rowData={rowData}
						isLoading={isLoading}
						getDataStaffSalaryWidthID={(UserID: number) => {
							getDataStaffSalaryWidthID(UserID);
						}}
						_onSubmit={(data: any) => _onSubmit(data)}
						/>
				</>
			),
		},
	];

	useEffect(() => {
		getDataStaffSalary();
	}, [])

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
