import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Popover, Spin } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import SelectField from '~/components/FormControl/SelectField';
import { optionCommonPropTypes } from '~/utils/proptypes';

CheckManyEmptyTeacher.propTypes = {
	optionList: PropTypes.shape({
		branchList: optionCommonPropTypes,
		studyTimeList: optionCommonPropTypes,
		roomList: optionCommonPropTypes,
		teacherList: optionCommonPropTypes
	}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	handleFetchTeacher: PropTypes.func,
	handleSubmit: PropTypes.func
};
CheckManyEmptyTeacher.defaultProps = {
	optionList: {
		branchList: [],
		studyTimeList: [],
		roomList: [],
		teacherList: []
	},
	isLoading: { type: '', status: false },
	//
	handleFetchTeacher: null,
	handleSubmit: null
};
function CheckManyEmptyTeacher(props) {
	const { isLoading, optionList, handleFetchTeacher, handleSubmit } = props;
	const { branchList, studyTimeList, teacherList } = optionList;
	const [showFilter, showFilterSet] = useState(false);

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};

	const schema = yup.object().shape({
		BranchID: yup.number().nullable().required('Bạn không được để trống'),
		TeacherID: yup.array().min(1, 'Bạn phải chọn ít nhất 1 giáo viên').required('Bạn không được để trống'),
		StudyTimeID: yup.array().min(1, 'Bạn phải chọn ít nhất 1 ca học').required('Bạn không được để trống'),
		StartTime: yup.date().required('Bạn không được để trống'),
		EndTime: yup
			.date()
			.required('Bạn không được để trống')
			.when('StartTime', (startDate, schema) => startDate && schema.min(startDate, `Ngày không hợp lệ`))
	});

	const defaultValuesInit = {
		BranchID: null,
		TeacherID: undefined,
		StudyTimeID: undefined,
		StartTime: moment().format('YYYY/MM/DD'),
		EndTime: moment().add(1, 'months').format('YYYY/MM/DD')
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const checkHandleFetchTeacher = (value) => {
		if (!handleFetchTeacher) return;
		form.setValue('TeacherID', undefined);
		handleFetchTeacher(value);
	};

	const checkHandleSubmit = (value) => {
		if (!handleSubmit) return;
		handleSubmit(value).then((res) => {
			if (res && res.status === 200) {
				funcShowFilter();
			}
		});
	};
	const handleResetFilter = () => {
		form.reset({
			BranchID: null,
			TeacherID: undefined,
			StudyTimeID: undefined,
			StartTime: undefined,
			EndTime: undefined
		});
	};
	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
				<div className="row">
					<div className="col-md-12">
						<SelectField
							form={form}
							name="BranchID"
							label="Trung tâm"
							optionList={branchList}
							placeholder="Chọn trung tâm"
							isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
							onChangeSelect={(vl) => checkHandleFetchTeacher(vl)}
							isRequired
						/>
					</div>

					<div className="col-md-12">
						<SelectField
							form={form}
							name="TeacherID"
							label="Giáo viên"
							mode="multiple"
							optionList={teacherList}
							placeholder="Chọn giáo viên"
							isLoading={isLoading.type === 'FETCH_TEACHER' && isLoading.status}
							isRequired
						/>
					</div>
					<div className="col-md-12">
						<SelectField
							form={form}
							name="StudyTimeID"
							label="Ca học"
							mode="multiple"
							optionList={studyTimeList}
							placeholder="Chọn ca học"
							isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
							isRequired
						/>
					</div>
					<div className="col-md-6">
						<DateField form={form} name="StartTime" label="Từ ngày" placeholder="Chọn ngày" isRequired />
					</div>

					<div className="col-md-6">
						<DateField form={form} name="EndTime" label="Đến ngày" placeholder="Chọn ngày" isRequired />
					</div>

					<div className="col-md-12 mt-3">
						<button type="submit" className="btn btn-primary " disabled={isLoading.type == 'ADD_DATA' && isLoading.status}>
							Kiểm tra
							{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
						</button>
						<button
							type="button"
							className="light btn btn-secondary"
							style={{ marginLeft: '10px' }}
							onClick={handleResetFilter}
						>
							Reset
						</button>
					</div>
				</div>
			</Form>
		</div>
	);

	return (
		<>
			<div className="wrap-filter-parent">
				<Popover
					placement="bottomRight"
					content={content}
					trigger="click"
					visible={showFilter}
					onVisibleChange={funcShowFilter}
					overlayClassName="filter-popover"
				>
					<button className="light btn btn-danger">Kiểm tra lịch trống nhiều giáo viên</button>
				</Popover>
			</div>
		</>
	);
}

export default CheckManyEmptyTeacher;
