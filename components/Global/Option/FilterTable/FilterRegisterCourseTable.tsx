import { DatePicker, Form, Popover, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { Filter } from 'react-feather';
import { useForm } from 'react-hook-form';
import { supplierApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';

const dateFormat = 'YYYY/MM/DD';

const { RangePicker } = DatePicker;

const FilterRegisterCourseTable = (props: any) => {
	const [showFilter, setShowFilter] = useState(false);
	const { Option } = Select;
	const [supplierServices, setSupplierServices] = useState<ISupplier>();
	// const { listData } = useCatalogue();
	// console.log(listData);
	const { showNoti } = useWrap();
	const [form] = Form.useForm();

	const fetchData = () => {
		(async () => {
			try {
				const res = await supplierApi.getAll({ selectAll: true });
				// @ts-ignore
				res.status == 200 && setSupplierServices(res.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			}
		})();
	};

	useEffect(() => {
		fetchData();
	}, [showFilter]);

	console.log(supplierServices);

	const {
		handleSubmit,
		setValue,
		reset,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();

	const onSubmit = handleSubmit((data: any) => {
		props._onFilter(data);
		setShowFilter(false);
	});

	const examServiceType = [
		{
			id: 1,
			type: 'Thi thật'
		},
		{
			id: 2,
			type: 'Thi thử'
		}
	];

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={onSubmit} form={form}>
				<div className="row">
					<div className="col-md-12">
						<Form.Item label="Nhà cung cấp">
							<Select
								className="style-input"
								placeholder="Nhà cung cấp"
								onChange={(value) => setValue('SupplierServicesID', value)}
								allowClear={true}
							>
								{supplierServices?.map((item, index) => (
									<Option key={index} value={item.ID}>
										{item.SupplierName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>

					<div className="col-md-12">
						<Form.Item label="Hình thức thi">
							<Select
								className="style-input"
								placeholder="Chọn hình thức thi"
								onChange={(value) => setValue('ExamOfServiceStyle', value)}
								allowClear={true}
							>
								{examServiceType?.map((item, index) => (
									<Option key={index} value={item.id}>
										{item.type}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>

					<div className="col-md-12">
						<Form.Item label="Ngày thi" name="DayOfExam">
							<RangePicker
								format={dateFormat}
								className="style-input"
								allowClear={true}
								onChange={(value, dateStrings) => {
									setValue('fromDate', dateStrings[0]);
									setValue('toDate', dateStrings[1]);
								}}
							/>
						</Form.Item>
					</div>

					<div className="col-md-12">
						<div className="d-flex">
							<div>
								<Form.Item className="mb-0">
									<button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={onSubmit}>
										Tìm kiếm
									</button>
								</Form.Item>
							</div>

							<div>
								<button
									className="btn btn-info"
									style={{ marginRight: '10px' }}
									onClick={() => {
										form.resetFields();
										reset();
										props.reloadData();
									}}
								>
									Bỏ lọc
								</button>
							</div>
						</div>
					</div>
				</div>
			</Form>
		</div>
	);

	return (
		<>
			<div className="wrap-filter-parent">
				<Popover visible={showFilter} placement="bottomRight" content={content} trigger="click" overlayClassName="filter-popover">
					<button
						className="btn btn-secondary light btn-filter"
						onClick={() => {
							showFilter ? setShowFilter(false) : setShowFilter(true);
						}}
					>
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	);
};

export default FilterRegisterCourseTable;
