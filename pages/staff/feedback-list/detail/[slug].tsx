import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, Avatar, Rate } from "antd";

import {
  UserOutlined,
  DeploymentUnitOutlined,
  WhatsAppOutlined,
  MailOutlined,
  AimOutlined,
} from "@ant-design/icons";
import Editor from "~/components/Elements/Editor";
import CommentBox from "~/components/Elements/CommentBox";
import LayoutBase from "~/components/LayoutBase";
// interface info {
//   key: string,
//     ClassName: string,
//     Check: string,
//     Listening: string,
//     Wrting:string,
//     Speaking:string,
//     Reading:string,
//     SpeakingWorkstring,
//     ReadingWork:string,
//     width:number,
//     fixed:string,
// }

const FeedbackListDetail = (props) => {
  // Get path and slug
  const router = useRouter();
  const slug = router.query.slug;
  let path: string = router.pathname;
  let pathString: string[] = path.split("/");
  path = pathString[pathString.length - 2];
  // --------------- //

  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="row feedback-user">
        <div className="col-md-3 col-12">
          <Card className="info-profile-left">
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-center flex-wrap">
                <Avatar size={64} src={<img src="/images/user.png" />} />

                <Rate
                  disabled
                  value={4}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                />
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-2">
                <UserOutlined />
              </div>
              <div className="col-10  d-flex ">Nguyễn An</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <DeploymentUnitOutlined />
              </div>
              <div className="col-10  d-flex ">Teacher</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <WhatsAppOutlined />
              </div>
              <div className="col-10  d-flex ">0978111222</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <MailOutlined />
              </div>
              <div className="col-10  d-flex ">anhandsome@gmail.com</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <AimOutlined />
              </div>
              <div className="col-10  d-flex ">London, England</div>
            </div>
            <hr />
            <div className="row">
              <ul className="list-info-bonus">
                <li>
                  <b>Trung tâm: </b> <span>ZIM – 65 Yên Lãng</span>
                </li>
                <li>
                  <b>Khóa: </b>{" "}
                  <span>
                    [ZIM – 65 Yên Lãng] - AM - Intermediate, 27/07, 19:00-21:00,
                  </span>
                </li>
                <li>
                  <b>Học vụ:</b> <span>Nguyễn Thị Diện</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
        <div className="col-md-9 col-12">
          <Card title="Comment" className="space-top-card">
            <div className="box-comment">
              <Editor />
              <button className="btn btn-primary mt-3">Reply</button>
            </div>
            <hr />
            <div className="list-comment">
              <CommentBox />
              <CommentBox />
              <CommentBox />
              <CommentBox />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

FeedbackListDetail.propTypes = {};
FeedbackListDetail.layout = LayoutBase;
export default FeedbackListDetail;
