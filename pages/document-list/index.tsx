import { Button, Card, Dropdown, Input, Menu, Select, Tooltip } from 'antd';
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
import { DashOutlined } from '@ant-design/icons';

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
			if (res.status == 200) {
				setCategoryDoc(res.data.data);
				setActiveID(res.data.data[0].ID);
				getDocList(res.data.data[0].ID);
				setDocInfo({ CategoryID: res.data.data[0].ID, DocumentName: res.data.data[0].CategoryName });
				setCategoryID(res.data.data[0].ID);
			}
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

	const menu = (cate) => {
		return (
			<Menu className="action-btn text-right">
				<Menu.Item key="0">
					<DocModal
						type="EDIT_DOC"
						CategoryName={cate.CategoryName}
						cateID={cate.ID}
						onFetchData={() => {
							setParams({ ...params, pageIndex: 1 });
						}}
					/>
				</Menu.Item>
				<Menu.Item key="1">
					<DocModal
						type="DELETE_DOC"
						CategoryName={cate.CategoryName}
						cateID={cate.ID}
						onFetchData={() => {
							setParams({ ...params, pageIndex: 1 });
						}}
					/>
				</Menu.Item>
			</Menu>
		);
	};

	useEffect(() => {
		getDataCategoryDoc();
	}, [params]);

	return (
		<div className="h-100">
			<Card title="Tài liệu" className="h-100 card-document-list">
				<div className="row">
					<div className="col-3 document-menu">
						<div className="pb-3 col-12 d-flex justify-content-between align-items-center box-header">
							<div className="title">Danh sách</div>
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
							{categoryDoc.map((cate) => {
								return (
									<div className="d-flex justify-content-between">
										<div
											style={{ cursor: 'pointer', width: '90%' }}
											className={
												activeID == cate.ID
													? 'd-flex justify-content-between align-items-center doc__list-container doc__list-active'
													: 'd-flex justify-content-between align-items-center doc__list-container'
											}
											onClick={() => {
												setActiveID(cate.ID);
												getDocList(cate.ID);
												setDocInfo({ CategoryID: cate.ID, DocumentName: cate.CategoryName });
												setCategoryID(cate.ID);
											}}
										>
											<div className="title doc__list-menu">
												<Folder /> <p>{cate.CategoryName}</p>
											</div>
										</div>
										<Dropdown
											className={
												activeID == cate.ID
													? 'doc__list-active d-flex justify-content-between align-items-center pr-1'
													: 'd-flex justify-content-between align-items-center pr-1'
											}
											overlay={() => menu(cate)}
											trigger={['click']}
											placement="topRight"
										>
											<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
												<DashOutlined />
											</a>
										</Dropdown>
									</div>
								);
							})}
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
