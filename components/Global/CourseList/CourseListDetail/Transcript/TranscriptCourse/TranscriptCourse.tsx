import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {subjectApi} from '~/apiBase';
import {transcriptApi} from '~/apiBase/course-detail/transcript';
import PowerTable from '~/components/PowerTable';

TranscriptCourse.propTypes = {};

function TranscriptCourse(props) {
	const router = useRouter();
	const {slug: courseID} = router.query;
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [filters, setFilters] = useState({
		pageIndex: 1,
		pageSize: 10,
		CourseID: courseID,
	});
	const [columns, setColumns] = useState([]);
	const [dataSource, setDataSource] = useState([]);

	// PAGINATION
	const getPagination = (pageIndex: number) => {
		setFilters({
			...filters,
			pageIndex,
		});
	};
	// IN TRANSCRIPT COURSE COLUMN IS A SUBJECT
	const fmColumn = (columns: ISubject[]) => {
		let rs = [
			{
				title: 'Họ tên',
				dataIndex: 'FullNameUnicode',
				render: (text, item, idx) => <>{text}</>,
			},
		];
		columns.forEach((col, index) => {
			rs.push({
				title: col.SubjectName,
				dataIndex: `Column_${col.ID}`,
				render: (text) => <>{Math.round(text * 10) / 10 || 0}</>,
			});
		});
		rs.push({
			title: 'Điểm trung bình',
			dataIndex: 'Column_0',
			render: (text) => <>{Math.round(text * 10) / 10}</>,
		});
		return rs;
	};
	const fetchColumnForTable = async () => {
		try {
			const res = await subjectApi.getAll({
				CourseID: courseID,
			});
			if (res.status === 200) {
				const columns = fmColumn(res.data.data);
				setColumns(columns);
			}
		} catch (error) {
			console.log('fetchColumnForTable', error.message);
		}
	};
	useEffect(() => {
		fetchColumnForTable();
	}, []);
	const flatPointColumnsOfStudent = (
		pointColumn: {
			SubjectID: number;
			SubjectName: string;
			Point: string;
		}[]
	) => {
		const rs = {};
		for (const obj of pointColumn) {
			let p: string | number = +obj.Point;
			if (isNaN(p)) {
				p = 0;
			}
			rs[`Column_${obj.SubjectID}`] = p;
		}
		return rs;
	};
	const fmDataSource = (data: ITranscriptByCourse[]) => {
		const rs = data.map(
			({CourseID, UserInformationID, FullNameUnicode, PointColumn}) => ({
				UserInformationID,
				CourseID,
				FullNameUnicode,
				...flatPointColumnsOfStudent(PointColumn),
			})
		);
		return rs;
	};
	const fetchStudentByCourse = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const res = await transcriptApi.getAllByCourse(filters);
			if (res.status === 200) {
				const data = fmDataSource(res.data.data);
				setDataSource(data);
			}
		} catch (error) {
			console.log('fetchStudentByCourse', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	useEffect(() => {
		fetchStudentByCourse();
	}, [filters]);
	return (
		<>
			<PowerTable
				loading={isLoading}
				getPagination={getPagination}
				noScroll
				dataSource={dataSource}
				columns={columns}
			/>
		</>
	);
}

export default TranscriptCourse;
