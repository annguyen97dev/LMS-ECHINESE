import {Avatar, List} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {UserMinus} from 'react-feather';

const RemoveUser = (props) => {
	const {userList, handleDelete} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDelete = (idUser) => {
		if (!handleDelete) return;
		handleDelete(idUser);
	};
	return (
		<>
			<button
				className="btn del"
				onClick={() => {
					setIsModalVisible(true);
				}}
			>
				<UserMinus />
				Xóa thành viên
			</button>
			<Modal
				title="Xóa thành viên"
				visible={isModalVisible}
				footer={null}
				onCancel={() => setIsModalVisible(false)}
			>
				<List
					itemLayout="horizontal"
					dataSource={userList.sort((a, b) => a.RoleID - b.RoleID)}
					renderItem={(item: IUserGroupNewsFeed) => (
						<List.Item
							actions={[
								<button
									className="btn btn-sm btn-warning"
									onClick={() => checkHandleDelete(item.ID)}
								>
									Xóa
								</button>,
							]}
						>
							<List.Item.Meta
								avatar={<Avatar src={item.Avatar} alt="avatar" />}
								title={item.FullNameUnicode}
								description={
									<div>
										Vai trò:
										<span
											style={{
												marginLeft: 5,
												fontWeight: 500,
												color: `${item.RoleID === 1 ? '#dd4667' : ''} `,
											}}
										>
											{item.RoleName}
										</span>
									</div>
								}
							/>
						</List.Item>
					)}
				/>
			</Modal>
		</>
	);
};
RemoveUser.propTypes = {
	userList: PropTypes.arrayOf(
		PropTypes.shape({
			ID: PropTypes.number,
			GroupNewsFeedID: PropTypes.number,
			GroupNewsFeedName: PropTypes.string,
			UserInformationID: PropTypes.number,
			FullNameUnicode: PropTypes.string,
			RoleID: PropTypes.number,
			RoleName: PropTypes.string,
			Avatar: PropTypes.string,
		})
	),
	handleDelete: PropTypes.func,
};
RemoveUser.defaultProps = {
	userList: [],
	handleDelete: null,
};
export default RemoveUser;
