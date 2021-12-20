import { Card } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
	branchApi,
	createSelfCourse,
	curriculumApi,
	getRangeTimeSelfCourse,
	gradeApi,
	programApi,
	setRangeTimeSelfCourse
} from '~/apiBase';
import TitlePage from '~/components/TitlePage';
import { useWrap } from '~/context/wrap';
import { fmSelectArr } from '~/utils/functions';
import Schedule from '../CreateCourse/Schedule/Schedule';
import CreateSelfCourseCalendar from './Calendar/CreateSelfCourseCalendar';
import CreateSelfCourseForm from './CreateSelfCourseForm/CreateSelfCourseForm';
import SetTimeSelfCourseForm from './SetTimeSelfCourseForm';
// ------------ MAIN COMPONENT ------------------

const CreateSelfCourse = () => {
	const router = useRouter();
	// -----------STATE-----------
	// FORM
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [optionListForForm, setOptionListForForm] = useState<ISCOptionListForForm>({
		branchList: [],
		gradeList: [],
		programList: [],
		curriculumList: []
	});
	const [rangeTime, setRangeTime] = useState<ISCTime>();
	// -----------CREATE COURSE FORM-----------
	// FETCH BRANCH, STUDY TIME, GRADE IN THE FIRST TIME
	const fetchData = async () => {
		setIsLoading({
			type: 'FETCH_DATA',
			status: true
		});
		try {
			const [branch, grade] = await Promise.all([
				branchApi.getAll({ pageIndex: 1, pageSize: 9999 }),
				gradeApi.getAll({ selectAll: true })
			]);
			// BRANCH
			const newBranchList = fmSelectArr(branch.data.data, 'BranchName', 'ID');
			// GRADE
			const newGradeList = fmSelectArr(grade.data.data, 'GradeName', 'ID');
			setOptionListForForm({
				...optionListForForm,
				branchList: newBranchList,
				gradeList: newGradeList
			});
		} catch (error) {
			console.log('fetchData - PromiseAll:', error);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_DATA',
				status: false
			});
		}
	};
	// TIME
	const onFetchRangeTime = async () => {
		try {
			const res = await getRangeTimeSelfCourse();
			if (res.status === 200) {
				const { ID, ...rest } = res.data.data;
				setRangeTime(rest);
			}
		} catch (error) {
			console.log('onFetchRangeTime', error.message);
		}
	};
	const onSetRangeTime = async (data: ISCTime) => {
		try {
			setIsLoading({
				type: 'SUBMIT_TIME',
				status: true
			});
			const res = await setRangeTimeSelfCourse(data);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				return true;
			}
			return false;
		} catch (error) {
			console.log('onSetRangeTime', error.message);
		} finally {
			setIsLoading({
				type: 'SUBMIT_TIME',
				status: false
			});
		}
	};
	useEffect(() => {
		onFetchRangeTime();
		fetchData();
	}, []);
	// PROGRAM
	const fetchProgramByGrade = async (id: number) => {
		setIsLoading({
			type: 'GradeID',
			status: true
		});

		try {
			const res = await programApi.getAll({
				GradeID: id
			});
			if (res.status === 200) {
				const newProgramList = fmSelectArr(res.data.data, 'ProgramName', 'ID', ['Price']);
				setOptionListForForm((preState) => ({
					...preState,
					programList: newProgramList
				}));
			}
			if (res.status === 204) {
				setOptionListForForm((preState) => ({
					...preState,
					programList: []
				}));
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GradeID',
				status: false
			});
		}
	};
	const fetchCurriculumByProgram = async (id: number) => {
		setIsLoading({
			type: 'ProgramID',
			status: true
		});

		try {
			const res = await curriculumApi.getAll({
				ProgramID: id
			});
			if (res.status === 200) {
				const newCurriculum = fmSelectArr(res.data.data, 'CurriculumName', 'ID');
				setOptionListForForm((preState) => ({
					...preState,
					curriculumList: newCurriculum
				}));
			}
			if (res.status === 204) {
				setOptionListForForm((preState) => ({
					...preState,
					curriculumList: []
				}));
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ProgramID',
				status: false
			});
		}
	};
	// GET COURSE
	const getTitle = (arr: IOptionCommon[], vl) => arr.find((p) => p.value === vl).title;
	const onCreateCourse = async (object) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const { branchList, programList, curriculumList } = optionListForForm;
			const { BranchID, ProgramID, Price, CurriculumID, CourseName, SalaryOfLesson, StartDay, EndDay } = object;
			const startDayFm = moment(StartDay).format('YYYY/MM/DD');
			const endDayFm = moment(EndDay).format('YYYY/MM/DD');

			const BranchName = getTitle(branchList, BranchID);
			const ProgramName = getTitle(programList, ProgramID);
			const CurriculumName = getTitle(curriculumList, CurriculumID);
			const CourseNameFinal = CourseName
				? CourseName
				: `[${BranchName}][${ProgramName}][${CurriculumName}] - ${moment(StartDay).format('DD/MM/YYYY')}`;

			const fmValues: ISCPost = {
				...object,
				Price: parseInt(Price.replace(/\D/g, '')),
				SalaryOfLesson: parseInt(SalaryOfLesson.replace(/\D/g, '')),
				StartDay: startDayFm,
				EndDay: endDayFm,
				CourseName: CourseNameFinal
			};
			const res = await createSelfCourse(fmValues);
			if (res.status === 200) {
				router.push(`/course/course-list/edit-self-course/${res.data.data.ID}/`);
				showNoti('success', 'Tạo khóa học thành công. Hãy sắp xếp lịch học');
				return true;
			}
		} catch (error) {
			showNoti('error', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};
	return (
		<div className="create-course">
			<TitlePage title="Tạo khóa học 1 với 1" />
			<div className="row">
				<div className="col-md-8 col-12">
					<Card
						title="Sắp xếp lịch học"
						extra={
							<div className="btn-page-course d-flex align-items-center">
								<SetTimeSelfCourseForm isLoading={isLoading} rangeTimeObj={rangeTime} handleSetRangeTime={onSetRangeTime} />
								<CreateSelfCourseForm
									isLoading={isLoading}
									isUpdate={false}
									//
									optionListForForm={optionListForForm}
									//
									handleGetCourse={onCreateCourse}
									handleFetchProgramByGrade={fetchProgramByGrade}
									handleFetchCurriculumByProgram={fetchCurriculumByProgram}
								/>
							</div>
						}
					>
						<CreateSelfCourseCalendar eventList={[]} isLoaded={true} />
					</Card>
				</div>
				<div className="col-md-4 col-12">
					<Schedule />
				</div>
			</div>
		</div>
	);
};

export default CreateSelfCourse;
