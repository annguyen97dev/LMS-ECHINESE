import { Spin } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

FileExtension.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	documentList: PropTypes.array
};
FileExtension.defaultProps = {
	isLoading: { type: '', status: false },
	documentList: []
};
function FileExtension(props) {
	const { isLoading, documentList } = props;

	const iconFile = (link) => {
		return (
			<>
				{link.split('.').slice(-1) == 'pdf' && <img src="/images/pdf.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'png' && <img src="/images/png.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'doc' && <img src="/images/doc.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'docx' && <img src="/images/docx.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'jpg' && <img src="/images/jpg.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'gif' && <img src="/images/gif.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'xlsx' && <img src="/images/xls.svg" alt="icon" />}
			</>
		);
	};

	return (
		<div className="card-file-box">
			<div className="pb-3 font-weight-black">Tài liệu</div>
			<Spin spinning={isLoading.type === 'FETCH_DOCUMENT' && isLoading.status}>
				{documentList?.length ? (
					<div className="row">
						{documentList.map((doc: IDocument, idx) => (
							<div className="col-12 col-md-4" key={idx}>
								<div className="file-man-box">
									<a href={doc.DocumentLink} download={doc.DocumentLink} target="_blank">
										<div className="file-img-box">{iconFile(doc.DocumentLink)}</div>
										<div className="file-man-title">
											<p className="mb-0 text-overflow">{doc.DocumentName || 'Tài liệu không có tiêu đề'}</p>
											<p className="file-download">
												<i className="fa fa-download"></i>
											</p>
										</div>
									</a>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="empty-document">Không tìm thấy tài liệu trong giáo trình này!</p>
				)}
			</Spin>
		</div>
	);
}
export default FileExtension;
