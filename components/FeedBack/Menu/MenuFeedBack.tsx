import { Card, Drawer, Button, Avatar } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { MoreHorizontal } from 'react-feather';
import { useWrap } from '~/context/wrap';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

MenuFeedBack.propTypes = {
	currentTab: PropTypes.number,
	allDataLength: PropTypes.object,
	feedbackMenu: PropTypes.array,
	feedbackList: PropTypes.array,
	currentItem: PropTypes.string,
	handleClickItem: PropTypes.func,
	handleClickMenu: PropTypes.func,
	handleCreateNew: PropTypes.func
};

MenuFeedBack.defaultProps = {
	currentTab: 0,
	allDataLength: {},
	feedbackMenu: [],
	feedbackList: [],
	currentItem: '',
	handleClickItem: null,
	handleClickMenu: null,
	handleCreateNew: null
};

function MenuFeedBack(props) {
	const { handleClickItem, feedbackList, currentItem, feedbackMenu, handleClickMenu, handleCreateNew, allDataLength, currentTab } = props;
	const [visible, setVisible] = useState(false);
	const { showNoti, userInformation } = useWrap();

	const showSideBar = () => {
		setVisible(true);
	};
	const closeSideBar = () => {
		setVisible(false);
	};

	const ItemMenu = ({ status, icon, title, number, onClick }) => {
		return (
			<a
				onClick={onClick}
				className="row ml-0 pl-3 pr-3 student-fb__menu-item"
				style={{ backgroundColor: status ? '#e1f6e1' : null }}
			>
				<div className="row m-0 p-0 st-fb-center">
					<i className={`${icon} mr-3 student-fb__menu-item-icon none-decor `}></i>
					<span className="none-selection student-fb__menu-item-title">{title}</span>
				</div>
				<span className="student-fb__menu-item-num">{number}</span>
			</a>
		);
	};

	const getNum = (num) => {
		return num > 9 ? num : '0' + num;
	};

	const getDateString = (date) => {
		let nDate = new Date(date);
		return getNum(nDate.getDate()) + '-' + getNum(nDate.getMonth() + 1) + '-' + nDate.getFullYear();
	};

	const Menu = () => (
		<>
			<Card className="card-newsfeed" bordered={false}>
				<Button onClick={handleCreateNew} type="primary" className="student-fb__btn-add">
					Tạo phản hồi
				</Button>

				<ItemMenu
					onClick={() => {
						handleClickMenu(1);
					}}
					status={currentTab === 1 ? true : false}
					icon={'fas fa-cube'}
					title="Tất cả phản hồi"
					number={allDataLength.all}
				/>
				<ItemMenu
					onClick={() => {
						handleClickMenu(2);
					}}
					status={currentTab === 2 ? true : false}
					icon={'far fa-clock'}
					title="Gần đây"
					number={allDataLength.new}
				/>
				<ItemMenu
					onClick={() => {
						handleClickMenu(3);
					}}
					status={currentTab === 3 ? true : false}
					icon={'far fa-star'}
					title="Quan trọng"
					number={allDataLength.important}
				/>
				<ItemMenu
					onClick={() => {
						handleClickMenu(4);
					}}
					status={currentTab === 4 ? true : false}
					icon={'far fa-tv'}
					title="Chờ xử lý"
					number={allDataLength.waiting}
				/>
				<ItemMenu
					onClick={() => {
						handleClickMenu(5);
					}}
					status={currentTab === 5 ? true : false}
					icon={'fas fa-check-circle'}
					title="Hoàn thành"
					number={allDataLength.done}
				/>
			</Card>

			<Card className="card-newsfeed student-fb__wrap-list" bordered={false}>
				<div className="card-newsfeed-wrap__label">
					<p className="card-newsfeed__label font-weight-black">Danh sách phản hồi</p>
				</div>

				<ul className="m-feedback__list-group-nf">
					{feedbackList.map((item, index) => (
						<li key={index} className={currentItem === item.ID ? 'active' : ''} onClick={() => handleClickItem(item)}>
							<div className="row m-0 student-fb__i-fb">
								{userInformation.Avatar !== null && userInformation.Avatar !== '' ? (
									<Avatar size={36} className="student-fb__i-avt mr-3" src={userInformation.Avatar} />
								) : (
									<Avatar size={36} className="student-fb__i-avt mr-3" src={<img src="/images/user.png" alt="" />} />
								)}

								<div className="st-fb-colum st-fb-fw">
									<div className="row m-0 st-fb-rsb">
										<span className="student-fb__i-name">{item.CreatedBy}</span>
										<span className="student-fb__i-name">{getDateString(item.CreatedOn)}</span>
									</div>

									<span className="student-fb__i-title">{item.Title}</span>
									<span className="student-fb__i-content">{ReactHtmlParser(item.ContentFeedBack)}</span>
								</div>
							</div>
						</li>
					))}
				</ul>
			</Card>
		</>
	);

	return (
		<>
			<div className="sidebar-mobile">
				<Link href="">
					<a className="label-nf font-weight-black">Menu</a>
				</Link>
				<button className="btn btn-light" onClick={showSideBar}>
					<MoreHorizontal />
				</button>
				<Drawer placement="right" closable={false} onClose={closeSideBar} visible={visible} className="drawer-newsfeed">
					{Menu()}
				</Drawer>
			</div>
			<div className="sidebar-desktop">{Menu()}</div>
		</>
	);
}

export default MenuFeedBack;
