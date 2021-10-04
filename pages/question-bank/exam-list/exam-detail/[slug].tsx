import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,
} from "react";

import { Popover, Card, Skeleton, Spin } from "antd";
import TitlePage from "~/components/Elements/TitlePage";
import { Info, Bookmark } from "react-feather";

import LayoutBase from "~/components/LayoutBase";
import { useRouter } from "next/router";
import { examDetailApi, examTopicApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import ChoiceList from "~/components/Global/ExamList/ExamShow/ChoiceList";
import AddQuestionModal from "~/components/Global/ExamDetail/AddQuestionModal";
import MultipleList from "~/components/Global/ExamList/ExamShow/MultipleList";
import WrapList from "~/components/Global/ExamList/ExamShow/WrapList";
import MapList from "~/components/Global/ExamList/ExamShow/MapList";
import DragList from "~/components/Global/ExamList/ExamShow/DragList";
import TypingList from "~/components/Global/ExamList/ExamShow/TypingList";
import WrittingList from "~/components/Global/ExamList/ExamShow/WrittingList";
import AddQuestionAuto from "~/components/Global/ExamDetail/AddQuestionAuto";
import Link from "next/link";

const listAlphabet = [
  "A",
  "B",
  "C",
  "D",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
];

type objectQuestionAddOutside = {
  type: number;
  ExerciseOrExerciseGroupID: number;
};

export type IProps = {
  onAddQuestion: Function;
  onGetListQuestionID: Function;
  onRemoveQuestionAdd: Function;
  onDeleteQuestion: Function;
  onEditPoint: Function;
  isGetQuestion: boolean;
  listQuestionAddOutside: Array<objectQuestionAddOutside>;
  listQuestionID: Array<number>;
  listGroupID: Array<number>;
};

const ExamDetailContext = createContext<IProps>({
  onAddQuestion: () => {},
  onDeleteQuestion: () => {},
  onEditPoint: () => {},
  onRemoveQuestionAdd: (data) => {},
  onGetListQuestionID: (data) => {},
  isGetQuestion: false,
  listQuestionAddOutside: [],
  listQuestionID: [],
  listGroupID: [],
});

const ExamDetail = () => {
  const { showNoti } = useWrap();
  const [tabActive, setTabActive] = useState(0);
  const router = useRouter();
  const examID = parseInt(router.query.slug as string);
  const [dataExamDetail, setDataExamDetail] = useState([]);
  const [examTopicDetail, setExamTopicDetail] = useState<IExamTopic>(null);
  const [listQuestionID, setListQuestionID] = useState([]); // Lấy tất cả ID đã có
  const [listGroupID, setListGroupID] = useState([]); // Lấy tất cả group ID đã có
  const [listQuestionAddOutside, setListQuestionAddOutside] = useState([]); // Lấy tất cả ID vừa add
  const [isGetQuestion, setIsGetQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPageIndex, setTotalPageIndex] = useState(0);
  const boxEl = useRef(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const listTodoApi = {
    pageIndex: 1,
    pageSize: 10,
    ExamTopicID: examID,
  };
  const [todoApi, setTodoApi] = useState(listTodoApi);
  const [listExam, setListExam] = useState([]);
  const [loadingExam, setLoadingExam] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  let { asPath } = useRouter();

  console.log("Data Exam: ", dataExamDetail);
  console.log("List question: ", listQuestionID);
  // console.log("List Group ID: ", listGroupID);

  // ---- GET LIST EXAM ----
  const getListExam = async () => {
    try {
      let res = await examTopicApi.getAll({
        setlectAll: true,
        SubjectID: examTopicDetail.SubjectID,
        Type: examTopicDetail.Type,
      });
      if (res.status == 200) {
        setListExam(res.data.data);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingExam(false);
    }
  };

  // ---- GET LIST QUESTION IN EXAM ----
  const getExamDetail = async () => {
    let cloneListQuestionID = [...listQuestionID];
    let cloneListGroupID = [...listGroupID];

    try {
      let res = await examDetailApi.getAll(todoApi);
      if (res.status == 200) {
        setDataExamDetail(res.data.data);

        let cloneData = [...dataExamDetail];
        res.data.data.forEach((item, index) => {
          cloneData.push(item);
        });

        setDataExamDetail([...cloneData]);

        res.data.data.forEach((item) => {
          if (item.Enable) {
            item.ExerciseGroupID !== 0 &&
              cloneListGroupID.push(item.ExerciseGroupID);
            item.ExerciseTopic.forEach((ques) => {
              cloneListQuestionID.push(ques.ExerciseID);
            });
          }
        });
        setListGroupID([...cloneListGroupID]);
        setListQuestionID([...cloneListQuestionID]);
        setListQuestionAddOutside([]);

        // Caculator pageindex
        let totalPage = Math.ceil(res.data.totalRow / 10);
        setTotalPageIndex(totalPage);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading(false);
      setLoadingQuestion(false);
    }
  };

  console.log("LOADING QUESTION: ", loadingQuestion);

  const getExamTopicDetail = async () => {
    listExam.length == 0 && setLoadingExam(true);
    setLoadingDetail(true);
    try {
      let res = await examTopicApi.getByID(examID);
      if (res.status == 200) {
        setExamTopicDetail(res.data.data);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  // RETURN QUESTION TYPE
  const returnQuestionType = (item, index) => {
    const type = item.Type;
    switch (type) {
      case 1:
        return (
          <div key={index}>
            <WrapList dataQuestion={item} listQuestionID={listQuestionID}>
              <ChoiceList
                listQuestionID={listQuestionID}
                dataQuestion={item}
                listAlphabet={listAlphabet}
              />
            </WrapList>
          </div>
        );
        break;
      case 2:
        return (
          <div key={index}>
            <WrapList dataQuestion={item} listQuestionID={listQuestionID}>
              <DragList
                listQuestionID={listQuestionID}
                dataQuestion={item}
                listAlphabet={listAlphabet}
              />
            </WrapList>
          </div>
        );
        break;
      case 3:
        return (
          <div key={index}>
            <WrapList dataQuestion={item} listQuestionID={listQuestionID}>
              <TypingList
                listQuestionID={listQuestionID}
                dataQuestion={item}
                listAlphabet={listAlphabet}
              />
            </WrapList>
          </div>
        );
        break;
      case 4:
        return (
          <div key={index}>
            <WrapList dataQuestion={item} listQuestionID={listQuestionID}>
              <MultipleList
                listQuestionID={listQuestionID}
                dataQuestion={item}
                listAlphabet={listAlphabet}
              />
            </WrapList>
          </div>
        );
        break;
      case 5:
        return (
          <div key={index}>
            <WrapList dataQuestion={item} listQuestionID={listQuestionID}>
              <MapList
                listQuestionID={listQuestionID}
                dataQuestion={item}
                listAlphabet={listAlphabet}
              />
            </WrapList>
          </div>
        );
        break;
      case 6:
        return (
          <div key={index}>
            <WrapList dataQuestion={item} listQuestionID={listQuestionID}>
              <WrittingList
                listQuestionID={listQuestionID}
                dataQuestion={item}
                listAlphabet={listAlphabet}
              />
            </WrapList>
          </div>
        );
        break;
      case 7:
        return (
          <div key={index}>
            <WrapList dataQuestion={item} listQuestionID={listQuestionID}>
              <WrittingList
                listQuestionID={listQuestionID}
                dataQuestion={item}
                listAlphabet={listAlphabet}
              />
            </WrapList>
          </div>
        );
        break;
      default:
        return;
        break;
    }
  };

  // ON ADD QUESTION TO EXAM
  const onAddQuestion = () => {
    setIsGetQuestion(true);
  };

  // ON FETCH DATA
  const onFetchData = () => {
    setIsLoading(true);
    setListGroupID([]);
    setListQuestionID([]);
    setDataExamDetail([]);
    setTodoApi(listTodoApi);
    setIsGetQuestion(false);
  };

  // ON DELETE QUESTION
  const onDeleteQuestion = (dataDelete) => {
    let cloneListQuestionID = [];
    let cloneListGroupID = [];
    let cloneDataExam = [...dataExamDetail];

    let indexQues = cloneDataExam.findIndex((item) => item.ID == dataDelete.ID);
    cloneDataExam.splice(indexQues, 1);

    cloneDataExam.forEach((item) => {
      item.ExerciseGroupID !== 0 && cloneListGroupID.push(item.ExerciseGroupID);
      item.ExerciseTopic.forEach((ques) => {
        cloneListQuestionID.push(ques.ExerciseID);
      });
    });
    setListGroupID([...cloneListGroupID]);
    setListQuestionID([...cloneListQuestionID]);

    setDataExamDetail([...cloneDataExam]);
  };

  // ON EDIT POINT
  const onEditPoint = (dataEdit, detailID) => {
    console.log("DATA edit: ", dataEdit);
    console.log("DATA detail ID: ", detailID);

    dataExamDetail.every((item, index) => {
      if (detailID == item.ID) {
        // item.ExerciseTopic.forEach((ques, quesIndex) => {
        //   if (
        //     ques.ExerciseID ==
        //     dataEdit.some((object) => object["ExerciseOrExerciseGroupID"])
        //   ) {
        //     ques.Point = dataEdit.Point;

        //   }
        //   return true;
        // });
        item.ExerciseTopic[0].Point = dataEdit[0].Point;
        return false;
      }
      return true;
    });

    setDataExamDetail([...dataExamDetail]);
  };

  // ON REMOVE QUESTION ADD IN LIST
  const onRemoveQuestionAdd = (objectQuestion: any) => {
    let index = listQuestionAddOutside.findIndex(
      (item) =>
        item.ExerciseOrExerciseGroupID ==
        objectQuestion.ExerciseOrExerciseGroupID
    );
    listQuestionAddOutside.splice(index, 1);
    setListQuestionAddOutside([...listQuestionAddOutside]);
  };

  // ON GET LIST QUESTION ID
  const onGetListQuestionID = (objectQuestion: any) => {
    listQuestionAddOutside.push(objectQuestion);

    setListQuestionAddOutside([...listQuestionAddOutside]);
  };

  // SCROLL TO TOP
  const scrollToTop = () => {
    boxEl.current.scrollTo(0, 0);
  };
  // ON SCROLL
  const onScroll = () => {
    const scrollHeight = boxEl.current.scrollHeight;
    const offsetHeight = boxEl.current.offsetHeight;
    const scrollTop = boxEl.current.scrollTop;

    // console.log("Height: ", scrollHeight - offsetHeight - 50);
    // console.log("Scroll: ", scrollTop);

    if (scrollTop > scrollHeight - offsetHeight - 50) {
      if (todoApi.pageIndex < totalPageIndex) {
        dataExamDetail?.length !== 0 && setLoadingQuestion(true);

        if (scrollTop > 0 && loadingQuestion == false) {
          setTodoApi({
            ...todoApi,
            pageIndex: todoApi.pageIndex + 1,
          });
        }
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getExamTopicDetail();
  }, [examID]);

  useEffect(() => {
    if (examTopicDetail) {
      if (listExam.length == 0) {
        getListExam();
      }
    }
  }, [examTopicDetail]);

  useEffect(() => {
    onFetchData();
    scrollToTop();
  }, [examID]);

  useEffect(() => {
    getExamDetail();
  }, [todoApi]);

  const content = (
    <div className="question-bank-info">
      <ul className="list">
        <li className="list-item mb-0">
          <span className="list-title">Chương trình</span>
          <span className="list-text">{examTopicDetail?.ProgramName}</span>
        </li>
        <li className="list-item">
          <span className="list-title">Môn học:</span>
          <span className="list-text">{examTopicDetail?.SubjectName}</span>
        </li>
        <li className="list-item">
          <span className="list-title">Dạng đề thi:</span>
          <span className="list-text">{examTopicDetail?.TypeName}</span>
        </li>

        <li className="list-item mb-0">
          <span className="list-title">Thời gian:</span>
          <span className="list-text">{examTopicDetail?.Time} phút</span>
        </li>
      </ul>
    </div>
  );

  return (
    <ExamDetailContext.Provider
      value={{
        onAddQuestion,
        onEditPoint,
        isGetQuestion: isGetQuestion,
        onGetListQuestionID,
        listQuestionAddOutside,
        listQuestionID: listQuestionID,
        listGroupID: listGroupID,
        onRemoveQuestionAdd,
        onDeleteQuestion,
      }}
    >
      <div className="question-create exam">
        <TitlePage title="Tạo đề thi" />

        <div className="row">
          <div className="col-md-9 col-12">
            <Card
              className="card-detail-exam card-detail-question"
              title={
                <div className="title-question-bank">
                  <h3 className="title-big">
                    <Bookmark /> {examTopicDetail?.Name}
                  </h3>
                  <Popover
                    content={content}
                    trigger="hover"
                    placement="bottomLeft"
                  >
                    {loadingDetail ? (
                      <div className="row">
                        <div className="col-md-3">
                          <Skeleton
                            paragraph={false}
                            loading={true}
                            title={true}
                            active
                          />
                        </div>
                        <div className="col-md-3">
                          <Skeleton
                            paragraph={false}
                            loading={true}
                            title={true}
                            active
                          />
                        </div>
                        <div className="col-md-3">
                          <Skeleton
                            paragraph={false}
                            loading={true}
                            title={true}
                            active
                          />
                        </div>
                      </div>
                    ) : (
                      <ul className="list-detail-question">
                        <li>
                          <span className="icon-detail-question">
                            <Info />
                          </span>
                        </li>
                        <li>
                          <span className="title">Môn học:</span>
                          <span className="text">
                            {examTopicDetail?.SubjectName}
                          </span>
                        </li>
                        <li>
                          <span className="title">Thời gian:</span>
                          <span className="text">
                            {examTopicDetail?.Time} phút
                          </span>
                        </li>
                        <li>
                          <span className="title">Tổng số câu:</span>
                          <span className="text">{listQuestionID.length}</span>
                        </li>
                      </ul>
                    )}
                  </Popover>
                </div>
              }
              extra={
                <>
                  <AddQuestionModal
                    dataExam={examTopicDetail}
                    onFetchData={onFetchData}
                  />
                  <AddQuestionAuto
                    dataExam={examTopicDetail}
                    onFetchData={onFetchData}
                    examTopicID={examID}
                  />
                </>
              }
            >
              <div className="question-list" ref={boxEl} onScroll={onScroll}>
                {isLoading ? (
                  <div className="text-center mt-3">
                    <Spin />
                  </div>
                ) : dataExamDetail.length == 0 ? (
                  <p className="text-center">
                    <b>Đề thi hiện chưa có câu hỏi nào</b>
                  </p>
                ) : (
                  dataExamDetail?.map(
                    (item, index) =>
                      item.Enable && returnQuestionType(item, index)
                  )
                )}
                {loadingQuestion && (
                  <div>
                    <Skeleton />
                  </div>
                )}
              </div>
            </Card>
          </div>
          <div className="col-md-3 col-12 fixed-card">
            <Card
              className="card-exam-bank"
              title="Danh sách đề cùng môn học"
              // extra={<AddQuestionForm />}
            >
              <ul className="list-exam-bank">
                {loadingExam ? (
                  <div className="text-center mt-4">
                    <Spin />
                    <p className="d-block">Đang tải danh sách...</p>
                  </div>
                ) : listExam?.length > 0 ? (
                  listExam.map((item, index) => (
                    <li key={index} className={item.ID == examID && "active"}>
                      <Link
                        href={{
                          pathname:
                            "/question-bank/exam-list/exam-detail/[slug]",
                          query: { slug: item.ID },
                        }}
                      >
                        <a className="">
                          <span className="number">{index + 1}/</span>
                          <span className="text">{item.Name}</span>
                        </a>
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="font-italic">Không có dữ liệu</p>
                )}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </ExamDetailContext.Provider>
  );
};
ExamDetail.layout = LayoutBase;
export default ExamDetail;

export const useExamDetail = () => useContext(ExamDetailContext);
