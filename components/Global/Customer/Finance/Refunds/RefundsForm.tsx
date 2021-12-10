import { Form, Modal, Select, Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { DollarSign } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useWrap } from '~/context/wrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectField from '~/components/FormControl/SelectField';
import PropTypes from 'prop-types';
import { optionCommonPropTypes } from '~/utils/proptypes';
RefundsForm.propTypes = {
	isUpdate: PropTypes.bool,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	handleSubmit: PropTypes.func,
	optionStatusList: optionCommonPropTypes
};
RefundsForm.defaultProps = {
	isUpdate: false,
	updateObj: {},
	isLoading: { type: '', status: false },
	handleSubmit: null,
	optionStatusList: []
};

function RefundsForm(props) {
	const { isLoading, isUpdate, updateObj, handleSubmit, optionStatusList } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		StatusID: yup.number().nullable().required('Bạn không được để trống')
	});
	const defaultValuesInit = {
		StatusID: null
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});
	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset({
				StatusID: updateObj.StatusID
			});
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
			<Tooltip title="Cập nhật">
				<button className="btn btn-icon" onClick={openModal}>
					<DollarSign />
				</button>
			</Tooltip>

			<Modal title="Cập nhật trạng thái yêu cầu hoàn tiền" visible={isModalVisible} onCancel={closeModal} footer={null}>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						<div className="row">
							<div className="col-md-12 col-12">
								{/* <Form.Item
									label="Trạng thái"
									name="Trạng thái"
									initialValue={props.rowData?.StatusName}
								>
									<Select
										className="w-100 style-input"
										onChange={(value) => setValue('StatusID', value)}
									>
										<Option value="1">Chờ duyệt</Option>
										<Option value="2">Đã duyệt</Option>
										<Option value="3">Không duyệt</Option>
									</Select>
								</Form.Item> */}
								<SelectField form={form} name="StatusID" label="Trạng thái" optionList={optionStatusList} />
							</div>
							<div className="col-12 mt-3">
								<button
									type="submit"
									className="btn btn-primary w-100"
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

export default RefundsForm;
