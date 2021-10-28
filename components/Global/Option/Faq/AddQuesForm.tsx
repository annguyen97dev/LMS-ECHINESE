import { Modal, Spin, Form, Input, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'react-feather';
import { faqApi } from '~/apiBase/options/faq';
import { useWrap } from '~/context/wrap';

const AddQuesForm = (props) => {
	const { mode, onFetchData, dataEdit, currentPage } = props;
	const [showModal, setShowModal] = useState(false);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [form] = Form.useForm();
	const { TextArea } = Input;
	const { showNoti } = useWrap();

	const hanleAddQuestion = async (data) => {
		setIsLoading({ type: 'ADD_DATA', status: true });
		try {
			let res = await faqApi.add(data);
			if (res.status == 200) {
				setIsLoading({ type: 'ADD_DATA', status: false });
				showNoti('success', 'Thêm câu hỏi thành công');
				form.resetFields();
				setShowModal(false);
				onFetchData && onFetchData();
			}
		} catch (error) {
			form.resetFields();
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'ADD_DATA', status: false });
		}
	};

	const handleEditQuestion = async (data) => {
		const dataUpdate = {
			ID: dataEdit.ID,
			Questions: data.Questions,
			Answer: data.Answer,
			Enable: true
		};
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			let res = await faqApi.update(dataUpdate);
			showNoti('success', 'Sửa câu hỏi thành công!');
			form.resetFields();
			setShowModal(false);
			onFetchData && onFetchData();
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	const _onSubmit = async (data) => {
		mode === 'add-questions' ? hanleAddQuestion(data) : handleEditQuestion(data);
	};

	useEffect(() => {
		console.log('reset form');
	}, [dataEdit]);

	return (
		<>
			{mode === 'add-questions' ? (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setShowModal(true);
					}}
				>
					Thêm mới
				</button>
			) : (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						form.resetFields();
						console.log(dataEdit);
						setShowModal(true);
					}}
				>
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				</button>
			)}

			<Modal
				title="Thêm câu hỏi"
				visible={showModal}
				onCancel={() => {
					form.resetFields();
					setShowModal(false);
				}}
				footer={false}
			>
				<div className="container-fluit">
					<Form form={form} layout="vertical" onFinish={_onSubmit}>
						<div className="row">
							<div className="col-12">
								<Form.Item
									label="Tiêu đề câu hỏi"
									name="Questions"
									rules={[mode === 'edit-questions' ? {} : { required: true, message: 'Bạn không được để trống' }]}
								>
									<Input
										placeholder="Thêm câu hỏi"
										className="style-input"
										defaultValue={mode === 'edit-questions' ? dataEdit.Questions : ''}
									/>
								</Form.Item>
							</div>
							<div className="col-12">
								<Form.Item
									label="Nội dung trả lời"
									name="Answer"
									rules={[mode === 'edit-questions' ? {} : { required: true, message: 'Bạn không được để trống' }]}
								>
									<TextArea
										placeholder="Thêm câu trả lời"
										allowClear
										rows={5}
										defaultValue={mode === 'edit-questions' ? dataEdit.Answer : ''}
									/>
								</Form.Item>
							</div>
							<div className="col-12 mt-3">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default AddQuesForm;
