import {Collapse} from 'antd';
import React, {cloneElement, useState} from 'react';

const ScheduleList = (props) => {
	const [panelActiveList, setPanelActiveList] = useState<number[]>([]);

	const onActiveSchedule = (id: number) => {
		const newPanelActiveList = [...panelActiveList];
		const isPanelActiveAlready = newPanelActiveList.findIndex((p) => p === id);
		if (isPanelActiveAlready >= 0) {
			newPanelActiveList.splice(isPanelActiveAlready, 1);
		} else {
			newPanelActiveList.push(id);
		}
		setPanelActiveList(newPanelActiveList);
	};

	return (
		<Collapse activeKey={panelActiveList}>
			{props.children.map((c, idx) => {
				return cloneElement(c, {
					handleActiveSchedule: () => onActiveSchedule(idx),
				});
			})}
		</Collapse>
	);
};

ScheduleList.propTypes = {};

export default ScheduleList;
