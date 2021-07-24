import {Collapse, Select} from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import React from 'react';
import PropTypes from 'prop-types';
const ScheduleItem = (props) => {
	const {handleActiveSchedule, idxToActive} = props;
	const {Panel} = Collapse;
	const {Option} = Select;
	const onSearch = (val) => {
		console.log('search:', val);
	};
	const onChange_CheckBox = (e) => {
		console.log(`checked = ${e.target.value}`);
	};
	const checkHandleActiveSchedule = () => {
		if (!handleActiveSchedule) return;
		console.log(idxToActive);
		handleActiveSchedule();
	};
	return (
		<Panel
			key={idxToActive}
			header={
				<div className="info-course-item">
					<Checkbox onChange={() => checkHandleActiveSchedule()}></Checkbox>
					<p className="title">
						Ngày học <span>1</span>
					</p>
					<ul className="info-course-list">
						<li>Tiết 7: Môn học test</li>
						<li>Tiết 8: Môn học test</li>
					</ul>
				</div>
			}
		>
			<div className="info-course-select">
				<div className="row">
					<div className="col-6">
						<Select
							className="style-input"
							size="large"
							showSearch
							style={{width: '100%'}}
							placeholder="Chọn phòng"
							optionFilterProp="children"
							onSearch={onSearch}
							filterOption={(input, option) =>
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
						>
							<Option value="jack">Lớp A</Option>
							<Option value="lucy">Lớp B</Option>
							<Option value="tom">Lớp C</Option>
						</Select>
					</div>

					<div className="col-6">
						<Select
							className="style-input"
							size="large"
							showSearch
							style={{width: '100%'}}
							placeholder="Chọn ca"
							optionFilterProp="children"
							onSearch={onSearch}
							filterOption={(input, option) =>
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
						>
							<Option value="jack">Ca 1</Option>
							<Option value="lucy">Ca 2</Option>
							<Option value="tom">Ca 3</Option>
						</Select>
					</div>
					<div className="col-12 mt-2">
						<Select
							className="style-input"
							size="large"
							showSearch
							style={{width: '100%'}}
							placeholder="Chọn giáo viên"
							optionFilterProp="children"
							onSearch={onSearch}
							filterOption={(input, option) =>
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
						>
							<Option value="jack">Nguyễn An</Option>
							<Option value="lucy">Nguyễn Phi Hùng</Option>
							<Option value="tom">Trương Thức</Option>
						</Select>
					</div>
				</div>
			</div>
		</Panel>
	);
};

ScheduleItem.propTypes = {
	handleActiveSchedule: PropTypes.func,
	idxToActive: PropTypes.number,
};
ScheduleItem.defaultProps = {
	handleActiveSchedule: null,
	idxToActive: null,
};
export default ScheduleItem;
