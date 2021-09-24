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
  isGetQuestion: boolean;
  listQuestionAddOutside: Array<objectQuestionAddOutside>;
  listQuestionID: Array<number>;
  listGroupID: Array<number>;
};

const ExamDetailContext = createContext<IProps>({
  onAddQuestion: () => {},
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
  const [examTopicDetail, setExamTopicDetail] = useState<IExamTopic>();
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

  // console.log("Data Exam: ", dataExamDetail);
  // console.log("List question: ", listQuestionID);
  console.log("List Group ID: ", listGroupID);

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
          item.ExerciseGroupID !== 0 &&
            cloneListGroupID.push(item.ExerciseGroupID);
          item.ExerciseTopic.forEach((ques) => {
            cloneListQuestionID.push(ques.ExerciseID);
          });
        });
        setListGroupID([...cloneListGroupID]);
        setListQuestionID([...cloneListQuestionID]);
        setListQuestionAddOutside([]);

        // Caculator pageindex
        let totalPage = Math.ceil(res.data.totalRow / 10);
        setTotalPageIndex(totalPage);
      }
    } catch (error) {
      showNoti("danger", error);
    } finally {
      setIsLoading(false);
      loadingQuestion && setLoadingQuestion(false);
    }
  };

  const getExamTopicDetail = async () => {
    try {
      let res = await examTopicApi.getByID(examID);
      if (res.status == 200) {
        setExamTopicDetail(res.data.data);
      }
    } catch (error) {
      showNoti("danger", error);
    }
  };

  const getTabActive = (e) => {
    e.preventDefault();
    console.log(e.target);
    let tab = e.target.parentElement.getAttribute("data-index");
    setTabActive(tab);
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
              <TypingList />
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
            <WrapList>
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
          <div key={6}>
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

  const onFetchData = () => {
    setIsLoading(true);
    setListGroupID([]);
    setListQuestionID([]);
    setDataExamDetail([]);
    setTodoApi(listTodoApi);
    setIsGetQuestion(false);
  };

  // ON GET LIST QUESTION ID
  const onGetListQuestionID = (objectQuestion: any) => {
    listQuestionAddOutside.push(objectQuestion);

    setListQuestionAddOutside([...listQuestionAddOutside]);
  };
  console.log("List question add outside: ", listQuestionAddOutside);
  // ON SCROLL
  const onScroll = () => {
    const scrollHeight = boxEl.current.scrollHeight;
    const offsetHeight = boxEl.current.offsetHeight;
    const scrollTop = boxEl.current.scrollTop;

    // console.log("Height: ", scrollHeight - offsetHeight - 50);
    // console.log("Scroll: ", scrollTop);

    if (scrollTop > scrollHeight - offsetHeight - 50) {
      if (todoApi.pageIndex < totalPageIndex) {
        setLoadingQuestion(true);

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
  }, []);

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
          <span className="list-title">Loại câu hỏi:</span>
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
        isGetQuestion: isGetQuestion,
        onGetListQuestionID,
        listQuestionAddOutside,
        listQuestionID: listQuestionID,
        listGroupID: listGroupID,
      }}
    >
      <div className="question-create">
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
                    </ul>
                  </Popover>
                </div>
              }
              extra={
                <AddQuestionModal
                  dataExam={examTopicDetail}
                  onFetchData={onFetchData}
                />
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
                  dataExamDetail?.map((item, index) =>
                    returnQuestionType(item, index)
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
              title="DS rút gọn"
              // extra={<AddQuestionForm />}
            >
              <ul className="list-exam-bank">
                <li>
                  <a href="#" onClick={getTabActive} data-index={1}>
                    <span className="number">1/</span>
                    <span className="text">Đề thi số 1</span>
                  </a>
                </li>
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
