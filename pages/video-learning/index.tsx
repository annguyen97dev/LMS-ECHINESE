import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Tabs, Drawer } from "antd";

import { CircularProgressbar } from "react-circular-progressbar";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import HeaderVideo from "./header";
import { VideoTabs } from "./tabs";
import { VideoList } from "./list-video";

const { TabPane } = Tabs;

const fakeData = require("./fakeData/fakeData.json");

// const data = [];

const VideoLearning = () => {
  const ref = useRef<HTMLDivElement>(null);

  const videoStudy = useRef(null);
  const textarea = useRef(null);
  const boxVideo = useRef(null);

  const [currentVideo, setCurrentVideo] = useState("");

  const [data, setData] = useState([]);

  // const [valueNote, setValueNote] = useState("");
  const [render, setRender] = useState("");

  const [eWidth, setWidth] = useState("100%");

  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    setWidth(ref.current.offsetWidth.toString());
  }, [size]);

  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(!visible);
  };

  const onClose = () => {
    setVisible(false);
  };

  useLayoutEffect(() => {
    setCurrentVideo(fakeData.videos[0].listVideo[0].link);

    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // --- Move to current time
  const moveToCurTime = (e) => {
    let curTime = e.target.getAttribute("data-time");
    console.log("cur Time: ", curTime);
    videoStudy.current.currentTime = curTime;
    e.preventDefault();
  };

  const formatTime = (seconds) => {
    let minutes: any = Math.floor(seconds / 60);
    minutes = minutes >= 10 ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  };

  // --- Remove item ---
  const removeItem = (id) => {
    data.forEach((item, index, arr) => {
      if (item.id === id) {
        arr.splice(index, 1);
      }
    });
    let dataTest = data.filter((item) => {
      return item.id != id;
    });

    setData(dataTest);
    // setStatus(true);
    console.log("Data after remove: ", dataTest);
  };

  // --- HANDLE FIXED ---
  const handleFixed = (id, note) => {
    data.forEach((item, index, arr) => {
      if (item.id === id) {
        item.note = note;
      }
    });
    let dataTest = data.map((item) => {
      if (item.id === id) {
        item.note = note;
      }
      return item;
    });

    setData(dataTest);
    // setShowForm(false);
    console.log("DATA after fixed: ", dataTest);
  };

  // --- Create ID ---
  const createId = () => {
    let number = Math.floor(Math.random() * 1000 + 1);
    let id = "id-" + number;
    return id;
  };

  // --- Calculator position of line note  inside video ---
  const calPosition = (curTime) => {
    let widthVideo = boxVideo.current.offsetWidth;
    let lengthTimeVideo = Math.round(videoStudy.current.duration);

    let position = (curTime * 100) / lengthTimeVideo;
    // position = (position * widthVideo) / 100 + 16;

    return position;
  };

  // --- Handle Submit ---
  const handleSubmit = (valueNote) => {
    let temp = data;

    let curTime = videoStudy.current.currentTime;
    let forTime = formatTime(videoStudy.current.currentTime);
    let id = createId();

    let position = calPosition(curTime);

    data.push({
      id: id,
      curTime: curTime,
      formatTime: forTime,
      title: "Chổ này bỏ title vô nha",
      subTitle: "Chổ này bỏ sub title vô",
      note: valueNote,
      position: position,
    });

    setData(temp);
    setRender(id);
  };

  const handlePause = () => {
    videoStudy.current.pause();
  };

  return (
    <div className="container-fluid p-0">
      <HeaderVideo params={fakeData} onClick={showDrawer} />
      <div className="row">
        <div className="col-md-9 col-12 p-0">
          <div className="wrap-video pl-3">
            <div ref={ref} className="wrap-video__video">
              <div className="box-video" ref={boxVideo}>
                <video ref={videoStudy} controls>
                  <track default kind="captions" />
                  <source src="/static/video/video.mp4" type="video/mp4" />
                  Your browser does not support HTML video.
                </video>

                {/* {data.length > 0
                  ? data.map((item) => (
                      <a
                        href="/#"
                        key={item.id}
                        style={{ left: item.position + "%" }}
                        className="marked"
                        onClick={moveToCurTime}
                      >
                        <div data-time={item.curTime}></div>
                      </a>
                    ))
                  : ""} */}
              </div>

              <VideoTabs
                params={fakeData}
                dataNote={data}
                onCreateNew={(p) => {
                  handleSubmit(p);
                }}
                onPress={(p) => {
                  videoStudy.current.currentTime = p.curTime;
                }}
                onDelete={(p) => {
                  removeItem(p.id);
                }}
                onEdit={(p) => {
                  console.log(p);
                  handleFixed(p.item.id, p.content);
                }}
                onPauseVideo={() => {
                  handlePause();
                }}
                videoRef={videoStudy}
              />
            </div>
          </div>
        </div>
        <div className="col-md-3 col-12 p-0">
          <div className="wrap-menu">
            <VideoList
              onPress={(p) => {
                setCurrentVideo(p);
              }}
              params={fakeData}
            />
          </div>
        </div>
      </div>

      <Drawer
        title="Nội dung khóa học"
        placement="right"
        onClose={onClose}
        visible={visible}
        className="video-drawer"
        headerStyle={{
          paddingTop: 24,
          paddingBottom: 24,
          background: "#fff",
        }}
      >
        <div className="wrap-menu-drawer">
          <VideoList
            onPress={(p) => {
              setCurrentVideo(p);
            }}
            params={fakeData}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default VideoLearning;
