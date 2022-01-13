import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Popover, Select } from 'antd';
import { useWrap } from '~/context/wrap';
import { Filter } from 'react-feather';

export default function FilterProduct(props) {
	const { onReset, productType, sortList, handleFilter } = props;
	const { showNoti } = useWrap();
	const [listFilter, setListFilter] = useState({
		ProductTypeID: null,
		sort: null,
		sortType: null
	});
	const [visible, setVisible] = useState(false);

	const { Option } = Select;

	const _onSubmit = () => {
		handleFilter(listFilter);
		setVisible(false);
	};

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={_onSubmit}>
				<div className="row">
					<div className="col-12">
						<Form.Item label="Loại sản phẩm">
							<Select
								placeholder="Chọn loại sản phẩm"
								className="style-input"
								onChange={(value) =>
									setListFilter({
										...listFilter,
										ProductTypeID: value
									})
								}
							>
								{productType.map((item, index) => (
									<Option key={index} value={item.value}>
										{item.name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>

					<div className="col-12">
						<Form.Item label="Chọn theo">
							<Select
								placeholder="Chọn theo..."
								className="style-input"
								onChange={(value, data) =>
									//@ts-ignore
									setListFilter({ ...listFilter, sort: data.title.sort, sortType: data.title.sortType })
								}
							>
								{sortList.map((item, index) => (
									<Option title={item.dataSort} key={index} value={item.value}>
										{item.text}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>

					<div className="col-md-12">
						<Form.Item className="mb-0">
							<button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
								Tìm kiếm
							</button>
							<button type="button" className="light btn btn-secondary" style={{ marginRight: '10px' }} onClick={onReset}>
								Reset
							</button>
						</Form.Item>
					</div>
				</div>
			</Form>
		</div>
	);

	const handleChangeFilter = (visible) => {
		setVisible(visible);
	};

	return (
		<>
			<Popover
				visible={visible}
				placement="bottomRight"
				content={content}
				trigger="click"
				overlayClassName="filter-popover"
				onVisibleChange={handleChangeFilter}
			>
				<button className="btn btn-secondary light btn-filter">
					<Filter />
				</button>
			</Popover>
		</>
	);
}
