import React, { useState } from "react";
import { Modal, Form, Input, Button, Divider, Tooltip, Spin } from "antd";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { RotateCcw } from "react-feather";

const RoomForm = React.memo((props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoading } = props;
  const { showNoti } = useWrap();
  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm<IRoom>();

  const onSubmit = handleSubmit((data: any) => {
    let res = props._onSubmit(data);
    res.then(function (rs: any) {
      rs
        ? rs.status == 200 && setIsModalVisible(false)
        : showNoti("danger", "Server lỗi");
    });
  });
  return (
    <>
      {props.showIcon && (
        <button
          className="btn btn-icon edit"
          onClick={() => {
            setIsModalVisible(true), props.getBranchDetail(props.branchId);
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
      <Modal
        title="Tạo phòng trong trung tâm"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="container-fluid">
          <Form layout="vertical">
            <div className="row">
              <div className="col-12">
                <Form.Item label="Mã phòng">
                  <Input
                    placeholder=""
                    className="style-input"
                    {...register("RoomCode")}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Form.Item label="Tên phòng">
                  <Input
                    placeholder=""
                    className="style-input"
                    {...register("RoomName")}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="row ">
              <div className="col-12">
                <Button
                  className="w-100"
                  type="primary"
                  size="large"
                  onClick={handleSubmit(onSubmit)}
                >
                  LƯU
                  {isLoading.type == "ADD_DATA" && isLoading.status && (
                    <Spin className="loading-base" />
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
});

export default RoomForm;
