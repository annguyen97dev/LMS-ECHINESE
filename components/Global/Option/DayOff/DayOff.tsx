import moment from 'moment';
import React, {useEffect, useState} from 'react';
import dayOffApi from '~/apiBase/options/day-off';
import SortBox from '~/components/Elements/SortBox';
import DayOffForm from '~/components/Global/Option/DayOff/DayOffForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';
import {useWrap} from '~/context/wrap';
import DayOffDelete from './DayOffDelete';

const DayOff = () => {
	const [dayOffList, setDayOffList] = useState<IDayOff[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();
	const [filter, setFilter] = useState({
		pageIndex: 1,
		pageSize: 10,
		sort: '',
		seacrhDay: '',
		fromDate: '',
		toDate: '',
		searchCreateby: '',
		seacrhNote: '',
		sealectall: '',
	});
	// GET DATA IN FIRST TIME
	const fetchDayOffList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await dayOffApi.getAll(filter);
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
	useEffect(() => {
		fetchDayOffList();
	}, [filter]);

	const getPagination = (pageNumber: number) => {
		const newFilter = {
			...filter,
			pageIndex: pageNumber,
		};
		setFilter(newFilter);
	};

	// CREATE
	const onCreateDayOff = async (data: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});

		try {
			const res = await dayOffApi.add({...data, Enable: true});
			const {data: newData, message} = res.data;
			if (res.status === 200) {
				const newDayOffList = [newData, ...dayOffList];
				setDayOffList(newDayOffList);
				fetchDayOffList();
				showNoti('success', message);
			}
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

	const onUpdateDayOff = async (newObj: any, idx: number, oldObj: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const newDayOff = {
				...oldObj,
				...newObj,
			};
			const res = await dayOffApi.update(newDayOff);
			if (res.status === 200) {
				const {message} = res.data;
				const newDayOffList = [...dayOffList];
				newDayOffList.splice(idx, 1, newDayOff);
				setDayOffList(newDayOffList);
				showNoti('success', message);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};

	// DELETE
	const onDeleteDayOff = async (id: number, idx: number) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const res = await dayOffApi.delete(id);
			if (res.status === 200) {
				const {message} = res.data;
				const newDayOffList = [...dayOffList];
				newDayOffList.splice(idx, 1);
				setDayOffList(newDayOffList);
				fetchDayOffList();
				showNoti('success', message);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
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
					<DayOffForm
						isUpdate={true}
						updateObj={value}
						idxUpdateOjb={idx}
						handleUpdateDayOff={onUpdateDayOff}
					/>
				</>
			),
		},
	];
	return (
		<PowerTable
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			loading={isLoading}
			addClass="basic-header"
			TitlePage="Day Off"
			TitleCard={
				<DayOffForm isUpdate={false} handleCreateDayOff={onCreateDayOff} />
			}
			dataSource={dayOffList}
			columns={columns}
			Extra={
				<div className="extra-table">
					{/* <FilterDayOffTable /> */}
					<SortBox />
				</div>
			}
		/>
	);
};

DayOff.layout = LayoutBase;
export default DayOff;
