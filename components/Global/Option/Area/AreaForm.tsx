import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Tooltip} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {RotateCcw} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import InputTextField from '~/components/FormControl/InputTextField';
import TextAreaField from '~/components/FormControl/TextAreaField';

const AreaForm = (props) => {
	const {
		handleCreateArea,
		isUpdate,
		handleUpdateArea,
		updateObj,
		idxUpdateObj,
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		AreaName: yup.string().required('Bạn không được để trống'),
	});

	const defaultValuesInit = {
		AreaName: '',
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (isUpdate && updateObj && idxUpdateObj >= 0) {
			form.setValue('AreaName', updateObj.AreaName);
		}
	}, [updateObj, idxUpdateObj]);

	const areaSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdateArea) return;
				handleUpdateArea(data, idxUpdateObj, updateObj);
				break;
			case false:
				if (!handleCreateArea) return;
				handleCreateArea(data);
				form.reset({...defaultValuesInit});
				break;
			default:
				break;
		}
		closeModal();
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
					Thêm mới
				</button>
			)}
			<Modal
				title={isUpdate ? 'Update Provincial' : 'Create Provincial'}
				visible={isModalVisible}
				onOk={closeModal}
				onCancel={closeModal}
				footer={null}
			>
				<div className="container-fluid">
					<Form layout="vertical" onFinish={form.handleSubmit(areaSwitchFunc)}>
						<div className="row">
							<div className="col-12">
								<InputTextField
									form={form}
									name="AreaName"
									label="Tên tỉnh/thành phố"
								/>
							</div>
						</div>
						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									{isUpdate ? 'Update' : 'Create'}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};
AreaForm.propTypes = {
	handleCreateArea: PropTypes.func,
	isUpdate: PropTypes.bool,
	handleUpdateArea: PropTypes.func,
	updateObj: PropTypes.shape({}),
	idxUpdateObj: PropTypes.number,
};
AreaForm.defaultProps = {
	handleCreateArea: null,
	isUpdate: false,
	handleUpdateArea: null,
	updateObj: {},
	idxUpdateObj: -1,
};
export default AreaForm;
