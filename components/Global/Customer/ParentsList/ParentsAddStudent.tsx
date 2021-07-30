import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Spin } from "antd";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import { studentApi } from "~/apiBase";

const ParentsAddStudent = React.memo((props: any) => {
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { parentsID, reloadData } = props;
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  const [loading, setLoading] = useState(false);
  const { setValue } = useForm();

  const [studentList, setStudentList] = useState<IStudent[]>();

  const fetchData = () => {
    (async () => {
      try {
        const res = await studentApi.getAll({ pageSize: 99999, pageIndex: 1 });
        //@ts-ignore
        res.status == 200 && setStudentList(res.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      let res = await studentApi.update({
        UserInformationID: data.UserInformationID,
        Enable: true,
        ParentsOf: parentsID,
      });
      afterSubmit(res?.data.message);
      reloadData(1);
      form.resetFields();
    } catch (error) {
      showNoti("danger", error.message);
      setLoading(false);
    }
  };

  const afterSubmit = (mes) => {
    showNoti("success", mes);
    setLoading(false);
    setIsModalVisible(false);
  };

  return (
    <>
      <button
        className="btn btn-warning add-new"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        Thêm mới
      </button>

      <Modal
        title="Thêm học viên"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="UserInformationID"
                  label="Học viên"
                  rules={[
                    { required: true, message: "Vui lòng điền đủ thông tin!" },
                  ]}
                >
                  <Select
                    className="w-100 style-input"
                    placeholder="Chọn học viên liên kết với phụ huynh"
                  >
                    {studentList?.map((item, index) => (
                      <Option key={index} value={item.UserInformationID}>
                        {item.FullNameUnicode}
                      </Option>
                    ))}
                  </Select>
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

export default ParentsAddStudent;
