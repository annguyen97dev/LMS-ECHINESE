import React, { FC } from "react";
import "antd/dist/antd.css";
import { Tabs } from "antd";
import { VideoInfomation } from "./video-information";
import { VideoQuestion } from "./question";
import { VocabularyTab } from "./vocabulary";

const { TabPane } = Tabs;

const titlePages = {
  page1: "Video bài giảng",
  page2: "Thẻ từ vựng (FlashCard)",
  page3: "Luyện tập",
  page4: "Hỏi và đáp",
  page5: "Ghi chú",
  page6: "Thông báo",
};

function callback(key) {
  console.log(key);
}

type vType = {
  params: { name: ""; description: "" };
  dataNote: any[];
  onCreateNew: any;
  onPress: any;
  onDelete: any;
  onEdit: any;
  onPauseVideo: any;
  dataQA: any[];
  videoRef: { current: { currentTime: "" } };
  addNewQuest: any;
};

export const VideoTabs: FC<vType> = ({
  params,
  dataNote,
  onCreateNew,
  onPress,
  onDelete,
  onEdit,
  onPauseVideo,
  videoRef,
  dataQA,
  addNewQuest,
}) => {
  return (
    <Tabs onChange={callback} type="card">
      <TabPane tab={titlePages.page1} key="1">
        <VideoInfomation params={params} />
      </TabPane>
      <TabPane tab={titlePages.page2} key="2">
        Content of Tab Pane 3
      </TabPane>
      <TabPane tab={titlePages.page5} key="3">
        <VocabularyTab
          dataNote={dataNote}
          createNew={(p) => {
            onCreateNew(p);
          }}
          onPress={(p) => {
            onPress(p);
          }}
          onDelete={(p) => {
            onDelete(p);
          }}
          onEdit={(p) => {
            onEdit(p);
          }}
          onPauseVideo={onPauseVideo}
          videoRef={videoRef}
        />
      </TabPane>
      <TabPane tab={titlePages.page3} key="4">
        Content of Tab Pane 3
      </TabPane>
      <TabPane tab={titlePages.page4} key="5">
        <VideoQuestion params={dataQA} addNew={addNewQuest} />
      </TabPane>
      <TabPane tab={titlePages.page6} key="6">
        Content of Tab Pane 3
      </TabPane>
    </Tabs>
  );
};