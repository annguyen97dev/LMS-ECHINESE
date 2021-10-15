import React, { useEffect, useState } from "react";
import { Card, Checkbox, Spin, Modal } from "antd";
import { CloseOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import { examDetailApi, examTopicApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import CountDown from "~/components/Elements/CountDown/CountDown";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { useRouter } from "next/router";
import { useDoingTest } from "~/context/useDoingTest";
import dynamic from "next/dynamic";

const ListQuestion = dynamic(
  () => import("~/components/Global/DoingTest/ListQuestion"),
  {
    loading: () => <p>...</p>,
    ssr: false,
  }
);

const MainTest = (props) => {
  const { getListQuestionID, getActiveID } = useDoingTest();
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
  const [activeID, setActiveID] = useState(null);
  const router = useRouter();
  const packageID = router.query.packageID as string;
  const { packageResult, getPackageResult } = useDoingTest();
  const { userInformation } = useWrap();

  console.log("DataQuestion: ", dataQuestion);
  // console.log("Space Question: ", spaceQuestion);
  // console.log("List question ID: ", listQuestionID);

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
        checkSpaceQuestionAtFirst(res.data.data);

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

  const checkSpaceQuestionAtFirst = (data) => {
    if (data[0].ExerciseGroupID !== 0) {
      setIsGroup(true);
      setSpaceQuestion({
        start: 0,
        end: 1,
      });
    } else {
      data.every((item, index) => {
        if (index == spaceQuestion.start + 1) {
          if (item.ExerciseGroupID !== 0) {
            setSpaceQuestion({
              ...spaceQuestion,
              end: index,
            });
            return false;
          } else {
            setIsGroup(false);
            setSpaceQuestion({
              ...spaceQuestion,
              end: index + 1,
            });
            return false;
          }
        }

        return true;
      });
    }
  };

  function onChange_preview(e) {
    // console.log(`checked = ${e.target.checked}`);
  }

  // -- CHECK IS SINGLE
  const checkIsSingle = (indexCurrent) => {
    if (
      indexCurrent !== spaceQuestion.start &&
      indexCurrent !== 0 &&
      indexCurrent !== spaceQuestion.end
    ) {
      if (spaceQuestion.end - spaceQuestion.start == 2) {
        indexCurrent = indexCurrent - 1;
      }
    }

    dataQuestion.every((item, index) => {
      if (index == indexCurrent + 1) {
        if (item.ExerciseGroupID !== 0) {
          // nếu là group

          setSpaceQuestion({
            start: indexCurrent,
            end: index,
          });
          return false;
        } else {
          setSpaceQuestion({
            start: indexCurrent,
            end: index + 1,
          });
          return false;
        }
      }

      return true;
    });
  };

  // -- CHECK IS GROUP --
  const checkIsGroup = (page) => {
    let exerciseID = listQuestionID[page - 1];

    dataQuestion.every((item, index) => {
      // Kiểm tra nếu trong list Exercise Topic có exercise ID thì bắt đầu lấy được vị trí
      if (
        item.ExerciseTopic.some((object) => object["ExerciseID"] == exerciseID)
      ) {
        // Kiểm tra ở vị trí này là câu hỏi nhóm hay đơn
        if (item.ExerciseGroupID !== 0) {
          setSpaceQuestion({
            start: index,
            end: index + 1,
          });
          setIsGroup(true);
        } else {
          setIsGroup(false);
          checkIsSingle(index);
        }
        return false;
      }
      return true;
    });

    // return isGroup;
  };

  // --- ON CHAGNE PAGINATION
  const onChange_pagination = (e, page: number) => {
    e.preventDefault();
    setActiveID(listQuestionID[page - 1]);
    getActiveID(listQuestionID[page - 1]);

    checkIsGroup(page);
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
      getActiveID(listQuestionID[0]);
      setActiveID(listQuestionID[0]);
    }
  }, [listQuestionID]);

  // Use to check
  useEffect(() => {
    if (spaceQuestion.start !== null && spaceQuestion.end !== null) {
      dataQuestion
        .slice(spaceQuestion.start, spaceQuestion.end)
        .map((item) => console.log("ITEM ACTIVE: ", item));
    }
  }, [spaceQuestion]);

  useEffect(() => {
    if (userInformation) {
      getPackageResult({
        ...packageResult,
        SetPackageDetailID: parseInt(packageID),
        StudentID: userInformation.UserInformationID,
      });
    }
  }, [userInformation]);

  useEffect(() => {
    if (dataQuestion?.length > 0) {
      dataQuestion.forEach((item, index) => {
        let listQuestion = [];

        item.ExerciseTopic.forEach((ques, index) => {
          listQuestion.push({
            ExerciseID: ques.ExerciseID,
            SetPackageExerciseAnswerStudentList: [],
          });
        });

        packageResult.SetPackageResultDetailInfoList.push({
          ExamTopicDetailID: item.ID,
          ExerciseGroupID: item.ExerciseGroupID,
          Level: item.Level,
          Type: item.Type,
          SkillID: item.SkillID,
          SetPackageExerciseStudentInfoList: listQuestion,
        });

        getPackageResult({
          ...packageResult,
        });
      });
    }
  }, [dataQuestion]);

  return (
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
                    <div className="doingtest-group h-100" key={index}>
                      <div className="row h-100">
                        <div className="col-md-6 col-12 h-100">
                          <div className="box-paragraph">
                            {ReactHtmlParser(item.Content)}
                          </div>
                        </div>
                        <div className="col-md-6 col-12 h-100">
                          <div className="box-list-question">
                            <ListQuestion
                              dataQuestion={item}
                              listQuestionID={listQuestionID}
                            />
                          </div>
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
                listQuestionID.map((questionID, index) => (
                  <li
                    className={`item ${
                      questionID == activeID ? "activeDoing" : ""
                    }`}
                    value={questionID}
                    key={questionID}
                  >
                    <a
                      href=""
                      onClick={(e) => onChange_pagination(e, index + 1)}
                    >
                      {index + 1}
                    </a>
                  </li>
                ))}
            </ul>
            <span className="pagi-btn next">
              <RightOutlined />
            </span>
          </div>
          <div className="footer-submit text-right">
            <button className="btn btn-primary">Submit</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MainTest;
