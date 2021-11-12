import React, { useEffect, useState } from 'react';
import PowerTable from '~/components/PowerTable';
import { useRouter } from 'next/router';
import { useWrap } from '~/context/wrap';
import { curriculumDetailApi, examTopicApi, subjectApi } from '~/apiBase';
import CurriculumForm from '~/components/Global/Option/CurriculumForm';
import { Tooltip, Select, Button } from 'antd';
import Link from 'next/link';
import { Info } from 'react-feather';
import NestedTable from '~/components/Elements/NestedTable';
import { PlusOutlined } from '@ant-design/icons';
import AddCurriculumForm from './AddCurriculumForm';
import DetailsModal from './DetailsModal';

let pageIndex = 1;

let listFieldSearch = {
	pageIndex: 1
};

const CurriculumDetail = (props) => {
	const { Option } = Select;
	const router = useRouter();
	// const curriculumID = parseInt(router.query.slug as string);
	const { curriculumID, dataSubject } = props;

	const [saveValue, setSaveValue] = useState([]);
	const [loadingSelect, setLoadingSelect] = useState({
		id: null,
		status: false
	});

	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<ICurriculumDetail[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [examTopic, setExamTopic] = useState({
		pageIndex: 1,
		pageSize: pageSize,
		// CurriculumID: curriculumID ? curriculumID : null,
		Type: 3
	});
	const [totalPage, setTotalPage] = useState(null);
	const [indexRow, setIndexRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		CurriculumID: curriculumID ? curriculumID : null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);
	const [dataExamTopic, setDataExamTopic] = useState(null);

	// GET DATA COURSE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await curriculumDetailApi.getAll(todoApi);

			if (res.status == 200) {
				if (res.data.data.length > 0) {
					setDataSource(res.data.data);
					setTotalPage(res.data.totalRow);
					// showNoti("success", "Thành công");
				} else {
					showNoti('danger', 'Không có dữ liệu');
				}
			}

			res.status == 204 && showNoti('danger', 'Không có dữ liệu') && setDataSource([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	// ---------------- AFTER SUBMIT -----------------
	const afterPost = (mes) => {
		showNoti('success', mes);
		setTodoApi({
			...listTodoApi
			// pageIndex: 1,
		});
		setCurrentPage(1);
	};

	const updateSubject = async (value, data, index) => {
		let cloneData = { ...data };
		cloneData.SubjectID = value;

		// let cloneArr = [...saveValue];
		// cloneArr.push(data);
		// setSaveValue(cloneArr);

		setLoadingSelect({
			id: data.ID,
			status: true
		});

		try {
			let res = await curriculumDetailApi.update({
				ID: data.ID,
				SubjectID: value
			});

			if (res.status == 200) {
				let newDataSource = [...dataSource];
				newDataSource.splice(index, 1, cloneData);
				setDataSource(newDataSource);
				showNoti('success', res.data.message);
			}
		} catch (error) {
			console.log('error: ', error);
			showNoti('danger', error.message);
		} finally {
			setLoadingSelect({
				id: data.ID,
				status: false
			});
		}
	};

	const returnValue = (ID: any) => {
		let value = null;
		dataSource.every((item, index) => {
			if (item.ID == ID) {
				value = item.SubjectID;
				return false;
			} else {
				return true;
			}
		});

		// console.log("Value is: ", value);
		return value;
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi
			// ...listFieldSearch,
			// pageIndex: pageIndex,
		});
	};

	const getLessonID = async () => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});

		try {
			let res = await examTopicApi.getAll(examTopic);
			if (res.status == 200) {
				// showNoti("success", "Upload file thành công");
				setDataExamTopic(res.data.data);
			} else if (res.status == 204) {
				// showNoti("danger", "Không có dữ liệu");
			}
		} catch (error) {
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource();
		getLessonID();
	}, [todoApi]);
	// console.log(dataSource);

	const columns = [
		{
			title: 'Môn học',
			dataIndex: 'SubjectName',
			key: 'subjectname',
			className: 'text-center',
			render: (text, data, index) => (
				<Select
					loading={data.ID == loadingSelect.id && loadingSelect.status}
					value={returnValue(data.ID)}
					style={{ width: '100%', margin: 'auto' }}
					className="style-input"
					showSearch
					optionFilterProp="children"
					defaultValue={data.SubjectID}
					onChange={(value) => updateSubject(value, data, index)}
				>
					<Option key="none" value={0}>
						Trống
					</Option>
					{dataSubject?.map((item, index) => (
						<Option key={index} value={item.ID}>
							{item.SubjectName}
						</Option>
					))}
				</Select>
			)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			key: 'statusname',
			className: 'text-center',
			render: (text, data) => (
				<div>
					<p>{data?.IsExam ? 'Kiểm tra' : 'Buổi học'}</p>
				</div>
			)
		},
		{
			title: 'Số buổi học',
			dataIndex: 'LessonNumber',
			key: 'lessonnumber',
			className: 'col-short text-center'
		},
		// {
		//   title: "",
		//   dataIndex: "StatusName",
		//   key: "statusname",
		//   className: "text-center",
		//   render: (text, data) => (
		//     <AddCurriculumForm
		//       curriculumDetailID={data.ID}
		//       dataExamTopic={dataExamTopic}
		//       dataCurriculumDetail={dataSource}
		//       callFrom="main"
		//       onFetchData={() => setTodoApi({ ...todoApi })}
		//     />
		//   ),
		// },
		{
			title: '',
			dataIndex: 'StatusName',
			key: 'statusname',
			className: 'text-center',
			render: (text, data) => (
				<>
					<AddCurriculumForm
						curriculumDetailID={data.ID}
						dataExamTopic={dataExamTopic}
						dataCurriculumDetail={dataSource}
						callFrom="main"
						onFetchData={() => setTodoApi({ ...todoApi })}
					/>
					<DetailsModal
						curriculumDetailID={data.ID}
						dataExamTopic={dataExamTopic}
						dataCurriculumDetail={dataSource}
						onFetchData={() => setTodoApi({ ...todoApi })}
					/>
				</>
			)
		}
	];

	return (
		<div>
			<NestedTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				addClass="table-curriculum-detail"
				loading={isLoading}
				dataSource={dataSource}
				columns={columns}
			/>
		</div>
	);
};

export default CurriculumDetail;
