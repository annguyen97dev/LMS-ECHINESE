import { Card, Popover, Modal, Skeleton, Tooltip } from "antd";
import { MoreHorizontal, AlertTriangle, Trash2 } from "react-feather";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { groupNewsFeedApi, userGroupNewsFeedApi } from "~/apiBase"
import GroupNewsFeedFrom from "./GroupNewsFeedForm";
import AddUserToGroupForm from "./AddUserToGroupForm";
import { useWrap } from "~/context/wrap";

const GroupTagElement = (props) => {
    const {inGroup, totalRow, dataUser, onSubmitGroupNewsFeed} = props;
    const [data, setData] = useState<any>();
    const [userInGroup, setUserInGroup] = useState([]);
    const [totalUserInGroup, setTotalUserInGroup] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { showNoti } = useWrap();
    const [dataDelete, setDataDelete]  = useState({
		ID: null,
		Enable: null,
	});
    const [isModalVisible, setIsModalVisible] = useState(false);

    const getGroupByID = async () => {
        setIsLoading(true);
        try {
            let res = await groupNewsFeedApi.getByID(inGroup);
            if(res.status == 200) {
                setData(res.data.data);
            }
            if(res.status == 204) {
                console.log("Không có dữ liệu");
            }
        } catch (error) {
            console.log("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const getUserInGroup = async () => {
        try {
            let res = await userGroupNewsFeedApi.getAll({selectAll: true, GroupNewsFeedID: inGroup});
            if(res.status == 200) {
                setUserInGroup(res.data.data);
                setTotalUserInGroup(res.data.totalRow);
            }
            if(res.status == 204) {
                console.log("Không có dữ liệu");
            }
        } catch (error) {
            console.log("Error", error.message);
        }
    }

    const addUserToGroup = async (data) => {
        console.log(data);
        setIsLoading(true);
        let res;
        try {
            res = await userGroupNewsFeedApi.add(data);
            if(res.status == 200) {
                getUserInGroup();
                showNoti("success", "Thêm thành công")
            }
            if(res.status == 204) {
                console.log("Không có dữ liệu");
            }
        } catch (error) {
            console.log("Error", error.message);
        } finally {
            setIsLoading(false);
        }
        return res;
    }

    const OutOrDeleteGroup = async () => {
        console.log("Data delete: ", dataDelete);
        setIsLoading(true);
        try {
            let res = await groupNewsFeedApi.update(dataDelete);
            if(res.status == 200) {
                window.location.reload();
            }
            if(res.status == 204) {
                console.log("Không có dữ liệu");
            }
        } catch (error) {
            console.log("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const content = (data) => {
        // console.log("Data Group Index", data);
        // console.log("Data user: ", dataUser);
        return (
            <>
            <ul className="more-list">
                <GroupNewsFeedFrom 
                    getGroupByID={getGroupByID} 
                    isLoading={isLoading} 
                    onSubmitGroupNewsFeed={(data) => onSubmitGroupNewsFeed(data)}
                    showEdit={true} 
                    oldData={data}
                />
                <AddUserToGroupForm 
                    addUserToGroup={(data) => addUserToGroup(data)}
                    GroupID={data?.ID}
                />
                <li>
                    <button 
                        className="btn del" 
                        onClick={() => {
                            setIsModalVisible(true);
                            setDataDelete({
                                ID: data.ID,
                                Enable: false,
                            });
                        }}
                    >
                        <Trash2/>
                        Xóa nhóm
                    </button>
                </li>
            </ul>
            </>
        )
    }

    const popoverUser = (userInGroup) => {
        return (
            <ul className="list-user-in-group">
            {userInGroup.map((item, index) => (
                <li key={index}>
                    <img src={item.Avatar} alt="" />
                    {item.FullNameUnicode}
                </li>
            ))}
            </ul>
        )
    }

    // console.log("Total Row: ", totalRow);

    useEffect(() => {
        getGroupByID();
        getUserInGroup();
    }, [inGroup]);

    // console.log(userInGroup);

    if(!isLoading) {
        return (
            <>
            <div className="card-group-nf">
                <div className="card-group-nf__header" style={{backgroundImage: `url(${data?.BackGround})`}}>
                    <div className="infomation-group">
                        <p className="name-group">{data?.Name}</p>
                        <p className="name-admin">Admin: {userInGroup?.map((item, index) => {
                            if(item.RoleID == 1) return (
                                <span key={index}>{item.FullNameUnicode}</span>
                            )
                        })}</p>
                    </div>
                    {dataUser?.UserInformationID == data?.Administrators ? (
                        <div className="more-group">
                            <Popover placement="bottomRight" content={content(data)} trigger="focus">
                                <button className="btn-more">
                                    <MoreHorizontal />
                                </button>
                            </Popover>
                        </div>
                    ) : <></>}

                </div>
                <div className="card-group-nf__body">
                    <p>Bài biết: {totalRow}</p>
                    <div className="group">
                        <p>Thành viên: </p>
                        {totalUserInGroup > 5 ? (
                            <div className="members">
                                <Popover placement="bottom" title="Thành viên" content={popoverUser(userInGroup)} trigger="click">
                                    <span><MoreHorizontal/></span>
                                </Popover>
                                {userInGroup && userInGroup.filter((item, idx) => idx < 5).map((item, index) => (
                                    <Tooltip title={item.FullNameUnicode} key={index}>
                                        <button className="item-user"><img src={item.Avatar} alt="" /></button>
                                    </Tooltip>
                                ))}
                            </div>
                        ) : (
                            <div className="members">
                                {/* <span>{totalUserInGroup}</span> */}
                                {userInGroup && userInGroup.map((item, index) => (
                                    <Tooltip title={item.FullNameUnicode} key={index}>
                                        <button className="item-user"><img src={item.Avatar} alt="" /></button>
                                    </Tooltip>
                                ))}
                            </div>
                        )}

                    </div>
                    {/* <ul>
                        <span>Thành viên: {totalUserInGroup}</span> 
                    </ul> */}
                </div>
            </div>
            <Modal
				title={<AlertTriangle color="red" />}
				visible={isModalVisible}
				onOk={() => OutOrDeleteGroup()}
				onCancel={() => setIsModalVisible(false)}
			>
				<span className="text-confirm">Bạn có chắc chắn muốn xóa không ?</span>
			</Modal>
            </>
        )
    } else {
        return (
            <>
            <div className="card-group-nf skeleton">
                <Skeleton active/>
            </div>
            </>
        )
    }
}

export default GroupTagElement;