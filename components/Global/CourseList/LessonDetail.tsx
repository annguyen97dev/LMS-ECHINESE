import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { courseApi, subjectApi } from '~/apiBase';
import TitlePage from '~/components/Elements/TitlePage';
import CurriculumDetail from '~/components/Global/Option/ProgramDetail/CurriculumDetail';
import { useWrap } from '~/context/wrap';

const LessonDetail = (props) => {
	const router = useRouter();
	const { courseID: courseID, slug: slug } = router.query;
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
			let res = await courseApi.getById(courseID ? (courseID as any) : slug);
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
			{dataSource && (
				<CurriculumDetail disable={props.disable} isNested={false} curriculumID={dataSource?.CurriculumID} dataSubject={null} />
			)}
		</>
	);
};

export default LessonDetail;
