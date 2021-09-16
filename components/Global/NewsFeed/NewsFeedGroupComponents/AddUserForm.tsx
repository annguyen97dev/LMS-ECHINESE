import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Spin} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {UserPlus} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import RadioField from '~/components/FormControl/RadioField';
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';
AddUserForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	roleOptionList: optionCommonPropTypes,
	userOptionList: optionCommonPropTypes,
	roleMemberOptionList: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				.isRequired,
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				.isRequired,
			disabled: PropTypes.bool,
		})
	),
	fetchUserByRole: PropTypes.func,
	handleSubmit: PropTypes.func,
};
AddUserForm.defaultProps = {
	isLoading: {type: '', status: false},
	roleOptionList: [],
	userOptionList: [],
	roleMemberOptionList: [],
	fetchUserByRole: null,
	handleSubmit: null,
};

function AddUserForm(props) {
	const {
		isLoading,
		fetchUserByRole,
		roleOptionList,
		userOptionList,
		roleMemberOptionList,
		handleSubmit,
	} = props;
	const [isVisibleModal, setIsVisibleModal] = useState(false);

	const showModal = () => {
		setIsVisibleModal(true);
	};

	const closeModal = () => {
		setIsVisibleModal(false);
	};

	const defaultValuesInit = {
		RoleUser: null,
		UserInformationID: null,
		RoleID: 2,
	};

	const schema = yup.object().shape({
		RoleUser: yup.number().nullable().required('Bạn không được để trống'),
		UserInformationID: yup
			.number()
			.nullable()
			.required('Bạn không được để trống'),
		RoleID: yup
			.number()
			.oneOf([1, 2], 'Bạn phải chọn 1 cấp bậc')
			.required('Bạn không được để trống'),
	});

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	const checkFetchUserByRole = (RoleID: number) => {
		if (!fetchUserByRole) return;
		fetchUserByRole(RoleID);
	};

	const checkHandleSubmit = (data) => {
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
			<button className="add-user-to-group btn" onClick={showModal}>
				<UserPlus />
				<span>Thêm thành viên</span>
			</button>
			<Modal
				title="Thêm thành viên"
				visible={isVisibleModal}
				onCancel={closeModal}
				footer={null}
			>
				<div>
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(checkHandleSubmit)}
					>
						<div className="row">
							<div className="col-12">
								<SelectField
									form={form}
									name="RoleUser"
									label="Loại thành viên"
									optionList={roleOptionList}
									onChangeSelect={checkFetchUserByRole}
									placeholder="Chọn loại thành viên"
								/>
							</div>
							<div className="col-12">
								<SelectField
									form={form}
									name="UserInformationID"
									label="Thành viên"
									optionList={userOptionList}
									isLoading={
										isLoading.type === 'FETCH_USER_IN_GROUP' && isLoading.status
									}
									placeholder="Chọn thành viên"
								/>
							</div>
							<div className="col-12">
								<RadioField
									form={form}
									name="RoleID"
									label="Phân cấp thành viên"
									radioList={roleMemberOptionList}
								/>
							</div>
							<div className="col-12 mt-3">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type === 'ADD_DATA' && isLoading.status}
								>
									Lưu
									{isLoading.type === 'ADD_DATA' && isLoading.status && (
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
export default AddUserForm;
