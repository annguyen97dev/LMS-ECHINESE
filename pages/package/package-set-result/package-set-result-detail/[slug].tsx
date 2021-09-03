import { Card, Radio } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Bookmark } from "react-feather";
import { packageResultDetailApi } from "~/apiBase/package/package-result-detail";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import TitlePage from "~/components/Elements/TitlePage";

const PackageSetDetailResult = (props: any) => {
  const [detailResult, setDetailResult] = useState<ISetPackageResultDetail[]>(
    []
  );
  const boxEl = useRef(null);

  const { showNoti } = useWrap();
  const listAlphabet = ["A", "B", "C", "D", "F", "G", "H", "I", "J"];
  const onScroll = () => {
    const scrollHeight = boxEl.current.scrollHeight;
    const offsetHeight = boxEl.current.offsetHeight;
    const scrollTop = boxEl.current.scrollTop;

    // console.log("Height: ", scrollHeight - offsetHeight);
    // console.log("Scroll: ", scrollTop);

    // if (scrollTop > scrollHeight - offsetHeight - 40) {
    //   if (todoApi.pageIndex < totalPageIndex) {
    //     setLoadingQuestion(true);
    //     if (scrollTop > 0 && loadingQuestion == false) {
    //       setTodoApi({
    //         ...todoApi,
    //         pageIndex: todoApi.pageIndex + 1,
    //       });
    //     }
    //   }
    // }
  };

  const getDataSetPackageResult = () => {
    (async () => {
      try {
        let res = await packageResultDetailApi.getAll({
          pageSize: 9999,
          pageIndex: 1,
          SetPackageResultID: 9,
        });
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
          {detailResult.map((data) => (
            <Fragment>
              {data.SetPackageExerciseStudent.map((question, idx) => (
                <div className="question-item" key={idx}>
                  <div className="box-detail">
                    <div className="box-title">
                      <span className="title-ques">Câu hỏi {idx + 1}</span>
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
