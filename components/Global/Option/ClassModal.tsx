import React, { useEffect, useState, useMemo } from "react";
import { Modal, Form, Input, Spin, Tooltip, Skeleton, Select } from "antd";
import { RotateCcw } from "react-feather";
import { useForm } from "react-hook-form";
import { courseApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const ClassModal = React.memo((props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    isLoading,
    startShowModal,
    dataBranch,
    dataCourse,
    dataRoom,
    getRoom,
    getCourse,
  } = props;

  console.log("data Course: ", dataCourse);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm<IClass>();
  const { showNoti } = useWrap();
  const { Option } = Select;
  const [valueRoom, setValueRoom] = useState("");
  const [valueCourse, setValueCourse] = useState("");

  const onSubmit = handleSubmit((data: any) => {
    console.log("data submit: ", data);
    // let res = props._onSubmit(data);

    // res.then(function (rs: any) {
    //   rs
    //     ? rs.status == 200 && setIsModalVisible(false)
    //     : showNoti("danger", "Server lỗi");
    // });
  });

  const onSearch = (val: any) => {
    console.log("search:", val);
  };

  const onChangeSelect = (name: any) => (value: any, option: any) => {
    name == "BranchName" &&
      (getRoom(value),
      getCourse(value),
      setValue("RoomName", ""),
      setValue("ListCourseName", ""),
      setValueRoom(""),
      setValueCourse(""));
    name == "RoomName" && setValueRoom(value);

    setValue(name, option.children);
  };

  //   useEffect(() => {
  //     if (props.rowData) {
  //       setValue("ListCourseID", props.rowData.ListCourseID);
  //       setValue("ListCourseName", props.rowData.ListCourseName);
  //       setValue("ListCourseCode", props.rowData.ListCourseCode);
  //       setValue("Description", props.rowData.Description);
  //       setValue("Enable", props.rowData.Enable);
  //     }
  //   }, [props.rowData]);

  return (
    <>
      {props.showIcon && (
        <button
          className="btn btn-icon edit"
          onClick={() => {
            setIsModalVisible(true), props.getDataCourseWithID(props.CourseID);
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
            setIsModalVisible(true), startShowModal();
          }}
        >
          Thêm mới
        </button>
      )}

      {/*  */}
      <Modal
        title={`${!props.showAdd ? "Sửa" : "Tạo"} lớp học`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="modal-medium"
      >
        <div className="container-fluid">
          <Form layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Code lớp">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("ListClassCode")}
                      placeholder=""
                      className="style-input"
                      //   defaultValue={props.rowData?.ListCourseCode}
                      onChange={(e) =>
                        setValue("ListClassCode", e.target.value)
                      }
                    />
                  )}
                </Form.Item>
              </div>

              <div className="col-md-6 col-12">
                <Form.Item label="Tên lớp">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("ListClassName")}
                      placeholder=""
                      className="style-input"
                      //   defaultValue={props.rowData?.ListCourseName}
                      onChange={(e) =>
                        setValue("ListClassName", e.target.value)
                      }
                    />
                  )}
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Trung tâm">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Select
                      style={{ width: "100%" }}
                      className="style-input"
                      showSearch
                      placeholder="Select..."
                      optionFilterProp="children"
                      onChange={onChangeSelect("BranchName")}
                      onSearch={onSearch}
                      //   filterOption={(input, option) =>
                      //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      //   }
                    >
                      {dataBranch?.length > 0 ? (
                        dataBranch?.map((item) => (
                          <Option value={item.ID}>{item.BranchName}</Option>
                        ))
                      ) : (
                        <Option value={5}>Không có dữ liệu</Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </div>

              <div className="col-md-6 col-12">
                <Form.Item label="Phòng">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Select
                      style={{ width: "100%" }}
                      className="style-input"
                      showSearch
                      placeholder="Select..."
                      optionFilterProp="children"
                      onChange={onChangeSelect("RoomName")}
                      value={valueRoom}
                      onSearch={onSearch}
                      //   filterOption={(input, option) =>
                      //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      //   }
                    >
                      {dataRoom?.length > 0 ? (
                        dataRoom?.map((item) => (
                          <Option key={item.RoomID} value={item.RoomID}>
                            {item.RoomName}
                          </Option>
                        ))
                      ) : (
                        <Option value={"none"}>Không có dữ liệu</Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Khóa học">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Select
                      style={{ width: "100%" }}
                      className="style-input"
                      showSearch
                      placeholder="Select..."
                      optionFilterProp="children"
                      onChange={onChangeSelect("ListCourseName")}
                      onSearch={onSearch}
                      value={valueCourse}
                      //   filterOption={(input, option) =>
                      //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      //   }
                    >
                      {dataCourse?.length > 0 ? (
                        dataCourse?.map((item) => (
                          <Option value={item.ListCourseID}>
                            {item.ListCourseName}
                          </Option>
                        ))
                      ) : (
                        <Option value={"none"}>Không có dữ liệu</Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-12">
                <Form.Item label="Khu vực">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("AreaName")}
                      placeholder=""
                      className="style-input"
                      //   defaultValue={props.rowData?.Description}
                      onChange={(e) => setValue("AreaName", e.target.value)}
                    />
                  )}
                </Form.Item>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-12">
                <Form.Item label="Học phí">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("Price")}
                      placeholder=""
                      className="style-input"
                      //   defaultValue={props.rowData?.Description}
                      onChange={(e) => setValue("Price", e.target.value)}
                    />
                  )}
                </Form.Item>
              </div>

              <div className="col-md-6 col-12">
                <Form.Item label="Trạng thái">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("Type")}
                      placeholder=""
                      className="style-input"
                      //   defaultValue={props.rowData?.Description}
                      onChange={(e) => setValue("Type", e.target.value)}
                    />
                  )}
                </Form.Item>
              </div>
            </div>

            <div className="row ">
              <div className="col-12 text-center">
                <button type="submit" className="btn btn-primary ">
                  Lưu
                  {isLoading.type == "ADD_DATA" && isLoading.status && (
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
});

export default ClassModal;
