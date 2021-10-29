import { Card, Select, Input } from 'antd';

export default function SearchBox(props) {
	const { placeholder, handleSearch } = props;
	const { Search } = Input;
	const onSearch = (value) => handleSearch && handleSearch(value);
	return (
		<Search placeholder={placeholder ? placeholder : 'Search...'} onSearch={onSearch} className="btn-search style-input" size="large" />
	);
}
