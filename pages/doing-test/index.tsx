import React, { useEffect, useState, useRef } from "react";
import { Steps, Button, message, Card, Divider, Skeleton, Modal } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  WarningOutlined,
  CaretRightOutlined,
  PauseOutlined,
} from "@ant-design/icons";
const { Step } = Steps;
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import TitlePage from "~/components/TitlePage";
import moment from "moment";
import ControlVolume from "~/components/Elements/ControlVolume";
import MainTest from "~/components/Global/DoingTest/MainTest";
import { examTopicApi } from "~/apiBase";

const InformationUser = () => {
  const { titlePage, userInformation } = useWrap();
  const [dataUser, setDataUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userInformation) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [userInformation]);

  return (
    <div className="info-box doing-test-box">
      <Divider orientation="center">Xác nhận thông tin sau đây</Divider>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <ul className="info-list">
            <li>
              <span className="title">Họ và tên</span>{" "}
              <span className="text">{userInformation?.FullNameUnicode}</span>
            </li>
            <li>
              <span className="title">Ngày sinh:</span>{" "}
              <span className="text">
                {moment(userInformation?.DOB).format("DD/MM/YYYY")}
              </span>
            </li>
            <li>
              <span className="title">Email:</span>{" "}
              <span className="text">{userInformation?.Email}</span>
            </li>
            <li>
              <span className="title">Số điện thoại:</span>{" "}
              <span className="text">{userInformation?.Mobile}</span>
            </li>
          </ul>
          <p className="text-danger">
            <WarningOutlined />{" "}
            <span className="text">
              Nếu thông tin bị sai, vui lòng liên hệ tư vấn viên để sửa.
            </span>
          </p>
        </>
      )}
    </div>
  );
};

const InformationTest = () => {
  return (
    <div className="package-set doing-test-box">
      <Divider orientation="center">Confirm your test infomation</Divider>
      <div className="wrap-set">
        <div className="wrap-set-img">
          <img src="/images/study-2.png" alt="" />
        </div>
        <div className="wrap-set-content">
          <h6 className="set-title">IELTS Practice Test 1</h6>
          <ul className="set-list">
            <li className="price">
              Price: <span>2,200,000 VNĐ</span>
            </li>
            <li className="status">
              Status: <span>Free</span>
            </li>
          </ul>
          <p className="set-des">
            This is your first test in course, please be carefull on your all
            respon
          </p>
        </div>
      </div>
    </div>
  );
};

const SoundTest = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = useRef(null);

  const playSound = () => {
    if (!isPlaying) {
      audio.current.play();
      setIsPlaying(true);
    } else {
      audio.current.pause();
      setIsPlaying(false);
    }
  };

  const controlVolume = (value) => {
    let customValue = value / 100;
    audio.current.volume = customValue;
  };

  return (
    <div className="sound-test doing-test-box">
      <Divider orientation="center">Kiểm tra âm thanh</Divider>
      <div className="sound-img">
        <img src="/images/headphone-icon.jpg" alt="" />
      </div>
      <div className="sound-test-content position-relative">
        <p>Đeo tai nghe và bấm vào nút bên dưới để kiểm tra âm thanh.</p>
        <div className="position-absolute" style={{ opacity: 0 }}>
          <audio controls ref={audio} onEnded={() => setIsPlaying(false)}>
            <source
              src="https://s3-eu-west-1.amazonaws.com/oep2stt/sample-listening-multiple-choice-one-answer/sample-audio.ogg"
              type="audio/mpeg"
            />
          </audio>
        </div>
        <div className="w-100 d-flex justify-content-center">
          <ControlVolume getValueControl={(value) => controlVolume(value)} />
        </div>
        <Button
          onClick={playSound}
          icon={!isPlaying ? <CaretRightOutlined /> : <PauseOutlined />}
        >
          Nghe thử
        </Button>
      </div>
    </div>
  );
};

const steps = [
  {
    title: "Thông tin cá nhân",
    content: <InformationUser />,
  },
  {
    title: "Kiểm tra âm thanh",
    content: <SoundTest />,
  },
  // {
  //   title: "Test Information",
  //   content: <InformationTest />,
  // },
];

const DoingTest = () => {
  const [current, setCurrent] = useState(0);
  const [showTest, setShowTest] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoExam, setInfoExam] = useState<IExamTopic>(null);

  // --- GET INFO EXAM ---
  const getInfoExam = async () => {
    try {
      let res = await examTopicApi.getByID(examID);
      if (res.status === 200) {
        setInfoExam(res.data.data);
      }
    } catch (error) {
      console.log("Error Info Exam: ", error.message);
    } finally {
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    router.push("package/package-student/");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const router = useRouter();
  const examID = parseInt(router.query.exam as string);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const moveToTest = () => {
    if (!examID) {
      setIsModalVisible(true);
    } else {
      setShowTest(true);
    }
  };

  useEffect(() => {
    getInfoExam();
  }, []);

  return (
    <>
      {showTest && <MainTest infoExam={infoExam} examID={examID} />}
      <Modal
        title="Chú ý!"
        visible={isModalVisible}
        okText="Đồng ý"
        cancelText="Đóng"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p style={{ fontWeight: 500 }}>
          Bạn chưa chọn đề thi. Chuyển đến trang bộ đề?
        </p>
      </Modal>
      <div className="doing-test-step">
        <TitlePage title="Xác nhận thông tin" />
        <Card>
          <Steps className="step-doing" current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action">
            {current > 0 && (
              <Button
                className="btn-back-step"
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
              >
                Quay lại
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Tiếp tục
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={moveToTest}>
                Hoàn tất
              </Button>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

DoingTest.layout = LayoutBase;
export default DoingTest;
