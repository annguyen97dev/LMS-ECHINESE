import React, { Fragment, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Tooltip,
  Select,
  Spin,
  TimePicker,
  DatePicker,
  Divider,
} from "antd";
import { RotateCcw } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import {
  areaApi,
  branchApi,
  districtApi,
  parentsApi,
  serviceApi,
  studentApi,
} from "~/apiBase";
import moment from "moment";

moment.locale("vn");

const ParentsForm = React.memo((props: any) => {
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { parentsID, reloadData, parentsDetail, currentPage } = props;
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  const [loading, setLoading] = useState(false);
  const { setValue } = useForm();
  //@ts-ignore
  const [branch, setBranch] = useState<IBranch[]>();
  const [student, setStudent] = useState<IStudent[]>();
  const [district, setDistrict] = useState<IDistrict[]>();
  const [area, setArea] = useState<IArea[]>();

  const fetchData = () => {
    (async () => {
      try {
        const _branch = await branchApi.getAll({ selectAll: true });
        // const _student = await studentApi.getAll({ selectAll: true });
        const _area = await areaApi.getAll({ selectAll: true });

        //@ts-ignore
        _branch.status == 200 && setBranch(_branch.data.data);
        //@ts-ignore
        // _student.status == 200 && setStudent(_student.data.data);
        //@ts-ignore
        _area.status == 200 && setArea(_area.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  const getDistrictByArea = (AreaID: number) => {
    (async () => {
      try {
        const res = await districtApi.getByArea(AreaID);
        res.status == 200 && setDistrict(res.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  const onChangeSelect = (name) => (value) => {
    name == "AreaID" &&
      (form.setFieldsValue({ DistrictID: "" }), getDistrictByArea(value));
    setValue(name, value);
  };

  const gender = [
    {
      id: 0,
      type: "Nữ",
    },
    {
      id: 1,
      type: "Nam",
    },
    {
      id: 2,
      type: "Khác",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    if (typeof data.Course != "undefined") {
      data.Course = data.Course.toString();
    } else {
      data.Course = "";
    }

    setLoading(true);
    if (parentsID) {
      try {
        let res = await parentsApi.update({
          ...data,
          Enable: true,
          UserInformationID: parentsID,
        });
        reloadData(currentPage);
        afterSubmit(res?.data.message);
      } catch (error) {
        showNoti("danger", error.message);
        setLoading(false);
      }
    } else {
      try {
        let res = await parentsApi.add({ ...data, Enable: true });
        afterSubmit(res?.data.message);
        reloadData(1);
        form.resetFields();
      } catch (error) {
        showNoti("danger", error.message);
        setLoading(false);
      }
    }
  };

  const afterSubmit = (mes) => {
    showNoti("success", mes);
    setLoading(false);
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (parentsDetail) {
      let arrBranch = [];
      parentsDetail.Branch.forEach((item, index) => {
        arrBranch.push(item.ID);
      });
      console.log(arrBranch);
      form.setFieldsValue({
        ...parentsDetail,
        Branch: arrBranch,
        DOB: null,
        CMNDDate: null,
      });
    }
  }, [parentsDetail]);

  return (
    <>
      {parentsID ? (
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
        title={<>{parentsID ? "Cập nhật phụ huynh" : "Tạo mới phụ huynh"}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Divider orientation="center">Thông tin cá nhân</Divider>

            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="Branch"
                  label="Trung tâm"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền đủ thông tin!",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    className="w-100 style-input"
                    placeholder="Chọn trung tâm"
                    showSearch
                    allowClear
                  >
                    {branch?.map((item) => (
                      <Option value={`${item.ID}`}>{item.BranchName}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="FullNameUnicode"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Input
                    placeholder="Họ và tên phụ huynh"
                    className="style-input"
                    onChange={(e) =>
                      setValue("FullNameUnicode", e.target.value)
                    }
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6">
                <Form.Item
                  name="Email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Input
                    allowClear
                    placeholder="Email"
                    className="style-input"
                    onChange={(e) => setValue("Email", e.target.value)}
                  />
                </Form.Item>
              </div>

              <div className="col-12 col-md-6">
                <Form.Item
                  name="Mobile"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Input
                    allowClear
                    placeholder="SĐT"
                    className="style-input"
                    onChange={(e) => setValue("Mobile", e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Giới tính" name="Gender">
                  <Select
                    className="style-input"
                    placeholder="Giới tính"
                    onChange={(value) => setValue("Gender", value)}
                    allowClear={true}
                  >
                    {gender?.map((item, index) => (
                      <Option key={index} value={item.id}>
                        {item.type}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item
                  name="DOB"
                  label="Ngày sinh"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <DatePicker
                    className="style-input"
                    onChange={(e) => setValue("DayOfExam", e)}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item
                  name="AreaID"
                  label="Tỉnh/TP"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Select
                    className="w-100 style-input"
                    placeholder="Chọn tỉnh/thành phố"
                    onChange={onChangeSelect("AreaID")}
                  >
                    {area?.map((item, index) => (
                      <Option key={index} value={item.AreaID}>
                        {item.AreaName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="col-md-6 col-12">
                <Form.Item
                  name="DistrictID"
                  label="Quận huyện"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Select
                    allowClear
                    className="w-100 style-input"
                    placeholder="Chọn quận/huyện"
                    onChange={onChangeSelect("DistrictID")}
                  >
                    {district?.map((item, index) => (
                      <Option key={index} value={item.ID}>
                        {item.DistrictName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="HouseNumber"
                  label="Số nhà - phường xã"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Input
                    allowClear
                    placeholder="Số nhà - phường xã"
                    className="style-input"
                    onChange={(e) => setValue("HouseNumber", e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>

            <Divider orientation="center">Giấy tờ tùy thân</Divider>
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="CMND"
                  label="Số CMND"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Input
                    allowClear
                    className="style-input"
                    onChange={(e) => setValue("CMND", e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="CMNDDate"
                  label="Ngày làm CMND"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <DatePicker
                    allowClear
                    className="style-input"
                    onChange={(e) => setValue("CMNDDate", e)}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="CMNDRegister"
                  label="Nơi làm CMND"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Input
                    allowClear
                    className="style-input"
                    onChange={(e) => setValue("CMNDRegister", e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>

            {parentsID ? (
              <Fragment>
                <Divider orientation="center">Tài khoản</Divider>
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="UserName"
                      label="Tên tài khoản"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền đủ thông tin!",
                        },
                      ]}
                    >
                      <Input
                        allowClear
                        className="style-input"
                        onChange={(e) =>
                          setValue("HouseNumber", e.target.value)
                        }
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="Password"
                      label="Mật khẩu"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền đủ thông tin!",
                        },
                      ]}
                    >
                      <Input
                        allowClear
                        type="password"
                        className="style-input"
                        onChange={(e) => setValue("Password", e.target.value)}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Fragment>
            ) : (
              <Fragment></Fragment>
            )}

            <div className="row ">
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
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

export default ParentsForm;
