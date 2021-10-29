import React, { Component, useEffect, useState } from "react";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import { exerciseGroupApi } from "~/apiBase/";
import { useWrap } from "~/context/wrap";
import { Mic, Pause, Play, Square } from "react-feather";
import { Spin, Tooltip } from "antd";

const AudioRecord = (props) => {
  const { getLinkRecord, linkRecord } = props;
  const [state, setState] = useState(null);
  const { showNoti } = useWrap();
  const [linkAudio, setLinkAudio] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  const [isPause, setIsPause] = useState(false);

  const start = () => {
    setState(RecordState.START);
    setIsRecord(true);
  };

  const pause = () => {
    setState(RecordState.PAUSE);
    setIsPause(!isPause);
    isPause && start();
  };

  const stop = () => {
    setState(RecordState.STOP);
  };

  function blobToFile(theBlob, fileName) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return new File([theBlob], fileName, {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    });
  }

  const onStop = async (audioData) => {
    let file = blobToFile(audioData.blob, "record-audio.mp3");
    setLoadingUpload(true);
    setIsRecord(false);
    setIsPause(false);

    try {
      let res = await exerciseGroupApi.UploadAudio(file);
      if (res.status == 200) {
        setLinkAudio(res.data.data);
        getLinkRecord(res.data.data);
        showNoti("success", "Ghi âm thành công");
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  useEffect(() => {
    setLinkAudio(linkRecord);
  }, [linkRecord]);

  return (
    <div className="wrap-audio-record mt-2">
      <AudioReactRecorder
        state={state}
        onStop={onStop}
        canvasHeight={30}
        canvasWidth={300}
      />

      {loadingUpload ? (
        <div className="d-flex align-items-center mt-2 mb-2">
          <Spin />
          <span
            style={{
              marginLeft: "5px",
              fontStyle: "italic",
              fontSize: "13px",
            }}
          >
            Loading audio...
          </span>
        </div>
      ) : (
        linkAudio && (
          <audio controls>
            <source src={linkAudio} type="audio/mpeg" />
          </audio>
        )
      )}

      {!isRecord && (
        <Tooltip title="Bắt đầu ghi âm">
          <button className="btn-record start" onClick={start}>
            <Mic />
          </button>
        </Tooltip>
      )}
      {isRecord && (
        <>
          <Tooltip title="Tạm dừng">
            <button className="btn-record pause mr-2" onClick={pause}>
              {!isPause ? <Pause /> : <Play />}
            </button>
          </Tooltip>
          <Tooltip title="Lưu lại">
            <button className="btn-record save" onClick={stop}>
              <Square />
            </button>
          </Tooltip>
        </>
      )}
      {isPause && (
        <div className="d-block mt-2">
          <p className="font-italic" style={{ fontWeight: 500, opacity: 0.7 }}>
            Lưu ý: Hiện bạn đang tạm dừng. Bấm vào nút lưu bên trên để lưu lại
            đoạn ghi âm.
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioRecord;
