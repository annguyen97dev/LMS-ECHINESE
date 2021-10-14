import React, { FC, useEffect, useState } from "react";
import "antd/dist/antd.css";
import { List, Card, Progress, Rate, Modal, Input } from "antd";
import LayoutBase from "~/components/LayoutBase";
import { VideoCourseListApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const { TextArea } = Input;

const fakeData = [
  {
    CreatedBy: null,
    CreatedOn: null,
    ID: 1,
    ImageThumbnails: "",
    RatingComment: "1  12 31231",
    RatingNumber: 1,
    Status: 1,
    StatusName: null,
    StudentName: null,
    UserInformationID: null,
    VideoCourseID: 1,
    VideoCourseName: "Video Course 2 ấ qui qưuie uqe jqje j",
  },
  {
    CreatedBy: null,
    CreatedOn: null,
    ID: 2,
    ImageThumbnails: "",
    RatingComment: "2222 24 44314 234",
    RatingNumber: 0,
    Status: 1,
    StatusName: null,
    StudentName: null,
    UserInformationID: null,
    VideoCourseID: 0,
    VideoCourseName: "Video Course 2qưe ư ư ",
  },
  {
    CreatedBy: null,
    CreatedOn: null,
    ID: 3,
    ImageThumbnails: "",
    RatingComment: "qwe qw e",
    RatingNumber: 3,
    Status: 1,
    StatusName: null,
    StudentName: null,
    UserInformationID: null,
    VideoCourseID: 0,
    VideoCourseName: "Video Course 2",
  },
  {
    CreatedBy: null,
    CreatedOn: null,
    ID: 4,
    ImageThumbnails: "",
    RatingComment: "qw qw qw eqw e qwqwe w q qweq eq w eqw ",
    RatingNumber: 1,
    Status: 1,
    StatusName: null,
    StudentName: null,
    UserInformationID: null,
    VideoCourseID: 2,
    VideoCourseName: "Video Course 2",
  },
  {
    CreatedBy: null,
    CreatedOn: null,
    ID: 5,
    ImageThumbnails: "",
    RatingComment: "h hqweqw hjqwh",
    RatingNumber: 5,
    Status: 1,
    StatusName: null,
    StudentName: null,
    UserInformationID: null,
    VideoCourseID: 5,
    VideoCourseName: "Video Course 2",
  },
];

const ItemVideo = ({ item, onRate }) => {
  //

  return (
    <div className="video-course-list__item">
      <img src="/images/logo-final.jpg"></img>
      <div className="p-3 video-course-list__item__content">
        <a className="title">{item.VideoCourseName}</a>
        <a className="content">Content chưa có, nào có thì thêm</a>

        <Progress percent={50} status="active" />
        <div className="pr-3 pl-3 row rate-container">
          <Rate disabled defaultValue={item.RatingNumber} />
          <a
            onClick={() => {
              onRate(item);
            }}
            className="none-selection"
          >
            Sửa đánh giá
          </a>
        </div>
      </div>
    </div>
  );
};

const VideoCourseList = () => {
  const { userInformation } = useWrap();

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "ID":
          return {
            ...prevState,
            ID: action.ID,
          };
        case "RatingNumber":
          return {
            ...prevState,
            RatingNumber: action.RatingNumber,
          };
        case "RatingComment":
          return {
            ...prevState,
            RatingComment: action.RatingComment,
          };
      }
    },
    {
      ID: "",
      RatingNumber: 0,
      RatingComment: "",
    }
  );

  useEffect(() => {
    if (userInformation) {
      console.log("User: ", userInformation);
      getAllArea();
    }
  }, [userInformation]);

  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

  //GET DATA
  const getAllArea = async () => {
    try {
      const res = await VideoCourseListApi.getByUser(
        userInformation.UserInformationID
      );

      res.status == 200 && setData(res.data.data);
    } catch (err) {
      // showNoti("danger", err);
    }
  };

  return (
    <div className="">
      <p className="video-course-list-title">Khóa Học Video</p>
      <Card className="video-course-list">
        <List
          itemLayout="horizontal"
          dataSource={fakeData}
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
          renderItem={(item) => (
            <ItemVideo
              onRate={(p) => {
                dispatch({
                  type: "ID",
                  ID: p.ID,
                });
                dispatch({
                  type: "RatingNumber",
                  RatingNumber: p.RatingNumber,
                });
                dispatch({
                  type: "RatingComment",
                  RatingComment: p.RatingComment,
                });
                setShowModal(true);
              }}
              item={item}
            />
          )}
        />

        <Modal
          title="Đánh giá"
          visible={showModal}
          onOk={() => {
            //
            setShowModal(false);
          }}
          confirmLoading={false}
          onCancel={() => {
            //
            setShowModal(false);
          }}
        >
          <Rate
            value={parseInt(state.RatingNumber)}
            onChange={(e) => {
              console.log("change: ", e);
              dispatch({ type: "RatingNumber", RatingNumber: e });
            }}
          />

          <TextArea
            value={state.RatingComment}
            onChange={(p) => {
              dispatch({
                type: "RatingComment",
                RatingComment: p.target.value,
              });
            }}
            rows={4}
            className="mt-4"
          />
        </Modal>
      </Card>
    </div>
  );
};
VideoCourseList.layout = LayoutBase;

export default VideoCourseList;
