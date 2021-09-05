import { Card, Radio } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Bookmark } from "react-feather";
import { packageResultDetailApi } from "~/apiBase/package/package-result-detail";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import TitlePage from "~/components/Elements/TitlePage";
import router from "next/router";

const PackageSetDetailResult = (props: any) => {
  const [detailResult, setDetailResult] = useState<ISetPackageResultDetail[]>(
    []
  );
  const boxEl = useRef(null);

  const paramsDefault = {
    pageSize: 10,
    pageIndex: 1,
    SetPackageResultID: parseInt(router.query.slug as string),
  };
  const [params, setParams] = useState(paramsDefault);

  const [totalPageIndex, setTotalPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const { showNoti } = useWrap();
  const listAlphabet = ["A", "B", "C", "D", "F", "G", "H", "I", "J"];

  const onScroll = () => {
    const scrollHeight = boxEl.current.scrollHeight;
    const offsetHeight = boxEl.current.offsetHeight;
    const scrollTop = boxEl.current.scrollTop;
    if (scrollTop > scrollHeight - offsetHeight - 40) {
      if (paramsDefault.pageIndex < totalPageIndex) {
        setLoading(true);
        if (scrollTop > 0 && loading == false) {
          setParams({
            ...params,
            pageIndex: params.pageIndex + 1,
          });
        }
      }
    }
  };

  const getDataSetPackageResult = () => {
    (async () => {
      try {
        let res = await packageResultDetailApi.getAll(params);
        //@ts-ignore
        res.status == 200 && setDetailResult(res.data.data);
        if (res.status == 204) {
          showNoti("danger", "Không tìm thấy dữ liệu!");
        }
      } catch (error) {
        showNoti("danger", error.message);
      }
    })();
  };

  useEffect(() => {
    getDataSetPackageResult();
  }, []);

  return (
    <div className="question-create">
      <TitlePage title="Kết quả gói bài chi tiết" />
      <div className="row">
        <div className="col-md-12"></div>
      </div>
      <Card
        className="card-detail-exam"
        title={
          <div className="title-question-bank">
            <h3 className="title-big">
              <Bookmark />
              Danh sách câu hỏi
            </h3>
          </div>
        }
      >
        <div className="question-list active" ref={boxEl} onScroll={onScroll}>
          {detailResult.map((data, index) => (
            <Fragment>
              {data.SetPackageExerciseStudent.map((question, idx) => (
                <div className="question-item" key={idx}>
                  <div className="box-detail">
                    <div className="box-title">
                      <span className="title-ques">{data.Content}</span>
                      <div className="title-text">{question.Content}</div>
                    </div>

                    <div className="box-answer">
                      <div className="question-single question-wrap w-100">
                        {question.SetPackageExerciseAnswerStudent?.map(
                          (ans, i) => (
                            <Radio
                              checked={ans.isTrue}
                              key={i}
                              className="d-block"
                              value={ans.ID}
                              disabled={ans.isTrue ? false : true}
                            >
                              <span className="tick">{listAlphabet[i]}</span>
                              <span className="text">{ans.AnswerContent}</span>
                            </Radio>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
};
PackageSetDetailResult.layout = LayoutBase;
export default PackageSetDetailResult;
