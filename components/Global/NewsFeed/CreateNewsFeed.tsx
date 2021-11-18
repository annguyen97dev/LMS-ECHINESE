import { FileImageFilled, GroupOutlined, TeamOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Modal, Popover, Skeleton, Spin, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { Edit2, Image, Send, Users } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import UploadFileField from '~/components/FormControl/UploadFileField';
import { optionCommonPropTypes } from '~/utils/proptypes';

CreateNewsFeed.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	isUpdate: PropTypes.bool,
	dataUser: PropTypes.object,
	handleUploadFile: PropTypes.func,
	handleSubmit: PropTypes.func,
	fetchBackgroundNewsFeed: PropTypes.func,
	backgroundList: PropTypes.arrayOf(
		PropTypes.shape({
			ID: PropTypes.number,
			FileName: PropTypes.string
		})
	),
	optionList: PropTypes.shape({
		teamOptionList: optionCommonPropTypes,
		groupOptionList: optionCommonPropTypes
	}),
	itemUpdate: PropTypes.shape({
		ID: PropTypes.number,
		UserInformationID: PropTypes.number,
		FullNameUnicode: PropTypes.string,
		Color: PropTypes.string,
		Avatar: PropTypes.string,
		RoleID: PropTypes.number,
		RoleName: PropTypes.string,
		GroupNewsFeedID: PropTypes.number,
		GroupNewsFeedName: PropTypes.string,
		Content: PropTypes.string,
		TypeFile: PropTypes.number,
		isComment: PropTypes.bool,
		CommentCount: PropTypes.number,
		isLike: PropTypes.bool,
		LikeCount: PropTypes.number,
		NewsFeedFile: PropTypes.arrayOf(
			PropTypes.shape({
				ID: PropTypes.number,
				NameFile: PropTypes.string,
				Type: PropTypes.number,
				TypeName: PropTypes.string,
				UID: PropTypes.string,
				Thumnail: PropTypes.string
			})
		),
		NewsFeedBranch: PropTypes.arrayOf(
			PropTypes.shape({
				ID: PropTypes.number,
				BranchID: PropTypes.number,
				BranchName: PropTypes.string
			})
		)
	}),
	filtersData: PropTypes.shape({
		name: PropTypes.string,
		idTeam: PropTypes.number,
		idGroup: PropTypes.number
	})
};
CreateNewsFeed.defaultProps = {
	isLoading: { type: '', status: false },
	isUpdate: false,
	dataUser: {},
	handleUploadFile: null,
	handleSubmit: null,
	fetchBackgroundNewsFeed: null,
	backgroundList: [],
	optionList: {
		teamOptionList: [],
		groupOptionList: []
	},
	itemUpdate: {
		ID: 0,
		UserInformationID: 0,
		FullNameUnicode: '',
		Color: '#000',
		Avatar: '',
		RoleID: 0,
		RoleName: '',
		GroupNewsFeedID: 0,
		GroupNewsFeedName: '',
		Content: '',
		TypeFile: 0,
		isComment: false,
		CommentCount: 0,
		isLike: false,
		LikeCount: 0,
		NewsFeedFile: [],
		NewsFeedBranch: []
	},
	filtersData: {
		name: '',
		idTeam: 0,
		idGroup: 0
	}
};

const colorList = [
	'#D0021B',
	'#F5A623',
	'#F8E71C',
	'#8B572A',
	'#7ED321',
	'#417505',
	'#BD10E0',
	'#9013FE',
	'#4A90E2',
	'#50E3C2',
	'#B8E986',
	'#4A4A4A',
	'#9B9B9B',
	'#000',
	'#FFF'
];
function CreateNewsFeed(props) {
	const [isVisibleModal, setIsVisibleModal] = useState(false);
	const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
	const [chooseArea, setChooseArea] = useState('team');
	const [isShowBackgroundList, setIsShowBackgroundList] = useState(false);
	const [backgroundUrl, setBackgroundUrl] = useState('');
	const [color, setColor] = useState('#000');
	const {
		isLoading,
		isUpdate,
		itemUpdate,
		dataUser,
		handleUploadFile,
		handleSubmit,
		backgroundList,
		fetchBackgroundNewsFeed,
		optionList,
		filtersData
	} = props;
	const { teamOptionList, groupOptionList } = optionList;
	const { name, idTeam, idGroup } = filtersData;

	console.log('Option List: ', optionList);

	const defaultValuesInit = {
		Content: '',
		Color: '',
		TypeFile: 0,
		NewsFeedFile: null,
		BranchList: undefined, //TEAM
		GroupNewsFeedID: null //GROUP
	};

	const schemaBase = yup.object().shape({
		Content: yup.string().nullable(),
		Color: yup.string().nullable(),
		TypeFile: yup.number().nullable(),
		NewsFeedFile: yup.array().nullable()
	});
	const checkSchema = () => {
		if (chooseArea === 'team') {
			return yup
				.object()
				.shape({
					BranchList: yup.array().min(1, 'Bạn phải chọn ít nhất 1 trung tâm').nullable().required('Bạn không được để trống')
				})
				.concat(schemaBase);
		}
		if (chooseArea === 'group') {
			return yup
				.object()
				.shape({
					GroupNewsFeedID: yup.number().nullable().min(1, 'Bạn phải chọn ít nhất 1 nhóm').required('Bạn không được để trống')
				})
				.concat(schemaBase);
		}
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(checkSchema())
	});

	const showModal = () => {
		setIsVisibleModal(true);
	};
	const closeModal = () => {
		setIsVisibleModal(false);
	};

	const checkFetchBackgroundNewsFeed = () => {
		if (!fetchBackgroundNewsFeed) return;
		fetchBackgroundNewsFeed();
	};
	const onToggleUploadImage = () => {
		showModal();
		setIsOpenUploadFile(true);
	};
	const onToggleBackgroundList = () => {
		if (!isShowBackgroundList) {
			checkFetchBackgroundNewsFeed();
		} else {
			form.setValue('TypeFile', 0);
			form.setValue('NewsFeedFile', null);
		}
		setIsShowBackgroundList(!isShowBackgroundList);
		setIsOpenUploadFile(false);
	};

	// UPLOAD WITH BACKGROUND DO NOT ACCEPT FILE
	const toggleUploadFile = () => {
		setIsOpenUploadFile(!isOpenUploadFile);
		setIsShowBackgroundList(false);
	};
	const checkHandleUploadFile = (arrFile) => {
		if (!handleUploadFile) return;
		return handleUploadFile(arrFile);
	};

	const setChooseAreaFunc = (branch: string, value?: any) => {
		if (branch === 'group') {
			form.setValue('BranchList', undefined);
		}
		if (branch === 'team') {
			form.setValue('GroupNewsFeedID', null);
		}
		setChooseArea(branch);
	};
	const activeChooseBtn = (branch: string, chooseBranch: string) => {
		if (isUpdate && chooseBranch !== branch) return 'disable';
		if (chooseBranch === branch) return 'active';
	};
	const onChangeColor = (color) => {
		setColor(color.hex);
	};
	const onToggleSelectBranch = () => {
		showModal();
		setChooseAreaFunc('group');
	};
	const resetOption = () => {
		closeModal();
		setIsOpenUploadFile(false);
		setIsShowBackgroundList(false);
		// NEED TO STONE INFO IN TEAM OR GROUP
		if (idTeam || idGroup) {
			form.reset({
				...defaultValuesInit,
				BranchList: form.getValues('BranchList'),
				GroupNewsFeedID: form.getValues('GroupNewsFeedID')
			});
		} else {
			form.reset({ ...defaultValuesInit });
			setChooseAreaFunc('team');
		}
	};
	const checkHandleSubmit = (data) => {
		if (!handleSubmit) return;
		if (isUpdate) {
			handleSubmit(data).then((res) => {
				if (res?.status === 200) {
					closeModal();
				}
			});
			return;
		}
		handleSubmit(data).then((res) => {
			if (res?.status === 200) {
				resetOption();
			}
		});
	};

	useEffect(() => {
		const newValues: any = {
			BranchList: undefined, //TEAM
			GroupNewsFeedID: null //GROUP
		};
		// CREATE NEWS FEED IN TEAM OR GROUP DO NOT TO SELECT AGAIN
		if (idTeam) {
			newValues.BranchList = [idTeam];
			newValues.GroupNewsFeedID = null;
			setChooseAreaFunc('team');
		}
		if (idGroup) {
			newValues.GroupNewsFeedID = idGroup;
			newValues.BranchList = undefined;
			setChooseAreaFunc('group');
		}
		form.reset(newValues);
	}, [filtersData]);

	useEffect(() => {
		if (isShowBackgroundList) {
			form.setValue('Content', form.getValues('Content')?.slice(0, 191));
			if (backgroundUrl) {
				form.setValue('TypeFile', 1);
				form.setValue('NewsFeedFile', [
					{
						url: backgroundUrl,
						NameFile: backgroundUrl,
						UID: Math.floor(Math.random() * 130698)
					}
				]);
			}
		}
		if (isOpenUploadFile) {
			form.setValue('TypeFile', 2);
		}
		if (color) {
			form.setValue('Color', color);
		}
	}, [isOpenUploadFile, isShowBackgroundList, backgroundUrl, color]);

	useEffect(() => {
		if (isUpdate && typeof itemUpdate === 'object' && itemUpdate !== null) {
			const { Content, TypeFile, Color, NewsFeedFile, GroupNewsFeedID, NewsFeedBranch } = itemUpdate;
			const newValues: any = {
				ID: itemUpdate.ID,
				Content,
				TypeFile,
				Color
			};
			// COLOR
			if (Color) {
				setColor(Color);
			}
			// BACKGROUND
			if (TypeFile === 1) {
				const { NameFile } = NewsFeedFile[0];
				newValues.NewsFeedFile = [
					{
						...NewsFeedFile[0],
						url: NameFile
					}
				];
				onToggleBackgroundList();
				setBackgroundUrl(NameFile);
			}
			// FILE LIST
			if (TypeFile === 2 && Array.isArray(NewsFeedFile) && NewsFeedFile.length) {
				const typeName = { 2: 'image/*', 3: 'audio/*', 4: 'video/*' };
				newValues.NewsFeedFile = NewsFeedFile.map((f) => ({
					...f,
					uid: f.UID,
					url: f.NameFile,
					name: f.NameFile ? f.NameFile.slice(f.NameFile.lastIndexOf('/')) : '',
					type: typeName[f.Type]
				}));
				toggleUploadFile();
			}
			// BRACH
			if (Array.isArray(NewsFeedBranch) && NewsFeedBranch.length) {
				newValues.BranchList = NewsFeedBranch.map((b) => b.BranchID);
				setChooseAreaFunc('team');
			}
			// GROUP
			if (GroupNewsFeedID) {
				newValues.GroupNewsFeedID = GroupNewsFeedID;
				setChooseAreaFunc('group');
			}
			form.reset(newValues);
		}
	}, []);

	return (
		<>
			{isUpdate ? (
				<button className="btn" onClick={showModal}>
					<Edit2 />
					Chỉnh sửa bài viết
				</button>
			) : (
				<div className="create-newsfeed">
					<div className="top-nf">
						<div className="avatar">
							<img src={dataUser?.Avatar || '/images/user.jpg'} alt="avatar" />
						</div>
						<div className="box-newsfeed">
							<button className="btn-thinking" onClick={showModal}>
								Bạn đang nghĩ gì ?
							</button>
						</div>
					</div>
					<div className="bottom-nf">
						<div className="item-func">
							<button className="btn btn-light" onClick={onToggleUploadImage}>
								<Image color="#10ca93" />
								<span>Ảnh/Video</span>
							</button>
						</div>
						<div className="item-func">
							<button type="button" className={`btn ${idTeam ? 'disable' : 'btn-light'}`} onClick={onToggleSelectBranch}>
								<Users color="#ffc107" />
								<span>Chia sẻ nhóm</span>
							</button>
						</div>
						<div className="item-func">
							<button type="button" className="btn btn-light" onClick={showModal}>
								<Send color="#00afef" />
								<span>Đăng bài</span>
							</button>
						</div>
					</div>
				</div>
			)}
			<Modal
				style={{ top: 50 }}
				title="Tạo bài viết"
				visible={isVisibleModal}
				footer={null}
				onCancel={closeModal}
				className="modal-create-nf"
			>
				<div className="wrap-create-nf">
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						<div className="row">
							<div className="col-12">
								<div className="info-current-user">
									<div className="avatar">
										<img src={dataUser?.Avatar || '/images/user.jpg'} alt="" />
									</div>
									<div className="name-user">
										<p className="name">{dataUser?.FullNameUnicode}</p>
									</div>
								</div>
							</div>
							<div className={`col-12 newsfeed-control ${isShowBackgroundList ? 'have-bg' : ''}`}>
								<div
									className={`${isShowBackgroundList ? 'bg' : ''}`}
									style={{
										backgroundImage: `${isShowBackgroundList ? 'url(' + backgroundUrl + ')' : ''}`
									}}
								>
									<TextAreaField
										style={{ color: color }}
										form={form}
										name="Content"
										className="text-area-nf"
										placeholder="Bạn đang nghĩ gì ?"
										rows={4}
										autoSize={true}
										allowClear={false}
										maxLength={isShowBackgroundList ? 190 : null}
									/>
								</div>
								<div className="select-color-nf">
									<Popover
										overlayClassName="select-color-nf-popover"
										// trigger="focus"
										content={
											<div className="list-color-nf">
												<SketchPicker colors={colorList} color={color} triangle="hide" onChange={onChangeColor} />
											</div>
										}
										placement="bottomRight"
									>
										<div className="btn-color-nf">
											<img src="/images/icon-text-newsfeed.png" alt="icon" />
										</div>
									</Popover>
								</div>
							</div>
							<div className="col-12">
								<div className="select-background-nf">
									<div
										className={`btn-bg-nf ${isShowBackgroundList ? 'active' : ''} ${isUpdate ? 'disable' : ''}`}
										onClick={onToggleBackgroundList}
									>
										<img src="/images/icon-background-newsfeed.png" alt="icon" />
									</div>
									<ul className={isShowBackgroundList ? 'list-bg-nf' : 'hide'}>
										{backgroundList.length ? (
											backgroundList.map((bg, index) => (
												<li
													key={index}
													style={{ backgroundImage: `url(${bg.FileName})` }}
													onClick={(e) => setBackgroundUrl(bg.FileName)}
													className={`item-bg-nf ${backgroundUrl === bg.FileName ? 'active' : ''}`}
												/>
											))
										) : (
											<div className="loading-bg-nf">
												<Skeleton.Avatar active />
												<Skeleton.Avatar active />
												<Skeleton.Avatar active />
												<Skeleton.Avatar active />
												<Skeleton.Avatar active />
												<Skeleton.Avatar active />
												<Skeleton.Avatar active />
												<Skeleton.Avatar active />
												<Skeleton.Avatar active />
												<Skeleton.Avatar active />
											</div>
										)}
									</ul>
								</div>
							</div>

							{isOpenUploadFile && (
								<div className="col-12">
									<UploadFileField form={form} name="NewsFeedFile" max={5} handleUploadFile={checkHandleUploadFile} />
								</div>
							)}
							<div className="col-12">
								<div className="option-for-nf">
									<div className="option-for-nf--header">
										<div className="text">
											<p>Thêm vào bài viết</p>
										</div>
										<div className="list-option">
											<div className="item-option">
												<Tooltip title="Thêm Ảnh/Video">
													<div
														className={`btn ${isOpenUploadFile ? 'active' : ''} ${isUpdate ? 'disable' : ''}`}
														onClick={toggleUploadFile}
													>
														<FileImageFilled style={{ color: '#10ca93' }} />
													</div>
												</Tooltip>
											</div>
											<div className="item-option">
												<Tooltip title="Chia sẻ vào trung tâm">
													<div
														// FILTER NEWS FEED => DISABLE BUTTON IF DO NOT HAVE ID TEAM
														className={`btn ${activeChooseBtn('team', chooseArea)} ${
															!idTeam && !idGroup ? '' : idGroup ? 'disable' : ''
														}`}
														onClick={() => setChooseAreaFunc('team')}
													>
														<GroupOutlined style={{ color: '#ffc107' }} />
													</div>
												</Tooltip>
											</div>
											<div className="item-option">
												<Tooltip title="Chia sẻ vào nhóm">
													<div
														// FILTER NEWS FEED => DISABLE BUTTON IF DO NOT HAVE ID GROUP
														className={`btn ${activeChooseBtn('group', chooseArea)} ${
															!idTeam && !idGroup ? '' : idTeam ? 'disable' : ''
														}`}
														onClick={() => setChooseAreaFunc('group')}
													>
														<TeamOutlined style={{ color: '#00afef' }} />
													</div>
												</Tooltip>
											</div>
										</div>
									</div>
									<div className="option-for-nf--body">
										<div className="choose-branch">
											{chooseArea === 'team' ? (
												<SelectField
													key="BranchList"
													form={form}
													name="BranchList"
													mode="multiple"
													placeholder="Chọn trung tâm"
													optionList={idTeam ? teamOptionList.filter((t) => t.value === idTeam) : teamOptionList}
												/>
											) : (
												<SelectField
													key="GroupNewsFeedID"
													form={form}
													name="GroupNewsFeedID"
													placeholder="Chọn nhóm"
													disabled={isUpdate ? true : false}
													optionList={
														idGroup ? groupOptionList.filter((t) => t.value === idGroup) : groupOptionList
													}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="row ">
							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type === 'ADD_DATA' && isLoading.status}
								>
									{isUpdate ? 'Cập nhật' : 'Đăng'}
									{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default CreateNewsFeed;
