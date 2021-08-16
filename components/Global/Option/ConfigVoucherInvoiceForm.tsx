import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, Divider, Tooltip, Select, Skeleton, InputNumber, Spin, Collapse, Popover } from 'antd';
import { RotateCcw } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import TinyMCE from "~/components/TinyMCE";
const { Panel } = Collapse;

const ConfigVoucherInvoiceForm = (props) => {
  const { Option } = Select;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
    });
  const { showNoti } = useWrap();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
    // const { showNoti } = useWrap();

  const onSubmit = handleSubmit((data: any) => {
    let res = props._onSubmit(data);
    res.then(function (rs: any) {
      rs && rs.status == 200 && setIsModalVisible(false), form.resetFields();
    });
  });

  const onChangeTinyMCE = (value) => {
    setValue("NotificationContent", value);
  }

  useEffect(() => {
    if(isModalVisible) {
      if (props.rowData) {
        Object.keys(props.rowData).forEach(function (key) {
          setValue(key, props.rowData[key]);
        });
      }
    }
  }, [isModalVisible]);

  return (
    <>
      {props.showIcon && (
        <Tooltip title="Cập nhật">
          <button
            className="btn btn-icon edit"
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            <RotateCcw />
          </button>
        </Tooltip>
      )}
      {props.showAdd && (
        <button
          className="btn btn-warning add-new"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          Thêm mới
        </button>
      )}

      {/*  */}
      <Modal
        title={<>{props.showAdd ? "Thêm Phiếu" : "Cập Nhật Phiếu"}</>}
        visible={isModalVisible}
        width={1000}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            {/*  */}
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Loại phiếu"
                  name="Loại phiếu"
                  rules={[
                    { required: true, message: "Bạn không được để trống" },
                  ]}
                  initialValue={props.rowData?.TypeName}
                >
                    <Select
                        className="style-input"
                        onChange={(value) => setValue("Type",value)}
                    >
                        <Option value="1">Phiếu chi</Option>
                        <Option value="1">Phiếu thu</Option>
                    </Select>
                </Form.Item>
              </div>
            </div>
            {/* <div className="row">
              <div className="col-12">
                <Form.Item 
                    label="Nội dung" 
                    name="Nội dung"
                >
                    <TinyMCE initialValue={props.rowData?.ConfigContent} onChangeTinyMCE={(value) => setValue("ConfigContent", value)}/>
                </Form.Item>
              </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Popover
                        content={
                            <>
                                <p>{'{'}hinhthucthanhtoan{'}'} : Hình thức thanh toán</p>
                                <p>{'{'}hovaten{'}'} : Họ và tên</p>
                                <p>{'{'}sodienthoai{'}'} : Số điện thoại</p>
                                <p>{'{'}cmnd{'}'} : CMND</p>
                                <p>{'{'}ngaycap{'}'} : Ngày cấp</p>
                                <p>{'{'}noicap{'}'} : Nơi cấp</p>
                                <p>{'{'}diachi{'}'} : địa chỉ</p>
                                <p>{'{'}lydo{'}'} : lý do xuất phiếu</p>
                                <p>{'{'}dachi{'}'} : số tiền chi ra</p>
                                <p>{'{'}dathu{'}'} : số tiền thu vào</p>
                                <p>{'{'}nguoinhanphieu{'}'} : người nhận phiếu ký tên</p>
                                <p>{'{'}nhanvienxuat{'}'} : nhân viên xuất phiếu ký tên</p>
                                <p>{'{'}maqr{'}'} : mã qr</p>
                            </>
                        }
                        title={null}
                        trigger="click"
                    >
                        <a className="btn-code-editor" type="primary">Mã hướng dẫn</a>
                    </Popover>
                </div>
            </div> */}
            <div className="row ">
              <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {props.isLoading.type == "ADD_DATA" && props.isLoading.status && (
                    <Spin className="loading-base" />
                  )}
                </button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ConfigVoucherInvoiceForm;
