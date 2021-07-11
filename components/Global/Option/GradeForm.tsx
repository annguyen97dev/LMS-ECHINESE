import React, { useEffect, useState, useMemo } from "react";
import { Modal, Form, Input, Spin, Tooltip, Skeleton } from "antd";
import { RotateCcw } from "react-feather";
import { useForm } from "react-hook-form";
import { gradeApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const GradeForm = React.memo((props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoading, gradeID, _onSubmit } = props;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm<IGrade>();
  const { showNoti } = useWrap();

  const onSubmit = handleSubmit((data: any) => {
    let res = _onSubmit(data);

    res.then(function (rs: any) {
      rs && rs.status == 200 && setIsModalVisible(false);
    });
  });

  useEffect(() => {
    if (props.rowData) {
    }
  }, [props.rowData]);

  return (
    <>
      {gradeID ? (
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
      ) : (
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
                <Form.Item name="GradeCode" label="Code khóa">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      {...register("GradeCode")}
                      placeholder=""
                      className="style-input"
                      defaultValue={props.rowData?.ListCourseCode}
                      onChange={(e) => setValue("GradeCode", e.target.value)}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item name="GradeName" label="Tên khóa">
                  {isLoading.type == "GET_WITH_ID" && isLoading.status ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 0 }}
                      title={{ width: "100%" }}
                    />
                  ) : (
                    <Input
                      placeholder=""
                      className="style-input"
                      defaultValue={props.rowData?.ListCourseName}
                      onChange={(e) => setValue("GradeName", e.target.value)}
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
                      placeholder=""
                      className="style-input"
                      defaultValue={props.rowData?.Description}
                      onChange={(e) => setValue("Description", e.target.value)}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
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
