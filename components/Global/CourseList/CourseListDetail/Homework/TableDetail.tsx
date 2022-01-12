import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useWrap } from '~/context/wrap';
import ExpandTable from '~/components/ExpandTable';
import { homeworkResultApi } from '~/apiBase/course-detail/home-work-result';
import ExamAppointmentPoint from '~/components/Global/ExamAppointment/ExamAppointmentPoint';
import { DeleteOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Tooltip } from 'antd';

TableDetail.propTypes = {
	courseID: PropTypes.number,
	CurriculumID: PropTypes.any,
	dataRow: PropTypes.any,
	visible: PropTypes.bool
};

function TableDetail(props) {
	const { courseID, CurriculumID, dataRow, visible } = props;
	const { showNoti, isAdmin } = useWrap();

	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});

	const [totalPage, setTotalPage] = useState(0);

	// FILTER
	const [filters, setFilters] = useState({
		pageSize: 10,
		pageIndex: 1,
		CourseID: courseID,
		CourseScheduleID: 0,
		StudentID: 0
	});

	const getPagination = (pageNumber: number) => {
		setFilters({
			...filters,
			pageIndex: pageNumber
		});
	};

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Ngày làm',
			dataIndex: 'CreatedOn',
			render: (text) => <p className="font-weight-primary">{moment(text).format('DD/MM/yyy')}</p>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			align: 'center',
			render: (value) => (
				<>{value == 'Chưa bắt đầu' ? <span className="tag gray">{value}</span> : <span className="tag green">{value}</span>}</>
			)
		},
		{
			width: 120,
			title: 'Hành động',
			dataIndex: 'Warning',
			align: 'center',
			render: (warning, item: any, idx) => {
				return (
					<>
						<Link
							href={{
								pathname: '/course/exercise/result-teacher/[slug]',
								query: {
									slug: `${item.ID}`,
									teacherMarking: item.TeacherID,
									packageResultID: item.ID,
									type: 'test'
								}
							}}
						>
							<Tooltip title={!item.isDone ? 'Chấm bài ngay' : 'Xem chi tiết'}>
								<button className="btn btn-icon edit">
									<FormOutlined />
								</button>
							</Tooltip>
						</Link>
					</>
				);
			}
		}
	];

	useEffect(() => {
		if (visible) {
			console.log('props: ', props);
			getResult({ HomeworkID: dataRow.ID });
		}
	}, []);

	const [results, setResults] = useState([]);

	// GET RESULT LIST
	const getResult = async (params) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			const res = await homeworkResultApi.getAll(params);
			if (res.status === 200) {
				setTotalPage(res.data.totalRow);
				setResults(res.data.data);
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

	const expandedRowRender = (data, index, y, visible: boolean) => {
		return (
			<>
				<ExamAppointmentPoint isExercise={true} visible={visible} infoID={data.HomeworkID} userID={data.UserInformationID} />
			</>
		);
	};

	// RENDER
	return (
		<div style={{ width: 1200 }}>
			<ExpandTable
				loading={isLoading}
				currentPage={filters.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				dataSource={results}
				columns={columns}
				Extra={null}
				TitleCard={null}
				expandable={{ expandedRowRender }}
			/>
		</div>
	);
}
export default TableDetail;
