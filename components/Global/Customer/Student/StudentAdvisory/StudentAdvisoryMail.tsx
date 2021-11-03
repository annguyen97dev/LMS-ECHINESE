import React, { useState } from 'react';
import { Modal, Form, Spin, Tooltip } from 'antd';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import InputTextField from '~/components/FormControl/InputTextField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import { studentAdviseApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { SendOutlined } from '@ant-design/icons';

let returnSchema = {};
let schema = null;

const StudentAdvisoryMail = (props) => {
	const { onFetchData, dataSource, loadingOutside, dataRow } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { showNoti } = useWrap();

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const listID = () => {
		let arrID = dataSource.map((item) => item.ID);

		console.log('arrID: ', arrID);

		return arrID;
	};

	const defaultValuesInit = {
		title: null,
		content: null
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'title':
					returnSchema[key] = yup.mixed().required('Tiêu đề không được để trống');
					break;
				case 'content':
					returnSchema[key] = yup.mixed().required('Nội dung không được để trống');
					break;

				default:
					// returnSchema[key] = yup.mixed().required("Bạn không được để trống");
					break;
			}
		});

		schema = yup.object().shape(returnSchema);
	})();

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const onSubmit = async (data: any) => {
		let dataSubmit = null;
		if (!dataRow) {
			dataSubmit = {
				...data,
				customerIDs: listID()
			};
		} else {
			dataSubmit = {
				...data,
				customerIDs: [dataRow.ID]
			};
		}

		setIsLoading(true);
		try {
			let res = await studentAdviseApi.sendEmail(dataSubmit);
			if (res.status === 200) {
				showNoti('success', 'Gửi email thành công');
				setIsModalVisible(false);
				form.reset(defaultValuesInit);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			{!dataRow ? (
				<button className="btn btn-warning" onClick={showModal}>
					Gửi mail
				</button>
			) : (
				<Tooltip title="Gửi mail">
					<button className="btn btn-icon" onClick={showModal}>
						<SendOutlined />
					</button>
				</Tooltip>
			)}

			<Modal
				footer={null}
				title={!dataRow ? 'Gửi mail hàng loạt' : 'Gửi mail'}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				{loadingOutside.status ? (
					<p>Chờ chút bạn đang thao tác quá nhanh</p>
				) : (
					<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
						<div className="row">
							<div className="col-12">
								<InputTextField form={form} name="title" label="Tiêu đề" placeholder="" />
							</div>
							<div className="col-12">
								<TextAreaField form={form} name="content" label="Nội dung" placeholder="" />
							</div>
							<div className="col-12 mt-3">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{isLoading && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				)}
			</Modal>
		</div>
	);
};

export default StudentAdvisoryMail;
