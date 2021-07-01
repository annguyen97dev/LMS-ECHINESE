import React from "react";
import { Steps, Button, message, Card, Divider } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  WarningOutlined,
  CaretRightOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
const { Step } = Steps;
import LayoutBase from "~/components/LayoutBase";
const InformationUser = () => {
  return (
    <div className="info-box doing-test-box">
      <Divider orientation="center">Confirm your infomation</Divider>
      <ul className="info-list">
        <li>
          <span className="title">Fullname:</span>{" "}
          <span className="text">An Nguyễn</span>
        </li>
        <li>
          <span className="title">Date of birth:</span>{" "}
          <span className="text">19/12/2019</span>
        </li>
        <li>
          <span className="title">Email:</span>{" "}
          <span className="text">andeptrai@gmail.com</span>
        </li>
        <li>
          <span className="title">Branch:</span>{" "}
          <span className="text">Mona media</span>
        </li>
        <li>
          <span className="title">Candidate Number:</span>{" "}
          <span className="text">52435</span>
        </li>
      </ul>
      <p className="text-danger">
        <WarningOutlined />{" "}
        <span className="text">
          If your details are not correct, please inform the invigilator.
        </span>
      </p>
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
  return (
    <div className="sound-test doing-test-box">
      <Divider orientation="center">Check your sound</Divider>
      <div className="sound-img">
        <img src="/images/headphone-icon.jpg" alt="" />
      </div>
      <div className="sound-test-content">
        <p>
          Put on your headphones and click on the Play sound button to play as
          sample sound.
        </p>
        <Button icon={<CaretRightOutlined />}>Play Sound</Button>
      </div>
    </div>
  );
};

const steps = [
  {
    title: "User Information",
    content: <InformationUser />,
  },
  {
    title: "Sound Test",
    content: <SoundTest />,
  },
  {
    title: "Test Information",
    content: <InformationTest />,
  },
];

const DoingTest = () => {
  const router = useRouter();
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const moveToTest = () => {
    message.success("We can do test now!");
    setTimeout(() => {
      router.push("/doing-test/quiz/listening-test");
    }, 1000);
  };

  return (
    <>
      <div className="doing-test-step">
        <Card title="Nguyễn An">
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
                Back
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Continue
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={moveToTest}>
                Done
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
