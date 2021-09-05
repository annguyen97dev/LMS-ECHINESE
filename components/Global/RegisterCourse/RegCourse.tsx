import React, { useEffect, useState } from "react";

import {
  Modal,
  Form,
  Input,
  Select,
  Card,
  Spin,
  InputNumber,
  Button,
  DatePicker,
} from "antd";
import { branchApi, courseApi, discountApi } from "~/apiBase";
import { examServiceApi } from "~/apiBase/options/examServices";
import { useWrap } from "~/context/wrap";
import moment from "moment";
import { useForm } from "react-hook-form";
import { PaymentMethod } from "~/lib/payment-method/payment-method";
import { studentExamServicesApi } from "~/apiBase/customer/student/student-exam-services";

const RegCourse = React.memo((props: any) => {
  const { TextArea } = Input;
  const { Option } = Select;
  const [branch, setBranch] = useState<IBranch[]>();
  const [course, setCourse] = useState<ICourse[]>();
  const [discount, setDiscount] = useState<IDiscount[]>();
  const { showNoti } = useWrap();
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<IExamServices>();
  const [isLoading, setIsLoading] = useState(false);
  const { setValue } = useForm();

  const fetchDataSelectList = () => {
    (async () => {
      try {
        const _branch = await branchApi.getAll({
          pageIndex: 1,
          pageSize: 99999,
          Enable: true,
        });
        const _course = await courseApi.getAll({
          pageIndex: 1,
          pageSize: 99999,
        });
        const _discount = await discountApi.getAll({
          pageIndex: 1,
          pageSize: 99999,
        });
        _branch.status == 200 && setBranch(_branch.data.data);
        _course.status == 200 && setCourse(_course.data.data);
        _discount.status == 200 && setDiscount(_discount.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  useEffect(() => {
    fetchDataSelectList();
  }, []);

  const handleChangeCourse = (value) => {
    console.log(value);
    // setIsLoading(true);
    // (async () => {
    //   try {
    //     const _detail = await examServiceApi.getDetail(value);
    //     //@ts-ignore
    //     _detail.status == 200 && setDetail(_detail.data.data);
    //   } catch (err) {
    //     showNoti("danger", err.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // })();
  };

  return (
    <Card title="Đăng ký khóa học">
      <div className="row">
        <div className="col-12">
          <Form.Item
            name="BranchID"
            label="Trung tâm"
            rules={[
              {
                required: true,
                message: "Vui lòng điền đủ thông tin!",
              },
            ]}
          >
            <Select
              className="style-input"
              showSearch
              optionFilterProp="children"
            >
              {branch?.map((item, index) => (
                <Option key={index} value={item.ID}>
                  {item.BranchName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Form.Item
            name="Course"
            label="Khóa học"
            rules={[
              {
                required: true,
                message: "Vui lòng điền đủ thông tin!",
              },
            ]}
          >
            <Select
              mode="multiple"
            //   className="style-input"
              showSearch
              optionFilterProp="children"
              onChange={(value) => handleChangeCourse(value)}
            >
              {course?.map((item, index) => (
                <Option key={index} value={item.ID}>
                  {item.CourseName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Form.Item name="DiscountCode" label="Mã giảm giá">
            <Select
              className="style-input"
              showSearch
              optionFilterProp="children"
            >
              {discount?.map((item, index) => (
                <Option key={index} value={item.DiscountCode}>
                  {item.DiscountCode}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-12">
          <Form.Item
            name="Paid"
            label="Thanh toán"
            rules={[{ required: true, message: "Bạn không được để trống" }]}
          >
            <InputNumber
              placeholder="Số tiền thanh toán"
              className="ant-input style-input w-100"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={(value) => setValue("Paid", value)}
            />
          </Form.Item>
        </div>

        <div className="col-md-6 col-12">
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
            <Select className="style-input">
              {PaymentMethod?.map((item, index) => (
                <Option key={index} value={item.id}>
                  {item.Name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-12">
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
              className="style-input"
              showSearch
              optionFilterProp="children"
            >
              {branch?.map((item, index) => (
                <Option key={index} value={item.ID}>
                  {item.BranchName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="col-md-6 col-12">
          <Form.Item
            name="PayDate"
            label="Ngày hẹn trả"
            rules={[{ required: true, message: "Vui lòng điền đủ thông tin!" }]}
          >
            <DatePicker
              className="style-input"
              onChange={(e) => setValue("PayDate", e)}
            />
          </Form.Item>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Form.Item name="Commitment" label="Cam kết">
            <TextArea
              onChange={(e) => setValue("Commitment", e.target.value)}
              allowClear={true}
            />
          </Form.Item>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Form.Item name="Note" label="Ghi chú">
            <TextArea
              onChange={(e) => setValue("Note", e.target.value)}
              allowClear={true}
            />
          </Form.Item>
        </div>
      </div>

      <div className="row">
        <div className="col-12 text-center text-left-mobile">
          <button type="submit" className="btn btn-primary">
            Xác nhận
            {props.loading == true && <Spin className="loading-base" />}
          </button>
        </div>
      </div>
    </Card>
  );
});

export default RegCourse;
