import { Button, Card, Input, Menu, Select, Tooltip } from 'antd';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import LayoutBase from '~/components/LayoutBase';
import { documentCategoryApi } from '~/apiBase/course-detail/document-category';
import { useWrap } from '~/context/wrap';
import { Folder, RotateCcw, X } from 'react-feather';
import PowerList from '~/components/Global/CourseList/PowerList';
import FileExtension from '~/components/Global/document-list/FileExtension';
import { documentListApi } from '~/apiBase/document-list/document-list';
import DocModal from '~/components/Global/document-list/DocModal';

const DocumentList = (props) => {
	const [isLoading, setIsLoading] = useState({ type: '', loading: false });
	const [categoryDoc, setCategoryDoc] = useState<ICategoryDoc[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [categoryID, setCategoryID] = useState(null);
	const [activeID, setActiveID] = useState<any>();
	const [docList, setDocList] = useState(null);
	const [docInfo, setDocInfo] = useState({});

	const paramsDefault = {
		pageIndex: 1,
		pageSize: pageSize,
		CurriculumnID: 0
	};

	const [params, setParams] = useState(paramsDefault);

	const getDataCategoryDoc = async () => {
		setIsLoading({ type: 'GET_ALL', loading: true });
		try {
			let res = await documentCategoryApi.getAll(params);
			console.log(res.data.data);
			res.status == 200 && setCategoryDoc(res.data.data);
			if (res.status == 204) {
				showNoti('danger', 'Không tìm thấy dữ liệu!');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'GET_ALL', loading: false });
		}
	};

	const getDocList = async (ID) => {
		setIsLoading({ type: 'GET_ALL', loading: true });
		try {
			let res = await documentListApi.getAll(ID);
			if (res.status == 200) {
				setDocList(res.data.data);
			}
			if (res.status == 204) {
				setDocList([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', loading: false });
		}
	};

	useEffect(() => {
		getDataCategoryDoc();
	}, [params]);

	return (
		<div className="h-100">
			<Card title="Tài liệu" className="h-100">
				<div className="row">
					<div className="col-3">
						<div className="pb-3 col-12 d-flex justify-content-between align-items-center">
							<div className=" font-weight-black">Giáo trình</div>
							<DocModal
								type="ADD_DOC"
								CategoryName={null}
								cateID={null}
								onFetchData={() => {
									setParams({ ...params, pageIndex: 1 });
								}}
							/>
						</div>
						<Menu mode="vertical">
							{categoryDoc.map((cate) => (
								<div
									className={
										activeID == cate.ID
											? 'd-flex justify-content-between align-items-center doc__list-container doc__list-active'
											: 'd-flex justify-content-between align-items-center doc__list-container'
									}
								>
									<div
										style={{ cursor: 'pointer' }}
										className="title doc__list-menu"
										onClick={() => {
											console.log('clicked', cate.ID);
											setActiveID(cate.ID);
											getDocList(cate.ID);
											setDocInfo({ CategoryID: cate.ID, DocumentName: cate.CategoryName });
											setCategoryID(cate.ID);
										}}
									>
										<Folder /> {cate.CategoryName}
									</div>
									<div className="action-btn">
										<DocModal
											type="EDIT_DOC"
											CategoryName={cate.CategoryName}
											cateID={cate.ID}
											onFetchData={() => {
												setParams({ ...params, pageIndex: 1 });
											}}
										/>
										<DocModal
											type="DELETE_DOC"
											CategoryName={cate.CategoryName}
											cateID={cate.ID}
											onFetchData={() => {
												setParams({ ...params, pageIndex: 1 });
											}}
										/>
									</div>
								</div>
							))}
						</Menu>
					</div>
					<div className="col-9">
						{categoryID ? (
							<FileExtension
								docList={docList}
								isLoading={isLoading}
								docInfo={docInfo}
								onFetchData={() => {
									getDocList(categoryID);
								}}
							/>
						) : (
							<h4 className="col-12">Hãy chọn danh mục!</h4>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
};

DocumentList.layout = LayoutBase;
export default DocumentList;
