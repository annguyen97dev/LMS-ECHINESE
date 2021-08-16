import React, { useEffect, useState } from "react";
import { Timeline, Card, Spin } from "antd";
import LayoutBase from "~/components/LayoutBase";
import { timelineApi } from "~/apiBase/course-detail/timeline";
import { useWrap } from "~/context/wrap";
import moment from "moment";
import CommentCreate from "./CommentCreate";

moment.locale("vn");

const Comment = (props: any) => {
  const { courseID } = props;
  const [timeline, setTimeline] = useState<ITimeLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNoti } = useWrap();

  const getDataTimeline = () => {
    setIsLoading(true);
    (async () => {
      try {
        let res = await timelineApi.getByCourseID(courseID);
        //@ts-ignore
        res.status == 200 && setTimeline(res.data.data);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  useEffect(() => {
    getDataTimeline();
  }, []);

  return (
    <div className="container-fluid">
      <Card
        title="Phản hồi"
        extra={
          <>
            <CommentCreate
              reloadData={() => {
                getDataTimeline();
              }}
            />
          </>
        }
      >
        <div>
          <Spin spinning={isLoading} size="large">
            <Timeline mode="right">
              {timeline.map((x) => (
                <Timeline.Item
                  label={
                    <>
                      <div>
                        <p className="font-weight-black">
                          {moment(x.CreatedOn).format("DD/MM/YYYY")}
                        </p>
                      </div>
                      <div>{moment(x.CreatedOn).format("LT")}</div>
                    </>
                  }
                >
                  <div>
                    <p className="font-weight-blue">{x.Note}</p>
                  </div>
                  <div>{x.CreatedBy}</div>
                  <div>{x.RoleName}</div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Spin>
        </div>
      </Card>
    </div>
  );
};
Comment.layout = LayoutBase;
export default Comment;
