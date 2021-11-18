import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NestedTable from '~/components/Elements/NestedTable';
import { useWrap } from '~/context/wrap';
import { programDetailPointColumnApi } from '~/apiBase';
import { Card } from 'antd';
import PowerTable from '~/components/PowerTable';
import PointColumnForm from './PointColumnForm';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';

PointColumn.propTypes = {
	SubjectID: PropTypes.number
};
PointColumn.defaultTypes = {
	SubjectID: null
};

const optionType = [
	{ title: 'Cột điểm', value: 1 },
	{ title: 'Điểm trung bình', value: 2 },
	{ title: 'Ghi chú', value: 3 }
];
function PointColumn(props) {
	const { SubjectID } = props;
	const { showNoti } = useWrap();
	const [pointColumnList, setPointColumnList] = useState<IProgramDetailPointColumn[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [filters, setFilters] = useState({
		SubjectID
	});
	const fetchPointColumnList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await programDetailPointColumnApi.getAll(filters);
			if (res.status === 200) {
				setPointColumnList(res.data.data);
				showNoti('success', res.data.message);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	// CREATE
	const onCreatePointColumn = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			const newPointColumn = {
				...data,
				SubjectID
			};
			res = await programDetailPointColumnApi.add(newPointColumn);
			if (res.status === 200) {
				setPointColumnList([...pointColumnList, res.data.data]);
				showNoti('success', res.data.message);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
		return res;
	};
	// UPDATE
	const onUpdatePointColumn = async (newObj: IProgramDetailPointColumn) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			const { ID, Name, Coefficient, Type, Enable } = newObj;
			const newPointColumnAPI =
				Type === 1
					? {
							ID,
							Name,
							Coefficient,
							Enable
					  }
					: { ID, Name, Coefficient: 0, Enable };
			res = await programDetailPointColumnApi.update(newPointColumnAPI);
			if (res.status === 200) {
				setFilters({ ...filters });
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
			return res;
		}
	};
	// DELETE
	const onDeletePointColumn = (idx: number) => {
		return async () => {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			try {
				const delObj = pointColumnList[idx];
				const newDelObj = {
					ID: delObj.ID,
					Enable: false
				};
				const res = await programDetailPointColumnApi.delete(newDelObj);
				if (res.status === 200) {
					if (pointColumnList.length === 1) {
						setPointColumnList([]);
						showNoti('success', 'Thành công');
						return;
					}
					fetchPointColumnList();
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		};
	};

	useEffect(() => {
		fetchPointColumnList();
	}, [filters]);

	const columns = [
		{ title: 'Tên điểm', dataIndex: 'Name' },
		{ title: 'Loại', dataIndex: 'TypeName' },
		{ title: 'Hệ số', dataIndex: 'Coefficient' },
		{
			title: '',
			render: (value, _, idx) => (
				<div>
					<PointColumnForm
						isLoading={isLoading}
						isUpdate={true}
						handleUpdatePointColumn={onUpdatePointColumn}
						updateObj={value}
						optionType={optionType}
					/>
					<DeleteTableRow handleDelete={onDeletePointColumn(idx)} />
				</div>
			)
		}
	];
	return (
		<NestedTable
			TitleCard={
				<div className="list-action-table">
					<PointColumnForm isLoading={isLoading} optionType={optionType} handleCreatePointColumn={onCreatePointColumn} />
				</div>
			}
			loading={isLoading}
			dataSource={pointColumnList}
			columns={columns}
		/>
	);
}

export default PointColumn;
