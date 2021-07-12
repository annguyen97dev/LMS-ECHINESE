import {SearchOutlined} from '@ant-design/icons';
import {Button, DatePicker, Input, Space} from 'antd';
import moment from 'moment';
import React, {useRef, useState} from 'react';

const TableSearch = (dataIndex, handleSearch, handleReset, type = 'text') => {
	const [isVisible, setIsVisible] = useState(false);
	const [valueSearch, setValueSearch] = useState<any>(null);
	const {RangePicker} = DatePicker;
	const inputRef = useRef<any>(null);

	const getValueSearch = (value) => {
		setValueSearch(value);
	};

	const checkHandleSearch = (...rest) => {
		if (!handleSearch) return;
		if (!valueSearch) return;
		handleSearch(...rest);
		getValueSearch(null);
		setIsVisible(false);
	};

	const checkHandleReset = () => {
		if (!handleReset) return;
		handleReset();
		getValueSearch(null);
		setIsVisible(false);
	};

	const checkType = () => {
		let fControl;
		switch (type) {
			case 'text':
				fControl = (
					<Input
						ref={inputRef}
						value={valueSearch}
						placeholder={`Search ${dataIndex}`}
						onPressEnter={(value) => checkHandleSearch(value)}
						onChange={(e) => getValueSearch(e.target.value)}
						style={{marginBottom: 8, display: 'block'}}
					/>
				);
				break;
			case 'date':
				fControl = (
					<DatePicker
						style={{marginBottom: 8, display: 'block'}}
						format="DD/MM/YYYY"
						onChange={(date, dateString) => getValueSearch(date)}
					/>
				);
				break;
			case 'date-range':
				fControl = (
					<div style={{marginBottom: 8, display: 'block'}}>
						<RangePicker
							format="DD/MM/YYYY"
							ranges={{
								Today: [moment(), moment()],
								'This Month': [
									moment().startOf('month'),
									moment().endOf('month'),
								],
							}}
							onChange={(date, dateString) => getValueSearch(date)}
						/>
					</div>
				);
				break;
			default:
				break;
		}
		return fControl;
	};
	// useEffect(() => {
	// 	console.log(isVisible);
	// 	if (isVisible) {
	// 		setTimeout(() => {
	// inputRef.current.select();
	// 		}, 100);
	// 	}
	// }, [isVisible]);
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: () => (
			<div style={{padding: 8}}>
				{checkType()}
				<Space>
					<Button
						type="primary"
						onClick={() => checkHandleSearch(valueSearch)}
						icon={<SearchOutlined />}
						size="small"
						style={{width: 90}}
					>
						Search
					</Button>
					<Button onClick={checkHandleReset} size="small" style={{width: 90}}>
						Reset
					</Button>
				</Space>
			</div>
		),
		filterDropdownVisible: isVisible,
		filterIcon: (filtered) => <SearchOutlined />,
		onFilterDropdownVisibleChange: (visible) => {
			visible ? setIsVisible(true) : setIsVisible(false);
		},
	});

	return getColumnSearchProps(dataIndex);
};

export default TableSearch;
