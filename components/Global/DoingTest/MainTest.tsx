import React, { useEffect, useState } from "react";
import { Card, Checkbox, Spin, Modal } from "antd";
import { CloseOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import { DoingTestProvider } from "~/context/useDoingTest";
import { examDetailApi, examTopicApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import CountDown from "~/components/Elements/CountDown/CountDown";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import ListQuestion from "./ListQuestion";
import { useDoingTest } from "~/context/useDoingTest";

const MainTest = (props) => {
  const { getListQuestionID } = useDoingTest();
  const { examID, infoExam } = props;
  const listTodoApi = {
    pageIndex: 1,
    pageSize: 999,
    ExamTopicID: examID,
  };
  const { showNoti } = useWrap();
  const [todoApi, setTodoApi] = useState(listTodoApi);
  const [isLoading, setIsLoading] = useState(false);
  const [dataQuestion, setDataQuestion] = useState<IExamDetail[]>(null);
  const [isGroup, setIsGroup] = useState(false);
  const [addMinutes, setAddMinutes] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listQuestionID, setListQuestionID] = useState([]); // Lấy tất cả ID đã có
  const [listGroupID, setListGroupID] = useState([]); // Lấy tất cả group ID đã có
  const [spaceQuestion, setSpaceQuestion] = useState({
    start: 0,
    end: null,
  });

  console.log("DataQuestion: ", dataQuestion);
  // console.log("Space Question: ", spaceQuestion);

  // --- GET LIST QUESTION ---
  const getListQuestion = async () => {
    let cloneListQuestionID = [...listQuestionID];
    let cloneListGroupID = [...listGroupID];
    setIsLoading(true);
    try {
      let res = await examDetailApi.getAll(todoApi);
      if (res.status == 200) {
        setDataQuestion(res.data.data);

        // Add questionid to list
        res.data.data.forEach((item, index) => {
          if (item.Enable) {
            item.ExerciseGroupID !== 0 &&
              cloneListGroupID.push(item.ExerciseGroupID);
            item.ExerciseTopic.forEach((ques) => {
              cloneListQuestionID.push(ques.ExerciseID);
            });
          }
        });

        // Calculate space question
        res.data.data.every((item, index) => {
          if (item.ExerciseGroupID !== 0) {
            setSpaceQuestion({
              ...spaceQuestion,
              end: index,
            });
            return false;
          }
          return true;
        });

        setListGroupID([...cloneListGroupID]);
        setListQuestionID([...cloneListQuestionID]);

        // Run time
        const add_minutes = (function (dt, minutes) {
          return new Date(dt.getTime() + minutes * 60000);
        })(new Date(), infoExam.Time);
        setAddMinutes(add_minutes);
      }
      if (res.status == 204) {
        setDataQuestion([]);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  function onChange_preview(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  console.log("Space Question: ", spaceQuestion);

  // -- CHECK IS SINGLE
  const checkIsSingle = (index) => {
    dataQuestion.slice(index, dataQuestion.length - 1).every((item, i) => {
      if (item.ExerciseGroupID !== 0) {
        setSpaceQuestion({
          start: index,
          end: i,
        });
      }
    });
  };

  // -- CHECK IS GROUP --
  const checkIsGroup = (page) => {
    let exerciseID = listQuestionID[page - 1];
    let isGroup = false;

    dataQuestion.every((item, index) => {
      if (
        item.ExerciseTopic.some((object) => object["ExerciseID"] == exerciseID)
      ) {
        if (item.ExerciseGroupID !== 0) {
          isGroup = true;
          setSpaceQuestion({
            start: index,
            end: index + 1,
          });
          setIsGroup(true);
        } else {
          checkIsSingle(index);
        }
        return false;
      }
      return true;
    });

    // return isGroup;
  };

  // --- ON CHAGNE PAGINATION
  const onChange_pagination = (page: number) => {
    console.log("PAGE: ", page);
    if (page > spaceQuestion.end) {
      checkIsGroup(page);
    }
  };

  // --- TIME UP ---
  const timeUp = () => {
    // setHandleclick(false);
    // setShowPopup(true);
    alert("Hết giờ làm bài");
  };

  // --- ACTION SHOW MODAL ---
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    getListQuestion();
  }, []);

  useEffect(() => {
    if (listQuestionID?.length > 0) {
      getListQuestionID(listQuestionID);
    }
  }, [listQuestionID]);

  return (
    <DoingTestProvider>
      <div className="test-wrapper">
        <Modal
          title="Chú ý!"
          visible={isModalVisible}
          okText="Đồng ý"
          cancelText="Đóng"
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p style={{ fontWeight: 500 }}>
            Bạn chưa chọn đề thi. Chuyển đến trang bộ đề?
          </p>
        </Modal>
        <Card
          className="test-card"
          title={
            <div className="test-title-info">
              <h6 className="name-type-test">{infoExam?.Name}</h6>
              <p className="info-user">
                <span>{infoExam?.ProgramName}</span>
              </p>
            </div>
          }
          extra={
            infoExam &&
            dataQuestion?.length > 0 &&
            addMinutes && (
              <CountDown
                addMinutes={addMinutes}
                onFinish={() => !isModalVisible && timeUp()}
              />
            )
          }
        >
          <div className="test-body">
            {isLoading ? (
              <div className="w-100 mt-4 text-center">
                <Spin />
                <p className="mt-3" style={{ fontStyle: "italic" }}>
                  Đang tải dữ liệu...
                </p>
              </div>
            ) : dataQuestion?.length > 0 ? (
              dataQuestion
                .slice(spaceQuestion.start, spaceQuestion.end)
                .map((item, index) => {
                  if (isGroup) {
                    return (
                      <div className="doingtest-group" key={index}>
                        <div className="row">
                          <div className="col-md-6 col-12">
                            {ReactHtmlParser(item.Content)}
                          </div>
                          <div className="col-md-6 col-12">
                            <ListQuestion
                              dataQuestion={item}
                              listQuestionID={listQuestionID}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="doingtest-single" key={index}>
                        <div className="row">
                          <div className="col-12">
                            <ListQuestion
                              dataQuestion={item}
                              listQuestionID={listQuestionID}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                })
            ) : (
              <div className="w-100 text-center">
                <p style={{ fontWeight: 500 }}>Đề thi này chưa có câu hỏi</p>
              </div>
            )}
          </div>
          <div className="test-footer">
            {/* <div className="footer-preview">
              <Checkbox onChange={onChange_preview}>Preview</Checkbox>
            </div> */}
            <div className="footer-pagination row-pagination">
              {/* {listQuestionID?.length > 0 && (
                <Pagination
                  defaultCurrent={1}
                  total={listQuestionID.length}
                  pageSize={1}
                  onChange={onChange_pagination}
                />
              )} */}

              <button className="close-icon">
                <CloseOutlined />
              </button>
              <p className="pagi-name">Danh sách câu hỏi</p>
              <Checkbox onChange={onChange_preview}>Preview</Checkbox>
              <span className="pagi-btn previous">
                <LeftOutlined />
              </span>
              <ul className="list-answer">
                {listQuestionID?.length > 0 &&
                  listQuestionID.map((question, index) => (
                    <li className={`item`} value={question}>
                      <span
                      // className={handleCheckNumber(question.QuestionID)}
                      >
                        {index + 1}
                      </span>
                    </li>
                  ))}
              </ul>
              <span className="pagi-btn next">
                <RightOutlined />
              </span>
            </div>
            <div className="footer-submit text-right">
              <button className="btn btn-success">Submit</button>
            </div>
          </div>
        </Card>
      </div>
    </DoingTestProvider>
  );
};

export default MainTest;
