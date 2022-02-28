import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useExamDetail } from '~/pages/question-bank/exam-list/exam-detail/[slug]';

const { Option } = Select;

const ChangePosition = (props) => {
	const { questionID, arPosition, dataQuestion, handleChange, addOldItem } = props;
	const { getDataChange, dataChange, isChangePosition } = useExamDetail();
	const [selected, setSelected] = useState<any>(-1);
	const [flag, setFlag] = useState<any>(0);

	// ON CHANGE POSITION TO
	const onChange_PositionTo = (e) => {
		let value = parseInt(e);
		let cloneData = [...dataChange];
		if (Number.isNaN(value)) {
			value = null;
		}
		let index = dataChange.findIndex((item) => item.ID === questionID);
		cloneData[index].Index = value;
		getDataChange(cloneData);
	};

	useEffect(() => {
		if (dataChange !== undefined && dataChange !== null && dataChange.length > 0 && flag == 0) {
			setFlag(1);
			onChange_PositionTo(dataQuestion?.Index);
		}
	}, [dataChange]);

	useEffect(() => {
		if (dataQuestion?.Index !== undefined) {
			setSelected(dataQuestion?.Index);
		}
	}, [dataQuestion]);

	const remove = () => {
		addOldItem(selected);
		setSelected(-1);
	};

	const onChangeValue = (e) => {
		setSelected(e);
		onChange_PositionTo(e);
		handleChange(e, selected);
	};

	// RENDER
	return (
		<>
			{isChangePosition && (
				<>
					{arPosition && (
						<Select
							value={selected !== -1 && selected}
							placeholder="Chọn vị trí"
							style={{ width: 120 }}
							showSearch={true}
							onChange={onChangeValue}
							allowClear
							onClear={() => remove()}
						>
							{arPosition.map((item, index) => {
								return (
									<Option value={item?.value} key={index}>
										{item?.value}
									</Option>
								);
							})}
						</Select>
					)}
				</>
			)}
		</>
	);
};

export default ChangePosition;
