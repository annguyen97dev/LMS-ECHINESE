import React, { useState, useEffect } from 'react';
import LayoutBase from '~/components/LayoutBase';
import TitlePage from '~/components/TitlePage';
import { Card } from 'antd';
import { Checkbox, DatePicker } from 'antd';
import { Check } from 'react-feather';
import { teacherOffScheduleApi } from '~/apiBase/teacher/teacher-off-schedule';
import { clearOptionsDuplicate, removeRepeatElementSorted } from '~/utils/functions';

const DayOffSchedule = () => {
	const [dataSchedule, setDataSchedule] = useState<ITeacherOff[]>();
	const [dataDates, setDataDates] = useState([]);
	const [dataTimes, setDataTimes] = useState([]);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const [params, setParams] = useState({ Date: '2021-09-15', Type: 0 });

	const getSchedule = async () => {
		setIsLoading({ status: 'GET_ALL', loading: true });
		try {
			let res = await teacherOffScheduleApi.getAll(params);
			if (res.status == 200) {
				setDataSchedule(res.data.data);
				// @ts-ignore
				setDataDates(res.data.Dates);
				// @ts-ignore
				setDataTimes(res.data.Times);
			}
			if (res.status == 204) {
				setDataSchedule([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_ALL', loading: false });
		}
	};

	const dataTemp = [
		{
			date: 'Sun 02/01',
			info: [
				{
					StudyTimeID: 2,
					StudyTimeName: '08:00 09:00',
					TimeStart: '08:00',
					Checked: false,
					IsHideCheckBox: false
				},
				{
					StudyTimeID: 3,
					StudyTimeName: '09:00 10:00',
					TimeStart: '09:00',
					Checked: false,
					IsHideCheckBox: false
				},
				{
					StudyTimeID: 5,
					StudyTimeName: '13:00 14:00',
					TimeStart: '13:00',
					Checked: false,
					IsHideCheckBox: false
				},
				{
					StudyTimeID: 4,
					StudyTimeName: '15:00 16:00',
					TimeStart: '15:00',
					Checked: false,
					IsHideCheckBox: false
				},
				{
					StudyTimeID: 10,
					StudyTimeName: '17:00 18:00',
					TimeStart: '17:00',
					Checked: false,
					IsHideCheckBox: false
				}
			]
		}
	];

	useEffect(() => {
		getSchedule();
	}, [params]);

	function onChangeDate(date, dateString) {
		console.log(date, dateString);
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
							<th>
								{
									<>
										<p>{dataDates[0]}</p>
									</>
								}
							</th>
							<th>
								{
									<>
										<p>{dataDates[1]}</p>
									</>
								}
							</th>
							<th>
								{
									<>
										<p>{dataDates[2]}</p>
									</>
								}
							</th>
							<th>
								{
									<>
										<p>{dataDates[3]}</p>
									</>
								}
							</th>
							<th>
								{
									<>
										<p>{dataDates[4]}</p>
									</>
								}
							</th>
							<th>
								{
									<>
										<p>{dataDates[5]}</p>
									</>
								}
							</th>
							<th>
								{
									<>
										<p>{dataDates[6]}</p>
									</>
								}
							</th>
						</tr>
					</thead>
					<tbody>
						{dataTimes.map((time, indexTime) => (
							<tr key={indexTime}>
								<td>{time.StudyTimeName}</td>
								{dataDates.map((date, indexDate) => (
									<td>
										<Checkbox
											key={indexDate}
											onChange={(event) => {
												console.log(date);
												console.log(time);
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
						<div className="box grey"></div>
						<div className="text">
							<p>Được đăng ký</p>
						</div>
					</div>
					<div className="note-info__item">
						<div className="box white"></div>
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
