import React, { useState } from "react";
import {
  Card,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Drawer,
  Collapse,
  Checkbox,
} from "antd";

// ------------ DRAWER INFO CORUSE --------------
const InfoCourse = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <button type="button" className="btn btn-success" onClick={showModal}>
        Lưu
      </button>
      <Modal
        title="Thông tin khóa học"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="info-course-save">
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="item">
                <p>
                  <span>Phòng</span>
                  <span>A1</span>
                </p>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="item">
                <p>
                  <span>Lớp</span>
                  <span>605</span>
                </p>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="item">
                <p>
                  <span>Ngày bắt đầu</span>
                  <span>15/5/2021</span>
                </p>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="item">
                <p>
                  <span>Học phí</span>
                  <span>2.000.000 VNĐ</span>
                </p>
              </div>
            </div>

            <div className="col-12 mt-1">
              <button className="btn btn-primary w-100">Lưu tất cả</button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InfoCourse;
