import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';

import TitlePage from '~/components/TitlePage';
import LayoutBase from '~/components/LayoutBase';
import {
	studentApi,
	areaApi,
	districtApi,
	wardApi,
	jobApi,
	puroseApi,
	branchApi,
	sourceInfomationApi,
	parentsApi,
	staffApi,
	teacherApi,
	examTopicApi
} from '~/apiBase';
import { useWrap } from '~/context/wrap';
import StudentForm from '~/components/Global/Customer/Student/StudentForm';

// -- FOR DIFFERENT VIEW --
interface listDataForm {
	Area: Array<Object>;
	DistrictID: Array<Object>;
	WardID: Array<Object>;
	Job: Array<Object>;
	Branch: Array<Object>;
	Purposes: Array<Object>;
	SourceInformation: Array<Object>;
	Parent: Array<Object>;
	Counselors: Array<Object>;
	Teacher: Array<Object>;
	Exam: Array<Object>;
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

const listApi = [
	{
		api: areaApi,
		text: 'Tỉnh/Tp',
		name: 'Area'
	},

	{
		api: jobApi,
		text: 'Công việc',
		name: 'Job'
	},
	{
		api: puroseApi,
		text: 'Mục đích học',
		name: 'Purposes'
	},
	{
		api: branchApi,
		text: 'Trung tâm',
		name: 'Branch'
	},
	{
		api: parentsApi,
		text: 'Phụ huynh',
		name: 'Parent'
	},
	{
		api: sourceInfomationApi,
		text: 'Nguồn khách hàng',
		name: 'SourceInformation'
	},
	{
		api: staffApi,
		text: 'Nguồn khách hàng',
		name: 'Counselors'
	},
	{
		api: teacherApi,
		text: 'Giáo vên',
		name: 'Teacher'
	},
	{
		api: examTopicApi,
		text: 'Đề hẹn test',
		name: 'Exam'
	}
];

const StudentAppointmentCreate = () => {
	const [listDataForm, setListDataForm] = useState<listDataForm>({
		Area: [],
		DistrictID: [],
		WardID: [],
		Job: [],
		Branch: [],
		Purposes: [],
		SourceInformation: [],
		Parent: [],
		Counselors: [],
		Teacher: [],
		Exam: []
	});
	const { showNoti } = useWrap();
	// FOR STUDENT FORM
	// ------------- ADD data to list --------------

	const makeNewData = (data, name) => {
		let newData = null;
		switch (name) {
			case 'Area':
				newData = data.map((item) => ({
					title: item.AreaName,
					value: item.AreaID
				}));
				break;
			case 'DistrictID':
				newData = data.map((item) => ({
					title: item.DistrictName,
					value: item.ID
				}));
				break;
			case 'WardID':
				newData = data.map((item) => ({
					title: item.WardName,
					value: item.ID
				}));
				break;
			case 'Branch':
				newData = data.map((item) => ({
					title: item.BranchName,
					value: item.ID
				}));
				break;
			case 'Job':
				newData = data.map((item) => ({
					title: item.JobName,
					value: item.JobID
				}));
				break;
			case 'Purposes':
				newData = data.map((item) => ({
					title: item.PurposesName,
					value: item.PurposesID
				}));
				break;
			case 'Parent':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				break;
			case 'SourceInformation':
				newData = data.map((item) => ({
					title: item.SourceInformationName,
					value: item.SourceInformationID
				}));
				break;
			case 'Counselors':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				break;
			case 'Teacher':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				break;
			case 'Exam':
				newData = data.map((item) => ({
					title: item.Name,
					value: item.ID
				}));
			default:
				break;
		}

		return newData;
	};

	const getDataTolist = (data: any, name: any) => {
		let newData = makeNewData(data, name);

		Object.keys(listDataForm).forEach(function (key) {
			if (key == name) {
				listDataForm[key] = newData;
			}
		});
		setListDataForm({ ...listDataForm });
	};

	// ----------- GET DATA SOURCE ---------------
	const getDataStudentForm = (arrApi) => {
		arrApi.forEach((item, index) => {
			(async () => {
				let res = null;
				try {
					if (item.name == 'Counselors') {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 9999,
							RoleID: 6,
							StatusID: 0,
							Enable: true
						});
					} else if (item.name == 'Exam') {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 9999,
							Enable: true,
							Type: 1
						});
					} else if (item.name == 'Teacher') {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 9999,
							Enable: true,
							StatusID: 0
						});
					} else {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 9999,
							Enable: true
						});
					}

					res.status == 200 && getDataTolist(res.data.data, item.name);

					res.status == 204 && console.log(item.text + ' Không có dữ liệu');
				} catch (error) {
					// showNoti('danger', error.message);
					console.log(error);
				} finally {
				}
			})();
		});
	};

	useEffect(() => {
		getDataStudentForm(listApi);
	}, []);
	return (
		<div>
			<div className="row">
				<div className="col-12 text-center">
					<TitlePage title="Lịch hẹn" />
				</div>
			</div>
			<StudentForm listDataForm={listDataForm} />
		</div>
	);
};
StudentAppointmentCreate.layout = LayoutBase;
export default StudentAppointmentCreate;
