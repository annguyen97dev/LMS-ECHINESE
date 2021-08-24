import {DatePicker} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

TaskGroupFilterDate.propTypes = {
	handleFilter: PropTypes.func,
};
TaskGroupFilterDate.defaultProps = {
	handleFilter: null,
};

const {RangePicker} = DatePicker;
function TaskGroupFilterDate(props) {
	const {handleFilter} = props;

	const checkHandleFilter = (data: string[]) => {
		if (!handleFilter) return;
		handleFilter(data);
	};
	return (
		<RangePicker
			className="style-input"
			style={{width: '100%'}}
			allowClear={true}
			defaultValue={[moment(), moment().add(1, 'months')]}
			format="DD/MM/YYYY"
			onChange={(date, dateString) => {
				if (date) {
					checkHandleFilter(date.map((d) => d.format('YYYY/MM/DD')));
				}
			}}
		/>
	);
}

export default TaskGroupFilterDate;
