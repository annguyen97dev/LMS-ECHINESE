import React, { Fragment, useEffect, useRef, useState } from "react";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import moment from "moment";
import { Checkbox, Row, Col, Tooltip, Spin, Card, Input, Skeleton, Empty, Form, Select } from 'antd';
import { signIn, signOut, useSession } from "next-auth/client";
import { newsFeedApi, userBranchApi, groupNewsFeedApi } from "~/apiBase";
import CreateNewsFeed from "~/components/Global/NewsFeed/CreateNewsFeed";
import ListNewsFeed from "~/components/Global/NewsFeed/ListNewsFeed";
import { Waypoint } from "react-waypoint";
import GroupTagElement from "~/components/Global/NewsFeed/components/GroupTagElement";
import GroupNewsFeedFrom from "~/components/Global/NewsFeed/components/GroupNewsFeedForm";
const { Search } = Input;
const { Option } = Select;

const NewsFeed = () => {
    const [session, loading] = useSession();
    const [dataUser, setDataUser] = useState<IUser>();
    const { showNoti } = useWrap();
    const { titlePage, userInformation } = useWrap();
    const [isLoading, setIsLoading] = useState({
        type: null,
        status: false
    });
    const [emptyNewsFeed, setEmptyNewsFeed] = useState(false);

    const intialNewsFeed = [];
    const intialPageIndex = 1;

    const [newsFeed, setNewsFeed] = useState<INewsFeed[]>(intialNewsFeed);
    const [userBranch, setUserBranch] = useState<IUserBranch[]>([]);
    const [groupNewsFeed, setGroupNewsFeed] = useState<IGroupNewsFeed[]>([]);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [pageIndex, setPageIndex] = useState(1);

    const [inGroup, setInGroup] = useState(null);
    const [inTeam, setInTeam] = useState(null);
    const [searchName, setSearchName] = useState(null);
    const [totalRow, setTotalRow] = useState(0);


    const fetchListNewsFeed = async () => {
        // if(!hasNextPage) return;
        setIsLoading({
            type: "GET_LIST",
            status: true
        });
        try {
            let res = await newsFeedApi.getAll({
                            pageIndex: pageIndex, 
                            pageSize: 5, 
                            GroupNewsFeedID: inGroup, 
                            BranchID: inTeam, 
                            FullNameUnicode: searchName});
            if(res.status == 204) {
                showNoti("danger", "Không có dữ liệu");
                setEmptyNewsFeed(true);
                setTotalRow(0);
            }
            if(res.status == 200) {
                setNewsFeed([...newsFeed, ...res.data.data]);
                setTotalRow(res.data.totalRow);
                setEmptyNewsFeed(false);
                if(res.data.totalRow <= newsFeed.length + res.data.data.length) {
                    setHasNextPage(false);
                }
            }
        } catch (error) {
            showNoti("danger", error.message)
        } finally {
            setIsLoading({
                type: "GET_LIST",
                status: false
            });
        }
    }

    const fetchUserBranch = async () => {
        if(userInformation?.UserInformationID != undefined) {
            try {
                let res = await userBranchApi.getAll({UserInfomationID: userInformation.UserInformationID});
                if(res.status == 204) {
                    console.log("Không có dữ liệu");
                }
                if(res.status == 200) {
                    setUserBranch(res.data.data);
                }
            } catch (error) {
                console.log("Lỗi UserBranch", error.message);
            }
        } else {
            return;
        }
    }

    const fetchGroupNewsFeed = async () => {
        if(userInformation?.UserInformationID != undefined) {
            try {
                let res = await groupNewsFeedApi.getAll({selectAll: true});
                if(res.status == 204) {
                    console.log("Không có dữ liệu");
                }
                if(res.status == 200) {
                    setGroupNewsFeed(res.data.data);
                }
            } catch (error) {
                console.log("Lỗi UserBranch", error.message);
            }
        } else {
            return;
        }
    }

    const onSubmit = async (data) => {
        setIsLoading({
            type: "ADD",
            status: true,
        })
        let res;
        if(data.ID) {
            try {
                res = await newsFeedApi.update(data);
                if(res.status == 200) {
                    showNoti("success", "Update thành công");
                    reset();
                }
                if(res.status == 204) {
                    showNoti("danger", "Không có dữ liệu")
                }
            } catch (error) {
                showNoti("danger", error.message)
            } finally {
                setIsLoading({
                    type: "ADD",
                    status: false,
                })
            }
        } else {
            try {
                res = await newsFeedApi.add(data);
                if(res.status == 200) {
                    showNoti("success", "Đăng thành công");
                    reset();
                }
                if(res.status == 204) {
                    showNoti("danger", "Không có dữ liệu")
                }
            } catch (error) {
                showNoti("danger", error.message)
            } finally {
                setIsLoading({
                    type: "ADD",
                    status: false,
                });
            }
        }
        return res;
    }

    const onSubmitGroupNewsFeed = async (data) => {
        console.log("Data submit: ", data);
        setIsLoading({
            type: "ADD",
            status: true,
        })
        let res;

        if(data.ID) {
            try {
                res = await groupNewsFeedApi.update(data);
                if(res.status == 200) {
                    showNoti("success", "Update thành công");
                    fetchGroupNewsFeed();
                }
                if(res.status == 204) {
                    showNoti("danger", "Không có dữ liệu")
                }
            } catch (error) {
                showNoti("danger", error.message)
            } finally {
                setIsLoading({
                    type: "ADD",
                    status: false,
                })
            }
        } else {
            try {
                res = await groupNewsFeedApi.add(data);
                if(res.status == 200) {
                    showNoti("success", "Thêm thành công");
                    fetchGroupNewsFeed();
                }
                if(res.status == 204) {
                    showNoti("danger", "Không có dữ liệu")
                }
            } catch (error) {
                showNoti("danger", error.message)
            } finally {
                setIsLoading({
                    type: "ADD",
                    status: false,
                })
            }
        }

        return res;
    }

    function parseJwt(token) {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
    
        return JSON.parse(jsonPayload);
    }

    const reset = () => {
        setNewsFeed(intialNewsFeed);
        setPageIndex(intialPageIndex);
        console.log("reset");
    }

    const loadMore = () => {
        if(Object.keys(newsFeed).length >= 10) {
            setPageIndex(pageIndex + 1);
        } else {
            fetchListNewsFeed();
        }
    }

    const onSearch = value => {
        setInGroup(null);
        setInTeam(null);
        reset();
        setSearchName(value);
    };

    const inGroupFunc = (e) => {
        setInTeam(null);
        setSearchName(null);
        reset();
        setInGroup(e.target.value);
    }

    const inTeamFunc = (e) => {
        setInGroup(null);
        setSearchName(null);
        reset();
        setInTeam(e.target.value);
    }

    const inGroupFuncMB = (value) => {
        setInTeam(null);
        setSearchName(null);
        reset();
        setInGroup(value);
    }

    const inTeamFuncMB = (value) => {
        setInGroup(null);
        setSearchName(null);
        reset();
        setInTeam(value);
    }

    const SideBar = () => {
        return (
            <>
            <Card className="card-newsfeed" title="TÌM KIẾM" bordered={false}>
                <Search 
                    className="style-input"
                    placeholder={searchName != null ? searchName : "Nhập từ khóa"}
                    allowClear 
                    onSearch={onSearch}
                    // defaultValue={searchName}
                />
            </Card>
            <Card className="card-newsfeed" bordered={false}>
                <p className="card-newsfeed__label font-weight-black">TRUNG TÂM</p>
                <Select
                    className="style-input list-group-nf__moblie"
                    placeholder="Chọn trung tâm"
                    onChange={(value) => inTeamFuncMB(value)}
                >
                    {userBranch && userBranch.map((item, index) => (
                        <Option 
                            key={index} 
                            value={item.BranchID}
                        >
                            {item.BranchName}
                        </Option>
                    ))}
                </Select>
                <ul className="list-group-nf">
                    {userBranch && userBranch.map((item, index) => (
                        <li 
                            className={inTeam == item.BranchID ? "active" : ""}
                            key={index} 
                            value={item.BranchID}
                            onClick={e => inTeamFunc(e)}
                        >
                            {item.BranchName}
                        </li>
                    ))}
                </ul>
                <p className="card-newsfeed__label font-weight-black">NHÓM</p>
                <Select
                    className="style-input list-group-nf__moblie mb-0"
                    placeholder="Chọn nhóm"
                    onChange={(value) => inGroupFuncMB(value)}
                >
                    {groupNewsFeed && groupNewsFeed.map((item, index) => (
                        <Option 
                            key={index} 
                            value={item.ID}
                        >
                            {item.Name}
                        </Option>
                    ))}
                </Select>
                <ul className="list-group-nf mb-0">
                    {groupNewsFeed && groupNewsFeed.map((item, index) => (
                        <li 
                            className={inGroup == item.ID ? "active" : ""} 
                            key={index} 
                            value={item.ID}
                            onClick={e => inGroupFunc(e)}
                        >
                            {item.Name}
                        </li>
                    ))}
                </ul>
                <GroupNewsFeedFrom 
                        showAdd={true}
                        isLoading={isLoading} 
                        onSubmitGroupNewsFeed={(data) => onSubmitGroupNewsFeed(data)}/>
            </Card>
            </>
        )
    }

    // console.log("Group: ", inGroup);
    // console.log("Team: ", inTeam);

    useEffect(() => {
        if (session !== undefined) {
          let token = session.accessToken;
          if (userInformation) {
            setDataUser(userInformation);
          } else {
            setDataUser(parseJwt(token));
          }
        }
        fetchListNewsFeed();
        fetchUserBranch();
        fetchGroupNewsFeed();
    }, [userInformation, pageIndex, inGroup, inTeam, searchName]);

    return (
        <>  
        <div className="row wrap-newsfeed">
            {emptyNewsFeed == false ? (
                <div className="col-md-8 col-12">
                    {inGroup != null ? (
                        <>
                            <GroupTagElement onSubmitGroupNewsFeed={(data) => onSubmitGroupNewsFeed(data)} dataUser={dataUser} totalRow={totalRow} inGroup={inGroup}/>
                        </>
                    ) : (<></>)}
                    {session?.user ? (
                        <>
                        <CreateNewsFeed 
                            inGroup={inGroup} 
                            inTeam={inTeam} 
                            dataUser={dataUser} 
                            groupNewsFeed={groupNewsFeed} 
                            userBranch={userBranch} 
                            _onSubmit={(data) => onSubmit(data)}
                        />
                        <ListNewsFeed 
                            onSearch={(value) => onSearch(value)} 
                            dataUser={dataUser} 
                            dataNewsFeed={newsFeed} 
                            groupNewsFeed={groupNewsFeed} 
                            userBranch={userBranch} 
                            inGroup={inGroup} 
                            inTeam={inTeam} 
                            inGroupFunc={(e) => inGroupFunc(e)} 
                            inTeamFunc={(e) => inTeamFunc(e)}
                            _onSubmit={(data) => onSubmit(data)}
                        />
                        </>
                    ) : (
                        <>Bạn cần phải đăng nhập</>
                    )}
                    {hasNextPage &&(
                        <Waypoint onEnter={loadMore}>
                            <ul className="list-nf skeleton">
                                <li className="item-nf">
                                    <div className="newsfeed">
                                        <Skeleton avatar paragraph={{ rows: 0 }} active/>
                                        <Skeleton active paragraph={{ rows: 2 }}/>
                                    </div>
                                </li>
                                <li className="item-nf">
                                    <div className="newsfeed">
                                        <Skeleton avatar paragraph={{ rows: 0 }} active/>
                                        <Skeleton active paragraph={{ rows: 2 }}/>
                                    </div>
                                </li>
                                <li className="item-nf">
                                    <div className="newsfeed">
                                        <Skeleton avatar paragraph={{ rows: 0 }} active/>
                                        <Skeleton active paragraph={{ rows: 2 }}/>
                                    </div>
                                </li>
                            </ul>
                        </Waypoint>
                    )}
                </div>
            ) : (
                <div className="col-md-8 col-12">
                    {inGroup != null ? (
                        <>
                            <GroupTagElement onSubmitGroupNewsFeed={(data) => onSubmitGroupNewsFeed(data)} dataUser={dataUser} totalRow={totalRow} inGroup={inGroup}/>
                        </>
                    ) : (<></>)}
                    {session?.user ? (
                        <>
                        <CreateNewsFeed 
                            inGroup={inGroup} 
                            inTeam={inTeam} 
                            dataUser={dataUser} 
                            groupNewsFeed={groupNewsFeed} 
                            userBranch={userBranch} 
                            _onSubmit={(data) => onSubmit(data)}
                        />
                        <div className="mt-4"><Empty /></div>
                        </>
                    ) : (
                        <>Bạn cần phải đăng nhập</>
                    )}
                </div>
            )}
            <div className="col-md-4 col-12">
                <SideBar />
            </div>
        </div>
        </>
    )

}
NewsFeed.layout = LayoutBase;
export default NewsFeed;
