import { Card, Checkbox, DatePicker, Form, Select, Spin, Table, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useWrap } from '~/context/wrap';
import { Modal } from 'antd';
import { RotateCcw } from 'react-feather';
import ConfirmAssignModal from './Teacher/ConfirmAssignModal';
import { teacherApi } from '~/apiBase';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const { TabPane } = Tabs;

const TeacherProfile = (props) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState({ type: '', status: false });
	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();
	const { showNoti } = useWrap();

	// --- GET DATA USER
	// let dataUser = null;
	// if (props.dataUser) {
	//   dataUser = props.dataUser;
	// }
	const { dataUser, isLoading, updateTeacherID, userID, dataSubject, updateTeacherForSubject, onFetchData } = props;
	const { Option } = Select;

	const onSubmit = handleSubmit((data) => {
		console.log('Data submit:', data);
		if (Object.keys(data).length === 1) {
			showNoti('danger', 'Bạn chưa chỉnh sửa');
		} else {
			let res = updateTeacherID(data);
			res.then(function (rs: any) {
				rs && rs.status == 200;
			});
		}
	});

	const columns = [
		{
			title: 'Tên Chương trình học',
			width: 200,
			dataIndex: 'ProgramName',
			render: (text) => <p className="font-weight-primary">{text}</p>
		},

		{
			title: 'Trạng thái',
			width: 150,
			dataIndex: 'IsSelected',
			render: (text, data) => (
				<p className={data.IsSelected ? 'tag green' : 'tag red'}>{data.IsSelected ? 'Dạy tất cả' : 'Không được dạy tất cả'}</p>
			)
		},

		{
			title: 'Thao tác',
			width: 100,
			render: (text, data) => {
				return (
					<>
						<ConfirmAssignModal data={data} _onSubmit={(info) => handleSubmitAssignment(info)} loading={loading} />
					</>
				);
			}
		}
	];

	const handleSubmitAssignment = async (info) => {
		setLoading({ type: 'ASSIGN_TEACHER', status: true });
		try {
			let res = await teacherApi.updateTeacherForAllSubject({
				teacherId: userID,
				programId: info.key,
				IsSelected: info.IsSelected ? false : true
			});
			if (res.status === 200) {
				showNoti('success', 'Thay đổi thành công!');
				onFetchData && onFetchData();
				return true;
			}
			if (res.status === 204) {
				showNoti('danger', 'Chưa có môn học trong chương trình này!');
				onFetchData && onFetchData();
				return true;
			}
		} catch (error) {
		} finally {
			setLoading({ type: 'ASSIGN_TEACHER', status: false });
		}
	};

	const expandedRowRender = (record) => {
		const columns = [];
		const data = [
			{
				Subject: 'Subject'
			}
		];

		for (let i = 0; i < Object.keys(record.Subject).length; i++) {
			columns.push({
				key: record.Subject[i].SubjectID,
				title: record.Subject[i].SubjectName,
				dataIndex: 'Subject',
				render: () => (
					<Checkbox
						value={record.Subject[i].SubjectID}
						checked={record.Subject[i].IsSelected ? true : false}
						onChange={onChangeCheckBox}
					/>
				)
			});
		}

		const onChangeCheckBox = (e) => {
			// console.log(`checked = ${e.target.value}`);
			const data = {
				UserInformationID: userID,
				SubjectID: e.target.value
			};
			let res = updateTeacherForSubject(data);
			res.then(function (rs: any) {
				rs && rs.status == 200;
			});
		};

		if (Object.keys(record.Subject).length) {
			return (
				<div className="mini-table">
					<Table columns={columns} dataSource={data} pagination={false} className="tb-expand" />
				</div>
			);
		} else {
			return <p>Chưa có môn học</p>;
		}
	};

	useEffect(() => {
		setValue('UserInformationID', userID);
	}, []);

	if (isLoading.status == true) {
		return (
			<>
				<Card className="space-top-card text-center">
					<Spin></Spin>
				</Card>
			</>
		);
	} else {
		return (
			<>
				<Card className="space-top-card">
					<Tabs defaultActiveKey="1">
						{/* <TabPane tab="Tài khoản nhân viên" key="1">
              <div className="row justify-content-center">
                <div className="col-md-8 col-12">
                  <Form form={form} layout="vertical" onFinish={onSubmit}>
                    <div className="row">
                      <div className="col-md-4 col-12">
                        <Form.Item
                          label="Họ và tên"
                          name="họ và tên"
                          initialValue={dataUser?.FullNameUnicode}
                        >
                          <Input
                            className="style-input"
                            size="large"
                            onChange={(e) =>
                              setValue("FullNameUnicode", e.target.value)
                            }
                          />
                        </Form.Item>
                      </div>
                      <div className="col-md-4 col-12">
                        <Form.Item
                          label="Giới tính"
                          name="Giới tính"
                          initialValue={dataUser?.Gender == 0 ? "Nữ" : "Nam"}
                        >
                          <Select
                            className="style-input"
                            size="large"
                            onChange={(value) => setValue("Gender", value)}
                          >
                            <Option value={0}>Nữ</Option>
                            <Option value={1}>Nam</Option>
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="col-md-4 col-12">
                        <Form.Item
                          label="Ngày sinh"
                          name="DOB"
                          initialValue={moment(dataUser?.DOB)}
                        >
                          <DatePicker
                            className="style-input"
                            format={dateFormat}
                            onChange={(date, dateString) =>
                              setValue("DOB", dateString)
                            }
                          ></DatePicker>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-12">
                        <Form.Item
                          label="Địa chỉ email"
                          name="Địa chỉ email"
                          initialValue={dataUser?.Email}
                        >
                          <Input
                            className="style-input"
                            size="large"
                            onChange={(e) => setValue("Email", e.target.value)}
                          />
                        </Form.Item>
                      </div>
                      <div className="col-md-6 col-12">
                        <Form.Item
                          label="Số điện thoại"
                          name="Số điện thoại"
                          initialValue={dataUser?.Mobile}
                        >
                          <Input
                            className="style-input"
                            size="large"
                            onChange={(e) => setValue("Mobile", e.target.value)}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <Form.Item
                          label="Địa chỉ"
                          name="Địa chỉ"
                          initialValue={dataUser?.Address}
                        >
                          <Input
                            className="style-input"
                            size="large"
                            onChange={(e) =>
                              setValue("Address", e.target.value)
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <Form.Item label="Hình đại diện">
                          <ImgCrop grid>
                            <AvatarBase
                              imageUrl={dataUser?.Avatar}
                              getValue={(value) => setValue("Avatar", value)}
                            />
                          </ImgCrop>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center">
                        <button className="btn btn-primary" type="submit">
                          Cập nhật thông tin
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </TabPane> */}
						<TabPane tab="Thông tin lớp học" key="2">
							<div className="row justify-content-center">
								<div className="col-md-8 col-12">
									<div className="wrap-table table-expand">
										<Table
											className="teacher-detail-table"
											dataSource={dataSubject}
											columns={columns}
											size="middle"
											scroll={{ x: 600 }}
											expandable={{
												expandedRowRender: (record) => expandedRowRender(record)
											}}
											pagination={false}
										/>
									</div>
								</div>
							</div>
						</TabPane>
					</Tabs>
				</Card>
			</>
		);
	}
};

export default TeacherProfile;
