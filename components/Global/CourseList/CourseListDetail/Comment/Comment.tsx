import React, { useEffect, useState } from "react";
import { Timeline, Card } from "antd";
import LayoutBase from "~/components/LayoutBase";
import { timelineApi } from "~/apiBase/course-detail/timeline";
import { useWrap } from "~/context/wrap";

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
      <Card title="Phản hồi">
        <div>
          <Timeline mode="right">
            {timeline.map((x) => (
              <Timeline.Item label="25/12/2019 14:38">
                <div>
                  <p className="font-weight-black">{x.Note}</p>
                </div>
                <div>{x.CreatedBy}</div>
                <div>{x.RoleName}</div>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </Card>
    </div>
  );
};
Comment.layout = LayoutBase;
export default Comment;
