import { Empty, Skeleton } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import {
	backgroundNewsFeedApi,
	courseApi,
	groupNewsFeedApi,
	newsFeedApi,
	newsFeedCommentApi,
	newsFeedCommentReplyApi,
	newsFeedLikeApi,
	userBranchApi,
	userGroupNewsFeedApi,
	userInformationApi
} from '~/apiBase';
import CreateNewsFeed from '~/components/Global/NewsFeed/CreateNewsFeed';
import ListNewsFeed from '~/components/Global/NewsFeed/ListNewsFeed';
import AddUserForm from '~/components/Global/NewsFeed/NewsFeedGroupComponents/AddUserForm';
import BannerGroup from '~/components/Global/NewsFeed/NewsFeedGroupComponents/BannerGroup';
import DeleteGroup from '~/components/Global/NewsFeed/NewsFeedGroupComponents/DeleteGroup';
import GroupForm from '~/components/Global/NewsFeed/NewsFeedGroupComponents/GroupForm';
import RemoveUser from '~/components/Global/NewsFeed/NewsFeedGroupComponents/RemoveUser';
import DeleteNewsFeed from '~/components/Global/NewsFeed/NewsFeedItemComponents/DeleteNewsFeed';
import NewsFeedItem from '~/components/Global/NewsFeed/NewsFeedItemComponents/NewsFeedItem';
import SideBarNewsFeed from '~/components/Global/NewsFeed/SideBarNewsFeed';
import { useDebounce } from '~/context/useDebounce';
import { useWrap } from '~/context/wrap';
import { Roles } from '~/lib/roles/listRoles';
import { fmSelectArr } from '~/utils/functions';

const initialNewsFeedList = [];
const initialPageIndex = 1;
type FiltersData = {
	name: string;
	idTeam: number;
	idGroup: number;
};
type OptionList = {
	teamOptionList: IOptionCommon[];
	groupOptionList: IOptionCommon[];
};
type InfoGroup = {
	info: IGroupNewsFeed;
	userList: IUserGroupNewsFeed[];
};
const NewsFeed = () => {
	const { showNoti, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [newsFeedList, setNewsFeedList] = useState<INewsFeed[]>([]);
	const [totalNewsFeed, setTotalNewsFeed] = useState(1);
	const [emptyNewsFeed, setEmptyNewsFeed] = useState(false);
	const [idListUserLiked, setIDListUserLiked] = useState<number[]>([]);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [pageIndex, setPageIndex] = useState(1);
	// STONE DATA TO FILTER NEWS FEED
	const [filtersData, setFiltersData] = useState<FiltersData>({
		name: null,
		idTeam: null,
		idGroup: null
	});
	// OPTION LIST FOR CREATE NEWS FEED
	const [optionList, setOptionList] = useState<OptionList>({
		teamOptionList: [],
		groupOptionList: []
	});
	const [backgroundList, setBackgroundList] = useState<IBackgroundNewsFeed[]>([]);
	// GROUP
	const [infoGroup, setInfoGroup] = useState<InfoGroup>({
		info: null,
		userList: []
	});
	const [courseList, setCourseList] = useState<IOptionCommon[]>([]);
	const [userOptionList, setUserOptionList] = useState<IOptionCommon[]>([]);
	const roleOptionList = Roles.filter((r) => r.id !== 1 && r.id !== 5).map((r) => ({ title: r.RoleName, value: r.id }));
	const roleMemberOptionList = [
		{ label: 'Thành viên', value: 2 },
		{ label: 'Quản trị viên', value: 1 }
	];
	// CHECK AUTHENTICATE
	// 1: ADMIN - 5: MANAGER
	const checkAuthorization = (newsFeedAuthor?: number) => {
		if (!userInformation) return 'Ignore';
		const role = userInformation['RoleID'];
		const uid = userInformation.UserInformationID;
		if (role === 1 || role === 5 || role === 2 || +newsFeedAuthor === +uid) {
			return 'Accept';
		}
		return 'Ignore';
	};
	// RESET DATA BACK TO INIT
	const reset = () => {
		setNewsFeedList(initialNewsFeedList);
		setPageIndex(initialPageIndex);
	};
	// --------------FETCH--------------
	const fetchNewsFeedList = async () => {
		setIsLoading({
			type: 'GET_LIST',
			status: true
		});
		try {
			const res = await newsFeedApi.getAll({
				pageIndex: pageIndex,
				pageSize: 5,
				GroupNewsFeedID: filtersData.idGroup,
				BranchID: filtersData.idTeam,
				FullNameUnicode: filtersData.name
			});
			if (res.status === 204) {
				setEmptyNewsFeed(true);
				setHasNextPage(false);
				setTotalNewsFeed(0);
			}
			if (res.status === 200) {
				setNewsFeedList([...newsFeedList, ...res.data.data]);
				setEmptyNewsFeed(false);
				setTotalNewsFeed(res.data.totalRow);
				if (res.data.data.length < 5) {
					setHasNextPage(false);
				}
			}
		} catch (error) {
			console.log('fetchNewsFeedList', error.message);
		} finally {
			setIsLoading({
				type: 'GET_LIST',
				status: false
			});
		}
	};
	useEffect(() => {
		if (pageIndex === 1) {
			fetchNewsFeedList();
		}
	}, [pageIndex, filtersData]);

	const fetchOptionList = async () => {
		try {
			let [team, group] = await Promise.all([
				userBranchApi.getAll({ getbytokenID: true }),
				groupNewsFeedApi.getAll({ selectAll: true })
			]);
			if (team.status === 200) {
				const teamOptionList = fmSelectArr(team.data.data, 'BranchName', 'BranchID');
				setOptionList((prevState) => ({
					...prevState,
					teamOptionList
				}));
			} else {
				setOptionList((prevState) => ({
					...prevState,
					teamOptionList: []
				}));
			}
			if (group.status === 200) {
				const groupOptionList = fmSelectArr(group.data.data, 'Name', 'ID');
				setOptionList((prevState) => ({
					...prevState,
					groupOptionList
				}));
			} else {
				setOptionList((prevState) => ({
					...prevState,
					groupOptionList: []
				}));
			}
		} catch (error) {
			console.log('fetchOptionList', error.message);
		}
	};
	useEffect(() => {
		fetchOptionList();
	}, []);
	const fetchCourseList = async () => {
		try {
			if (checkAuthorization() === 'Ignore') return;
			const res = await courseApi.getAll({ selectAll: true });
			if (res.status === 200) {
				const fmCourseList = res.data.data.map((c) => ({
					title: `${c.DonePercent}% - ${c.CourseName}`,
					value: c.ID
				}));
				setCourseList(fmCourseList);
			}
		} catch (error) {
			console.log('fetchCourseList', error.message);
		}
	};
	useEffect(() => {
		fetchCourseList();
	}, [userInformation]);
	const checkFileType = (file: File) => {
		const { type, name } = file;
		if (type.includes('image')) {
			return {
				name,
				type,
				Type: 2 // key for api
			};
		}
		if (type.includes('audio')) {
			return {
				name,
				type,
				Type: 3
			};
		}
		if (type.includes('video')) {
			return {
				name,
				type,
				Type: 4
			};
		}
		return {
			name,
			Type: 0
		};
	};
	const onUploadFile = async (fileList) => {
		try {
			let nextPost = 0;
			const resArr = await Promise.all(
				fileList.reduce((newArr, file, idx) => {
					if (file.originFileObj) {
						newArr.push(newsFeedApi.uploadFile(file.originFileObj));
					} else {
						nextPost = idx + 1;
						newArr;
					}
					return newArr;
				}, [])
			);
			const rs = resArr.map((r: any) => {
				return {
					uid: r.data.data,
					url: r.data.data,
					...checkFileType(fileList[nextPost])
				};
			});
			return rs;
		} catch (error) {
			console.log('onUploadFile', error);
		}
	};
	// CREATE
	const onCreateNewsFeed = async (data: {
		Content: string;
		TypeFile: number;
		NewsFeedFile: {
			name: string;
			type: string;
			Type?: number;
			preview: string;
			uid: string;
			url: string;
			//
		}[];
		BranchList: number[]; //TEAM
		GroupNewsFeedID: number; //GROUP
	}) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const { TypeFile, NewsFeedFile } = data;
			const newData =
				TypeFile && NewsFeedFile?.length
					? {
							...data,
							NewsFeedFile: data.NewsFeedFile.map((f) => ({
								Type: f.Type,
								NameFile: f.url,
								UID: f.uid
							}))
					  }
					: data;
			const res = await newsFeedApi.add(newData);
			if (res.status === 200) {
				const newNewsFeedList = [res.data.data, ...newsFeedList];
				setNewsFeedList(newNewsFeedList);
				setTotalNewsFeed(newNewsFeedList.length);
				showNoti('success', res.data.message);
			}
			return res;
		} catch (error) {
			console.log('onCreateNewsFeed', error.message);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};
	// EDIT
	const onEditNewsFeed = (idx: number) => {
		return async (data: {
			Content: string;
			Color: string;
			TypeFile: number;
			NewsFeedFile: {
				ID?: number;
				name: string;
				type: string;
				Type?: number;
				preview?: string;
				uid: string;
				url: string;
				Enable?: boolean;
				//
			}[];
			BranchList: number[]; //TEAM
			GroupNewsFeedID: number; //GROUP
		}) => {
			setIsLoading({
				type: 'ADD_DATA',
				status: true
			});
			try {
				const { TypeFile, NewsFeedFile } = data;

				const { NewsFeedFile: oldNewsFeedFileList } = newsFeedList[idx];

				let newFileUploadList = null;
				if (TypeFile === 2) {
					newFileUploadList = [...(oldNewsFeedFileList || []), ...(NewsFeedFile || [])].reduce((arr, f) => {
						// CLEAR DUPLICATE OLD FILE
						if (arr.some((newFile) => newFile.ID && newFile.ID === f.ID)) {
							return arr;
						}
						if (NewsFeedFile.some((fileForm) => fileForm.ID && fileForm.ID === f.ID)) {
							arr.push(f);
						} else if (!f.hasOwnProperty('ID')) {
							// DO NOT HAVE PROPERTY ID => NEW FILE
							arr.push({
								...f,
								Type: f.Type,
								NameFile: f.url,
								UID: f.uid
							});
						} else {
							// CAN NOT FIND ID FILE IN NEWS FEED FILE => FILE REMOVED
							arr.push({
								...f,
								Enable: false
							});
						}
						return arr;
					}, []);
				}
				if (TypeFile === 1 && NewsFeedFile?.length) {
					newFileUploadList = NewsFeedFile;
				}

				const newData = newFileUploadList
					? {
							...data,
							NewsFeedFile: newFileUploadList
					  }
					: data;

				const res = await newsFeedApi.update(newData);

				if (res.status === 200) {
					const newNewsFeedList = [...newsFeedList];
					newNewsFeedList.splice(idx, 1, res.data.data);
					setNewsFeedList(newNewsFeedList);
					showNoti('success', res.data.message);
				}
				return res;
			} catch (error) {
				console.log('onEditNewsFeed', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		};
	};
	// DELETE
	const onDelete = (idx: number) => {
		return async () => {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			try {
				const newNewsFeedList = [...newsFeedList];
				const delObj = newNewsFeedList[idx];
				const newDelObj = {
					ID: delObj.ID,
					Enable: false
				};
				const res = await newsFeedApi.delete(newDelObj);
				if (res.status === 200) {
					newNewsFeedList.splice(idx, 1);
					setNewsFeedList(newNewsFeedList);
					setTotalNewsFeed(newNewsFeedList.length);
					showNoti('success', res.data.message);
				}
			} catch (error) {
				console.log('onDelete', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		};
	};
	const fetchBackgroundNewsFeed = async () => {
		try {
			const res = await backgroundNewsFeedApi.getAll();
			if (res.status === 200) {
				setBackgroundList(res.data.data);
			}
		} catch (error) {
			console.log('fetchBackgroundNewsFeed', error.message);
		}
	};
	// --------------BACK TO HOME PAGE--------------
	const onBackToHomePage = useDebounce(
		() => {
			setFiltersData({
				name: null,
				idTeam: null,
				idGroup: null
			});
			reset();
		},
		200,
		[]
	);
	// --------------FILTER--------------
	const loadMore = () => {
		// PAGE INDEX >= 2, OTHERWISE DUPLICATE CALL API
		setPageIndex(pageIndex + 1);
		if (pageIndex > 1) {
			fetchNewsFeedList();
		}
	};
	const onFilters = (field: string, value: string | number) => {
		if (filtersData[field] === value) {
			onBackToHomePage();
			return;
		}
		const newFilters: FiltersData = {
			name: null,
			idTeam: null,
			idGroup: null
		};
		newFilters[field] = value;
		setFiltersData(newFilters);
		reset();
	};
	useEffect(() => {
		for (const key in filtersData) {
			if (filtersData[key]) {
				setHasNextPage(true);
			}
		}
	}, [filtersData]);
	// --------------LIKE--------------
	const fetchNewsFeedUserLiked = async () => {
		try {
			if (!userInformation) return;
			let res = await newsFeedLikeApi.getAll({
				selectAll: true,
				UserInformationID: userInformation.UserInformationID
			});
			if (res.status === 200) {
				const getNewsFeedIDList = res.data.data.map((n) => n.NewsFeedID);
				setIDListUserLiked(getNewsFeedIDList);
			}
			if (res.status === 204) {
				setIDListUserLiked([]);
			}
		} catch (error) {
			console.log('fetchNewsFeedUserLiked', error.message);
		}
	};
	useEffect(() => {
		fetchNewsFeedUserLiked();
	}, [userInformation]);
	const stoLike = useRef(null);
	const DELAY = 500;
	const onUserLikeNewsFeed = (idx: number) => {
		clearTimeout(stoLike.current);
		return (NewsFeedID: number) => {
			try {
				// LIMIT USER FAST CLICK
				stoLike.current = setTimeout(async () => {
					const data = {
						NewsFeedID
					};
					let res = await newsFeedLikeApi.add(data);
					if (res.status === 200) {
						const newNewsFeedList = [...newsFeedList];
						const newNewsFeed: INewsFeed = {
							...newNewsFeedList[idx]
						};
						if (res.data.data.Enable) {
							// WE NEED TO INCREMENT OR DECREMENT LIKE COUNT IN THE NEWS FEED LIST
							newNewsFeedList.splice(idx, 1, {
								...newNewsFeed,
								LikeCount: ++newNewsFeedList[idx].LikeCount
							});
							setIDListUserLiked([...idListUserLiked, res.data.data.NewsFeedID]);
							setNewsFeedList(newNewsFeedList);
						} else {
							newNewsFeedList.splice(idx, 1, {
								...newNewsFeed,
								LikeCount: --newNewsFeedList[idx].LikeCount
							});
							const newIDListUserLiked = idListUserLiked.filter((id) => id !== res.data.data.NewsFeedID);
							setIDListUserLiked(newIDListUserLiked);
							setNewsFeedList(newNewsFeedList);
						}
					}
				}, DELAY);
			} catch (error) {
				console.log('onUserLikeNewsFeed', error.message);
			}
		};
	};
	// --------------COMMENT--------------
	const onComment = async (data: { CommentContent: string; NewsFeedID: number }) => {
		setIsLoading({
			type: 'ADD_COMMENT',
			status: true
		});
		try {
			const res = await newsFeedCommentApi.add(data);
			return res;
		} catch (error) {
			console.log('onComment', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_COMMENT',
				status: false
			});
		}
	};
	const fetchComment = async (NewsFeedID: number) => {
		setIsLoading({
			type: `FETCH_COMMENT_${NewsFeedID}`,
			status: true
		});
		try {
			const res = await newsFeedCommentApi.getAll({
				selectAll: true,
				NewsFeedID
			});
			return res;
		} catch (error) {
			console.log('fetchComment', error.message);
		} finally {
			setIsLoading({
				type: `FETCH_COMMENT_${NewsFeedID}`,
				status: false
			});
		}
	};
	// --------------REPLY--------------
	const onReplyComment = async (data) => {
		setIsLoading({
			type: 'ADD_COMMENT',
			status: true
		});
		try {
			const res = await newsFeedCommentReplyApi.add(data);
			return res;
		} catch (error) {
			console.log('onReplyComment', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_COMMENT',
				status: false
			});
		}
	};
	const fetchReplyComment = async (NewsFeedCommentID: number) => {
		setIsLoading({
			type: `FETCH_REPLY_COMMENT_${NewsFeedCommentID}`,
			status: true
		});
		try {
			const res = await newsFeedCommentReplyApi.getAll({
				selectAll: true,
				NewsFeedCommentID
			});
			return res;
		} catch (error) {
			console.log('fetchReplyComment', error.message);
		} finally {
			setIsLoading({
				type: `FETCH_REPLY_COMMENT_${NewsFeedCommentID}`,
				status: false
			});
		}
	};
	// GROUP
	const fetchInfoGroup = async (idGroup: number) => {
		setIsLoading({
			type: 'FETCH_INFO_GROUP',
			status: true
		});
		try {
			let [info, userList] = await Promise.all([
				groupNewsFeedApi.getByID(idGroup),
				userGroupNewsFeedApi.getAll({
					selectAll: true,
					GroupNewsFeedID: idGroup
				})
			]);
			if (info.status === 200) {
				setInfoGroup((prevState) => ({
					...prevState,
					info: info.data.data
				}));
			}
			if (userList.status === 200) {
				setInfoGroup((prevState) => ({
					...prevState,
					userList: userList.data.data
				}));
			}
		} catch (error) {
			console.log('fetchInfoGroup', error.message);
		} finally {
			setIsLoading({ type: 'FETCH_INFO_GROUP', status: false });
		}
	};
	useEffect(() => {
		if (filtersData.idGroup) {
			fetchInfoGroup(filtersData.idGroup);
		}
	}, [filtersData.idGroup]);

	const onCreateGroup = async (data: { Name: string; CourseID: number; BackGround: string }) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const res = await groupNewsFeedApi.add(data);
			if (res.status === 200) {
				const newGroup: IOptionCommon = {
					title: res.data.data.Name,
					value: res.data.data.ID
				};
				const newGroupOptionList = [newGroup, ...optionList.groupOptionList];
				setOptionList({ ...optionList, groupOptionList: newGroupOptionList });
				showNoti('success', res.data.message);
				return res;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};
	const onUpdateGroup = async (data: IGroupNewsFeed) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const res = await groupNewsFeedApi.update(data);

			if (res.status === 200) {
				const newGroupOptionList = [...optionList.groupOptionList].map((t) => {
					if (t.value === data.ID) {
						return {
							...t,
							title: data.Name
						};
					}
					return t;
				});
				setOptionList({
					...optionList,
					groupOptionList: newGroupOptionList
				});
				setInfoGroup({
					...infoGroup,
					info: data
				});
				showNoti('success', res.data.message);
				return res;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};
	const onDeleteGroup = async () => {
		try {
			const data = {
				ID: filtersData.idGroup,
				Enable: false
			};
			const res = await groupNewsFeedApi.update(data);

			if (res.status === 200) {
				const newGroupOptionList = [...optionList.groupOptionList].filter((g) => g.value !== filtersData.idGroup);
				reset();
				setOptionList({
					...optionList,
					groupOptionList: newGroupOptionList
				});
				setFiltersData({
					name: null,
					idTeam: null,
					idGroup: null
				});
			}
		} catch (error) {
			console.log('onDeleteGroup', error.message);
		}
	};

	// ADD USER TO GROUP
	const fetchUserByRole = async (roleID: number) => {
		setIsLoading({
			type: 'FETCH_USER_IN_GROUP',
			status: true
		});
		try {
			const res = await userInformationApi.getAllParams({
				RoleID: roleID,
				pageSize: 9999
			});
			if (res.status === 200) {
				const fmOptionList = fmSelectArr(res.data.data, 'FullNameUnicode', 'UserInformationID');
				setUserOptionList(fmOptionList);
			}
			if (res.status === 204) {
				setUserOptionList([]);
			}
		} catch (error) {
			console.log('fetchUserByRole', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_USER_IN_GROUP',
				status: false
			});
		}
	};
	const addUserToGroup = async (data: { RoleUser: number; UserInformationID: number; RoleID: number }) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const { UserInformationID, RoleID } = data;
			const newData = {
				GroupNewsFeedID: filtersData.idGroup,
				UserInformationID,
				RoleID
			};
			const res = await userGroupNewsFeedApi.add(newData);
			if (res.status === 200) {
				const newUserList = [...infoGroup.userList, res.data.data];
				setInfoGroup({
					...infoGroup,
					userList: newUserList
				});
				showNoti('success', 'Thêm thành công');
				return res;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	const removeUser = async (idUser: number) => {
		try {
			const data = {
				ID: idUser,
				Enable: false
			};
			const res = await userGroupNewsFeedApi.update(data);
			if (res.status === 200) {
				const newUserList = [...infoGroup.userList].filter((u) => u.ID !== idUser);
				setInfoGroup({
					...infoGroup,
					userList: newUserList
				});
				showNoti('success', res.data.message);
			}
		} catch (error) {
			console.log('onDeleteGroup', error.message);
		}
	};

	return (
		<>
			<div className="row wrap-newsfeed">
				<div className="col-md-8 col-12">
					<div className="list-newsfeed">
						{filtersData.idGroup && (
							<BannerGroup
								infoGroup={infoGroup}
								totalNewsFeed={totalNewsFeed}
								//
								bannerGroupActionListComponent={
									checkAuthorization() === 'Accept' ? (
										<ul className="more-list">
											<li>
												<GroupForm
													isLoading={isLoading}
													isUpdate={true}
													dataUpdate={infoGroup.info}
													courseList={courseList}
													handleSubmit={onUpdateGroup}
												/>
											</li>
											<li>
												<AddUserForm
													isLoading={isLoading}
													roleOptionList={roleOptionList}
													userOptionList={userOptionList}
													roleMemberOptionList={roleMemberOptionList}
													fetchUserByRole={fetchUserByRole}
													handleSubmit={addUserToGroup}
												/>
											</li>
											<li>
												<RemoveUser userList={infoGroup.userList} handleDelete={removeUser} />
											</li>
											<li>
												<DeleteGroup handleDelete={onDeleteGroup} />
											</li>
										</ul>
									) : null
								}
							/>
						)}
						{/* 3 HỌC VIÊN - 4 PHỤ HUYNH */}
						{!userInformation || userInformation['RoleID'] === 3 || userInformation['RoleID'] === 4 ? null : (
							<CreateNewsFeed
								isLoading={isLoading}
								dataUser={userInformation}
								handleUploadFile={onUploadFile}
								handleSubmit={onCreateNewsFeed}
								fetchBackgroundNewsFeed={fetchBackgroundNewsFeed}
								backgroundList={backgroundList}
								filtersData={filtersData}
								optionList={optionList}
							/>
						)}
						<ListNewsFeed>
							{newsFeedList.map((item: INewsFeed, idx) => {
								const isUserLiked = idListUserLiked.includes(item.ID);
								return (
									<NewsFeedItem
										key={item.ID}
										// FILTER
										handleFilters={onFilters}
										// LIKE HANDLE
										isUserLiked={isUserLiked}
										handleUserLikeNewsFeed={onUserLikeNewsFeed(idx)}
										// COMMENT HANDLE
										handleComment={onComment}
										fetchComment={fetchComment}
										// REPLY HANDLE
										handleReplyComment={onReplyComment}
										fetchReplyComment={fetchReplyComment}
										// INFORMATION
										item={item}
										isLoading={isLoading}
										userComment={userInformation}
										// COMPONENT
										moreActionComponent={
											// ADMIN || MANAGER || AUTHOR CAN EDIT OR REMOVE
											checkAuthorization(item.UserInformationID) === 'Accept' ? (
												<ul className="more-list">
													{/* ONLY AUTHOR CAN EDIT POST  */}
													{item.UserInformationID === userInformation?.UserInformationID && (
														<li>
															<CreateNewsFeed
																key={item.ID}
																isLoading={isLoading}
																isUpdate={true}
																itemUpdate={item}
																dataUser={userInformation}
																handleUploadFile={onUploadFile}
																handleSubmit={onEditNewsFeed(idx)}
																fetchBackgroundNewsFeed={fetchBackgroundNewsFeed}
																backgroundList={backgroundList}
																optionList={optionList}
															/>
														</li>
													)}
													<li>
														<DeleteNewsFeed text="bảng tin này" handleDelete={onDelete(idx)} />
													</li>
												</ul>
											) : null
										}
									/>
								);
							})}
						</ListNewsFeed>
						{hasNextPage && (
							<Waypoint onEnter={loadMore}>
								<ul className="list-nf skeleton">
									<li className="item-nf">
										<div className="newsfeed">
											<Skeleton avatar paragraph={{ rows: 0 }} active />
											<Skeleton active paragraph={{ rows: 2 }} />
										</div>
									</li>
									<li className="item-nf">
										<div className="newsfeed">
											<Skeleton avatar paragraph={{ rows: 0 }} active />
											<Skeleton active paragraph={{ rows: 2 }} />
										</div>
									</li>
									<li className="item-nf">
										<div className="newsfeed">
											<Skeleton avatar paragraph={{ rows: 0 }} active />
											<Skeleton active paragraph={{ rows: 2 }} />
										</div>
									</li>
								</ul>
							</Waypoint>
						)}
					</div>
					{emptyNewsFeed && (
						<div className="mt-4">
							<Empty />
						</div>
					)}
				</div>
				<div className="col-md-4 col-12">
					<SideBarNewsFeed
						optionList={optionList}
						filtersData={filtersData}
						handleBack={onBackToHomePage}
						handleFilters={onFilters}
						// CREATE GROUP
						groupFormComponent={
							// ADMIN || MANAGER CAN CREATE NEW GROUP
							checkAuthorization() === 'Accept' ? (
								<GroupForm isLoading={isLoading} courseList={courseList} handleSubmit={onCreateGroup} />
							) : null
						}
					/>
				</div>
			</div>
		</>
	);
};
export default NewsFeed;
