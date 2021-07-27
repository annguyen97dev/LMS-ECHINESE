import { Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import { AlertTriangle, X } from "react-feather";
import { feedbackApi } from "~/apiBase/options/feedback";
import { useWrap } from "~/context/wrap";

const FeedbackDelete = React.memo((props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { feedbackId, reloadData } = props;
  const { showNoti } = useWrap();

  const onHandleDelete = async () => {
    try {
      setIsModalVisible(false);
      // @ts-ignore
      let res = await feedbackApi.update({ ID: feedbackId, Enable: false });
      showNoti("success", res.data?.message);
      reloadData();
    } catch (error) {
      setIsModalVisible(false);
      showNoti("danger", error.message);
    }
  };

  return (
    <>
      <Tooltip title="Xóa">
        <button
          className="btn btn-icon delete"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <X />
        </button>
      </Tooltip>
      <Modal
        title={<AlertTriangle color="red" />}
        visible={isModalVisible}
        onOk={onHandleDelete}
        onCancel={() => setIsModalVisible(false)}
      >
        <p className="text-confirm">Bạn có muốn xóa phản hồi này?</p>
      </Modal>
    </>
  );
});

export default FeedbackDelete;
