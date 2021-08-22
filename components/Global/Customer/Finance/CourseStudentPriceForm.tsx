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
} from "antd";
import { CreditCard, RotateCcw } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import { branchApi, serviceApi } from "~/apiBase";
import moment from "moment";
import { examServiceApi } from "~/apiBase/options/examServices";
import { paymentMethodApi } from "~/apiBase/options/payment-method";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";

const CourseOfStudentPriceForm = React.memo((props: any) => {
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { infoId, reloadData, infoDetail, currentPage } = props;
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setValue } = useForm();

  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod[]>();
  const [payBranch, setPayBranch] = useState<IBranch[]>();

  const fetchData = () => {
    setIsLoading(true);
    (async () => {
      try {
        const _paymentMethod = await paymentMethodApi.getAll({});

        const _payBranch = await branchApi.getAll({
          pageSize: 99999,
          pageIndex: 1,
        });

        _paymentMethod.status == 200 &&
          // @ts-ignore
          setPaymentMethod(_paymentMethod.data.data);
        //@ts-ignore
        _payBranch.status == 200 && setPayBranch(_payBranch.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (infoId) {
      try {
        let res = await courseStudentPriceApi.update({
          ...data,
          Enable: true,
          ID: infoId,
        });
        reloadData(currentPage);
        afterSubmit(res?.data.message);
      } catch (error) {
        showNoti("danger", error.message);
        setLoading(false);
      }
    } else {
      try {
        let res = await courseStudentPriceApi.add({ ...data, Enable: true });
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
    if (isModalVisible == true) {
      fetchData();
      if (infoDetail) {
        form.setFieldsValue({
          ...infoDetail,
          Paid: null,
          PayDate: null,
          payBranch: null,
        });
      }
    }
  }, [isModalVisible]);

  return (
    <>
      {infoId ? (
        <button
          className="btn btn-icon edit"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <Tooltip title="Thanh toán học phí">
            <CreditCard />
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
        title={<>{infoId ? "Thanh toán học phí" : "Học viên nợ học phí"}</>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12 col-md-6">
                <Form.Item name="FullNameUnicode" label="Học viên">
                  <Input
                    value={infoDetail.FullNameUnicode}
                    readOnly={true}
                    className="style-input"
                    // onChange={(e) =>
                    //   setValue("FullNameUnicode", e.target.value)
                    // }
                  />
                </Form.Item>
              </div>

              <div className="col-12 col-md-6">
                <Form.Item name="MoneyInDebt" label="Số tiền còn lại">
                  <InputNumber
                    value={infoDetail.MoneyInDebt}
                    readOnly={true}
                    className="ant-input style-input w-100"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    // onChange={(value) => setValue("MoneyInDebt", value)}
                  />
                </Form.Item>
              </div>
            </div>

            {/* <div className="row">
              <div className="col-12">
                <Form.Item
                  name="Course"
                  label="Khóa học"
                  initialValue={infoDetail.Course.CourseName}
                >
                  <Select className="w-100 style-input" mode="multiple">
                    {course.map((x) => {
                      <Option value={x.ID}>{x.CourseName}</Option>;
                    })}
                  </Select>
                </Form.Item>
              </div>
            </div> */}

            <div className="row">
              <div className="col-12 col-md-6">
                <Form.Item
                  name="Paid"
                  label="Thanh toán"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền đủ thông tin!",
                    },
                  ]}
                >
                  <InputNumber
                    value="0"
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
                    {
                      required: true,
                      message: "Vui lòng điền đủ thông tin!",
                    },
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
                    {
                      required: true,
                      message: "Vui lòng điền đủ thông tin!",
                    },
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
                    {
                      required: true,
                      message: "Vui lòng điền đủ thông tin!",
                    },
                  ]}
                >
                  <DatePicker
                    className="style-input"
                    onChange={(e) => setValue("PayDate", e)}
                  />
                </Form.Item>
              </div>
            </div>
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

export default CourseOfStudentPriceForm;
