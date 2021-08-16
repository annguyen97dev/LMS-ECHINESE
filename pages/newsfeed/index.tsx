import React, { Fragment, useEffect, useRef, useState } from "react";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import moment from "moment";
import { Checkbox, Row, Col, Tooltip, Spin, Card, Input, Skeleton, Empty } from 'antd';
import document from "next/document";
import ReactHtmlParser from 'react-html-parser';
import Modal from "antd/lib/modal/Modal";
import { signIn, signOut, useSession } from "next-auth/client";
import { newsFeedApi, userBranchApi, groupNewsFeedApi } from "~/apiBase";
import CreateNewsFeed from "~/components/Global/NewsFeed/CreateNewsFeed";
import ListNewsFeed from "~/components/Global/NewsFeed/ListNewsFeed";
import { Waypoint } from "react-waypoint";
const { Search } = Input;

const NewsFeed = () => {
    const [session, loading] = useSession();
    const [dataUser, setDataUser] = useState<IUser>();
    const { showNoti } = useWrap();
    const { titlePage, userInformation } = useWrap();
    const [isLoading, setIsLoading] = useState({
        type: null,
        status: false
    });

    const intialNewsFeed = [];

    const [newsFeed, setNewsFeed] = useState<INewsFeed[]>(intialNewsFeed);
    const [userBranch, setUserBranch] = useState<IUserBranch[]>([]);
    const [groupNewsFeed, setGroupNewsFeed] = useState<IGroupNewsFeed[]>([]);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [pageIndex, setPageIndex] = useState(1);

    const [inGroup, setInGroup] = useState(null);
    const [inTeam, setInTeam] = useState(null);
    const [searchName, setSearchName] = useState(null);


    const fetchListNewsFeed = async () => {
        // if(!hasNextPage) return;
        setIsLoading({
            type: "GET_LIST",
            status: true
        });
        try {
            let res = await newsFeedApi.getAll({pageIndex: pageIndex, pageSize: 10, GroupNewsFeedID: inTeam, BranchID: inGroup, FullNameUnicode: searchName});
            if(res.status == 204) {
                showNoti("danger", "Không có dữ liệu")
            }
            if(res.status == 200) {
                setNewsFeed([...newsFeed, ...res.data.data]);
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

    // console.log("UserInfomation: ", userInformation);

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
        try {
            let res = await newsFeedApi.add(data);
            if(res.status == 204) {
                showNoti("danger", "Không có dữ liệu")
            }
            if(res.status == 200) {
                showNoti("success", "Đăng thành công");
                reset();
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

    // console.log(Object.keys(newsFeed).length);
    // console.log(pageIndex);

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
        setPageIndex(1);
    }

    const loadMore = () => {
        // console.log(Object.keys(newsFeed).length);
        if(Object.keys(newsFeed).length >= 10) {
            setPageIndex(pageIndex + 1);
        } else {
            fetchListNewsFeed();
        }
    }

    const onSearch = value => console.log(value);

    const inGroupFunc = (e) => {
        setInTeam(null)
        setInGroup(e.target.value);
    }

    const inTeamFunc = (e) => {
        setInGroup(null)
        setInTeam(e.target.value);
    }


    console.log("Group: ", inGroup);
    console.log("Team: ", inTeam);

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
    }, [userInformation, pageIndex]);

    return (
        <>  
            <div className="row">
                <div className="col-8">
                    {session?.user ? (
                        <>
                        <CreateNewsFeed dataUser={dataUser} groupNewsFeed={groupNewsFeed} userBranch={userBranch} _onSubmit={(data) => onSubmit(data)}/>
                        <ListNewsFeed dataUser={dataUser} dataNewsFeed={newsFeed}/>
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
                <div className="col-4">
                    <Card className="card-newsfeed" title="TÌM KIẾM" bordered={false}>
                        <Search className="style-input" placeholder="Nhập từ khóa" allowClear onSearch={onSearch} />
                    </Card>
                    <Card className="card-newsfeed" bordered={false}>
                        <p className="card-newsfeed__label font-weight-black">TRUNG TÂM</p>
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
                        <ul className="list-group-nf">
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
                    </Card>
                </div>
            </div>
        </>
    )   
}
NewsFeed.layout = LayoutBase;
export default NewsFeed;
