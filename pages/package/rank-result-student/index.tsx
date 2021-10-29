import { Card } from 'antd';
import React, { useState } from 'react';
import RankResult from '~/components/Global/Package/RankResult/RankResult';
import LayoutBase from '~/components/LayoutBase';

const RankResultStudentPage = () => {
	const [dataDetail, setDataDetail] = useState(null);

	console.log('data detaiL: ', dataDetail);

	return (
		<>
			<div className="container-fuild">
				<div className="row">
					<div className="col-md-8 col-12">
						<RankResult isStudent={true} getDataDeital={(data) => setDataDetail(data)} />
					</div>
					<div className="col-md-4 col-12">
						<Card className="rank-user">
							<div className="rank-user-detail">
								<div className="rank-user__rank">
									<h6 className="text-center title-rank">Thứ hạng của bạn</h6>
									{!dataDetail ? (
										<p className="mt-3 mb-0 font-weight-bold text-center">Vui lòng chọn đề thi</p>
									) : (
										<>
											<div className="box-rank">{dataDetail.Rank}</div>
											<p className="text-point">Điểm: {dataDetail.Point}</p>
										</>
									)}
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

RankResultStudentPage.layout = LayoutBase;
export default RankResultStudentPage;
