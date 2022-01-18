import { Collapse } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
const ScheduleList = (props) => {
	const { panelActiveListInModal, children } = props;
	return <Collapse activeKey={panelActiveListInModal}>{children}</Collapse>;
};
ScheduleList.propTypes = {
	panelActiveListInModal: PropTypes.arrayOf(PropTypes.number),
	children: PropTypes.node
};
ScheduleList.defaultProps = {
	panelActiveListInModal: [],
	children: null
};
export default ScheduleList;
