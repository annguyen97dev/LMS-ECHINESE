import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { numberWithCommas } from '~/utils/functions';

RenderProductItem.propTypes = {
	product: PropTypes.shape({
		CreatedBy: PropTypes.string,
		CreatedOn: PropTypes.string,
		Description: PropTypes.string,
		Enable: PropTypes.bool,
		ID: PropTypes.number,
		ImageOfProducts: PropTypes.arrayOf(
			PropTypes.shape({
				ID: PropTypes.number,
				ProductID: PropTypes.number,
				Link: PropTypes.string,
				Enable: PropTypes.bool,
				isAvatar: PropTypes.bool
			})
		),
		ListedPrice: PropTypes.number,
		ModifiedBy: PropTypes.string,
		ModifiedOn: PropTypes.string,
		Name: PropTypes.string,
		Price: PropTypes.number,
		ProductTypeID: PropTypes.number,
		Quantity: PropTypes.number
	})
};
RenderProductItem.defaultProps = {};

function RenderProductItem(props) {
	const router = useRouter();
	const { product } = props;

	return (
		<>
			<div className="product row justify-content-center ">
				<>
					<div className="product__img col-12" style={{ cursor: 'pointer' }}>
						<Link
							href={{
								pathname: '/stationery/[slug]',
								query: product
							}}
						>
							<div className="product__img-wrap">
								<img
									className=""
									src={
										product.ImageOfProducts[0].Link !== ''
											? product.ImageOfProducts[0].Link
											: '/images/logo-thumnail.jpg'
									}
								/>
							</div>
						</Link>
					</div>
					<div className="product__info col-12">
						<div className="product__name limit-text">{product.Name}</div>
						<div className="product__desc">{product.Description}</div>
						<div className="product__prices">
							<div className="product__selled">Đã bán {numberWithCommas(Math.round(Math.random() + 1) * 100)}</div>
							<div className="product__price">
								<p>
									{numberWithCommas(product.Price)} đ{' '}
									<span className="product__percents">
										- {Math.round(((product.ListedPrice - product.Price) / product.ListedPrice) * 100)}%
									</span>{' '}
								</p>{' '}
							</div>
						</div>
						<button
							style={{ zIndex: 1000 }}
							className="btn btn-primary"
							onClick={() => {
								console.log('click');
							}}
						>
							Thêm vào giỏ
						</button>
					</div>
				</>
			</div>
		</>
	);
}

export default RenderProductItem;
