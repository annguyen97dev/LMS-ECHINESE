import React, { Fragment, useEffect, useState } from "react";
import PowerTable from '~/components/PowerTable';
import {data} from '../../../lib/option/dataOption2';
import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';
import SortBox from '~/components/Elements/SortBox';
import FilterTable from '~/components/Global/CourseList/FitlerTable';
import PurposeForm from '~/components/Global/Option/PurposeForm';
import LayoutBase from '~/components/LayoutBase';
import FilterPurposeTable from '~/components/Global/Option/FilterTable/FilterPurposeTable';
import { Tag, Tooltip, Switch, Input, Button, Space } from "antd";
import { useWrap } from "~/context/wrap";
import { puroseApi } from "~/apiBase";
import { AlertTriangle, X } from "react-feather";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";

const Purpose = () => {
	const [dataPurpose, setDataPurpose] = useState<IPurpose[]>([]);
	const [dataDelete, setDataDelete]  = useState({
		PurposesID: null,
		Enable: null,
	});
	const { showNoti } = useWrap();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
	  type: "",
	  status: false,
	});
	const [totalPage, setTotalPage] = useState(null);

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
		PurposesName: "",
		ModifiedBy: "",
	};

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: 10,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET DATA STAFFSALARY
	const getDataPurpose = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await puroseApi.getAll(todoApi);
			res.status == 200 && setDataPurpose(res.data.data);
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
  
	// ADD DATA
	const _onSubmit = async (data: any) => {
	  setIsLoading({
		type: "ADD_DATA",
		status: true,
	  });
  
	  let res = null;
  
	  if(data.PurposesID) {
		console.log(data);
		try {
		  res = await puroseApi.update(data);
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
		  res = await puroseApi.add(data);
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
	  getDataPurpose();
	};

	// PAGINATION
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		getDataPurpose();
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
		let clearKey = compareField(valueSearch, dataIndex);

		setTodoApi({
			...todoApi,
			...clearKey,
		});

	};

	// DELETE
	const handleDelele = () => {
		if(dataDelete) {
			let res = _onSubmit(dataDelete);
			res.then(function (rs: any) {
				rs && rs.status == 200 && setIsModalVisible(false);
			});
		}
	}

	// HANDLE RESET
	const handleReset = () => {
		setTodoApi(listTodoApi);
	};

	// HANDLE SORT
	const handleSort = async (option) => {
		console.log('Show option: ', option);

		let newTodoApi = {
			...listTodoApi,
			sort: option.title.sort,
			sortType: option.title.sortType,
		};

		setTodoApi(newTodoApi);
	};

	// COLUMNS TABLE
	const columns = [
		{
			title: 'Purposes Name', 
			dataIndex: 'PurposesName', 
			...FilterColumn('PurposesName', onSearch, handleReset, "text")
		},
		{
			title: 'Modified By', 
			dataIndex: 'ModifiedBy', 
			// ...FilterColumn('ModifiedBy', onSearch, handleReset, "text")
		},
		{
			title: 'Modified On',
			dataIndex: 'ModifiedOn',
			render: (date) => moment(date).format("DD/MM/YYYY"),
			// ...FilterDateColumn("expires"),
		},
		{
			render: (record) => (
				<>
					<PurposeForm 
						showIcon={true}
						rowData={record}
						isLoading={isLoading}
						_onSubmit={(data: any) => _onSubmit(data)}	
					/>
					<Tooltip title="Xóa">
						<button
							className="btn btn-icon delete"
							onClick={() => {
								setIsModalVisible(true);
								setDataDelete({
									PurposesID: record.PurposesID,
									Enable: false,
								});
							}}
						>
							<X />
						</button>
					</Tooltip>
				</>
			),
		},
	];

	useEffect(() => {
		getDataPurpose();
	}, [todoApi])


	return (
		<Fragment>
			<Modal
				title={<AlertTriangle color="red" />}
				visible={isModalVisible}
				onOk={() => handleDelele()}
				onCancel={() => setIsModalVisible(false)}
			>
				<span className="text-confirm">Bạn có chắc chắn muốn xóa không ?</span>
			</Modal>
			<PowerTable
				loading={isLoading}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				addClass="basic-header"
				TitlePage="PURPOSES list"
				TitleCard={
					<PurposeForm 
						showAdd={true} 
						isLoading={isLoading} 
						_onSubmit={(data: any) => _onSubmit(data)}
					/>}
				dataSource={dataPurpose}
				columns={columns}
				Extra={
					<div className="extra-table">
						{/* <FilterPurposeTable />
						<SortBox 
							handleSort={(value) => handleSort(value)}
							dataOption={dataOption}
						/> */}
					</div>
				}
			/>
		</Fragment>

	);
};

Purpose.layout = LayoutBase;
export default Purpose;
