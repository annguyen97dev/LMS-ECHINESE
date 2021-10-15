import React, {useEffect, useState} from 'react';
import TitlePage from '~/components/Elements/TitlePage';
import Link from 'next/link';
import {Card, Tooltip} from 'antd';
import LayoutBase from '~/components/LayoutBase';
import {dataZoom} from '~/lib/zoom-manager';
import {Copy} from 'react-feather';
import MeetingStaff from '~/components/Global/ManageZoom/MeetingStaff';
import MeetingIntervalForm from '~/components/Global/ManageZoom/MeetingIntervalForm';

const MeetingInternal = () => {
	return (
		<div className="row zoom-interval">
			<div className="col-12">
				<TitlePage title="Phòng họp nội bộ" />
				<Card
					className="card-zoom-wrap"
					extra={
						<>
							<MeetingIntervalForm />
						</>
					}
				>
					<div className="ant-card-body-list">
						{dataZoom?.map((item, index) => {
							return (
								<div className="wrap-zoom" key={item.id}>
									<div className="row">
										<div className="col-2 image-wrap" style={{width: '150px'}}>
											<div className="zoom-image">
												<a>
													<img src={item.image} alt="zoom-image" />
												</a>
											</div>
										</div>

										<div className="col-9">
											<div className="row ">
												<div className="col-12 d-md-flex d-inline">
													<span className="tag green">Đang mở</span>
													<h5 className="zoom-title">{item.title}</h5>
												</div>
											</div>

											<div className="row pt-4 zoom-content">
												<div className="col-10">
													<div className="row">
														<div className="col-md-4 col-sm-12 col-12">
															<i className="far fa-user-plus zoom-icons" />
															<span>Người tạo: {item.creator}</span>
														</div>
														<div className="col-md-4 col-sm-12 col-12">
															<i className=" far fa-calendar-alt zoom-icons" />
															<span> Ngày tạo: {item.date}</span>
														</div>
														<div className="col-md-4 col-sm-12 col-12">
															<i className="far fa-play zoom-icons" />
															<span> Lịch diễn ra: {item.dateMeeting}</span>
														</div>
													</div>

													<div className="row pt-2">
														<div className="col-md-4 col-sm-12 col-12">
															<i className="far fa-pause-circle zoom-icons" />
															<span>Kết thúc lúc: {item.endTime}</span>
														</div>

														<div className="col-md-4 col-sm-12 col-12">
															<i className="far fa-home zoom-icons" />
															<span>ID Phòng: {item.idRoom}</span>
														</div>

														<div className="col-md-4 col-sm-12 col-12">
															<i className="far fa-unlock-alt zoom-icons" />
															<span>Mật khẩu: {item.pass}</span>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div className="col-1 d-flex">
											<span>
												<Tooltip title="Sao chép link lớp học">
													<button
														className="btn btn-icon"
														style={{
															marginLeft: '1.5rem',
															paddingTop: '0px',
														}}
													>
														<Copy style={{color: 'blueviolet'}} />
													</button>
												</Tooltip>
											</span>
											<span>
												<MeetingStaff />
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</Card>
			</div>
		</div>
	);
};

MeetingInternal.layout = LayoutBase;
export default MeetingInternal;
