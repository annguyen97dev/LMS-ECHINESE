import { Form, Modal, Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'react-feather';
import { idiomsApi } from '~/apiBase/options/idioms';
import EditorBase from '~/components/Elements/EditorBase';
import { useWrap } from '~/context/wrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import EditorField from '~/components/FormControl/EditorField';

const IdiomsForm = React.memo((props: any) => {
	const { idiomsId, reloadData, idiomsDetail, currentPage } = props;
	const { setValue } = useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);
	const [idiomsInput, setIdiomsInput] = useState();
	const [isReset, setIsReset] = useState(false);

	const defaultValuesInit = {
		Idioms: ''
	};
	const schema = yup.object().shape({
		Idioms: yup.string().required('Bạn không được để trống')
	});
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});
	console.log(idiomsInput);

	const onSubmit = async (data: any) => {
		console.log(data);
		setLoading(true);
		if (idiomsId) {
			try {
				let res = await idiomsApi.update({
					...data,
					ID: idiomsId,
					Idioms: idiomsInput
				});
				afterSubmit(res?.data.message);
				reloadData(currentPage);
			} catch (error) {
				showNoti('danger', error.message);
				setLoading(false);
			}
		} else {
			try {
				let res = await idiomsApi.add({
					...data,
					Enable: true,
					Idioms: idiomsInput
				});
				if (res.status === 200) {
					form.reset({
						Idioms: ''
					});
				}
				afterSubmit(res?.data.message);
				reloadData(1);
				setIdiomsInput(null);
				setIsReset(true);
			} catch (error) {
				showNoti('danger', error.message);
				setLoading(false);
			}
		}
	};

	const afterSubmit = (mes) => {
		showNoti('success', mes);
		setLoading(false);
		setIsModalVisible(false);
	};

	useEffect(() => {
		if (idiomsDetail) {
			form.setValue('Idioms', idiomsDetail.Idioms);
			console.log(idiomsDetail.Idioms);
		}
	}, [isModalVisible]);

	return (
		<>
			{idiomsId ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<Tooltip title="Cập nhật">
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
					Thêm mới
				</button>
			)}

			<Modal
				width={800}
				title={<>{idiomsId ? 'Cập nhật' : 'Thêm mới'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<EditorField
									form={form}
									label="Câu thành ngữ"
									name="Idioms"
									// content={idiomsDetail ? idiomsDetail.Idioms : idiomsInput}
									handleChange={(value) => setIdiomsInput(value)}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12 text-center">
								<button type="submit" className="btn btn-primary">
									Lưu
									{loading == true && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
});

export default IdiomsForm;
