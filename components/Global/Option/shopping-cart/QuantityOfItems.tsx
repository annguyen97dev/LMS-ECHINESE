import React, { useState, useEffect } from 'react';

const QuantityOfItems = (props) => {
	const { item, index, decreseItem, increseItem, setClickedItem } = props;
	const [count, setCount] = useState(item.Quantity);

	return (
		<div key={index}>
			<span
				className="quantity-btn"
				style={{ userSelect: 'none' }}
				onClick={() => {
					decreseItem(item.ID, count);
					console.log(count);
					setClickedItem(item.ID);
					if (count === 1) {
						setCount(1);
					} else {
						setCount(count - 1);
					}
				}}
			>
				-
			</span>
			<span className="cart__item-quantity font-weight-green">{count}</span>
			<span
				className="quantity-btn"
				style={{ userSelect: 'none' }}
				onClick={() => {
					increseItem(item.ID, count);
					setClickedItem(item.ID);
					setCount(count + 1);
				}}
			>
				+
			</span>
		</div>
	);
};

export default QuantityOfItems;
