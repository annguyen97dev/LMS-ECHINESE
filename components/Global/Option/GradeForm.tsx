import React, { useEffect, useState, useMemo } from "react";
import { Modal, Form, Input, Spin, Tooltip, Skeleton } from "antd";
import { RotateCcw } from "react-feather";
import { useForm } from "react-hook-form";
import { courseApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const GradeForm = React.memo((props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoading } = props;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm<ICourse>();
  const { showNoti } = useWrap();

  const onSubmit = handleSubmit((data: any) => {
    let res = props._onSubmit(data);

    res.then(function (rs: any) {
      rs && rs.status == 200 && setIsModalVisible(false);
      // : showNoti("danger", "Server lỗi");
    });
  });

  useEffect(() => {
    if (props.rowData) {
      // setValue("object", {
      //   ListCourseID: props.rowData.ListCourseID,
      //   ListCourseName: props.rowData.ListCourseName,
      //   ListCourseCode: props.rowData.ListCourseCode,
      //   Description: props.rowData.Description,
      //   Enable: props.rowData.Enable,
      // });
      setValue("ListCourseID", props.rowData.ListCourseID);
      setValue("ListCourseName", props.rowData.ListCourseName);
      setValue("ListCourseCode", props.rowData.ListCourseCode);
      setValue("Description", props.rowData.Description);
      setValue("Enable", props.rowData.Enable);
    }
  }, [props.rowData]);

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
            setIsModalVisible(true);
          }}
        >
          Thêm mới
        </button>
      )}

      {/*  */}
      <Modal
        title={`${!props.showAdd ? "Sửa" : "Tạo"} khối học`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Code khóa">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("ListCourseCode")}
                      placeholder=""
                      className="style-input"
                      defaultValue={props.rowData?.ListCourseCode}
                      onChange={(e) =>
                        setValue("ListCourseCode", e.target.value)
                      }
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Tên khóa">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("ListCourseName")}
                      placeholder=""
                      className="style-input"
                      defaultValue={props.rowData?.ListCourseName}
                      onChange={(e) =>
                        setValue("ListCourseName", e.target.value)
                      }
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Mô Tả">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("Description")}
                      placeholder=""
                      className="style-input"
                      defaultValue={props.rowData?.Description}
                      onChange={(e) => setValue("Description", e.target.value)}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            {/* <div className="row">
              <div className="col-12">
                <Form.Item>
                  <Radio.Group
                    onChange={onChange_Status("Enable")}
                    value={status}
                  >
                    <Radio value={1}>Hiện</Radio>
                    <Radio value={2}>Ẩn</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div> */}
            <div className="row ">
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
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

export default GradeForm;
