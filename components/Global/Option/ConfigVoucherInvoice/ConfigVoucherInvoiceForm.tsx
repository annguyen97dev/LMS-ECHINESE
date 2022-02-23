import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Modal, Popover, Spin, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import EditorField from '~/components/FormControl/EditorField';
import SelectField from '~/components/FormControl/SelectField';
import { optionCommonPropTypes } from '~/utils/proptypes';

ConfigVoucherInvoiceForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	isUpdate: PropTypes.bool,
	updateObj: PropTypes.shape({
		ID: PropTypes.number,
		ConfigContent: PropTypes.string,
		Type: PropTypes.number,
		TypeName: PropTypes.string
	}),
	handleSubmit: PropTypes.func,
	optionFormList: optionCommonPropTypes
};
ConfigVoucherInvoiceForm.defaultProps = {
	isLoading: { type: '', status: false },
	isUpdate: false,
	updateObj: {},
	handleSubmit: null,
	optionFormList: []
};
function ConfigVoucherInvoiceForm(props) {
	const { isLoading, isUpdate, updateObj, handleSubmit, optionFormList } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [codeEditorList, setCodeEditorList] = useState([
		{ label: '{hinhthucthanhtoan}', desc: 'Hình thức thanh toán' },
		{ label: '{hovaten}', desc: ' Họ và tên' },
		{ label: '{sodienthoai}', desc: ' Số điện thoại' },
		{ label: '{cmnd}', desc: ' CMND' },
		{ label: '{ngaycap}', desc: ' Ngày cấp' },
		{ label: '{noicap}', desc: ' Nơi cấp' },
		{ label: '{diachi}', desc: ' địa chỉ' },
		{ label: '{lydo}', desc: ' lý do xuất phiếu' },
		{ label: '{dachi}', desc: ' số tiền chi ra' },
		{ label: '{dathu}', desc: ' số tiền thu vào' },
		{ label: '{nguoinhanphieu}', desc: ' người nhận phiếu ký tên' },
		{ label: '{nhanvienxuat}', desc: ' nhân viên xuất phiếu ký tên' }
	]);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		ConfigContent: yup.string().required('Bạn không được để trống'),
		Type: yup.number().required('Bạn không được để trống')
	});
	const defaultValuesInit = {
		ConfigContent: '',
		Type: 1
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const handleChangeCodeEditorList = (Type) => {
		Type === 1 &&
			setCodeEditorList([
				{ label: '{hinhthucthanhtoan}', desc: 'Hình thức thanh toán' },
				{ label: '{hovaten}', desc: ' Họ và tên' },
				{ label: '{sodienthoai}', desc: ' Số điện thoại' },
				{ label: '{cmnd}', desc: ' CMND' },
				{ label: '{ngaycap}', desc: ' Ngày cấp' },
				{ label: '{noicap}', desc: ' Nơi cấp' },
				{ label: '{diachi}', desc: ' địa chỉ' },
				{ label: '{lydo}', desc: ' lý do xuất phiếu' },
				{ label: '{dachi}', desc: ' số tiền chi ra' },
				{ label: '{dathu}', desc: ' số tiền thu vào' },
				{ label: '{nguoinhanphieu}', desc: ' người nhận phiếu ký tên' },
				{ label: '{nhanvienxuat}', desc: ' nhân viên xuất phiếu ký tên' }
			]);
		Type === 2 &&
			setCodeEditorList([
				{ label: '{hinhthucthanhtoan}', desc: 'Hình thức thanh toán' },
				{ label: '{hovaten}', desc: ' Họ và tên' },
				{ label: '{sodienthoai}', desc: ' Số điện thoại' },
				{ label: '{cmnd}', desc: ' CMND' },
				{ label: '{ngaycap}', desc: ' Ngày cấp' },
				{ label: '{noicap}', desc: ' Nơi cấp' },
				{ label: '{diachi}', desc: ' địa chỉ' },
				{ label: '{lydo}', desc: ' lý do xuất phiếu' },
				{ label: '{dachi}', desc: ' số tiền chi ra' },
				{ label: '{dathu}', desc: ' số tiền thu vào' },
				{ label: '{nguoinhanphieu}', desc: ' người nhận phiếu ký tên' },
				{ label: '{nhanvienxuat}', desc: ' nhân viên xuất phiếu ký tên' }
			]);
		Type === 3 &&
			setCodeEditorList([
				{ label: '{hovaten}', desc: ' Họ và tên' },
				{ label: '{thoigianbatdau}', desc: ' Thời gian bắt đầu' },
				{ label: '{thoigianketthuc}', desc: ' Thời gian kết thúc' },
				{ label: '{tenkhoahoc}', desc: ' Tên khóa học' }
			]);
		Type === 5 &&
			setCodeEditorList([
				{ label: '{hovaten}', desc: ' Họ và tên' },
				{ label: '{tenkhoahoc}', desc: ' Tên khóa học' },
				{ label: '{thoigianbatdau}', desc: ' Thời gian bắt đầu' }
			]);

		Type === 6 &&
			setCodeEditorList([
				{ label: '{hovaten}', desc: ' Họ và tên' },
				{ label: '{tenkhoahoc}', desc: ' Tên khóa học' }
			]);
		Type === 7 &&
			setCodeEditorList([
				{ label: '{hovaten}', desc: ' Họ và tên' },
				{ label: '{loaibai}', desc: ' Loại bài(Bài kiểm tra, bài hẹn test, bộ đề, bài tập)' }
			]);
		Type === 8 &&
			setCodeEditorList([
				{ label: '{hotengiaovien}', desc: ' Họ và tên' },
				{ label: '{thoigianbatdau}', desc: ' Thời gian bắt đầu' },
				{ label: '{thoigianketthuc}', desc: ' Thời gian kết thúc' },
				{ label: '{tenkhoahoc}', desc: ' Tên khóa học' }
			]);
		Type === 9 &&
			setCodeEditorList([
				{ label: '{hotengiaovien}', desc: ' Họ và tên' },
				{ label: '{thoigianbatdau}', desc: ' Thời gian bắt đầu' },
				{ label: '{tenkhoahoc}', desc: ' Tên khóa học' }
			]);
		Type === 10 &&
			setCodeEditorList([
				{ label: '{hotengiaovien}', desc: ' Họ và tên' },
				{ label: '{loaibai}', desc: ' Loại bài(Bài kiểm tra, bài hẹn test, bộ đề, bài tập)' }
			]);
		Type === 11 &&
			setCodeEditorList([
				{ label: '{hovaten}', desc: ' Họ và tên' },
				{ label: '{taikhoan}', desc: ' Tài khoản' },
				{ label: '{matkhau}', desc: ' Mật khẩu' }
			]);
		Type === 12 &&
			setCodeEditorList([
				{ label: '{hovaten}', desc: ' Họ và tên' },
				{ label: '{sotiendongthem}', desc: ' Số tiền đóng thêm' },
				{ label: '{trungtamthu}', desc: ' Trung tâm thu tiền' },
				{ label: '{ngayhenthanhtoan}', desc: ' Ngày hẹn thanh toán' }
			]);
		Type === 13 &&
			setCodeEditorList([
				{ label: '{hovaten}', desc: ' Họ và tên' },
				{ label: '{tenkhoahoc}', desc: ' Tên khóa học' },
				{ label: '{mota}', desc: ' Mô tả' },
				{ label: '{thoigian}', desc: ' Thời gian' },
				{ label: '{makichhoat}', desc: ' Mã kích hoạt' }
			]);
	};

	useEffect(() => {
		if (isUpdate && updateObj.ID) {
			const { ConfigContent, Type } = updateObj;
			form.reset({
				ConfigContent,
				Type
			});
			handleChangeCodeEditorList(Type);
		}
	}, [updateObj]);

	const checkHandleSubmit = (data) => {
		if (!handleSubmit) return;
		handleSubmit(data).then((res) => {
			if (res) {
				closeModal();
				if (!isUpdate) {
					form.reset({ ...defaultValuesInit });
				}
			}
		});
	};

	return (
		<>
			{isUpdate ? (
				<Tooltip title="Cập nhật">
					<button className="btn btn-icon edit" onClick={openModal}>
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16 }}></i>
					</button>
				</Tooltip>
			) : (
				<button className="btn btn-warning add-new" onClick={openModal}>
					Thêm mới
				</button>
			)}
			<Modal
				style={{ top: 30 }}
				title={isUpdate ? 'Thêm phiếu' : 'Cập nhật phiếu'}
				visible={isModalVisible}
				width={1000}
				onCancel={closeModal}
				footer={null}
			>
				<div>
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						<div className="row">
							<div className="col-12">
								<SelectField
									form={form}
									name="Type"
									label="Loại phiếu"
									placeholder="Chọn loại phiếu"
									optionList={optionFormList}
									disabled={isUpdate || false}
									onChangeSelect={(value) => handleChangeCodeEditorList(value)}
								/>
							</div>
							<div className="col-12">
								<div className="invoice-editor">
									<EditorField form={form} name="ConfigContent" label="Nội dung" height={400} />
									<Popover
										placement="bottomRight"
										content={
											<div className="invoice-editor-list">
												{codeEditorList?.map((c, idx) => (
													<Tooltip title="Nhấn để sao chép" placement="left" className="invoice-editor-item">
														<p
															key={idx}
															onClick={() => {
																navigator.clipboard.writeText(c.label);
															}}
														>
															<span>{c.label}:</span>
															{`${c.desc}`}
														</p>
													</Tooltip>
												))}
											</div>
										}
									>
										<a className="btn-code-editor" type="primary">
											Mã hướng dẫn
										</a>
									</Popover>
								</div>
							</div>
							<div className="col-12 mt-3">
								<button
									type="submit"
									className="btn btn-primary w-100 "
									disabled={isLoading.type === 'ADD_DATA' && isLoading.status}
								>
									Lưu
									{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default ConfigVoucherInvoiceForm;
