import React, { useState } from "react";
import { Drawer, Form, Select, Input, Radio } from "antd";
import TinyBox from "~/components/Elements/TinyBox";
import { Edit } from "react-feather";

const CreateExamForm = (props) => {
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
      <button
        className={`btn  ${props.isEdit ? "btn-icon" : "btn-success"}`}
        onClick={showDrawer}
      >
        {props.isEdit ? <Edit /> : "Tạo đề thi"}
      </button>

      <Drawer
        title={props.isEdit ? "Form sửa đề thi" : "Form tạo đề thi"}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={700}
      >
        <Form layout="vertical">
          <div className="row">
            <div className="col-md-6 co-12">
              <Form.Item label="Nhập code đề">
                <Input className="style-input" />
              </Form.Item>
            </div>
            <div className="col-md-6 co-12">
              <Form.Item label="Nhập tên đề">
                <Input className="style-input" />
              </Form.Item>
            </div>
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

            <div className="col-md-6 co-12">
              <Form.Item label="Số câu hỏi">
                <Input className="style-input" />
              </Form.Item>
            </div>

            <div className="col-md-4 co-12">
              <Form.Item label="Số câu hỏi dễ">
                <Input className="style-input" type="number" />
              </Form.Item>
            </div>

            <div className="col-md-4 co-12">
              <Form.Item label="Số câu hỏi trung bình">
                <Input className="style-input" type="number" />
              </Form.Item>
            </div>

            <div className="col-md-4 co-12">
              <Form.Item label="Số câu hỏi khó">
                <Input className="style-input" type="number" />
              </Form.Item>
            </div>

            <div className="col-md-6 col-12">
              <Form.Item label="Học kỳ">
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
                  <Option value="jack">học kỳ I</Option>
                  <Option value="lucy">học kỳ II</Option>
                  <Option value="all">học kỳ III</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="col-md-6 co-12">
              <Form.Item label="Thời gian làm bài">
                <Input className="style-input" type="number" />
              </Form.Item>
            </div>

            <div className="col-md-12">
              <Form.Item className="mb-0 text-right">
                <button
                  className={`btn ${
                    props.isEdit ? "btn-primary" : "btn-success"
                  }`}
                  style={{ marginRight: "10px" }}
                >
                  {props.isEdit ? "Sửa ngay" : "Tạo ngay"}
                </button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default CreateExamForm;
