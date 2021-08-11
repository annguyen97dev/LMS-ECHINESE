//@ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Tooltip,
  Select,
  Spin,
  TimePicker,
  DatePicker,
  InputNumber,
  Divider,
} from "antd";
import { CreditCard, Move, RotateCcw } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import { branchApi, serviceApi } from "~/apiBase";
import moment from "moment";
import { examServiceApi } from "~/apiBase/options/examServices";
import { paymentMethodApi } from "~/apiBase/options/payment-method";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";

const ChangeCourseForm = React.memo((props: any) => {
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { infoId, reloadData, infoDetail, currentPage } = props;
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  const [loading, setLoading] = useState(false);
  const { setValue } = useForm();
  const [courseStudentPrice, setCourseStudentPrice] = useState(null);

  const fetchData = () => {
    (async () => {
      try {
        const _courseStudentPrice = await courseStudentPriceApi.getDetail(
          infoDetail.CourseOfStudentPriceID
        );
        _courseStudentPrice.status == 200 &&
          setCourseStudentPrice(_courseStudentPrice.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  // const onSubmit = async (data: any) => {
  //   setLoading(true);
  //   if (infoId) {
  //     try {
  //       let res = await courseStudentPriceApi.update({
  //         ...data,
  //         Enable: true,
  //         ID: infoId,
  //       });
  //       reloadData(currentPage);
  //       afterSubmit(res?.data.message);
  //     } catch (error) {
  //       showNoti("danger", error.message);
  //       setLoading(false);
  //     }
  //   } else {
  //     try {
  //       let res = await courseStudentPriceApi.add({ ...data, Enable: true });
  //       afterSubmit(res?.data.message);
  //       reloadData(1);
  //       form.resetFields();
  //     } catch (error) {
  //       showNoti("danger", error.message);
  //       setLoading(false);
  //     }
  //   }
  // };

  const afterSubmit = (mes) => {
    showNoti("success", mes);
    setLoading(false);
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchData();
      if (infoDetail) {
        form.setFieldsValue({
          ...infoDetail,
        });
      }
    }
  }, [isModalVisible]);

  return (
    <>
      <button
        className="btn btn-icon edit"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        <Tooltip title="Chuyển khóa">
          <Move />
        </Tooltip>
      </button>
      <Modal
        title="Chuyển khóa"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form
            form={form}
            layout="vertical"
            // onFinish={onSubmit}
          >
            <Divider orientation="center">Thông tin khóa hiện tại</Divider>
            <div className="row">
              <div className="col-12">
                <Form.Item name="FullNameUnicode" label="Học viên">
                  <Input
                    disabled
                    className="style-input"
                    onChange={(e) =>
                      setValue("FullNameUnicode", e.target.value)
                    }
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item name="CourseIDBefore" label="Trung tâm">
                  <Select
                    style={{ width: "100%" }}
                    className="style-input"
                    disabled
                    defaultValue={infoDetail.CourseID}
                  >
                    <Option value={infoDetail.CourseID}>
                      {infoDetail.CourseName}
                    </Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            {courseStudentPrice != null && (
              <>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Form.Item label="Giá tiền">
                      <Input
                        defaultValue={Intl.NumberFormat("ja-JP").format(
                          courseStudentPrice.Price
                        )}
                        disabled
                        className="style-input"
                      />
                    </Form.Item>
                  </div>

                  <div className="col-md-6 col-12">
                    <Form.Item label="Giảm giá">
                      <Input
                        defaultValue={Intl.NumberFormat("ja-JP").format(
                          courseStudentPrice.Reduced
                        )}
                        disabled
                        className="style-input"
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-12">
                    <Form.Item label="Đã đóng">
                      <Input
                        defaultValue={Intl.NumberFormat("ja-JP").format(
                          courseStudentPrice.Paid
                        )}
                        disabled
                        className="style-input"
                      />
                    </Form.Item>
                  </div>

                  <div className="col-md-6 col-12">
                    <Form.Item label="Còn lại">
                      <Input
                        defaultValue={Intl.NumberFormat("ja-JP").format(
                          courseStudentPrice.MoneyInDebt
                        )}
                        disabled
                        className="style-input"
                      />
                    </Form.Item>
                  </div>
                </div>
              </>
            )}

            {/* <div className="row">
              <div className="col-12 col-md-6">
                <Form.Item
                  name="Paid"
                  label="Thanh toán"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <InputNumber
                    defaultValue={"0"}
                    className="ant-input style-input w-100"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    //@ts-ignore
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    onChange={(value) => setValue("Paid", value)}
                  />
                </Form.Item>
              </div>

              <div className="col-12 col-md-6">
                <Form.Item
                  name="PaymentMethodsID"
                  label="Hình thức thanh toán"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Select
                    className="w-100 style-input"
                    placeholder="Chọn hình thức thanh toán"
                  >
                    {paymentMethod?.map((item, index) => (
                      <Option key={index} value={item.ID}>
                        {item.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6">
                <Form.Item
                  name="PayBranchID"
                  label="Trung tâm thanh toán"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Select
                    className="w-100 style-input"
                    placeholder="Chọn trung tâm thanh toán"
                  >
                    {payBranch?.map((item, index) => (
                      <Option key={index} value={item.ID}>
                        {item.BranchName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  name="PayDate"
                  label="Ngày thu tiếp theo"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <DatePicker
                    className="style-input"
                    onChange={(e) => setValue("PayDate", e)}
                  />
                </Form.Item>
              </div>
            </div> */}
            {/*  */}

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

export default ChangeCourseForm;
