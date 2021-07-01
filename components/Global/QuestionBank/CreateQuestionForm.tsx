import React, { useState } from "react";
import { Drawer, Form, Select, Input, Radio } from "antd";
import TinyBox from "~/components/Elements/TinyBox";
import { Edit } from "react-feather";

const CreateQuestionForm = (props) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = React.useState(1);
  const [openAns, setOpenAns] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const { Option } = Select;

  function handleChange_select(value) {
    console.log(`selected ${value}`);
    !openAns && setOpenAns(true);
  }

  function onChange(date, dateString) {
    console.log(date, dateString);
  }

  const onChange_Radio = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <>
      {props.isEdit ? (
        <button className="btn btn-icon" onClick={showDrawer}>
          <Edit />
        </button>
      ) : (
        <button className="btn btn-success" onClick={showDrawer}>
          Tạo câu hỏi
        </button>
      )}

      <Drawer
        title={props.isEdit ? "Form sửa câu hỏi" : "Form tạo câu hỏi"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={900}
      >
        <Form layout="vertical">
          <div className="row">
            <div className="col-md-6 col-12">
              <Form.Item label="Môn học">
                <Select
                  showSearch
                  className="style-input"
                  defaultValue="all"
                  onChange={handleChange_select}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="jack">English</Option>
                  <Option value="lucy">Toán</Option>
                  <Option value="all">Ngữ Văn</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6 col-12">
              <Form.Item label="Loại môn học">
                <Select
                  showSearch
                  className="style-input"
                  defaultValue="all"
                  onChange={handleChange_select}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="jack">Phát âm</Option>
                  <Option value="lucy">Ngữ pháp</Option>
                  <Option value="all">None</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="col-md-12 col-12">
              <Form.Item label="Nhập câu hỏi">
                <TinyBox />
              </Form.Item>
            </div>

            <div className="col-md-6 col-12">
              <Form.Item label="Mức độ">
                <Select
                  showSearch
                  className="style-input"
                  defaultValue="all"
                  onChange={handleChange_select}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="jack">Khó</Option>
                  <Option value="lucy">Dễ</Option>
                  <Option value="all">Trung bình</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6 col-12">
              <Form.Item label="Loại câu hỏi">
                <Select
                  showSearch
                  className="style-input"
                  defaultValue="all"
                  onChange={handleChange_select}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="jack">Câu hỏi nhóm</Option>
                  <Option value="lucy">Câu hỏi đơn</Option>
                  <Option value="all">Trắc nhiệm</Option>
                </Select>
              </Form.Item>
            </div>

            <div
              className={`col-md-12 col-12 ${
                openAns ? "show-ani" : "hide-ani"
              }`}
            >
              <div className="wrapper-answer-form">
                <Form.Item label="Nhập câu trả lời">
                  <TinyBox />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Radio.Group onChange={onChange_Radio} value={value}>
                    <Radio value={1}>Đúng</Radio>
                    <Radio value={2}>Sai</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>

            <div className="col-md-12">
              <Form.Item className="mb-0 text-right">
                <button
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                >
                  {props.isEdit ? "Sửa ngay" : "Tạo ngay"}
                </button>
                <button className="btn btn-success">Up file</button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default CreateQuestionForm;
