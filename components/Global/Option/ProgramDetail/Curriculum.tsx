import React, { useEffect, useState } from 'react';
import PowerTable from '~/components/PowerTable';
import { useRouter } from 'next/router';
import { useWrap } from '~/context/wrap';
import { curriculumApi, programApi, subjectApi } from '~/apiBase';
import CurriculumForm from '~/components/Global/Option/CurriculumForm';
import { Modal, Select, Tooltip } from 'antd';
import Link from 'next/link';
import { Info } from 'react-feather';
import ExpandTable from '~/components/ExpandTable';
import CurriculumDetail from './CurriculumDetail';
import { resolveSoa } from 'dns';
import { DiffOutlined, SnippetsOutlined } from '@ant-design/icons';
import DeleteItem from '~/components/Tables/DeleteItem';

let pageIndex = 1;

let listFieldSearch = {
	pageIndex: 1
};

const dataOption = [
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Tên giảm dần'
	},
	{
		dataSort: {
			sort: 0,
			sortType: true
		},
		text: 'Tên tăng dần '
	}
];

const Curriculum = (props) => {
	const { key } = props;
	const router = useRouter();
	const programID = parseInt(router.query.slug as string);

	const [dataProgram, setDataProgram] = useState<IProgram[]>([]);
	const [dataSubject, setDataSubject] = useState<ISubject[]>();
	const [curriculumID, setCurriculumID] = useState(null);

	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<ICurriculum[]>([]);
	const { showNoti, pageSize, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [indexRow, setIndexRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		ProgramID: programID ? programID : null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET DATA COURSE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await curriculumApi.getAll(todoApi);

			if (res.status == 200) {
				if (res.data.data.length > 0) {
					setDataSource(res.data.data);
					setTotalPage(res.data.totalRow);

					// showNoti("success", "Tải giáo trình thành công");
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

	// GET DATA PROGRAM
	const getDataProgram = async () => {
		try {
			let res = await programApi.getAll(todoApi);
			res.status == 200 && setDataProgram(res.data.data);

			res.status == 204 && showNoti('danger', 'Không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	// ---------------- GET DATA SUBJECT -------------

	const getDataSubject = async () => {
		try {
			let res = await subjectApi.getAll({
				ProgramID: programID,
				pageIndex: 1,
				pageSize: 9999
			});

			if (res.status == 200) {
				if (res.data.data.length > 0) {
					setDataSubject(res.data.data);
				} else {
					showNoti('danger', 'Không có dữ liệu môn học');
				}
			}

			res.status == 204 && showNoti('danger', 'Không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	// ---------------- AFTER SUBMIT -----------------
	const afterPost = (mes) => {
		showNoti('success', mes);
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// ----------------- ON SUBMIT --------------------
	const _onSubmit = async (dataSubmit: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});

		let res = null;

		if (dataSubmit.ID) {
			try {
				res = await curriculumApi.update(dataSubmit);

				if (res.status == 200) {
					let newDataSource = [...dataSource];
					newDataSource.splice(indexRow, 1, dataSubmit);
					setDataSource(newDataSource);
					showNoti('success', res.data.message);
					getDataSubject();
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		} else {
			try {
				res = await curriculumApi.add(dataSubmit);
				res?.status == 200 && (afterPost(res.data.message), getDataSubject());
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		}

		return res;
	};

	// HANDLE RESET
	const resetListFieldSearch = () => {
		Object.keys(listFieldSearch).forEach(function (key) {
			if (key != 'pageIndex') {
				listFieldSearch[key] = null;
			}
		});
	};

	const handleReset = () => {
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1), resetListFieldSearch();
	};

	// -------------- HANDLE DELETE --------------
	const handleDelete = async (data) => {
		console.log('DATA DELTETE: ', data);
		try {
			let res = await curriculumApi.update({
				ID: data.ID,
				Enable: false
			});
			if (res.status === 200) {
				showNoti('success', 'Xóa thành công');
				setTodoApi({ ...todoApi });
			} else {
				showNoti('danger', 'Đường truyền mạng đang không ổn định');
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			// ...listFieldSearch,
			pageIndex: pageIndex
		});
	};

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource();
	}, [todoApi, key]);

	useEffect(() => {
		getDataProgram();
		getDataSubject();
	}, []);

	// EXPANDED ROW RENDER

	const expandedRowRender = () => {
		return (
			<>
				<CurriculumDetail
					isFixed={true}
					isNested={true}
					loadingOut={isLoading}
					dataSubject={dataSubject}
					programID={programID}
					curriculumID={curriculumID}
				/>
			</>
		);
	};

	const columns =
		userInformation && userInformation.RoleID !== 2
			? [
					{
						title: 'ID',
						dataIndex: 'ID',
						render: (id) => <p className="font-weight-black">{id}</p>,
						fixed: 'left'
					},
					{
						width: '50%',
						title: 'Giáo trình',
						dataIndex: 'CurriculumName',
						key: 'curriculumname',
						render: (text) => <p className="font-weight-black">{text}</p>,
						fixed: 'left'
					},
					{
						width: 120,
						title: 'Thời gian học',
						dataIndex: 'TimeOfLesson',
						key: 'timeoflesson',
						className: 'text-center'
					},
					{
						width: 120,
						title: 'Số buổi học',
						dataIndex: 'Lesson',
						key: 'lesson',
						className: 'text-center'
					},

					{
						width: 130,
						key: 'action',
						render: (text, data, index) => (
							<>
								<CurriculumForm
									dataProgram={dataProgram}
									getIndex={() => setIndexRow(index)}
									index={index}
									rowData={data}
									rowID={data.ID}
									isLoading={isLoading}
									_onSubmit={(data: any) => _onSubmit(data)}
								/>
								<PickAllSubject
									dataSubject={dataSubject}
									curriculumID={data.ID}
									onFetchData={() => setTodoApi({ ...todoApi })}
								/>
								<DeleteItem onDelete={() => handleDelete(data)} />
							</>
						)
					}
			  ]
			: [
					{
						title: 'ID',
						dataIndex: 'ID',
						render: (id) => <p className="font-weight-black">{id}</p>,
						fixed: 'left'
					},
					{
						width: '50%',
						title: 'Giáo trình',
						dataIndex: 'CurriculumName',
						key: 'curriculumname',
						render: (text) => <p className="font-weight-black">{text}</p>,
						fixed: 'left'
					},
					{
						width: 120,
						title: 'Thời gian học',
						dataIndex: 'TimeOfLesson',
						key: 'timeoflesson',
						className: 'text-center'
					},
					{
						width: 120,
						title: 'Số buổi học',
						dataIndex: 'Lesson',
						key: 'lesson',
						className: 'text-center'
					}
			  ];

	return (
		<div>
			<ExpandTable
				addClass="table-medium"
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				TitleCard={
					userInformation &&
					userInformation.RoleID !== 2 && (
						<CurriculumForm dataProgram={dataProgram} isLoading={isLoading} _onSubmit={(data: any) => _onSubmit(data)} />
					)
				}
				dataSource={dataSource}
				columns={columns}
				Extra={'Giáo trình'}
				expandable={{ expandedRowRender }}
				handleExpand={(record: any) => (setCurriculumID(record.ID), getDataSubject())}
			/>
		</div>
	);
};

export default Curriculum;

const PickAllSubject = (props) => {
	const { Option } = Select;
	const { dataSubject, curriculumID, onFetchData } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [valueSubject, setValueSubject] = useState(false);
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = async () => {
		setLoading(true);

		let dataSubmit = {
			ID: curriculumID,
			SubjectID: valueSubject
		};

		try {
			let res = await curriculumApi.addSubject(dataSubmit);
			if (res.status === 200) {
				showNoti('success', 'Thêm môn học thành công');
				setIsModalVisible(false);
				onFetchData();
				setValueSubject(null);
			} else {
				showNoti('danger', 'Đường truyền mạng đang không ổn định');
			}
		} catch (error) {
			showNoti('error', error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleChange_Subject = (value) => {
		setValueSubject(value);
	};

	return (
		<>
			<Tooltip title="Thêm môn học cho tất cả các buổi">
				<button className="btn btn-icon view" onClick={showModal}>
					<DiffOutlined />
				</button>
			</Tooltip>
			<Modal
				title="Thêm môn học"
				visible={isModalVisible}
				okButtonProps={{ loading: loading }}
				onOk={handleOk}
				onCancel={handleCancel}
				okText="Lưu"
				cancelText="Hủy"
			>
				<p className="font-weight-black mb-2">Chọn môn học</p>
				<Select className="w-100 style-input" onChange={handleChange_Subject}>
					{dataSubject?.map((item) => (
						<Option key={item.ID} value={item.ID}>
							{item.SubjectName}
						</Option>
					))}
				</Select>
			</Modal>
		</>
	);
};
