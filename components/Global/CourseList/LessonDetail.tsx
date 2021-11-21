import React, { useState, useEffect } from 'react';
import { useWrap } from '~/context/wrap';
import { lessonDetailApi } from '~/apiBase/options/lesson-detail';
import Link from 'next/link';
import ExpandTable from '~/components/ExpandTable';
import LayoutBase from '~/components/LayoutBase';
import { useRouter } from 'next/router';
import { courseApi, subjectApi } from '~/apiBase';
import CurriculumDetail from '~/components/Global/Option/ProgramDetail/CurriculumDetail';
import TitlePage from '~/components/Elements/TitlePage';

const LessonDetail = () => {
	const router = useRouter();
	const { courseID: courseID } = router.query;
	const [dataSubject, setDataSubject] = useState<ISubject[]>();

	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState(null);
	const { showNoti, pageSize, isAdmin } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: 1
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// ---------------- GET DATA SUBJECT -------------

	const getDataSubject = async (ProgramID) => {
		console.log('Chạy vô đây');
		try {
			let res = await subjectApi.getAll({
				ProgramID: ProgramID,
				pageIndex: 1,
				pageSize: 9999
			});

			if (res.status == 200) {
				if (res.data.data.length > 0) {
					setDataSubject(res.data.data);
				} else {
					showNoti('danger', 'Không có dữ liệu môn học');
				}
			}

			res.status == 204 && showNoti('danger', 'Không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
		}
	};

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await courseApi.getById(courseID as any);
			res.status == 200 && setDataSource(res.data.data);

			res.status == 204 && setDataSource([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);

		setTodoApi({
			...todoApi,
			// ...listFieldSearch,
			pageIndex: pageNumber
		});
	};

	const columns = [
		{
			title: 'Buổi học',
			dataIndex: 'LessonDetailNumber',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Nội dung học',
			dataIndex: 'Content',
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Video',
			dataIndex: 'LinkVideo'
		},
		{
			title: 'Tài liệu',
			dataIndex: 'LinkDocument'
		},
		{
			title: 'File Zip',
			dataIndex: 'LinkHtml'
		},
		{
			title: 'Làm bài tập',
			dataIndex: 'ExamTopicID',
			render: (id) => (
				<Link
					href={{
						pathname: '/option/program/program-detail/[slug]',
						query: { slug: id }
					}}
				>
					<a href="" className="font-weight-black">
						Làm đề thi
					</a>
				</Link>
			)
		}
	];

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	return (
		<>
			<TitlePage title={'Chi tiết buổi học'} />
			{/* <ExpandTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage="Danh sách chương trình"
				dataSource={dataSource}
				columns={columns}
			/> */}
			{dataSource && <CurriculumDetail curriculumID={dataSource?.CurriculumID} dataSubject={null} />}
		</>
	);
};

export default LessonDetail;
