import { DashOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Card, Dropdown, Menu } from 'antd';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Folder } from 'react-feather';
import { documentCategoryApi } from '~/apiBase/course-detail/document-category';
import { documentListApi } from '~/apiBase/document-list/document-list';
import DocModal from '~/components/Global/document-list/DocModal';
import FileExtension from '~/components/Global/document-list/FileExtension';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';

const DocumentListFromDetail = () => {
	const router = useRouter();
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
		CurriculumnID: Number(router.query.curriculumID)
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
			let res = await documentListApi.getAll({ CategoryID: ID, DocumentName: '' });
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

	const menuCateMD = () => {
		return (
			<div className=" d-md-none col-md-3 document-menu">
				<div className="pb-3 col-12 d-flex justify-content-between align-items-center box-header">
					<div className="title">Danh sách</div>
					<DocModal
						type="ADD_DOC"
						CategoryName={null}
						curriculumID={Number(router.query.curriculumID)}
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
		);
	};

	useEffect(() => {
		getDataCategoryDoc();
	}, [params]);

	return (
		<div className="h-100">
			<Card
				title={
					<div className="d-none d-md-inline-block">
						<p>Tài liệu</p>
					</div>
				}
				className="h-100 card-document-list"
				extra={
					<div className="d-md-none d-inline-block col-md-3 w-25">
						<Dropdown overlay={menuCateMD} trigger={['click']}>
							<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
								<EllipsisOutlined />
							</a>
						</Dropdown>
					</div>
				}
			>
				<div className="row">
					<div className="d-none d-md-block col-md-3 document-menu">
						<div className="pb-3 col-12 d-flex justify-content-between align-items-center box-header">
							<div className="title">Danh sách</div>
							<DocModal
								type="ADD_DOC"
								CategoryName={null}
								cateID={null}
								curriculumID={Number(router.query.curriculumID)}
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
											trigger={['hover']}
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
					<div className="col-12 col-md-9">
						{categoryID ? (
							<FileExtension
								docList={docList}
								docListFromDetail={true}
								isLoading={isLoading}
								docInfo={docInfo}
								categoryID={categoryID}
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

DocumentListFromDetail.layout = LayoutBase;
export default DocumentListFromDetail;
