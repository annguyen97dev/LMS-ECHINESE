import React, { useEffect, useState } from "react";
import { Drawer, Form, Select, Input, Radio } from "antd";
import TinyBox from "~/components/Elements/TinyBox";
import { Edit } from "react-feather";
import FormSingle from "./FormSingle";

const EditQuestionForm = (props) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = React.useState(1);
  const [openAns, setOpenAns] = useState(false);

  const { isShow } = props;

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

  useEffect(() => {
    setVisible(isShow);
  }, [isShow]);

  return (
    <>
      <button className="btn btn-icon" onClick={showDrawer}>
        <Edit />
      </button>

      <Drawer
        title="Form tạo câu hỏi"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={900}
      >
        {/** Form single */}
        <FormSingle />
        {/* <Form layout="vertical">
          <div className="row">
            <div className="col-md-12 col-12">
              <Form.Item label="Nhập câu hỏi">
                <TinyBox />
              </Form.Item>
            </div>

            <div className="col-md-12">
              <Form.Item className="mb-0 text-right">
                <button
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                >
                  Sửa ngay
                </button>
              </Form.Item>
            </div>
          </div>
        </Form> */}
      </Drawer>
    </>
  );
};

export default EditQuestionForm;
