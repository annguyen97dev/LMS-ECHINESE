import {Collapse} from 'antd';
import React, {cloneElement, useState} from 'react';
import PropTypes from 'prop-types';
const ScheduleList = (props) => {
	const {panelActiveListInModal} = props;
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
		<Collapse
			activeKey={
				panelActiveList.length ? panelActiveList : panelActiveListInModal
			}
		>
			{props.children.map((c, idx) => {
				return cloneElement(c, {
					handleActiveSchedule: () => onActiveSchedule(idx),
				});
			})}
		</Collapse>
	);
};

export default ScheduleList;
