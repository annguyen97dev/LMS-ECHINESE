import { Tooltip, Modal, Form, Spin, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'react-feather';
import { staffSalaryApi } from '~/apiBase/staff-manage/staff-salary';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';

const ConfirmForm = ({ isLoading, record, userInformationID, setParams, params }) => {
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
		CountOff: record.CountOff, //Số ngày off,
		isClosing: true, //true- chốt lương (khi chốt lương thì mặc định status là 3)
		StatusID: 3, //4-Đã xác nhận
		isDonePaid: record.isDonePaid //true-thanh toán lương (khi thanh toán trang thái là 5)
	});
	const [reConfirm, setReConfirm] = useState({
		type: false,
		StatusID: record.StatusID
	});

	const _onSubmit = async (value) => {
		setSubmitLoading({ type: 'UPLOADING', loading: true });
		try {
			let res = await staffSalaryApi.update({ ...dataForm, StatusID: reConfirm.StatusID == 1 ? 3 : reConfirm.StatusID == 3 ? 3 : 5 });
			// let res = await staffSalaryApi.update({ ...dataForm, StatusID: 1 });
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

	const onChangeReConfirm = () => {
		if (reConfirm.StatusID == 3) {
			setReConfirm({
				type: false,
				StatusID: 4
			});
		}
		if (reConfirm.StatusID == 4) {
			setReConfirm({
				type: true,
				StatusID: 3
			});
		}
	};

	const selectStatus =
		(record.StatusID == 1 && 'Yêu cầu xác nhận') ||
		(record.StatusID == 3 && 'Yêu cầu xác nhận') ||
		(record.StatusID == 4 && 'Đã xác nhận') ||
		(record.StatusID == 5 && 'Đã thanh toán');

	return (
		<>
			{record.StatusID == 5 ? (
				<p className="font-weight-blue">Đã nhận lương</p>
			) : (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsVisible(true);
					}}
				>
					{record.StatusID == 1 && (
						<Tooltip title="Cập nhật lương">
							<RotateCcw />
						</Tooltip>
					)}
					{record.StatusID == 3 && (
						<Tooltip title="Cập nhật lại lương">
							<RotateCcw />
						</Tooltip>
					)}
					{record.StatusID == 4 && (
						<Tooltip title="Gửi yêu cầu xác nhận lại">
							<RotateCcw />
						</Tooltip>
					)}
				</button>
			)}

			<Modal title={'Cập nhật lương'} onCancel={() => setIsVisible(false)} visible={isVisible} footer={false}>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="row">
						{reConfirm.StatusID == 4 ? (
							<>
								<div className="col-12 mb-3">
									<h4 className="font-weight-blue">Xác nhận thanh toán lương cho nhân viên!</h4>
								</div>
							</>
						) : (
							<>
								<div className="col-12">
									<Form.Item label="Tăng Lương" name="AdvanceSalary">
										<Input
											onChange={(event) => {
												setDataForm({ ...dataForm, AdvanceSalary: Number(event.target.value) });
											}}
											name="AdvanceSalary"
											placeholder="Thêm lương thưởng"
											className="style-input"
											defaultValue={dataForm.AdvanceSalary}
										/>
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item label="Ngày Nghỉ" name="CountOff">
										<Input
											onChange={(event) => {
												setDataForm({ ...dataForm, CountOff: Number(event.target.value) });
											}}
											name="CountOff"
											className="style-input"
											defaultValue={dataForm.CountOff}
										/>
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item label="Thưởng" name="Bonus">
										<Input
											onChange={(event) => {
												setDataForm({ ...dataForm, Bonus: Number(event.target.value) });
											}}
											name="Bonus"
											placeholder="Thêm tiền thưởng"
											className="style-input"
											defaultValue={dataForm.Bonus}
										/>
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item label="Ghi Chú Lương Thưởng" name="NoteBonus">
										<Input
											onChange={(event) => {
												setDataForm({ ...dataForm, NoteBonus: event.target.value });
											}}
											name="NoteBonus"
											placeholder="Thêm ghi chú"
											className="style-input"
											defaultValue={dataForm.NoteBonus}
										/>
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item label="Trạng Thái" name="StatusName">
										<Select
											disabled={true}
											style={{ width: '100%' }}
											className="style-input"
											defaultValue={selectStatus}
										>
											<Option value={selectStatus}>{selectStatus}</Option>
										</Select>
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item label="Trạng Thái Thanh Toán" name="isDonePaid">
										<Select
											disabled={true}
											style={{ width: '100%' }}
											className="style-input"
											defaultValue={record.isDonePaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
										>
											<Option value={record.isDonePaid}>
												{record.isDonePaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
											</Option>
										</Select>
									</Form.Item>
								</div>
							</>
						)}

						{record.StatusID == 4 &&
							(reConfirm.StatusID ? (
								<div className="col-12 ">
									<a className="font-weight-blue" onClick={onChangeReConfirm}>
										Hủy gửi yêu cầu xác nhận lại
									</a>
								</div>
							) : (
								<div className="col-12 ">
									<a className="font-weight-blue" onClick={onChangeReConfirm}>
										Gửi yêu cầu xác nhận lại
									</a>
								</div>
							))}
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
