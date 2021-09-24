import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {programDetailPointColumnApi, subjectApi} from '~/apiBase';
import {transcriptApi} from '~/apiBase/course-detail/transcript';
import PowerTable from '~/components/PowerTable';
import {useWrap} from '~/context/wrap';
import {fmSelectArr} from '~/utils/functions';
import TranscriptSelectSubject from '../SelectSubject/TranscriptSelectSubject';
import NoteInput from '../TableFormControl/NoteInput';
import PointInput from '../TableFormControl/PointInput';

TranscriptSubject.propTypes = {};

function TranscriptSubject(props) {
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
		SubjectID: 0,
	});
	const [columns, setColumns] = useState([]);
	const [dataSource, setDataSource] = useState<
		{
			UserInformationID: number;
			CourseID: number;
			FullNameUnicode: string;
			IDTranscript?: number;
		}[]
	>([]);
	const [optionSubjectList, setOptionSubjectList] = useState([]);
	const {showNoti} = useWrap();
	// PAGINATION
	const getPagination = (pageIndex: number) => {
		setFilters({
			...filters,
			pageIndex,
		});
	};
	const getSubjectID = async (SubjectID: number) => {
		try {
			setFilters({
				...filters,
				SubjectID,
			});
		} catch (error) {
			console.log('getSubjectID', error.message);
		}
	};
	const fetchSubject = async () => {
		setIsLoading({
			type: 'FETCH_SUBJECT',
			status: true,
		});
		try {
			const res = await subjectApi.getAll({
				CourseID: courseID,
			});
			if (res.status === 200) {
				const fmOption = fmSelectArr(res.data.data, 'SubjectName', 'ID');
				setOptionSubjectList([
					{title: '---Chọn môn học---', value: 0},
					...fmOption,
				]);
				setFilters({...filters, SubjectID: fmOption[0]?.value});
			}
		} catch (error) {
			console.log('fetchSubject', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_SUBJECT',
				status: false,
			});
		}
	};
	useEffect(() => {
		fetchSubject();
	}, []);

	const onCreateTranscriptStudent = async (obj: {
		UserInformationID: number;
		CourseID: number;
		FullNameUnicode: string;
		PointColumnID: number;
		Note: string;
		Point: number;
		Type: 'Point' | 'Note';
	}) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		try {
			const {UserInformationID, CourseID, PointColumnID, Point, Note, Type} =
				obj;
			let addObj;
			if (Type === 'Note') {
				addObj = {UserInformationID, CourseID, PointColumnID, Note};
			}
			if (Type === 'Point') {
				addObj = {UserInformationID, CourseID, PointColumnID, Point};
			}
			const res = await transcriptApi.add(addObj);
			if (res.status === 200) {
				showNoti('success', res.data.message);
			}
		} catch (error) {
			console.log('onCreateTranscriptStudent', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
	};
	const onUpdateTranscriptStudent = async (obj: {
		UserInformationID: number;
		CourseID: number;
		PointColumnID: number;
		Point: number;
		Note: string;
		Type: 'Point' | 'Note';
	}) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		try {
			const {UserInformationID, CourseID, PointColumnID, Point, Note, Type} =
				obj;
			let updateObj;
			if (Type === 'Note') {
				updateObj = {
					UserInformationID,
					CourseID,
					PointColumnID,
					Note,
				};
			}
			if (Type === 'Point') {
				updateObj = {
					UserInformationID,
					CourseID,
					PointColumnID,
					Point,
				};
			}
			const res = await transcriptApi.update(updateObj);
			if (res.status === 200) {
				showNoti('success', res.data.message);
			}
		} catch (error) {
			console.log('onUpdateTranscriptStudent', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
	};

	// IN TRANSCRIPT COURSE COLUMN IS A SUBJECT
	const fmColumn = (columns: IProgramDetailPointColumn[]) => {
		let rs = [
			{
				title: 'Họ tên',
				dataIndex: 'FullNameUnicode',
				render: (text, item, idx) => <>{text}</>,
			},
		];
		columns
			.sort((a, b) => a.Type - b.Type)
			.forEach((col) => {
				rs.push({
					title: col.Name,
					dataIndex: `Column_${col.ID}`,
					render: (text, item, idx) => {
						return (
							<>
								{col.Type === 3 ? (
									<div key={idx}>
										<NoteInput
											// ALREADY COLUMN_ID => UPDATE POINT FOT THIS COLUMN
											isUpdate={
												item[`Column_${col.ID}`] !== undefined ? true : false
											}
											item={{
												...item,
												PointColumnID: col.ID,
												Note: item[`Column_${col.ID}`],
											}}
											handleCreatePointColumn={onCreateTranscriptStudent}
											handleUpdatePointColumn={onUpdateTranscriptStudent}
										/>
									</div>
								) : (
									<div style={{width: 120}} key={idx}>
										<PointInput
											isUpdate={
												item[`Column_${col.ID}`] !== undefined ? true : false
											}
											item={{
												...item,
												PointColumnID: col.ID,
												Point: item[`Column_${col.ID}`],
											}}
											// TYPE = 2 > AVERAGE POINT > CAN NOT UPDATE OR INSERT
											disabled={col.Type === 2 ? true : false}
											handleCreatePointColumn={onCreateTranscriptStudent}
											handleUpdatePointColumn={onUpdateTranscriptStudent}
										/>
									</div>
								)}
							</>
						);
					},
				});
			});

		return rs;
	};
	const fetchColumnForTable = async () => {
		try {
			const res = await programDetailPointColumnApi.getAll({
				SubjectID: filters.SubjectID,
			});
			if (res.status === 200) {
				const columns = fmColumn(res.data.data);
				setColumns(columns);
			}
			if (res.status === 204) {
				setColumns([
					{
						title: 'Họ tên',
						dataIndex: 'FullNameUnicode',
						render: (item, idx) => <>{item}</>,
					},
				]);
			}
		} catch (error) {
			console.log('fetchColumnForTable', error.message);
		}
	};
	useEffect(() => {
		fetchColumnForTable();
	}, [dataSource]);

	const flatPointColumnsOfStudent = (
		pointColumn: {
			ID: number;
			PointColumnID: number;
			PointColumnName: string;
			Coefficient: number;
			Point: number;
			Note: string;
		}[]
	) => {
		const rs = {};
		for (const obj of pointColumn) {
			let p: string | number = obj.Point;
			if (isNaN(p)) {
				p = null;
			}
			if (obj.Note) {
				p = obj.Note;
			}
			rs[`Column_${obj.PointColumnID}`] = p;
		}
		return rs;
	};
	const fmDataSource = (data: ITranscriptBySubject[]) => {
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
	const fetchStudentBySubject = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const res = await transcriptApi.getAllBySubject(filters);
			if (res.status === 200) {
				const data = fmDataSource(res.data.data);
				setDataSource(data);
			}
		} catch (error) {
			console.log('fetchStudentBySubject', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	useEffect(() => {
		fetchStudentBySubject();
	}, [filters]);
	return (
		<>
			<PowerTable
				loading={isLoading}
				getPagination={getPagination}
				TitleCard={
					<TranscriptSelectSubject
						optionSubjectList={optionSubjectList}
						handleOnFetchStudent={getSubjectID}
					/>
				}
				noScroll
				dataSource={dataSource}
				columns={columns}
			/>
		</>
	);
}

export default TranscriptSubject;
