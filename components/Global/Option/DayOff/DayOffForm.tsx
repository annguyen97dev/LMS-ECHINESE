import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Form, Input, Modal, Tooltip} from 'antd';
import moment from 'moment';
import React, {useState} from 'react';
import {RotateCcw} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import TextAreaField from '~/components/FormControl/TextAreaField';

const DayOffForm = (props) => {
	const {isUpdate, handleCreateDayOff} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		DayOff: yup.string().required('Bạn không được để trống'),
		DayOffName: yup.string().required('Bạn không được để trống'),
	});
	const defaultValuesInit = {
		DayOff: moment().format('YYYY-MM-DD'),
		DayOffName: '',
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	const checkHandleCreateDayOff = (data) => {
		if (!handleCreateDayOff) return;
		handleCreateDayOff(data);
		closeModal();
		form.reset({...defaultValuesInit});
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
				title="Create Day Off"
				visible={isModalVisible}
				onOk={closeModal}
				onCancel={closeModal}
				footer={null}
			>
				<div className="container-fluid">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(checkHandleCreateDayOff)}
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
									Create
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default DayOffForm;
