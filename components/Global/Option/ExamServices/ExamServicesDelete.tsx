import { Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import { AlertTriangle, X } from "react-feather";
import { examServiceApi } from "~/apiBase/options/examServices";
import { useWrap } from "~/context/wrap";

const ExamServicesDelete = React.memo((props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { examServicesId, reloadData } = props;
  const { showNoti } = useWrap();

  const onHandleDelete = async () => {
    try {
      setIsModalVisible(false);
      // @ts-ignore
      let res = await examServiceApi.update({
        ID: examServicesId,
        Enable: false,
      });
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
        <p className="text-confirm">Bạn có muốn xóa đợt thi này?</p>
      </Modal>
    </>
  );
});

export default ExamServicesDelete;
