import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Spin} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';

PackageDetailForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	handleSubmit: PropTypes.func,
	optionExamTopicList: optionCommonPropTypes,
	packageInfo: PropTypes.shape({
		ID: PropTypes.number,
		Name: PropTypes.string,
		Avatar: PropTypes.string,
		Level: PropTypes.number,
		Type: PropTypes.number,
		TypeName: PropTypes.string,
		Price: PropTypes.number,
	}),
};
PackageDetailForm.defaultProps = {
	isLoading: {type: '', status: false},
	handleSubmit: null,
	optionExamTopicList: [],
	packageInfo: {},
};

function PackageDetailForm(props) {
	const {isLoading, handleSubmit, optionExamTopicList, packageInfo} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống'),
		ExamTopicID: yup.number().nullable().required('Bạn không được để trống'),
	});

	const defaultValuesInit = {
		Name: '',
		ExamTopicID: null,
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (packageInfo?.ID) {
			form.setValue('Name', packageInfo.Name);
		}
	}, [packageInfo]);

	const checkHandleSubmit = (data: {Name: number; ExamTopicID: number}) => {
		if (!handleSubmit) return;
		handleSubmit(data).then((res) => {
			if (res?.status === 200) {
				closeModal();
				form.reset({...defaultValuesInit});
			}
		});
	};

	return (
		<>
			<button className="btn btn-warning add-new" onClick={openModal}>
				Thêm đề thi
			</button>
			<Modal
				title="Thêm đề thi"
				visible={isModalVisible}
				footer={null}
				onCancel={closeModal}
			>
				<div className="wrap-form">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(checkHandleSubmit)}
					>
						<div className="row">
							<div className="col-md-12 col-12">
								<InputTextField
									form={form}
									name="Name"
									label="Tên gói"
									placeholder="Nhập tên gói"
									disabled={true}
								/>
							</div>
							<div className="col-md-12 col-12">
								<SelectField
									form={form}
									name="ExamTopicID"
									label="Đề thi"
									placeholder="Chọn đề thi"
									optionList={optionExamTopicList}
								/>
							</div>
							<div
								className="col-md-12 col-12 mt-3 "
								style={{textAlign: 'center'}}
							>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Khởi tạo
									{isLoading.type == 'ADD_DATA' && isLoading.status && (
										<Spin className="loading-base" />
									)}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default PackageDetailForm;
