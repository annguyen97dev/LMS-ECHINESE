import React, { useState } from "react";
import { Card } from "antd";
import TitlePage from "~/components/Elements/TitlePage";

import { useRouter } from "next/router";

import {
  CustomerServiceOutlined,
  AudioOutlined,
  FormOutlined,
  FileTextOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import LayoutBase from "~/components/LayoutBase";
const PackageSetType = () => {
  const [isType, setIsType] = useState();
  const router = useRouter();

  const chooseType = (box) => {
    setIsType(box);
    router.push({
      pathname: "/doing-test",
      query: { type: "typename" },
    });
  };

  return (
    <div className="row package-create">
      <div className="col-12">
        <TitlePage title="Chọn bài test" />
        <Card title="IELTS Practice Test 1">
          <div className="row">
            <div className="col-md-3 col-sm-6 col-12">
              <div
                onClick={() => chooseType("listening")}
                className={`${
                  isType == "listening" ? "choose" : ""
                } box-type-package`}
                style={{
                  background: 'url("/images/listening.jpg")',
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <div className="box-detail">
                  <CustomerServiceOutlined />
                  <p>Listening</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-12">
              <div
                onClick={() => chooseType("reading")}
                className={`${
                  isType == "reading" ? "choose" : ""
                } box-type-package`}
                style={{
                  background: 'url("/images/reading.jpg")',
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <div className="box-detail">
                  <FileTextOutlined />
                  <p>Reading</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-12">
              <div
                onClick={() => chooseType("writting")}
                className={`${
                  isType == "writting" ? "choose" : ""
                } box-type-package`}
                style={{
                  background: 'url("/images/writting.jpg")',
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <div className="box-detail">
                  <FormOutlined />
                  <p>Writting</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-12">
              <div
                onClick={() => chooseType("speaking")}
                className={`${
                  isType == "speaking" ? "choose" : ""
                } box-type-package`}
                style={{
                  background: 'url("/images/speaking.jpg")',
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <div className="box-detail">
                  <AudioOutlined />
                  <p>Speaking</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

PackageSetType.layout = LayoutBase;
export default PackageSetType;
