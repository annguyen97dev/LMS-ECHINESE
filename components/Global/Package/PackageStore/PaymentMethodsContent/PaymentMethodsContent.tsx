import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

PaymentMethodsContent.propTypes = {
	paymentMethodsType: PropTypes.number,
};
PaymentMethodsContent.defaultProps = {
	paymentMethodsType: 0,
};

function PaymentMethodsContent(props) {
	const {paymentMethodsType} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	return (
		<>
			<a
				href="#"
				onClick={() => setIsModalVisible(true)}
				style={{fontStyle: 'italic', fontWeight: 500}}
			>
				{paymentMethodsType === 1
					? 'Quy trình thanh toán tiền mặt'
					: paymentMethodsType === 2
					? 'Quy trình thanh toán chuyển khoản'
					: null}
			</a>
			<Modal
				style={{top: 40}}
				title="Thông tin thanh toán"
				visible={isModalVisible}
				width={800}
				onCancel={() => setIsModalVisible(false)}
				footer={
					<button
						className="btn btn-secondary"
						onClick={() => setIsModalVisible(false)}
					>
						Tôi đã hiểu
					</button>
				}
			>
				{paymentMethodsType === 1 ? (
					<>
						<h6>
							Trường Nhật Ngữ Tâm Việt xin thông báo về quy trình thanh toán
							tiền mặt như sau:
						</h6>
						<div className="mg-t-20">
							<p>
								Sau khi tạo phiên thanh toán, quý khách vui lòng đến phòng tài
								chính trường với đại chỉ{' '}
								<span className="text-info">323/226 Lý Thường Kiệt P8 TB </span>{' '}
								để thanh toán và được cấp User và Mật khẩu để đăng nhập vào
								(các) Khóa học/Gói bài/Dịch vụ đã đăng ký.
							</p>
							<p>
								Nếu cần tư vấn thêm, Quý khách vui lòng liên hệ lại chúng tôi
								theo Thông tin liên hệ{' '}
								<span className="text-info">SĐT: 0936-230-247</span> hoặc{' '}
								<span className="text-info">Email: echinese.vn@gmail.com</span>{' '}
								để được hỗ trợ kịp thời.
							</p>
							<p>Chân thành cảm ơn.</p>
							<p>
								Lưu ý: Quý khách nhấn nút{' '}
								<span className="text-info">Thanh Toán</span> để tạo phiên thanh
								toán.
							</p>
						</div>
					</>
				) : paymentMethodsType === 2 ? (
					<>
						<h6>
							Trường Nhật Ngữ Tâm Việt xin thông báo về quy trình thanh toán
							chuyển khoản qua Ngân hàng như sau:
						</h6>
						<table className="table table-hover table-bordered mg-t-10">
							<thead>
								<tr>
									<th scope="col" className="no-wrap">
										Tên tài khoản
									</th>
									<th scope="col" className="no-wrap">
										Lê Thị Thanh Tuyền
									</th>
									<th scope="col" className="no-wrap" colSpan={2}>
										Trường Nhật Ngữ Tâm Việt
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">Số tài khoản</th>
									<td>29700069</td>
									<td>78326688</td>
									<td>060256548359</td>
								</tr>
								<tr>
									<th scope="row">Ngân hàng</th>
									<td>NH TMCP Á Châu (ACB) – PGD Nhà Rồng</td>
									<td>NH TMCP Á Châu (ACB) – PGD Hàm Tử</td>
									<td>
										NH TMCP Sài gòn Thương Tín (Sacombank) – CN quận 7 – PGD Tân
										Thuận
									</td>
								</tr>
								<tr>
									<th scope="row">Nội dung</th>
									<td colSpan={2}>
										<p>Theo cấu trúc sau:</p>
										<p>
											[Tên gói bài/Khóa học/Dịch vụ].[Họ và tên].[Số điện thoại]
										</p>
										<p>Ví dụ: Khoa Hoc Quan Ly.TRUONG MINH LOC.0987654321</p>
									</td>
								</tr>
							</tbody>
						</table>
						<div className="mg-t-20">
							<p>
								Trong vòng 02 ngày làm việc, Quý khách sẽ nhận được email cấp
								User và Mật khẩu để đăng nhập vào (các) Khóa học/Gói bài/Dịch vụ
								đã đăng ký.
							</p>
							<p>
								Nếu không nhận được email trên sau 02 ngày làm việc, Quý khách
								vui lòng liên hệ lại chúng tôi theo Thông tin liên hệ{' '}
								<span className="text-info">SĐT: 0936-230-247</span> hoặc{' '}
								<span className="text-info">Email: echinese.vn@gmail.com</span>{' '}
								để được hỗ trợ kịp thời.
							</p>
							<p>Chân thành cảm ơn.</p>
							<p>
								Lưu ý: Sau khi chuyển khoản, Quý khách nhấn nút{' '}
								<span className="text-info">Thanh Toán</span> để tạo phiên thanh
								toán.
							</p>
						</div>
					</>
				) : null}
			</Modal>
		</>
	);
}

export default PaymentMethodsContent;
