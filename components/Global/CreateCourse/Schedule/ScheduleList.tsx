import {Card, Collapse} from 'antd';
import React, {useEffect, useState} from 'react';
import ScheduleItem from './ScheduleItem';
import PropTypes from 'prop-types';

const ScheduleList = (props) => {
	const {scheduleList} = props;
	const [panelActiveList, setPanelActiveList] = useState<number[]>([]);
	console.log(scheduleList);

	const onActiveSchedule = (id: number) => {
		console.log(id);
		const newPanelActiveList = [...panelActiveList];
		// panelActiveList.push(id);
		setPanelActiveList([...panelActiveList, id]);
	};
	useEffect(() => {
		console.log(panelActiveList);
	}, [panelActiveList]);
	return (
		<Collapse activeKey={panelActiveList}>
			{scheduleList.map((s, idx) => (
				<ScheduleItem
					key={idx}
					// {...s}
					idxToActive={idx}
					handleActiveSchedule={() => onActiveSchedule(idx)}
				/>
			))}
		</Collapse>
	);
};

ScheduleList.propTypes = {
	scheduleList: PropTypes.array,
};
ScheduleList.defaultProps = {
	scheduleList: [],
};

export default ScheduleList;
