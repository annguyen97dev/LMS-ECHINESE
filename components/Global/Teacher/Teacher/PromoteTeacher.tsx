import React, { useState, useEffect } from 'react';
import { ChevronsDown, ChevronsUp } from 'react-feather';
import { Form, Modal, Spin } from 'antd';
const PromoteTeacher = (props) => {
	const { isLoading, record, type, _onSubmitPromoteTeacher, _onSubmitPromoteStaff } = props;
	const [visible, setVisible] = useState(false);

	const onSubmit = () => {
		if (type == 'teacher') {
			_onSubmitPromoteTeacher().then((res) => {
				console.log(res);
				if (res) {
					setVisible(false);
				}
			});
		}
		if (type == 'staff') {
			_onSubmitPromoteStaff().then((res) => {
				console.log(res);
				if (res) {
					setVisible(false);
				}
			});
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setVisible(true);
				}}
				className={type && type == 'teacher' ? 'btn btn-icon edit' : 'btn btn-icon delete'}
			>
				{type && type == 'teacher' && <ChevronsUp />}
				{type && type == 'staff' && <ChevronsDown />}
			</button>
			<Modal
				visible={visible}
				onCancel={() => {
					setVisible(false);
				}}
				footer={false}
			>
				<div className="row">
					<Form onFinish={onSubmit}>
						<div className="col-12">
							{type && type == 'teacher' && (
								<h3 className="mt-4 text-center">
									Bạn xác nhận muốn thăng cấp giáo viên{' '}
									<span className="text-uppercase mt-4">{record.FullNameUnicode}</span> thành quản lý
								</h3>
							)}
							{type && type == 'staff' && (
								<h3 className="mt-4 text-center">
									Bạn xác nhận muốn chuyển quản lý <span className="text-uppercase mt-4">{record.FullNameUnicode}</span>{' '}
									thành giáo viên
								</h3>
							)}
						</div>
						<div className="col-12 mt-3">
							<button
								type="submit"
								className="btn btn-primary w-100"
								disabled={isLoading.type === 'PROMOTE' && isLoading.status}
							>
								{type && type == 'teacher' && 'Thăng cấp'}
								{type && type == 'staff' && 'Chuyển'}
								{isLoading.type === 'PROMOTE' && isLoading.status && <Spin className="loading-base" />}
							</button>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default PromoteTeacher;
