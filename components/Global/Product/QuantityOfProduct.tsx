import React from 'react';

const QuantityOfProduct = (props) => {
	const { slots, setSlots } = props;
	return (
		<span className="quantity__btn-wrap">
			<span
				className="quantity-btn"
				style={{ userSelect: 'none' }}
				onClick={() => {
					if (slots > 1) {
						setSlots(slots - 1);
					}
				}}
			>
				-
			</span>
			<span className="cart__item-quantity font-weight-green">{slots}</span>
			<span
				className="quantity-btn"
				style={{ userSelect: 'none' }}
				onClick={() => {
					setSlots(slots + 1);
				}}
			>
				+
			</span>
		</span>
	);
};

export default QuantityOfProduct;
