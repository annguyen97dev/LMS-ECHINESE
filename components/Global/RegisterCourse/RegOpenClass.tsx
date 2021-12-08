import React, { Fragment, useEffect, useState } from 'react';

import { Modal, Form, Input, Button, Divider, Tooltip, Select, Card, Switch, Spin } from 'antd';
import { branchApi, programApi, studyTimeApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';

const RegOpenClass = (props: any) => {
	const { Option } = Select;
	const [branch, setBranch] = useState<IBranch[]>();
	const [studyTime, setStudyTime] = useState<IStudyTime[]>();
	const [program, setProgram] = useState<IProgram[]>();
	const { showNoti } = useWrap();

	const fetchDataSelectList = () => {
		(async () => {
			try {
				const _branch = await branchApi.getAll({
					pageIndex: 1,
					pageSize: 99999,
					Enable: true
				});
				const _program = await programApi.getAll({ selectAll: true });
				const _studyTime = await studyTimeApi.getAll({ selectAll: true });
				_branch.status == 200 && setBranch(_branch.data.data);
				_program.status == 200 && setProgram(_program.data.data);
				_studyTime.status == 200 && setStudyTime(_studyTime.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			}
		})();
	};

	useEffect(() => {
		fetchDataSelectList();
	}, []);

	return (
		<Card title="Đăng ký mở lớp">
			<div className="row">
				<div className="col-12">
					<Form.Item
						name="BranchID"
						label="Trung tâm mong muốn"
						rules={[
							{
								required: true,
								message: 'Vui lòng điền đủ thông tin!'
							}
						]}
					>
						<Select className="style-input" showSearch optionFilterProp="children">
							{branch?.map((item, index) => (
								<Option key={index} value={item.ID}>
									{item.BranchName}
								</Option>
							))}
						</Select>
					</Form.Item>
				</div>
			</div>

			<div className="row">
				<div className="col-12">
					<Form.Item
						name="ProgramID"
						label="Chương trình mong muốn"
						rules={[
							{
								required: true,
								message: 'Vui lòng điền đủ thông tin!'
							}
						]}
					>
						<Select className="style-input" showSearch optionFilterProp="children">
							{program?.map((item, index) => (
								<Option key={index} value={item.ID}>
									{item.ProgramName}
								</Option>
							))}
						</Select>
					</Form.Item>
				</div>
			</div>

			<div className="row">
				<div className="col-12">
					<Form.Item
						name="StudyTimeID"
						label="Ca học mong muốn"
						rules={[
							{
								required: true,
								message: 'Vui lòng điền đủ thông tin!'
							}
						]}
					>
						<Select className="style-input" showSearch optionFilterProp="children">
							{studyTime?.map((item, index) => (
								<Option key={index} value={item.ID}>
									{item.Name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</div>
			</div>

			<div className="row">
				<div className="col-12 text-center text-left-mobile">
					<button type="submit" className="btn btn-primary">
						Xác nhận
						{props.loading == true && <Spin className="loading-base" />}
					</button>
				</div>
			</div>
		</Card>
	);
};

export default RegOpenClass;
