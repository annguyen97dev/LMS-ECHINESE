import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Tooltip} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {RotateCcw} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import TextAreaField from '~/components/FormControl/TextAreaField';

const DayOffForm = (props) => {
	const {
		handleCreateDayOff,
		isUpdate,
		handleUpdateDayOff,
		updateObj,
		idxUpdateObj,
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		DayOff: yup.string().nullable().required('Bạn không được để trống'),
		DayOffName: yup.string().required('Bạn không được để trống'),
	});

	const defaultValuesInit = {
		DayOff: moment().toString(),
		DayOffName: '',
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (isUpdate && updateObj && idxUpdateObj >= 0) {
			Object.entries(updateObj).forEach((arr) => form.setValue(arr[0], arr[1]));
		}
	}, [updateObj, idxUpdateObj]);

	const dayOffSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdateDayOff) return;
				handleUpdateDayOff(data, idxUpdateObj, updateObj);
				break;
			case false:
				if (!handleCreateDayOff) return;
				handleCreateDayOff(data);
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
				title={isUpdate ? 'Update Day Off' : 'Create Day Off'}
				visible={isModalVisible}
				onOk={closeModal}
				onCancel={closeModal}
				footer={null}
			>
				<div className="container-fluid">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(dayOffSwitchFunc)}
					>
						<div className="row">
							<div className="col-12">
								<DateField form={form} name="DayOff" label="Day off" />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<TextAreaField
									form={form}
									name="DayOffName"
									label="Note"
									rows={2}
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
DayOffForm.propTypes = {
	handleCreateDayOff: PropTypes.func,
	isUpdate: PropTypes.bool,
	handleUpdateDayOff: PropTypes.func,
	updateObj: PropTypes.shape({}),
	idxUpdateObj: PropTypes.number,
};
DayOffForm.defaultProps = {
	handleCreateDayOff: null,
	isUpdate: false,
	handleUpdateDayOff: null,
	updateObj: {},
	idxUpdateObj: -1,
};
export default DayOffForm;
