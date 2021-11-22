import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Modal, Spin, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';

ConfigZoomForm.propTypes = {
	isUpdate: PropTypes.bool,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	handleSubmit: PropTypes.func
};
ConfigZoomForm.defaultProps = {
	isUpdate: false,
	updateObj: {},
	isLoading: { type: '', status: false },
	handleSubmit: null
};

const ImageInstructions = (props) => {
	const [imageVisible, setImageVisible] = useState(false);
	const { step } = props;
	return (
		<>
			<button
				type="button"
				className="btn-show-image"
				onClick={() => {
					setImageVisible(true);
				}}
			>
				Xem ảnh
			</button>
			<Modal visible={imageVisible} onCancel={() => setImageVisible(false)} footer={null} width={1000}>
				{step === 1 && <img src="/images/zoomIns1.png" alt="img" style={{ width: '100%' }} />}
				{step === 2 && <img src="/images/zoomIns2.png" alt="img" style={{ width: '100%' }} />}
				{step === 3 && <img src="/images/zoomIns3.png" alt="img" style={{ width: '100%' }} />}
				{step === 4 && <img src="/images/zoomIns4.png" alt="img" style={{ width: '100%' }} />}
			</Modal>
		</>
	);
};

const MoreInfo = () => (
	<div className="col-12">
		<div>
			1. Đăng kí tài khoản Zoom Developer
			<a href="https://marketplace.zoom.us/" target="_blank" style={{ paddingLeft: '5px', textDecoration: 'underline' }}>
				tại đây
			</a>
		</div>
		<ul>
			<li style={{ marginBottom: 5 }}>
				Chọn đăng ký/đăng nhập bằng Google.
				<span>
					<ImageInstructions step={1} />
				</span>
			</li>
			{/* <li>
				Tài khoản mail cũng là tài khoản cấu hình cần nhập. Có thể xem
				<a
					target="_blank"
					href="https://zoom.us/signin"
					style={{
						paddingLeft: '5px',
						textDecoration: 'underline',
						color: 'blue'
					}}
				>
					tại đây
				</a>
				. (Chọn show Sign-In Email và Copy)
			</li> */}
		</ul>
		<div>
			2. Sau khi đăng nhập ➝ Chọn "Develop" góc trên bên trái ➝ Build App ➝ Create App JWT. <ImageInstructions step={2} />
		</div>
		<ul>
			<li style={{ marginBottom: 5 }}>
				Tại mục Information: nhập App Name và Company Name.
				<ImageInstructions step={3} />
			</li>
			<li>
				Tại mục App Credentials: Sao chép API Key và API Secret.
				<ImageInstructions step={4} />
			</li>
		</ul>
	</div>
);

function ConfigZoomForm(props) {
	const { isUpdate, isLoading, updateObj, handleSubmit } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const [moreInfo, setMoreInfo] = useState(false);

	const showMoreInfo = () => {
		setMoreInfo(!moreInfo);
	};

	const schema = yup.object().shape({
		UserZoom: yup.string().required('Bạn không được để trống'),
		APIKey: yup
			.string()
			.required('Bạn không được để trống')
			.test('len', 'API Key là dãy ký tự dài 22 ký tự', (val) => val.length === 22),
		APISecret: yup
			.string()
			.required('Bạn không được để trống')
			.test('len', 'API Secret là dãy ký tự dài 36 ký tự', (val) => val.length === 36)
	});
	const defaultValuesInit = {
		UserZoom: '',
		APIKey: '',
		APISecret: ''
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset({
				...updateObj
			});
		}
	}, [updateObj]);

	const checkHandleSubmit = (data) => {
		if (!handleSubmit) return;
		handleSubmit(data).then((res) => {
			if (res) {
				closeModal();
				setMoreInfo(false);
				if (!isUpdate) {
					form.reset({ ...defaultValuesInit });
				}
			}
		});
	};

	return (
		<>
			{isUpdate ? (
				<button className="btn btn-icon edit" onClick={openModal}>
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				</button>
			) : (
				<button className="btn btn-warning add-new" onClick={openModal}>
					Thêm cấu hình
				</button>
			)}

			<Modal
				style={{ top: 25 }}
				title={isUpdate ? 'Cập nhật cấu hình' : 'Thêm cấu hình'}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={null}
				width={800}
			>
				<div>
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						<div className="row">
							<div className="col-12">
								<InputTextField form={form} name="UserZoom" label="Tài khoản" placeholder="Nhập tài khoản" />
							</div>
							<div className="col-12">
								<InputTextField form={form} name="APIKey" label="API Key" placeholder="Nhập API Key" />
							</div>
							<div className="col-12">
								<InputTextField form={form} name="APISecret" label="API Secret" placeholder="Nhập API secret" />
							</div>
							<div className="instructions" onClick={showMoreInfo}>
								<div className="col-12 d-flex">
									<i className="far fa-question-circle" />
									<div style={{ marginTop: '-4px', paddingLeft: '6px' }}>Hướng dẫn</div>
								</div>
							</div>

							{moreInfo && <MoreInfo />}

							<div className="col-12 mt-3">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type === 'ADD_DATA' && isLoading.status}
								>
									{isUpdate ? 'Cập nhật' : 'Thêm cấu hình'}
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

export default ConfigZoomForm;
