import React from 'react';
import { Avatar, Rate, Progress, Input, Select, List } from 'antd';
import ReactHtmlParser from 'react-html-parser';

const { Search } = Input;
const { Option } = Select;

const RenderItemFeedback = (props) => {
	const { item, data } = props;

	const isFinal = () => {
		return data.indexOf(item) == data.length - 1 ? true : false;
	};

	// RENDER
	return (
		<div className="item-fb mt-3 pb-3" style={{ borderBottomWidth: isFinal() ? 0 : 0.5 }}>
			{item.Avatar !== undefined && item.Avatar !== null && item.Avatar !== '' ? (
				<Avatar className="avatar" src={item.Avatar || '/images/user.png'} alt="avt" />
			) : (
				<Avatar className="avatar" src="/images/user.png" alt="avt" />
			)}
			<div className="main ml-3">
				<h6>{item?.FullNameUnicode}</h6>
				<Rate className="mr-3" allowHalf value={item?.RatingNumber} disabled style={{ fontSize: 14 }} />
				<span style={{ fontSize: 12 }}>Ngày: {item?.CreatedOn}</span>
				<span style={{ fontSize: 14 }}>{ReactHtmlParser(item?.RatingComment)}</span>
			</div>
		</div>
	);
};

const CourseDetailsFeedBack = (props) => {
	const { feedBack, onSearchFeedback, onFilterFeedback, getPagination, pageIndex } = props;
	console.log(feedBack.TotalRow);

	return (
		<>
			<div className="fb-header">
				<div className="number">
					<h1>
						{feedBack?.StarModel?.Average == 'NaN' || feedBack?.StarModel?.Average == NaN
							? 0
							: feedBack?.StarModel?.Average || 0}
					</h1>
					<Rate
						allowHalf
						value={
							feedBack?.StarModel?.Average == 'NaN' || feedBack?.StarModel?.Average == NaN
								? 0
								: feedBack?.StarModel?.Average || 0
						}
						disabled
						style={{ fontSize: 16 }}
					/>
					<h4>Trung Bình</h4>
				</div>
				<div className="stars ml-4 mt-3 mb-3">
					<div className="star-row">
						<Progress
							className="progress mr-3"
							strokeColor="#f53882"
							percent={
								feedBack?.StarModel?.PersentStar5 == NaN || feedBack?.StarModel?.PersentStar5 == 'NaN'
									? 0
									: feedBack?.StarModel?.PersentStar5
							}
							showInfo={false}
						/>
						<Rate className="start mr-3" allowHalf value={5} disabled />
						<span style={{ fontSize: 12 }}>
							{feedBack?.StarModel?.PersentStar5 == NaN || feedBack?.StarModel?.PersentStar5 == 'NaN'
								? 0
								: feedBack?.StarModel?.PersentStar5}
							%
						</span>
					</div>
					<div className="star-row">
						<Progress
							className="progress mr-3"
							strokeColor="#f53882"
							percent={
								feedBack?.StarModel?.PersentStar4 == NaN || feedBack?.StarModel?.PersentStar4 == 'NaN'
									? 0
									: feedBack?.StarModel?.PersentStar4
							}
							showInfo={false}
						/>
						<Rate className="start mr-3" allowHalf value={4} disabled />
						<span style={{ fontSize: 12 }}>
							{feedBack?.StarModel?.PersentStar4 == NaN || feedBack?.StarModel?.PersentStar4 == 'NaN'
								? 0
								: feedBack?.StarModel?.PersentStar4}
							%
						</span>
					</div>
					<div className="star-row">
						<Progress
							className="progress mr-3"
							strokeColor="#f53882"
							percent={
								feedBack?.StarModel?.PersentStar3 == NaN || feedBack?.StarModel?.PersentStar3 == 'NaN'
									? 0
									: feedBack?.StarModel?.PersentStar3
							}
							showInfo={false}
						/>
						<Rate className="start mr-3" allowHalf value={3} disabled />
						<span style={{ fontSize: 12 }}>
							{feedBack?.StarModel?.PersentStar3 == NaN || feedBack?.StarModel?.PersentStar3 == 'NaN'
								? 0
								: feedBack?.StarModel?.PersentStar3}
							%
						</span>
					</div>
					<div className="star-row">
						<Progress
							className="progress mr-3"
							strokeColor="#f53882"
							percent={
								feedBack?.StarModel?.PersentStar2 == NaN || feedBack?.StarModel?.PersentStar2 == 'NaN'
									? 0
									: feedBack?.StarModel?.PersentStar2
							}
							showInfo={false}
						/>
						<Rate className="start mr-3" allowHalf value={2} disabled />
						<span style={{ fontSize: 12 }}>
							{feedBack?.StarModel?.PersentStar2 == NaN || feedBack?.StarModel?.PersentStar2 == 'NaN'
								? 0
								: feedBack?.StarModel?.PersentStar2}
							%
						</span>
					</div>
					<div className="star-row">
						<Progress
							className="progress mr-3"
							strokeColor="#f53882"
							percent={
								feedBack?.StarModel?.PersentStar1 == NaN || feedBack?.StarModel?.PersentStar1 == 'NaN'
									? 0
									: feedBack?.StarModel?.PersentStar1
							}
							showInfo={false}
						/>
						<Rate className="start mr-3" allowHalf value={1} disabled />
						<span style={{ fontSize: 12 }}>
							{feedBack?.StarModel?.PersentStar1 == NaN || feedBack?.StarModel?.PersentStar1 == 'NaN'
								? 0
								: feedBack?.StarModel?.PersentStar1}
							%
						</span>
					</div>
				</div>
			</div>
			<div className="row m-0" style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
				<div style={{ flex: 1 }}>
					<Search
						className="fb-btn-search style-input"
						size="large"
						placeholder="Tìm kiếm"
						onSearch={(e) => onSearchFeedback(e)}
					/>
				</div>
				<div className="ml-3">
					<Select defaultValue="0" style={{ width: 120 }} onChange={(e) => onFilterFeedback(e)}>
						<Option value="0">Tất cả</Option>
						<Option value="1">1 sao</Option>
						<Option value="2">2 sao</Option>
						<Option value="3">3 sao</Option>
						<Option value="4">4 sao</Option>
						<Option value="5">5 sao</Option>
					</Select>
				</div>
			</div>
			<List
				pagination={{
					onChange: getPagination,
					total: feedBack.TotalRow,
					size: 'small',
					current: pageIndex,
					pageSize: 10
				}}
				header={null}
				footer={null}
				dataSource={feedBack.VideoCourseFeedBack}
				className="list-content mt-3"
				renderItem={(item) => <RenderItemFeedback item={item} data={feedBack.VideoCourseFeedBack} />}
			/>
		</>
	);
};

export default CourseDetailsFeedBack;
