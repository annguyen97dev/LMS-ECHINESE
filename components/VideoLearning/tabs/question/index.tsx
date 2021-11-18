import React, { FC, useState } from 'react';
import 'antd/dist/antd.css';
import { List, Avatar, Form, Button, Input, Tooltip } from 'antd';
import { useWrap } from '~/context/wrap';

const { TextArea } = Input;

type props = {
	params: any[];
	addNew: any;
	onEdit: any;
};

// MY EDITOR - TEXTAREA
const Editor = ({ onChange, onSubmit, onSubmitEdit, submitting, value, type, setType }) => (
	<>
		<Form.Item>
			<TextArea placeholder="Nội dung" rows={4} onChange={onChange} value={value} />
		</Form.Item>
		<Form.Item>
			<Button htmlType="submit" loading={submitting} onClick={type === 0 ? onSubmit : onSubmitEdit} type="primary">
				{type === 0 ? 'Thêm câu hỏi' : 'Lưu thay đổi'}
			</Button>
		</Form.Item>
	</>
);

// CONVERT DATE TO H:M DD-MM-YYYY
const getDateString = (date) => {
	const newDate = new Date(date);
	return (
		newDate.getHours() +
		':' +
		newDate.getMinutes() +
		' ' +
		getNumber(newDate.getDate()) +
		'-' +
		getNumber(newDate.getMonth() + 1) +
		'-' +
		getNumber(newDate.getFullYear())
	);
};

const getNumber = (num) => {
	return num > 9 ? num : '0' + num;
};

// RENDER ITEM QUESTION
const RenderItem = ({ item, onEdit, userInformation }: { item: any; onEdit: any; userInformation: any }) => {
	return (
		<div className="m-3 wrap-render-item-quest">
			<Avatar className="avatar custom-avt" src={item.AuthorAvatar} />
			<div className="ml-3 comment">
				<div className="m-0 row vl-t-sb">
					<p className="title">{item.Title}</p>
					<div className="row mr-1 ml-3 vocab-item__menu">
						{userInformation.UserInformationID == item.AuthorID && (
							<Tooltip title="Sửa">
								<button
									onClick={() => {
										onEdit(item);
									}}
									className="btn btn-icon edit"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 26 26"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
									</svg>
								</button>
							</Tooltip>
						)}

						{/* <Tooltip title="Xóa">
							<button
								onClick={() => {
									// onDelete(item);
								}}
								className="btn btn-icon delete"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 26 26"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="3 6 5 6 21 6"></polyline>
									<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
									<line x1="10" y1="11" x2="10" y2="17"></line>
									<line x1="14" y1="11" x2="14" y2="17"></line>
								</svg>
							</button>
						</Tooltip> */}
					</div>
				</div>
				<p className="content">{item.TextContent}</p>
				<span className="date">
					<span className="name">{item.AuthorName}</span> {' - '}
					{getDateString(item.CreatedDate)}
				</span>
			</div>
		</div>
	);
};

const VideoQuestion: FC<props> = ({ params, addNew, onEdit }) => {
	const { userInformation } = useWrap();
	const [comment, setComment] = useState('');
	const [title, setTile] = useState('');
	const [type, setType] = useState(0);
	const [editItem, setEditItem] = useState('');

	// ONEDIT
	const edit = (param) => {
		setEditItem(param);
		setType(1);
		setTile(param.Title);
		setComment(param.TextContent);
	};

	// RENDER
	return (
		<div className="wrap-question pr-3">
			<div className="wrap-question__container">
				<span className="ml-3 wrap-question__title">Tất cả câu hỏi ({params.length})</span>
				<List
					className="mt-3"
					itemLayout="horizontal"
					dataSource={params}
					pagination={{
						pageSize: 10
					}}
					renderItem={(item) => <RenderItem item={item} onEdit={edit} userInformation={userInformation} />}
				/>
				<div className="ml-3 mt-4">
					<Input
						value={title}
						onChange={(t) => {
							setTile(t.target.value);
						}}
						className="mb-3"
						placeholder="Tiêu đề"
					/>
					<Editor
						onChange={(t) => {
							setComment(t.target.value);
						}}
						onSubmit={() => {
							addNew({ comment: comment, title: title });
							setComment('');
							setTile('');
						}}
						submitting={false}
						value={comment}
						type={type}
						setType={setType}
						onSubmitEdit={() => {
							onEdit({ item: editItem, title: title, content: comment });
							setTile('');
							setComment('');
							setType(0);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default VideoQuestion;
