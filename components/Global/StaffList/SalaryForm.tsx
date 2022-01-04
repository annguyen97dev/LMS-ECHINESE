import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { staffSalaryApi } from '~/apiBase';
import InputMoneyField from '~/components/FormControl/InputMoneyField';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import { useWrap } from '~/context/wrap';

let returnSchemaSalary = {};
let schemaSalary = null;

interface listData {
	Area: Array<Object>;
	DistrictID: Array<Object>;
	WardID: Array<Object>;
	Role: Array<Object>;
	Branch: Array<Object>;
	Purposes: Array<Object>;
	SourceInformation: Array<Object>;
	Parent: Array<Object>;
	Counselors: Array<Object>;
}

const optionGender = [
	{
		value: 0,
		title: 'Nữ'
	},
	{
		value: 1,
		title: 'Nam'
	},
	{
		value: 0,
		title: 'Khác'
	}
];

let statusAdd = 'add-staff';

const SalaryForm = (props) => {
	const {
		dataStaff,

		rowID,
		getIndex,
		index,
		onSubmitSalary,
		submitSalary,
		changeVisible
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const showModal = () => {
		setIsModalVisible(true);
		rowID && getIndex(index);
	};

	// FORM SALARY
	const valueSalary = {
		Salary: null,
		UserInformationID: null,
		Style: null, //1 lương theo tháng , 2 lương theo giờ
		FullNameUnicode: null
	};

	(function returnSchemaSalaryFunc() {
		returnSchemaSalary = { ...valueSalary };
		Object.keys(returnSchemaSalary).forEach(function (key) {
			returnSchemaSalary[key] = yup.mixed().required('Bạn không được để trống');
		});

		schemaSalary = yup.object().shape(returnSchemaSalary);
	})();

	const formSalary = useForm({
		defaultValues: valueSalary,
		resolver: yupResolver(schemaSalary)
	});

	const onSubmitFormSalary = async (data: any) => {
		console.log('Submit salary: ', data);
		let cloneDataSubmit = {
			Salary: parseFloat(data.Salary.replace(/,/g, '')),
			UserInformationID: data.UserInformationID,
			Style: data.Style //1 lương theo tháng , 2 lương theo giờ
		};

		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res = null;
		try {
			res = await staffSalaryApi.addData(cloneDataSubmit);
			if (res.status == 200) {
				showNoti('success', 'Thành công');
				changeVisible();
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	// const formatMoney = (value) => {
	//   value = parseInt(value);
	//   // formSalary.setValue("Salary", value)
	// };

	useEffect(() => {
		if (dataStaff) {
			formSalary.reset({
				UserInformationID: dataStaff.UserInformationID,
				FullNameUnicode: dataStaff.FullNameUnicode,
				Style: 1
			});
		}
	}, [dataStaff]);

	return (
		<>
			<div className="box-form form-salary">
				<Form layout="vertical" onFinish={formSalary.handleSubmit(onSubmitFormSalary)} colon>
					<div className="row">
						<div className="col-12">
							<InputTextField form={formSalary} name="FullNameUnicode" label="Nhân viên" disabled={true} />
						</div>
						<div className="col-12">
							<SelectField
								disabled={true}
								form={formSalary}
								name="Style"
								label="Kiểu tính lương"
								optionList={[
									{
										title: 'Tính lương theo tháng',
										value: 1
									}
								]}
							/>
						</div>
						<div className="col-12">
							<InputMoneyField form={formSalary} name="Salary" label="Mức lương" isRequired={true} />
						</div>
					</div>

					<div className="row">
						<div className="col-12 d-flex justify-content-center">
							<div style={{ paddingRight: 5 }}>
								<button type="submit" className="btn btn-primary w-100">
									Thêm lương
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</div>
				</Form>
			</div>
		</>
	);
};

export default SalaryForm;
