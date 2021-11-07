import React, { useState, useRef, useCallback, useEffect } from 'react';
import { programApi, studyRoleApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Card, Table } from 'antd';
import AddStudyRole from './AddStudyRole';

const type = 'DraggableBodyRow';

const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
	const ref = useRef();
	const [{ isOver, dropClassName }, drop] = useDrop({
		accept: type,
		collect: (monitor) => {
			//@ts-ignore
			const { index: dragIndex } = monitor.getItem() || {};
			if (dragIndex === index) {
				return {};
			}
			return {
				isOver: monitor.isOver(),
				dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward'
			};
		},
		drop: (item) => {
			//@ts-ignore
			moveRow(item.index, index);
		}
	});
	const [, drag] = useDrag({
		type,
		item: { index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
	});
	drop(drag(ref));

	return <tr ref={ref} className={`${className}${isOver ? dropClassName : ''}`} style={{ cursor: 'move', ...style }} {...restProps} />;
};

const InfoStudyCard = (props) => {
	const { studentID } = props;
	const [dataProgram, setDataProgram] = useState([]);

	const [dataSource, setDataSource] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { showNoti, pageSize } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: 1,
		StudentID: studentID
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	const getDataProgram = async () => {
		try {
			let res = await programApi.getAll({ selectAll: true });
			if (res.status == 200) {
				let newData = res.data.data.map((item) => ({
					title: item.ProgramName,
					value: item.ID
				}));
				setDataProgram(newData);
			}

			res.status == 204 && setDataProgram([]);
		} catch (error) {
			console.log(error.message);
		}
	};

	const getDataSource = async () => {
		setIsLoading(true);
		try {
			let res = await studyRoleApi.getAll(todoApi);

			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow));
			res.status == 204 && setDataSource([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const columns = [
		{
			title: 'Chương trình',
			dataIndex: 'ProgramName',
			key: 'programname'
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note',
			key: 'note'
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			key: 'createdon'
		},
		{
			title: 'Tạo bởi',
			dataIndex: 'CreatedBy',
			key: 'createdby'
		}
	];

	const updatePosition = async (indexFirst, indexAfter) => {
		let dataSubmit = {
			IDOne: indexFirst,
			IDTwo: indexAfter
		};
		setIsLoading(true);
		try {
			let res = await studyRoleApi.changePosition(dataSubmit);
			if (res.status === 200) {
				showNoti('success', 'Đổi vị trí thành công');
				setTodoApi({ ...todoApi });
			} else {
				setIsLoading(false);
			}
		} catch (error) {
			showNoti('danger', error.message);
			setIsLoading(false);
		}
	};

	// const [data, setData] = useState(dataSource);

	const components = {
		body: {
			row: DraggableBodyRow
		}
	};

	const moveRow = useCallback(
		(dragIndex: any, hoverIndex: any) => {
			const dragRow = dataSource[dragIndex];

			const dragID = dataSource[dragIndex].ID;
			const hoverID = dataSource[hoverIndex].ID;

			updatePosition(dragID, hoverID);

			setDataSource(
				update(dataSource, {
					$splice: [
						[dragIndex, 1],
						[hoverIndex, 0, dragRow]
					]
				})
			);
		},
		[dataSource]
	);

	const onFetchData = () => {
		setTodoApi({ ...todoApi });
		setCurrentPage(1);
	};

	useEffect(() => {
		getDataSource();
		if (dataProgram.length == 0) {
			getDataProgram();
		}
	}, [todoApi]);

	return (
		<>
			<div className="wrap-table">
				<Card extra={<AddStudyRole studentID={studentID} dataProgram={dataProgram} onFetchData={() => onFetchData()} />}>
					<DndProvider backend={HTML5Backend}>
						<Table
							className="table-drop"
							columns={columns}
							dataSource={dataSource}
							components={components}
							//@ts-ignore
							onRow={(record, index) => ({ index, moveRow, record })}
							loading={isLoading}
							size="middle"
						/>
					</DndProvider>
				</Card>
			</div>
		</>
	);
};

export default InfoStudyCard;
