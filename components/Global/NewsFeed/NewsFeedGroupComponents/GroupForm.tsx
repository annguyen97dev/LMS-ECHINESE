import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Edit2, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import UploadAvatarField from '~/components/FormControl/UploadAvatarField';
import { optionCommonPropTypes } from '~/utils/proptypes';

GroupForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	isUpdate: PropTypes.bool,
	dataUpdate: PropTypes.shape({
		ID: PropTypes.number,
		Name: PropTypes.string,
		BackGround: PropTypes.string,
		Administrators: PropTypes.number,
		FullNameUnicode: PropTypes.string,
		CourseID: PropTypes.number,
		CourseName: PropTypes.string,
		BranchID: PropTypes.number,
		BranchName: PropTypes.string
	}),
	courseList: optionCommonPropTypes,
	handleSubmit: PropTypes.func
};
GroupForm.defaultProps = {
	isLoading: { type: '', status: false },
	isUpdate: false,
	dataUpdate: {
		ID: 0,
		Name: '',
		BackGround: '',
		Administrators: 0,
		FullNameUnicode: '',
		CourseID: 0,
		CourseName: '',
		BranchID: 0,
		BranchName: ''
	},
	courseList: [],
	handleSubmit: null
};

function GroupForm(props) {
	const { isLoading, isUpdate, dataUpdate, courseList, handleSubmit } = props;
	const [isVisibleModal, setIsVisibleModal] = useState(false);

	const showModal = () => {
		setIsVisibleModal(true);
	};

	const closeModal = () => {
		setIsVisibleModal(false);
	};

	const defaultValuesInit = {
		Name: '',
		CourseID: null,
		BackGround: ''
	};

	const schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống'),
		CourseID: yup.number().nullable().required('Bạn không được để trống'),
		BackGround: yup.string()
	});

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	useEffect(() => {
		if (isUpdate && dataUpdate.ID) {
			form.reset({ ...dataUpdate });
		}
	}, [dataUpdate]);

	const checkHandleSubmit = (data) => {
		if (!handleSubmit) return;
		handleSubmit(data).then((res) => {
			if (res?.status === 200) {
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
				<button className="edit-group btn" onClick={showModal}>
					<Edit2 />
					Chỉnh sửa nhóm
				</button>
			) : (
				<div className="add-group" onClick={showModal}>
					<PlusCircle />
				</div>
			)}
			<Modal title={isUpdate ? 'Chỉnh sửa nhóm' : 'Thêm nhóm'} visible={isVisibleModal} onCancel={closeModal} footer={null}>
				<div>
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						<div className="row">
							<div className="col-12">
								<InputTextField form={form} name="Name" label="Tên nhóm" placeholder="Nhập tên nhóm" />
							</div>
							<div className="col-12">
								<SelectField
									form={form}
									name="CourseID"
									label="Thuộc khóa học"
									placeholder="Chọn khóa học"
									optionList={courseList}
								/>
							</div>
							<div className="col-12">
								<UploadAvatarField form={form} name="BackGround" label="Background" />
							</div>
							<div className="col-12 mt-3">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type === 'ADD_DATA' && isLoading.status}
								>
									{isUpdate ? 'Cập nhật' : 'Lưu'}
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

export default GroupForm;
