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

//  ----------- POPUP FORM ------------
const FormCreateCourse = () => {
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);
  function onSearch(val) {
    console.log("search:", val);
  }

  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }

  // Show Modal with form
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
      <button type="button" className="btn btn-warning" onClick={showModal}>
        Thông tin khóa học
      </button>
      <Modal
        style={{ top: 20 }}
        title="Thông tin khóa học"
        visible={isModalVisible}
        footer={null}
        width={800}
        // onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="wrap-form">
          <Form layout="vertical">
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Trung tâm">
                  <Select
                    className="style-input"
                    size="large"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Chọn trung tâm"
                    optionFilterProp="children"
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="jack">Trung tâm 1</Option>
                    <Option value="lucy">Trung tâm 2</Option>
                    <Option value="tom">Trung tâm 3</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Học vụ">
                  <Select
                    className="style-input"
                    size="large"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Chọn học vụ"
                    optionFilterProp="children"
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="jack">Item 1</Option>
                    <Option value="lucy">Item 2</Option>
                    <Option value="tom">Item 3</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Phòng học">
                  <Select
                    className="style-input"
                    size="large"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Chọn phòng học"
                    optionFilterProp="children"
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="jack">Phòng 1</Option>
                    <Option value="lucy">Phòng 2</Option>
                    <Option value="tom">Phòng 3</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Ca học">
                  <Select
                    className="style-input"
                    size="large"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Chọn ca học"
                    optionFilterProp="children"
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="jack">Item 1</Option>
                    <Option value="lucy">Item 2</Option>
                    <Option value="tom">Item 3</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Khối học">
                  <Select
                    className="style-input"
                    size="large"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Chọn học vụ"
                    optionFilterProp="children"
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="jack">Item 1</Option>
                    <Option value="lucy">Item 2</Option>
                    <Option value="tom">Item 3</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Lớp học">
                  <Select
                    className="style-input"
                    size="large"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Chọn học vụ"
                    optionFilterProp="children"
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="jack">Item 1</Option>
                    <Option value="lucy">Item 2</Option>
                    <Option value="tom">Item 3</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Giáo trình">
                  <Select
                    className="style-input"
                    size="large"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Chọn học vụ"
                    optionFilterProp="children"
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="jack">Item 1</Option>
                    <Option value="lucy">Item 2</Option>
                    <Option value="tom">Item 3</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Ngày mở">
                  <DatePicker
                    className="style-input"
                    style={{ width: "100%" }}
                    onChange={onChangeDate}
                  />
                </Form.Item>
              </div>
              <div className="col-md-12 col-12">
                <Form.Item label="Tên khóa">
                  <Input size="large" className="style-input" />
                </Form.Item>
              </div>
              <div className="col-md-12 col-12">
                <Form.Item style={{ marginBottom: "0", textAlign: "center" }}>
                  <button className="btn btn-primary btn-submit">
                    Xem lịch
                  </button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default FormCreateCourse;
