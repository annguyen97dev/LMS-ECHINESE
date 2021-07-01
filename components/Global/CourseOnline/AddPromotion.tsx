import React, { useState } from "react";
import { Modal, Form, Input, Button, Checkbox } from "antd";

const AddPromotion = ({ visible, onCancel }) => {
  const [percent, setPercent] = useState(false);
  function onChange(e) {
    setPercent(!percent);
  }
  return (
    <Modal
      title="Mã khuyến mãi"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <div className="container-fluid">
        <Form layout="vertical">
          <div className="row">
            <div className="col-6">
              <Form.Item label="Giá tiền">
                <Input placeholder="Nhập giá tiền ..." defaultValue="1000" />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item label="Phần trăm">
                <div className="row">
                  {percent ? (
                    <div className="col-9">
                      <Input
                        placeholder="Nhập phần trăm ..."
                        defaultValue="25"
                      />
                    </div>
                  ) : (
                    <div className="col-9">
                      <Input
                        placeholder="Nhập phần trăm ..."
                        defaultValue="25"
                        disabled
                      />
                    </div>
                  )}

                  <div className="col-3 ">
                    <Checkbox onChange={onChange} />
                  </div>
                </div>
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <Form.Item label="Số lượng người tham gia">
                <Input placeholder="Nhập giá tiền ..." defaultValue="1" />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item label="Hạn sử dụng">
                <Input type="date" />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form.Item label="Ghi chú">
                <Input placeholder="Nhập ghi chú ..." />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Button className="w-100" type="primary">
                Lưu
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AddPromotion;
