import {Input, Modal} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import PowerTable from '~/components/PowerTable';
import {useDebounce} from '~/context/useDebounce';
import PackageExaminerSalary from './PackageExaminerSalary';

PackageExaminerForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	teacherList: PropTypes.array,
	handleCreateExaminer: PropTypes.func,
};
PackageExaminerForm.defaultProps = {
	isLoading: {type: '', status: false},
	teacherList: [],
	handleCreateExaminer: null,
};
const {Search} = Input;
function PackageExaminerForm(props) {
	const {isLoading, teacherList, handleCreateExaminer} = props;
	const [teacherListLocal, setTeacherListLocal] = useState<ITeacher[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};
	const closeModal = () => {
		setIsModalVisible(false);
	};

	useEffect(() => {
		teacherList.length && setTeacherListLocal(teacherList);
	}, [teacherList]);
	const onSearchTeacher = (value: string) => {
		if (!value) {
			setTeacherListLocal(teacherList);
			return;
		}
		const newTeacherListLocal = teacherListLocal.filter((t) =>
			t.FullNameUnicode.includes(value)
		);
		setTeacherListLocal(newTeacherListLocal);
	};
	const debounceOnSearchTeacher = useDebounce(onSearchTeacher, 500, []);

	const checkHandleCreateExaminer = (idx: number) => {
		if (!handleCreateExaminer) return;
		return handleCreateExaminer(idx);
	};

	const columns = [
		{
			title: 'Tên giáo viên',
			dataIndex: 'FullNameUnicode',
		},
		{
			title: 'Email',
			dataIndex: 'Email',
		},
		{
			title: 'SĐT',
			dataIndex: 'Mobile',
		},
		{
			title: 'Thêm',
			width: '50px',
			align: 'center',
			render: (_, record: ITeacher, idx: number) => (
				<PackageExaminerSalary
					isLoading={isLoading}
					examinerObj={record}
					handleSubmit={checkHandleCreateExaminer(idx)}
				/>
			),
		},
	];

	return (
		<>
			<button className="btn btn-warning" onClick={showModal}>
				Thêm giáo viên
			</button>
			<Modal
				style={{top: 50}}
				title="Danh sách giáo viên"
				visible={isModalVisible}
				onOk={closeModal}
				onCancel={closeModal}
				width={800}
				footer={null}
				className="package-examiner-form"
			>
				<PowerTable
					loading={isLoading}
					addClass="basic-header"
					dataSource={teacherListLocal}
					columns={columns}
					Extra={
						<div
							style={{
								width: 200,
								marginLeft: 'auto',
							}}
						>
							<Search
								placeholder="Tìm tên giáo viên"
								onChange={(e) => debounceOnSearchTeacher(e.target.value)}
								onSearch={debounceOnSearchTeacher}
								className="btn-search style-input"
								size="large"
							/>
						</div>
					}
				/>
			</Modal>
		</>
	);
}

export default PackageExaminerForm;
