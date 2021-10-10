import {Image} from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.min.css';
import {numberWithCommas} from '~/utils/functions';
import PackageStoreForm from '../Package/PackageStore/PackageStoreForm/PackageStoreForm';

TopPackageNewsFeed.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	topPackageList: PropTypes.array,
	handleBuyPackage: PropTypes.func,
};
TopPackageNewsFeed.defaultProps = {
	isLoading: {type: '', status: false},
	topPackageList: [],
	handleBuyPackage: null,
};

function TopPackageNewsFeed(props) {
	const {isLoading, topPackageList, handleBuyPackage} = props;

	return (
		<Swiper
			className="nf-package-wrap"
			spaceBetween={15}
			slidesPerView={2}
			slidesPerGroup={2}
			loop
			observer
			observeParents
			observeSlideChildren
			watchSlidesProgress
			breakpoints={{
				320: {
					slidesPerView: 1,
					slidesPerGroup: 1,
				},
				1600: {
					slidesPerView: 2,
					slidesPerGroup: 2,
				},
			}}
		>
			{topPackageList.map((p: IPackage, idx) => {
				const {Type, TypeName, Description, Level, Price, Name, Avatar} = p;
				return (
					<SwiperSlide key={idx}>
						<div className="nf-package">
							<div className="img">
								<Image
									width="100%"
									height="100%"
									src={Avatar}
									title="Ảnh bìa bộ đề"
									alt="Ảnh bìa bộ đề"
									style={{objectFit: 'cover'}}
								/>
							</div>
							<div className="content">
								<h6 className="title">{Name}</h6>
								<ul className="list">
									<li>
										Level:<span>HSK {Level}</span>
									</li>
									<li className="price">
										Giá:<span>{numberWithCommas(Price)} VNĐ</span>
									</li>
									<li className="desc">
										Mô tả:<span>{Description || 'Mô tả trống'}</span>
									</li>
								</ul>
								<PackageStoreForm
									isLoading={isLoading}
									packageItem={p}
									handleSubmit={handleBuyPackage}
								/>
							</div>
						</div>
					</SwiperSlide>
				);
			})}
		</Swiper>
	);
}

export default TopPackageNewsFeed;
