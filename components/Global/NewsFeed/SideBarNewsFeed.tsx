import {Card, Drawer, Input, Select} from 'antd';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Link, MoreHorizontal} from 'react-feather';
import {optionCommonPropTypes} from '~/utils/proptypes';
const {Search} = Input;
const {Option} = Select;

SideBarNewsFeed.propTypes = {
	optionList: PropTypes.shape({
		teamOptionList: optionCommonPropTypes,
		groupOptionList: optionCommonPropTypes,
	}),
	filtersData: PropTypes.shape({
		name: PropTypes.string,
		idTeam: PropTypes.number,
		idGroup: PropTypes.number,
	}),
	handleFilters: PropTypes.func,
	groupFormComponent: PropTypes.element,
};
SideBarNewsFeed.defaultProps = {
	optionList: {
		teamOptionList: [],
		groupOptionList: [],
	},
	filtersData: {
		name: '',
		idTeam: 0,
		idGroup: 0,
	},
	handleFilters: null,
	groupFormComponent: null,
};

function SideBarNewsFeed(props) {
	const {optionList, filtersData, handleFilters, groupFormComponent} = props;
	const {name, idTeam, idGroup} = filtersData;
	const {teamOptionList, groupOptionList} = optionList;
	const [visible, setVisible] = useState(false);
	const showSideBar = () => {
		setVisible(true);
	};
	const closeSideBar = () => {
		setVisible(false);
	};
	const checkHandleFilters = (field: string, value: string | number) => {
		if (!handleFilters) return;
		handleFilters(field, value);
	};
	const checkHandleFiltersMobile = (field: string, value: string | number) => {
		if (!handleFilters) return;
		handleFilters(field, value);
		closeSideBar();
	};
	const SideBar = () => (
		<>
			<Card className="card-newsfeed" bordered={false}>
				<p className="card-newsfeed__label font-weight-black">TÌM KIẾM</p>
				<Search
					className="style-input"
					placeholder="Nhập từ khóa"
					allowClear
					onSearch={(value) => checkHandleFilters('name', value)}
				/>
			</Card>
			<Card className="card-newsfeed" bordered={false}>
				<div className="card-newsfeed-wrap__label">
					<p className="card-newsfeed__label font-weight-black">Trung tâm</p>
				</div>
				<Select
					value={idTeam}
					className="style-input list-group-nf__mobile"
					placeholder="Chọn trung tâm"
					onChange={(value) => checkHandleFiltersMobile('idTeam', value)}
				>
					{teamOptionList.map((item, index) => (
						<Option key={index} value={item.value}>
							{item.title}
						</Option>
					))}
				</Select>
				<ul className="list-group-nf">
					{teamOptionList.map((item, index) => (
						<li
							key={index}
							className={idTeam === item.value ? 'active' : ''}
							onClick={() => checkHandleFilters('idTeam', item.value)}
						>
							{item.title}
						</li>
					))}
				</ul>
				{/* CHIA CÁCH BÌNH YÊN */}
				<div className="card-newsfeed-wrap__label">
					<p className="card-newsfeed__label font-weight-black">Nhóm</p>
					{groupFormComponent}
				</div>
				<Select
					value={idGroup}
					className="style-input list-group-nf__mobile mb-0"
					placeholder="Chọn nhóm"
					onChange={(value) => checkHandleFiltersMobile('idGroup', value)}
				>
					{groupOptionList.map((item, index) => (
						<Option key={index} value={item.value}>
							{item.title}
						</Option>
					))}
				</Select>
				<ul className="list-group-nf mb-0">
					{groupOptionList.map((item, index) => (
						<li
							key={index}
							className={idGroup === item.value ? 'active' : ''}
							onClick={() => checkHandleFilters('idGroup', item.value)}
						>
							{item.title}
						</li>
					))}
				</ul>
			</Card>
		</>
	);
	return (
		<>
			<div className="sidebar-desktop">{SideBar()}</div>
			<div className="sidebar-mobile">
				<Link href="/newsfeed">
					<a className="label-nf font-weight-black">NewsFeed</a>
				</Link>
				<button className="btn btn-light" onClick={showSideBar}>
					<MoreHorizontal />
				</button>
				<Drawer
					placement="right"
					closable={false}
					onClose={closeSideBar}
					visible={visible}
					className="drawer-newsfeed"
				>
					{SideBar()}
				</Drawer>
			</div>
		</>
	);
}

export default SideBarNewsFeed;
