import React, { useState, useEffect } from 'react';
import { Spin, Input } from 'antd';
import PropTypes from 'prop-types';
import DocListModal from './DocListMadal';
import { useWrap } from '~/context/wrap';

const FileExtension = ({ docList, isLoading, docInfo, onFetchData }) => {
	const { Search } = Input;
	const [submitLoading, setSubmitLoading] = useState({ type: '', loading: false });
	const { showNoti } = useWrap();

	const onSearch = async (value) => {
		setSubmitLoading({ type: 'UPLOADING', loading: true });
		try {
		} catch (error) {
		} finally {
		}
	};

	const iconFile = (link) => {
		return (
			<>
				{link.split('.').slice(-1) == 'pdf' && <img src="/images/pdf.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'png' && <img src="/images/png.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'doc' && <img src="/images/doc.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'jpg' && <img src="/images/jpg.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'gif' && <img src="/images/gif.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'xlsx' && <img src="/images/xls.svg" alt="icon" />}
			</>
		);
	};

	return (
		<div className="card-file-box">
			<div className="col-12 d-flex justify-content-end align-items-center">
				{/* <div className="pb-3 font-weight-black">Tài liệu</div> */}
				<div className="d-flex">
					<Search placeholder="Tìm giáo trình" onSearch={onSearch} size="large" style={{ width: 200 }} className="mr-1 " />
					<DocListModal
						type="ADD_DOC"
						docInfo={docInfo}
						onFetchDataForm={() => {
							onFetchData();
						}}
						docID={null}
						docName={null}
					/>
				</div>
			</div>
			<Spin spinning={isLoading.type === 'GET_ALL' && isLoading.loading}>
				{docList?.length && (
					<div className="row">
						{docList.map((doc: IDocumentList, idx) => (
							<div className="col-12 col-md-4" key={idx}>
								<div className="file-man-box">
									<a href={doc.DocumentLink} download={doc.DocumentLink} target="_blank">
										<div className="file-img-box">{iconFile(doc.DocumentLink)}</div>
										<div className="file-man-title">
											<div className="d-flex justify-content-between align-align-items-center">
												<p className="mb-0 text-overflow">{doc.DocumentName || 'Tài liệu không có tiêu đề'}</p>
											</div>
											<p className="file-download">
												<i className="fa fa-download"></i>
											</p>
										</div>
									</a>
									<div className="d-flex doc__list-action justify-content-end">
										<DocListModal
											type="EDIT_DOC"
											docInfo={docInfo}
											onFetchDataForm={() => {
												onFetchData();
											}}
											docID={doc.ID}
											docName={doc.DocumentName}
										/>
										<DocListModal
											type="DELETE_DOC"
											docInfo={docInfo}
											onFetchDataForm={() => {
												onFetchData();
											}}
											docID={doc.ID}
											docName={doc.DocumentName}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</Spin>
		</div>
	);
};

export default FileExtension;
