import { Tooltip, Modal, Form, Spin, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'react-feather';
import { teacherSalaryApi } from '~/apiBase/staff-manage/teacher-salary';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';

const ConfirmForm = ({ isLoading, record, setParams, params }) => {
	const { Option } = Select;
	const [isVisible, setIsVisible] = useState(false);
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const [submitLoading, setSubmitLoading] = useState({ type: '', loading: false });

	const [dataForm, setDataForm] = useState({
		ID: record.ID,
		AdvanceSalary: record.AdvanceSalary,
		Bonus: record.Bonus,
		NoteBonus: record.NoteBonus,
		isClosing: true, //true- chốt lương (khi chốt lương thì mặc định status là 3)
		StatusID: record.StatusID, //4-Đã xác nhận
		isDonePaid: record.isDonePaid //true-thanh toán lương (khi thanh toán trang thái là 5)
	});

	const _onSubmit = async (value) => {
		setSubmitLoading({ type: 'UPLOADING', loading: true });
		try {
			let res = await teacherSalaryApi.update({ ...dataForm, StatusID: record.StatusID == 3 ? 4 : 5 });
			if (res.status == 200) {
				form.resetFields();
				params && setParams({ ...params });
				setIsVisible(false);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setSubmitLoading({ type: 'UPLOADING', loading: false });
			console.log(dataForm);
		}
	};

	return (
		<>
			{record.StatusID == 1 && <p className="font-weight-blue">Chưa xác nhận lương</p>}
			{record.StatusID == 3 && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsVisible(true);
					}}
				>
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				</button>
			)}
			{record.StatusID == 4 && <p className="font-weight-blue">Đã xác nhận</p>}
			{record.StatusID == 5 && <p className="font-weight-blue">Đã nhận lương</p>}

			<Modal title={'Xác Nhận Lương'} onCancel={() => setIsVisible(false)} visible={isVisible} footer={false}>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="row">
						<div className="col-12 mb-2 justify-content-center">
							{record.StatusID == 3 ? (
								<h4 className="text-center">Xác Nhận Lương Của Bạn Là Chính Xác</h4>
							) : (
								<h4 className="text-center">Xác Nhận Đã Thanh Toán Lương</h4>
							)}
						</div>
						<div className="col-12">
							<Form.Item label="Trạng Thái Thanh Toán" name="isDonePaid">
								<Select
									disabled={true}
									style={{ width: '100%' }}
									className="style-input"
									defaultValue={record.isDonePaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
								>
									<Option value={record.isDonePaid}>{record.isDonePaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}</Option>
								</Select>
							</Form.Item>
						</div>

						<div className="col-12 mt-3">
							<button type="submit" className="btn btn-primary w-100">
								Lưu
								{submitLoading.type == 'UPLOADING' && submitLoading.loading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};
export default ConfirmForm;
