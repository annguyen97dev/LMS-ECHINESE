import {Card, Spin, Tooltip} from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import {File} from 'react-feather';

export default function ExpandBox() {
	return (
		<div className="feedback-detail-text">
			<table className="tb-expand">
				<tr>
					<th>Trung tâm</th>
					<th>Ghi chú</th>
					<th>Cam kết</th>
					<th>Giá tiền</th>
					<th>Đã đóng</th>
					<th>Giảm giá</th>
					<th>Nhập ngày</th>
				</tr>
				<tr>
					<td>ZIM – 35 Võ Oanh</td>
					<td>[Ghi chú chuyển lớp]</td>
					<td>Cam kết được 8đ</td>
					<td>19.500.000</td>
					<td>19.500.000</td>
					<td>0</td>
					<td>30/03/2021</td>
				</tr>
			</table>
		</div>
	);
}

export function ExpandPaymentRow(props: {
	isLoading: {type: string; status: boolean};
	dataRow: ICourseOfStudentPrice;
	infoInvoiceList?: IInvoice[];
}) {
	const {isLoading, dataRow, infoInvoiceList} = props;
	const {Course} = dataRow;
	return (
		<div className="feedback-detail-text">
			<Spin
				spinning={isLoading.type === 'FETCH_INFO_INVOICE' && isLoading.status}
			>
				<table className="tb-expand">
					<thead>
						<tr>
							{Course?.length ? <th>Các khóa học</th> : null}
							<th>Lý do</th>
							<th>Xem phiếu thu</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							{Course?.length ? (
								<td>
									<div className="list-coursename">
										{Course.map((item) => (
											<Link
												key={item.ID}
												href={{
													pathname:
														'/course/course-list/course-list-detail/[slug]',
													query: {slug: item.ID, type: item.TypeCourse},
												}}
											>
												<a
													title={item.CourseName}
													className="font-weight-black d-block"
												>
													{item.CourseName}
												</a>
											</Link>
										))}
									</div>
								</td>
							) : null}
							<td>
								{(infoInvoiceList && infoInvoiceList[0]?.Reason) ||
									'Không có lý do'}
							</td>
							<td>
								{infoInvoiceList &&
									infoInvoiceList.map((v) => (
										<Link
											key={v.ID}
											href={{
												pathname:
													'/customer/finance/finance-cashier-invoice/invoice-detail/[slug]',
												query: {slug: v.ID},
											}}
										>
											<Tooltip title={moment(v.CreatedOn).format('DD/MM/YYYY')}>
												<button className="btn btn-icon exchange ">
													<File />
												</button>
											</Tooltip>
										</Link>
									))}
							</td>
						</tr>
					</tbody>
				</table>
			</Spin>
		</div>
	);
}

export function ExpandRefundRow(props: {
	isLoading: {type: string; status: boolean};
	dataRow: IRefunds;
	infoVoucherList?: IVoucher[];
}) {
	const {isLoading, dataRow, infoVoucherList} = props;
	const {Reason, RefundsDetail, PaymentMethodsName} = dataRow;
	return (
		<div className="feedback-detail-text">
			<Spin
				spinning={isLoading.type === 'FETCH_INFO_VOUCHER' && isLoading.status}
			>
				<table className="tb-expand">
					<thead>
						<tr>
							{RefundsDetail.length ? <th>Các khóa học</th> : null}
							<th>Lý do hoàn tiền</th>
							<th>Phương thức hoàn tiền</th>
							<th>Xem phiếu chi</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							{RefundsDetail.length ? (
								<td>
									<div className="list-coursename">
										{RefundsDetail.map((item) => (
											<Link
												key={item.CourseID}
												href={{
													pathname:
														'/course/course-list/course-list-detail/[slug]',
													query: {slug: item.CourseID, type: item.TypeCourse},
												}}
											>
												<a
													title={item.CourseName}
													className="font-weight-black d-block"
												>
													{item.CourseName}
												</a>
											</Link>
										))}
									</div>
								</td>
							) : null}
							<td>{Reason || 'Không có lý do'}</td>
							<td>{PaymentMethodsName}</td>
							<td>
								{infoVoucherList &&
									infoVoucherList.map((v) => (
										<Link
											key={v.ID}
											href={{
												pathname:
													'/customer/finance/finance-cashier-payment/invoice-detail/[slug]',
												query: {slug: v.ID},
											}}
										>
											<Tooltip title={moment(v.CreatedOn).format('DD/MM/YYYY')}>
												<button className="btn btn-icon exchange ">
													<File />
												</button>
											</Tooltip>
										</Link>
									))}
							</td>
						</tr>
					</tbody>
				</table>
			</Spin>
		</div>
	);
}

export function ExpandBoxWarning(props) {
	return (
		<div className="feedback-detail-text">
			{/* <p>{props.dataRow.WarningNote != null ? props.dataRow.WarningNote : "Không có nội dung"}</p>  */}
			<table className="tb-expand">
				<tr>
					<th>Ghi chú</th>
					<th>Cam kết</th>
					<th>Cảnh báo</th>
				</tr>
				<tr>
					<td>
						{props.dataRow.Note != null
							? props.dataRow.Note
							: 'Không có nội dung'}
					</td>
					<td>
						{props.dataRow.Commitment != null
							? props.dataRow.Commitment
							: 'Không có nội dung'}
					</td>
					<td>
						{props.dataRow.WarningNote != null
							? props.dataRow.WarningNote
							: 'Không có nội dung'}
					</td>
				</tr>
			</table>
		</div>
	);
}

export function ExpandBoxPost() {
	return (
		<div className="feedback-detail-text">
			<>
				<Card>
					Thư giới thiệu là một phần quan trọng trong yêu cầu tuyển sinh của
					nhiều trường đại học trên thế giới, cho dù bạn đi học đại học hay thạc
					sĩ. Song song với bài luận cá nhân, thư giới thiệu góp phần cung cấp
					cái nhìn toàn diện về năng lực và tiềm năng của chúng ta. Và tất nhiên
					để cạnh tranh được với những thí sinh khác, chúng ta cần khác biệt,
					nổi trội so với phần đông. Anh đã từng viết rất nhiều thư giới thiệu
					cho học sinh, kể cả học sinh cấp 3, đại học hay thậm chí là người đi
					làm. Anh hiểu được cách các bạn đang hiểu nhầm mục đích của thư giới
					thiệu và phản ánh sự hiểu nhầm đó vào nội dung của thư. Anh cũng hiểu
					một thư giới thiệu xuất sắc cần phải đảm bảo những yếu tố như thế nào.
					Nên hôm nay anh sẽ đưa ra 3 tiêu chí giúp mọi người lên ý tưởng cho
					một (hoặc) nhiều bức thư giới thiệu mà thực sự sẽ để lại ấn tượng cho
					người đọc nhé.
				</Card>
			</>
		</div>
	);
}
