import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Spin, Select, Tooltip } from 'antd';
import { useForm } from 'react-hook-form';
import { districtApi } from '~/apiBase';

import { useWrap } from '~/context/wrap';
import { RotateCcw } from 'react-feather';

// type CenterFormProps = IFormBaseProps & {
//   Id?: number;
// };

const CenterForm = React.memo((props: any) => {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const { showNoti } = useWrap();
	const {
		reset,
		register,
		handleSubmit,
		control,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();
	const { Option } = Select;
	const { rowData, branchId, isLoading, _onSubmit, getIndex, dataArea } = props;
	const [form] = Form.useForm();
	// ------------ /
	const [dataDistrict, setDataDistrict] = useState<IDistrict[]>([]);
	const [loadingSelect, setLoadingSelect] = useState(false);

	// //GET DATA AREA
	// const getAllArea = () => {
	//   (async () => {
	//     try {
	//       const res = await areaApi.getAll({
	//         pageIndex: 1,
	//         pageSize: Number.MAX_SAFE_INTEGER,
	//       });
	//       res.status == 200 && setDataArea(res.data.data);
	//     } catch (err) {
	//       showNoti("danger", err);
	//     }
	//   })();
	// };

	// Get DATA DISTRICT

	const getDistrictByArea = (AreaID: number) => {
		setLoadingSelect(true);

		setDataDistrict([]);
		(async () => {
			try {
				const res = await districtApi.getByArea(AreaID);
				res.status == 200 && setDataDistrict(res.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setLoadingSelect(false);
			}
		})();
	};

	// SUBMI FORM
	const onSubmit = handleSubmit((data: any, e) => {
		let res = _onSubmit(data);

		res.then(function (rs: any) {
			rs && rs.status == 200 && (setIsModalVisible(false), form.resetFields());
		});
	});

	// ON CHANGE SELECT
	const onChangeSelect = (name) => (value) => {
		name == 'AreaID' && (form.setFieldsValue({ DistrictID: '' }), getDistrictByArea(value));
		setValue(name, value);
	};

	useEffect(() => {
		if (isModalVisible) {
			// getAllArea();

			if (branchId) {
				getIndex();
				// C???p nh???t gi?? tr??? khi show form update
				Object.keys(rowData).forEach(function (key) {
					setValue(key, rowData[key]);
				});
				form.setFieldsValue({
					...rowData,
					AreaID: rowData.AreaID,
					DistrictID: rowData.DistrictID
				});

				// load disctrict api
				rowData.AreaID && getDistrictByArea(rowData.AreaID);
			}
		}
	}, [isModalVisible]);

	return (
		<>
			{branchId ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<Tooltip title="C???p nh???t">
						<RotateCcw />
					</Tooltip>
				</button>
			) : (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					Th??m m???i
				</button>
			)}

			<Modal
				title={branchId ? 'S???a trung t??m' : 'Th??m trung t??m'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<Form.Item
									name="BranchCode"
									label="M?? trung t??m"
									rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
								>
									<Input
										placeholder=""
										className="style-input"
										onChange={(e) => setValue('BranchCode', e.target.value)}
										allowClear={true}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item
									name="BranchName"
									label="T??n trung t??m"
									rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
								>
									<Input
										placeholder=""
										className="style-input"
										onChange={(e) => setValue('BranchName', e.target.value)}
										allowClear={true}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item name="Phone" label="Phone" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
									<Input
										placeholder=""
										className="style-input"
										onChange={(e) => setValue('Phone', e.target.value)}
										allowClear={true}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item name="Email" label="Email" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
									<Input
										placeholder=""
										className="style-input"
										onChange={(e) => setValue('Email', e.target.value)}
										allowClear={true}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item name="Address" label="?????a ch???" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
									<Input
										placeholder=""
										className="style-input"
										onChange={(e) => setValue('Address', e.target.value)}
										allowClear={true}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-md-6 col-12">
								<Form.Item name="AreaID" label="T???nh" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
									<Select
										style={{ width: '100%' }}
										className="style-input"
										showSearch
										optionFilterProp="children"
										onChange={onChangeSelect('AreaID')}
									>
										{dataArea?.map((item, index) => (
											<Option key={index} value={item.AreaID}>
												{item.AreaName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>

							<div className="col-md-6 col-12">
								<Form.Item name="DistrictID" label="Qu???n" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
									<Select
										loading={loadingSelect}
										style={{ width: '100%' }}
										className="style-input"
										showSearch
										optionFilterProp="children"
										onChange={onChangeSelect('DistrictID')}
									>
										{dataDistrict?.length > 0 ? (
											dataDistrict?.map((item, index) => (
												<Option key={index} value={item.ID}>
													{item.DistrictName}
												</Option>
											))
										) : (
											<Option value={5}>...</Option>
										)}
									</Select>
								</Form.Item>
							</div>
						</div>

						<div className="col-12 mt-3">
							<button type="submit" className="btn btn-primary w-100">
								L??u
								{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
							</button>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
});

export default CenterForm;
