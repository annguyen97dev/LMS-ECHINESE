import React, { useState, useEffect } from 'react';
import LayoutBase from '~/components/LayoutBase';
import TitlePage from '~/components/TitlePage';
import { Card } from 'antd';
import { Checkbox, DatePicker } from 'antd';
import { Check } from 'react-feather';
import { teacherOffScheduleApi } from '~/apiBase/teacher/teacher-off-schedule';
import { day } from 'date-arithmetic';

const DayOffSchedule = () => {
	const [dataSchedule, setDataSchedule] = useState<ITeacherOff[]>();
	const [dataDates, setDataDates] = useState([]);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const [params, setParams] = useState({ Date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'), Type: 0 });

	const getSchedule = async () => {
		setIsLoading({ status: 'GET_ALL', loading: true });
		try {
			let res = await teacherOffScheduleApi.getAll(params);
			if (res.status == 200) {
				setDataSchedule(res.data.data);
			}
			if (res.status == 204) {
				setDataSchedule([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_ALL', loading: false });
		}
	};

	const updateSchedule = async (Day, StudyTimeID) => {
		setIsLoading({ status: 'UPDATE_SCHEDULE', loading: true });
		try {
			let res = await teacherOffScheduleApi.update({ DateOff: Day, StudyTimeID: StudyTimeID });
			if (res.status == 200) {
				setParams({ ...params });
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'UPDATE_SCHEDULE', loading: false });
		}
	};

	useEffect(() => {
		getSchedule();
	}, [params]);

	function onChangeDate(date, dateString) {
		setParams({ Date: dateString, Type: 0 });
	}

	return (
		<div className="day-off-schedule">
			<TitlePage title="Lịch nghỉ" />
			<Card
				title={
					<div>
						<DatePicker className="style-input" onChange={onChangeDate} />
					</div>
				}
			>
				<table className="table-dayoff">
					<thead>
						<tr>
							<th>Ca</th>
							{dataSchedule &&
								dataSchedule[0].Info.sort((a, b) => a.StudyTimeID - b.StudyTimeID).map((item, index) => (
									<th key={index}>
										{
											<>
												<p>{item.StudyTimeName}</p>
											</>
										}
									</th>
								))}
						</tr>
					</thead>
					<tbody>
						{dataSchedule &&
							dataSchedule.map((item, indexItem) => (
								<tr key={indexItem}>
									<td>{item.Day}</td>
									{item.Info.sort((a, b) => a.StudyTimeID - b.StudyTimeID).map((itemInfo, indexInfo) => (
										<td>
											<Checkbox
												key={indexInfo}
												checked={itemInfo.Checked}
												disabled={itemInfo.IsHideCheckBox}
												onChange={(event) => {
													console.log(itemInfo.StudyTimeID);
													console.log(item.Day.split('/').reverse().join('-'));
													updateSchedule(item.Day.split('/').reverse().join('-'), itemInfo.StudyTimeID);
												}}
											/>
										</td>
									))}
								</tr>
							))}
					</tbody>
				</table>
				<div className="note-info mt-5">
					<h6 className="mb-4">Thông tin thêm</h6>
					<div className="note-info__item">
						<div className="box white"></div>
						<div className="text">
							<p>Được đăng ký</p>
						</div>
					</div>
					<div className="note-info__item">
						<div className="box grey"></div>
						<div className="text">
							<p>Không được đăng ký(Có giờ nằm trong lịch dạy)</p>
						</div>
					</div>
					<div className="note-info__item">
						<div className="box red"></div>
						<div className="text">
							<p>Đã có lịch dạy</p>
						</div>
					</div>
					<div className="note-info__item">
						<div className="box blue">
							<Check />
						</div>
						<div className="text">
							<p>Đã đăng ký nghỉ</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

DayOffSchedule.layout = LayoutBase;
export default DayOffSchedule;
