import React, {useState} from 'react';
import {Card, Select, DatePicker, Input, Form, Popover, Spin} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';
import DateField from '~/components/FormControl/DateField';
import {optionCommonPropTypes} from '~/utils/proptypes';

CheckRoom.propTypes = {
	optionList: PropTypes.shape({
		branchList: optionCommonPropTypes,
		studyTimeList: optionCommonPropTypes,
		roomList: optionCommonPropTypes,
		teacherList: optionCommonPropTypes,
	}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	handleFetchRoom: PropTypes.func,
	handleSubmit: PropTypes.func,
};
CheckRoom.defaultProps = {
	optionList: {
		branchList: [],
		studyTimeList: [],
		roomList: [],
		teacherList: [],
	},
	isLoading: {type: '', status: false},
	//
	handleFetchRoom: null,
	handleSubmit: null,
};
function CheckRoom(props) {
	const {isLoading, optionList, handleFetchRoom, handleSubmit} = props;
	const {branchList, studyTimeList, roomList, teacherList} = optionList;
	const [showFilter, showFilterSet] = useState(false);

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};

	const schema = yup.object().shape({
		BranchID: yup.number().nullable().required('Bạn không được để trống'),
		RoomID: yup.number().nullable().required('Bạn không được để trống'),
		StartTime: yup.date().required('Bạn không được để trống'),
		EndTime: yup
			.date()
			.required('Bạn không được để trống')
			.when(
				'StartTime',
				(startDate, schema) =>
					startDate && schema.min(startDate, `Ngày không hợp lệ`)
			),
	});

	const defaultValuesInit = {
		BranchID: null,
		RoomID: null,
		StartTime: moment().format('YYYY/MM/DD'),
		EndTime: moment().add(1, 'months').format('YYYY/MM/DD'),
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	const checkHandleFetchRoom = (value) => {
		if (!handleFetchRoom) return;
		form.setValue('RoomID', undefined);
		handleFetchRoom(value);
	};

	const checkHandleSubmit = (value) => {
		if (!handleSubmit) return;
		handleSubmit(value).then((res) => {
			console.log(res);
			if (res && res.status === 200) {
				funcShowFilter();
				form.reset({...defaultValuesInit});
			}
		});
	};
	const handleResetFilter = () => {
		form.reset({...defaultValuesInit});
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
							onChangeSelect={(vl) => checkHandleFetchRoom(vl)}
						/>
					</div>

					<div className="col-md-12">
						<SelectField
							form={form}
							name="RoomID"
							label="Phòng"
							optionList={roomList}
							placeholder="Chọn phòng"
							isLoading={isLoading.type === 'FETCH_ROOM' && isLoading.status}
						/>
					</div>

					<div className="col-md-6">
						<DateField
							form={form}
							name="StartTime"
							label="Từ ngày"
							placeholder="Chọn ngày"
						/>
					</div>

					<div className="col-md-6">
						<DateField
							form={form}
							name="EndTime"
							label="Đến ngày"
							placeholder="Chọn ngày"
						/>
					</div>

					<div className="col-md-12 mt-3">
						<button
							type="submit"
							className="btn btn-primary "
							disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
						>
							Kiểm tra
							{isLoading.type == 'ADD_DATA' && isLoading.status && (
								<Spin className="loading-base" />
							)}
						</button>
						<button
							type="button"
							className="light btn btn-secondary"
							style={{marginLeft: '10px'}}
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
					<button className="light btn btn-warning">Kiểm tra phòng</button>
				</Popover>
			</div>
		</>
	);
}

export default CheckRoom;
