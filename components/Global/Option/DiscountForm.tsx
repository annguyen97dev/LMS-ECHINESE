import React, {useEffect, useState} from 'react';
import { Modal, Form, Input, Button, Switch, Tooltip, Select, DatePicker, InputNumber, Spin } from "antd";
import { RotateCcw } from "react-feather";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';


const DiscountForm = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const status = [
    {
      id: 1,
      text: "Chưa kích hoạt",
    },
    {
      id: 2,
      text: "Đã kích hoạt",
    },
    {
      id: 3,
      text: "Hết hạn",
    },
  ];
  const packages = [
    {
      id: 1,
      text: "Gói lẻ"
    },
    {
      id: 2,
      text: "Gói combo"
    }
  ]
  
  const currentDay = new Date();

  const [percent, setPercent] = useState(false);
  const onChange = () => {
    setPercent(!percent);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
    // const { showNoti } = useWrap();

  const onSubmit = handleSubmit((data: any) => {
    console.log("Data submit", data);

    if(!props.rowData) {
      if(percent) {
        data.DiscountType = 2
      } else {
        data.DiscountType = 1
      }
    }

    let res = props._onSubmit(data);
    res.then(function (rs: any) {
      rs && rs.status == 200 && setIsModalVisible(false), form.resetFields();
    });
  });

  useEffect(() => {
    if(isModalVisible) {
      if (props.rowData) {
        // Object.keys(props.rowData).forEach(function (key) {
        //   setValue(key, props.rowData[key]);
        // });
        setValue("ID", props.rowData.ID);
        setValue("Discount", props.rowData.Discount);
        setValue("DiscountType", props.rowData.DiscountType);
        setValue("Status", props.rowData.Status);
        setValue("Note", props.rowData.Note);
        setValue("DeadLine", props.rowData.DeadLine);
        setValue("Quantity", props.rowData.Quantity);
        setValue("Style", props.rowData.Style);
      }
    }
  }, [isModalVisible]);

  return (
    <>
      {props.showIcon && (
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
        title={
          <>
            {props.showAdd
              ? "Thêm Mã Khuyết Mãi"
              : "Cập Nhật Mã Khuyết Mãi"}
          </>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            {props.showAdd ? (
              <div className="row">
                <div className="col-9">
                  {percent ? (
                    <>
                    <Form.Item 
                      label="Khuyến mãi %"
                      name="Discount"
                      rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                      >
                      <InputNumber 
                        className="ant-input style-input w-100" 
                        // allowClear={true}
                        min={0}
                        max={100}
                        onChange={(value) => setValue("Discount", value)} 
                        />
                    </Form.Item>
                    <Form.Item 
                      label="Khuyến mãi tối đa"
                      name="MaxDiscount"
                      rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                      >
                      <InputNumber
                        className='ant-input style-input w-100'
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={value => setValue("MaxDiscountPrice", value)}
                      />
                    </Form.Item>
                    </>
                  ) : (
                    <Form.Item 
                      label="Khuyến mãi"
                      name="Discount"
                      rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                      >
                      {/* <Input 
                        placeholder="" 
                        className="style-input"
                        allowClear={true}
                        onChange={(e) => setValue("Discount", e.target.value)} 
                      /> */}
                      <InputNumber
                        className='ant-input style-input w-100'
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={value => setValue("Discount", value)}
                      />
                    </Form.Item>
                  )}
                </div>
                <div className="col-3 d-flex justify-content-center">
                  <Form.Item label="Phần trăm">
                    <Switch onChange={onChange} />
                  </Form.Item>
                </div>
              </div>
            ) : (
              <div className="row">
                {props.rowData.DiscountType == 1 ? (
                  <>
                  <div className="col-6">
                    <Form.Item 
                      label="Mã khuyến mãi"
                      name="DiscountCode"
                      rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                      initialValue={props.rowData?.DiscountCode}
                      >
                      <Input 
                        placeholder="" 
                        className="style-input" 
                        readOnly={true}
                        />
                    </Form.Item>
                  </div>
                  <div className="col-6">
                    <Form.Item 
                      label="Khuyến mãi"
                      name="Discount"
                      rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                      initialValue={props.rowData?.Discount}
                      >

                          <InputNumber 
                            className="ant-input style-input w-100"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={value => setValue("Discount",value)}
                          />
                    </Form.Item>
                  </div>
                  </>
                  ) : (
                    <>
                    <div className="col-12">
                      <Form.Item 
                        label="Mã khuyến mãi"
                        name="DiscountCode"
                        rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                        initialValue={props.rowData?.DiscountCode}
                        >
                        <Input 
                          placeholder="" 
                          className="style-input" 
                          readOnly={true}
                          />
                      </Form.Item>
                    </div>
                    <div className="col-6">
                    <Form.Item 
                      label="Khuyến mãi %"
                      name="Discount"
                      rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                      initialValue={props.rowData?.Discount}
                    >
                      <Input 
                        placeholder="" 
                        className="style-input"
                        onChange={(e) => setValue("Discount", e.target.value)}
                      />
                    </Form.Item>
                    </div>
                    <div className="col-6">
                    <Form.Item 
                      label="Khuyến mãi tối đa"
                      name="MaxDicount"
                      rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                      initialValue={props.rowData?.MaxDiscountPrice}
                    >
                        <InputNumber 
                          className="ant-input style-input w-100"
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          onChange={value => setValue("MaxDiscountPrice",value)}
                        />
                    </Form.Item>
                    </div>
                    </>
                  )
                  }
              </div>
            )}

            {/*  */}
            <div className="row">
              <div className="col-6">
                <Form.Item 
                  label="Số lượng"
                  name="Quantity"
                  rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                  initialValue={props.rowData?.Quantity}
                  >
                  <Input 
                    placeholder="" 
                    className="style-input" 
                    type="number"
                    onChange={(e) => setValue("Quantity", e.target.value)}
                    />
                </Form.Item>
              </div>
              <div className="col-6">
                {props.showAdd ? (
                    <Form.Item
                    label="Thời hạn"
                    name="DeadLine"
                    rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                  >
                    <DatePicker 
                      className="style-input"
                      format={dateFormat} 
                      onChange={(date, dateSting) => setValue("DeadLine", dateSting)}
                      />
                  </Form.Item>
                ) : (
                  <Form.Item
                  label="Thời hạn"
                  name="DeadLine"
                  rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                  initialValue={moment(`${props.rowData?.DeadLine}`, dateFormat)}
                  >
                  <DatePicker 
                    className="style-input"
                    format={dateFormat} 
                    onChange={(date, dateSting) => setValue("DeadLine", dateSting)}
                    />
                  </Form.Item>
                )}

              </div>
            </div>
            {/*  */}
            <div className="row">
              <div className="col-6">
                <Form.Item 
                  label="Trạng thái"
                  name="Status"
                  rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                  initialValue={props.rowData?.StatusName}
                  >
                    <Select 
											className="style-input" 
                      allowClear={true}
											onChange={(value) => setValue("Status", value)}>
                        {status.map(row => (
                          <Option key={row.id} value={row.id}>{row.text}</Option>
                        ))
                        }
                        <Option value="disabled" disabled>
                          Disabled
                        </Option>
										</Select>
                </Form.Item>
              </div>
              <div className="col-6">
              {props.showAdd ? (
                  <Form.Item 
                    label="Gói"
                    name="Packages"
                    rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                    >
                    <Select 
                      className="style-input" 
                      allowClear={true}
                      onChange={(value) => setValue("Style", value)}>
                        {packages.map(row => (
                          <Option key={row.id} value={row.id}>{row.text}</Option>
                        ))
                        }
                        <Option value="disabled" disabled>
                          Disabled
                        </Option>
                    </Select>
                  </Form.Item>
              ) : (
                <Form.Item 
                  label="Gói"
                  name="Packages"
                  rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
                  initialValue={props.rowData?.Style}
                  >
                  <Select 
                    className="style-input" 
                    allowClear={true}
                    onChange={(value) => setValue("Style", value)}>
                      {packages.map(row => (
                        <Option key={row.id} value={row.id}>{row.text}</Option>
                      ))
                      }
                      <Option value="disabled" disabled>
                        Disabled
                      </Option>
                  </Select>
                </Form.Item>
              )}

              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item name="Note" label="Ghi chú" initialValue={props.rowData?.Note}>
                  <TextArea 
                    placeholder=""
                    rows={2} 
                    allowClear={true}
                    onChange={(e) => setValue("Note", e.target.value)}  
                    />
                </Form.Item>
              </div>
            </div>
            {/*  */}
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

export default DiscountForm;
