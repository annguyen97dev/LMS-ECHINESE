import {Card, Menu, Spin} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Folder} from 'react-feather';
import {documentApi} from '~/apiBase/course-detail/document';
import {documentCategoryApi} from '~/apiBase/course-detail/document-category';
import FileExtension from '~/components/Global/CourseList/CourseListDetail/Document/FileExtension';
import {useWrap} from '~/context/wrap';

DocumentCourse.propTypes = {
	courseID: PropTypes.number,
};
DocumentCourse.defaultProps = {
	courseID: 0,
};

function DocumentCourse(props) {
	const {courseID} = props;
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [categoryDoc, setCategoryDoc] = useState<ICategoryDoc[]>([]);
	const {showNoti} = useWrap();
	const [documentList, setDocumentList] = useState<IDocument[]>([]);

	const getDataCategoryDoc = async () => {
		try {
			setIsLoading({
				type: 'FETCH_CATEGORY',
				status: true,
			});
			const res = await documentCategoryApi.getAll({
				CourseID: courseID,
			});
			if (res.status === 200) {
				setCategoryDoc(res.data.data);
			}
			if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy dữ liệu!');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_CATEGORY',
				status: false,
			});
		}
	};

	useEffect(() => {
		getDataCategoryDoc();
	}, []);

	const getDataDocByCategoryID = async (id: number) => {
		try {
			setIsLoading({
				type: 'FETCH_DOCUMENT',
				status: true,
			});
			const res = await documentApi.getAll({
				CategoryID: id,
			});
			if (res.status === 200) {
				setDocumentList(res.data.data);
			}
			if (res.status === 204) {
				setDocumentList(null);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_DOCUMENT',
				status: false,
			});
		}
	};

	return (
		<div>
			<Card title="Tài liệu">
				<Spin
					spinning={isLoading.type === 'FETCH_CATEGORY' && isLoading.status}
				>
					<div className="row">
						<div className="col-3">
							<div className="pb-3 font-weight-black">Giáo trình</div>
							<Menu mode="vertical">
								{categoryDoc.map((cate) => (
									<Menu.Item
										key={cate.ID}
										icon={<Folder />}
										onClick={() => {
											getDataDocByCategoryID(cate.ID);
										}}
									>
										{cate.CategoryName}
									</Menu.Item>
								))}
							</Menu>
						</div>
						<div className="col-9">
							<FileExtension
								isLoading={isLoading}
								documentList={documentList}
							/>
						</div>
					</div>
				</Spin>
			</Card>
		</div>
	);
}

export default DocumentCourse;
