import React, { Fragment, useEffect, useRef, useState } from "react";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import moment from "moment";
import { Checkbox, Row, Col, Tooltip, Spin, Card, Input, Skeleton, Empty, Form, Select, Drawer } from 'antd';
import { MoreHorizontal } from "react-feather";
import { signIn, signOut, useSession } from "next-auth/client";
import { newsFeedApi, userBranchApi, groupNewsFeedApi } from "~/apiBase";
import CreateNewsFeed from "~/components/Global/NewsFeed/CreateNewsFeed";
import ListNewsFeed from "~/components/Global/NewsFeed/ListNewsFeed";
import { Waypoint } from "react-waypoint";
import GroupTagElement from "~/components/Global/NewsFeed/components/GroupTagElement";
import GroupNewsFeedFrom from "~/components/Global/NewsFeed/components/GroupNewsFeedForm";
import Link from "next/dist/client/link";
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
    const [totalRow, setTotalRow] = useState(1);

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
                if(res.data.data.length < 5) {
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
        try {
            let res = await userBranchApi.getAll({getbytokenID: true});
            if(res.status == 204) {
                console.log("Không có dữ liệu");
            }
            if(res.status == 200) {
                setUserBranch(res.data.data);
            }
        } catch (error) {
            console.log("Lỗi UserBranch", error.message);
        }
    }

    const fetchGroupNewsFeed = async () => {
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
                    setNewsFeed(prev => prev.map(item => (item.ID == data.ID ? res.data.data : item)));
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
                    let obj = {...res.data.data}
                    setNewsFeed([obj, ...newsFeed]);
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

    const handleRemove = async (data) => {
        setIsLoading({
            type: "ADD",
            status: true,
        })
        let res;
        try {
            res = await newsFeedApi.update(data);
            if(res.status == 200) {
                showNoti("success", "Update thành công");
                const newArray = newsFeed.filter(item => item.ID != data.ID);
                setNewsFeed(newArray);
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
        // console.log("reset");
    }

    const loadMore = () => {
        setPageIndex(pageIndex + 1);
        fetchListNewsFeed();
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
        onClose();
        setInTeam(null);
        setSearchName(null);
        reset();
        setInGroup(value);
    }

    const inTeamFuncMB = (value) => {
        onClose();
        setInGroup(null);
        setSearchName(null);
        reset();
        setInTeam(value);
    }

    const SideBar = () => {
        return (
            <>
            <Card className="card-newsfeed" bordered={false}>
                <p className="card-newsfeed__label font-weight-black">TÌM KIẾM</p>
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

    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
      setVisible(true);
    };
    const onClose = () => {
      setVisible(false);
    };

    // console.log("Group: ", inGroup);
    // console.log("Team: ", inTeam);
    // console.log(newsFeed);

    useEffect(() => {
        if (session !== undefined) {
            let token = session.accessToken;
            if (userInformation) {
              setDataUser(userInformation);
            } else {
              setDataUser(parseJwt(token));
            }
          }
    }, [userInformation]);

    useEffect(() => {
        fetchGroupNewsFeed();
        fetchUserBranch();
    }, []);

    useEffect(() => {
        if(inGroup != null || inTeam != null || searchName != '') {
            setHasNextPage(true)
        }
    }, [pageIndex, inGroup, inTeam, searchName]);

    return (
        <>  
        <div className="row wrap-newsfeed">
            {emptyNewsFeed == false ? (
                <div className="col-md-8 col-12">
                    <div className="list-newsfeed">
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
                                isLoading={isLoading}
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
                                _handleRemove={(data) => handleRemove(data)}
                                isLoading={isLoading}
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
                            isLoading={isLoading}
                        />
                        <div className="mt-4"><Empty /></div>
                        </>
                    ) : (
                        <>Bạn cần phải đăng nhập</>
                    )}
                </div>
            )}
            <div className="col-md-4 col-12">
                <div className="sidebar-desktop">
                    <SideBar />
                </div>
                <div className="sidebar-mobile">
                    <Link href="/newsfeed">
                        <a><p className="label-nf font-weight-black">NewsFeed</p></a>
                    </Link>
                    <button className="btn btn-light" onClick={showDrawer}>
                        <MoreHorizontal/>
                    </button>
                    <Drawer
                        placement="right"
                        closable={false}
                        onClose={onClose}
                        visible={visible}
                        className="drawer-newsfeed"
                    >
                        <SideBar/>
                    </Drawer>
                </div>
            </div>
        </div>
        </>
    )

}
NewsFeed.layout = LayoutBase;
export default NewsFeed;
