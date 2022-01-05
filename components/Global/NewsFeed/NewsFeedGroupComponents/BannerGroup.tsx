import { Popover, Skeleton, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { MoreHorizontal } from 'react-feather';

BannerGroup.propTypes = {
	infoGroup: PropTypes.shape({
		info: PropTypes.shape({
			ID: PropTypes.number,
			Name: PropTypes.string,
			BackGround: PropTypes.string,
			Administrators: PropTypes.number,
			FullNameUnicode: PropTypes.string,
			CourseID: PropTypes.number,
			CourseName: PropTypes.string,
			BranchID: PropTypes.number,
			BranchName: PropTypes.string
		}),
		userList: PropTypes.arrayOf(
			PropTypes.shape({
				ID: PropTypes.number,
				GroupNewsFeedID: PropTypes.number,
				GroupNewsFeedName: PropTypes.string,
				UserInformationID: PropTypes.number,
				FullNameUnicode: PropTypes.string,
				RoleID: PropTypes.number,
				RoleName: PropTypes.string
			})
		)
	}),
	totalNewsFeed: PropTypes.number,
	//
	bannerGroupActionListComponent: PropTypes.element
};
BannerGroup.defaultProps = {
	infoGroup: {
		info: {
			ID: 0,
			Name: '',
			BackGround: '',
			Administrators: 0,
			FullNameUnicode: '',
			CourseID: 0,
			CourseName: '',
			BranchID: 0,
			BranchName: ''
		},
		userList: []
	},
	totalNewsFeed: 0,
	//
	bannerGroupActionListComponent: null
};

function BannerGroup(props) {
	const { infoGroup, totalNewsFeed, bannerGroupActionListComponent } = props;
	const { info, userList } = infoGroup;
	const popoverUserList = (userList) => {
		return (
			<ul className="list-user-in-group">
				{userList.map((item, idx) => (
					<li key={idx}>
						<img src={item.Avatar || '/images/user.png'} alt="" />
						{item.FullNameUnicode}
					</li>
				))}
			</ul>
		);
	};

	if (info?.ID) {
		return (
			<div className="card-group-nf">
				<div className="card-group-nf__header" style={{ backgroundImage: `url(${info.BackGround})` }}>
					<div className="information-group">
						<p className="name-group">{info.Name}</p>
						<p className="name-admin">
							Admin:
							{userList.map((item, idx) => {
								if (item.RoleID === 1)
									return (
										<span style={{ marginLeft: 5 }} key={idx}>
											{item.FullNameUnicode}
										</span>
									);
							})}
						</p>
					</div>
					{bannerGroupActionListComponent && (
						<div className="more-group">
							<Popover placement="bottomRight" content={bannerGroupActionListComponent} trigger="focus">
								<button className="btn-more">
									<MoreHorizontal />
								</button>
							</Popover>
						</div>
					)}
				</div>
				<div className="card-group-nf__body">
					<p>Bài biết: {totalNewsFeed}</p>
					<div className="group">
						<p>Thành viên: </p>
						{userList.length > 5 ? (
							<div className="members">
								<Popover placement="bottom" title="Thành viên" content={popoverUserList(userList)} trigger="click">
									<span>
										<MoreHorizontal />
									</span>
								</Popover>
								{userList.slice(0, 5).map((item, idx) => (
									<Tooltip title={item.FullNameUnicode} key={idx}>
										<button className="item-user">
											<img src={item.Avatar || '/images/user.png'} alt="" />
										</button>
									</Tooltip>
								))}
							</div>
						) : (
							<div className="members">
								{userList.map((item, idx) => (
									<Tooltip title={item.FullNameUnicode} key={idx}>
										<button className="item-user">
											<img src={item.Avatar || '/images/user.png'} alt="" />
										</button>
									</Tooltip>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="card-group-nf skeleton">
				<Skeleton active />
			</div>
		);
	}
}

export default BannerGroup;
