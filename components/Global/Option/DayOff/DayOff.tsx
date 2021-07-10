import {isSameSecond} from 'date-fns/esm';
import moment from 'moment';
import {useSession} from 'next-auth/client';
import React, {useEffect, useState} from 'react';
import dayOffApi from '~/apiBase/options/day-off';
import DayOffForm from '~/components/Global/Option/DayOff/DayOffForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';
import {useWrap} from '~/context/wrap';
import DayOffCreateForm from './DayOffCreateForm';
import DayOffDelete from './DayOffDelete';
import DayOffUpdateForm from './DayOffUpdateForm';

const formatDate = (date) => {
	console.log(date);
};

const DayOff = () => {
	const [dayOffList, setDayOffList] = useState<IDayOff[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();

	// GET DATA IN FIRST TIME
	useEffect(() => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		const fetchDayOffList = async () => {
			try {
				let res = await dayOffApi.getAll(20, 1);
				res.status == 200 && setDayOffList(res.data.data);
				setTotalPage(res.data.TotalRow);
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false,
				});
			}
		};

		fetchDayOffList();
	}, []);

	// CREATE
	const onCreateDayOff = async (data: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});

		try {
			const res = await dayOffApi.add(data);
			const newDayOffList = [res.data.data, ...dayOffList];
			setDayOffList(newDayOffList);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	// UPDATE
	const onUpdateDayOff = () => {};

	// DELETE
	const onDeleteDayOff = async (id: number, idx: number) => {
		const newDayOffList = [...dayOffList];
		newDayOffList.splice(idx, 1);
		await dayOffApi.delete(id);
		setDayOffList(newDayOffList);
	};
	const columns = [
		{
			title: 'Day off',
			dataIndex: 'DayOff',
			...FilterDateColumn('DayOff'),
			render: (date) => moment(date).format('DD-MM-YYYY'),
		},
		{
			title: 'Note',
			dataIndex: 'DayOffName',
			...FilterColumn('DayOffName'),
		},
		{
			title: 'Modified Date',
			dataIndex: 'CreatedOn',
			...FilterDateColumn('CreatedOn'),
			render: (date) => moment(date).format('DD-MM-YYYY'),
		},
		{
			title: 'Modified By',
			dataIndex: 'CreatedBy',

			// ...FilterDateColumn("expires"),
		},
		{
			render: (value, _, idx) => (
				<>
					<DayOffDelete
						handleDeleteDayOff={onDeleteDayOff}
						deleteObj={value}
						index={idx}
					/>
					<DayOffForm isUpdate={true} />
				</>
			),
		},
	];
	return (
		<PowerTable
			totalPage={totalPage && totalPage}
			loading={isLoading}
			addClass="basic-header"
			TitlePage="Day Off"
			TitleCard={<DayOffForm handleCreateDayOff={onCreateDayOff} />}
			dataSource={dayOffList}
			columns={columns}
			Extra={
				<div className="extra-table">
					{/* <FilterDayOffTable />
					<SortBox /> */}
				</div>
			}
		/>
	);
};

DayOff.layout = LayoutBase;
export default DayOff;
