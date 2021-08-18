import React, { useState, useRef, useEffect } from "react";

import { Popover, Card, Tooltip, Select, Spin } from "antd";
import TitlePage from "~/components/Elements/TitlePage";
import { Info, Bookmark, Edit, Trash2 } from "react-feather";
import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";
import { dataTypeGroup, dataTypeSingle } from "~/lib/question-bank/dataBoxType";
import { data } from "~/lib/option/dataOption2";
import SelectFilterBox from "~/components/Elements/SelectFilterBox";
import LayoutBase from "~/components/LayoutBase";
import QuestionSingle from "~/components/Global/QuestionBank/QuestionSingle";
import QuestionMultiple from "~/components/Global/QuestionBank/QuestionMultiple";
import QuestionWrite from "~/components/Global/QuestionBank/QuestionWrite";
import { programApi, subjectApi, exerciseApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { questionObj } from "./TypeData/";

const { Option, OptGroup } = Select;

const listTodoApi = {
  pageSize: 10,
  pageIndex: 1,
  SubjectID: null,
  Type: null,
  Level: null,
  ExerciseGroupID: null,
  ExamTopicType: null,
};

const QuestionCreate = () => {
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState(false);
  const [dataProgram, setDataProgram] = useState<IProgram[]>(null);
  const [dataSubject, setDataSubject] = useState<ISubject[]>(null);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [questionData, setQuestionData] = useState(questionObj);
  const [showListQuestion, setShowListQuestion] = useState(false);
  const [showTypeQuetion, setShowTypeQuestion] = useState({
    type: null,
    status: false,
  });
  const [todoApi, setTodoApi] = useState(listTodoApi);
  const [dataSource, setDataSource] = useState([]);
  const boxEl = useRef(null);
  const [totalPageIndex, setTotalPageIndex] = useState(0);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  // GET DATA SOURCE - DATA EXERCISE
  const getDataSource = async () => {
    try {
      let res = await exerciseApi.getAll(todoApi);
      if (res.status == 200) {
        let cloneData = [...dataSource];
        res.data.data.forEach((item, index) => {
          cloneData.push(item);
        });

        setDataSource([...cloneData]);
        todoApi.pageIndex == 1 && showNoti("success", "Thành công");
        !showListQuestion && setShowListQuestion(true);

        // Tính phân trang
        let totalPage = Math.ceil(res.data.totalRow / 10);
        setTotalPageIndex(totalPage);
      }

      res.status == 204 &&
        (showNoti("danger", "Không có dữ liệu"), setShowListQuestion(true));
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading(false);
      loadingQuestion && setLoadingQuestion(false);
    }
  };

  // GET DATA PROGRAM
  const getDataProgram = async () => {
    try {
      let res = await programApi.getAll({ pageIndex: 1, pageSize: 999999 });
      res.status == 200 && setDataProgram(res.data.data);
      res.status == 204 && showNoti("danger", "Chương trình không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  // GET DATA SUBJECT
  const getDataSubject = async (id) => {
    setLoadingSelect(true);
    try {
      let res = await subjectApi.getAll({
        pageIndex: 1,
        pageSize: 999999,
        ProgramID: id,
      });
      res.status == 200 && setDataSubject(res.data.data);
      res.status == 204 && showNoti("danger", "Môn học không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingSelect(false);
    }
  };

  const changeBoxType = (e: any, Type: number, TypeName: string) => {
    e.preventDefault();

    questionData.Type = Type;
    questionData.TypeName = TypeName;

    // Kiểm dạng câu hỏi gì để thay đổi list answer
    switch (Type) {
      case 4:
        questionData.ExerciseAnswer = [];
        setQuestionData({ ...questionData });
        break;
      case 1:
        questionData.ExerciseAnswer = questionObj.ExerciseAnswer;
      default:
        break;
    }

    // Add value vào data chung
    setQuestionData({ ...questionData });

    // Active
    setShowTypeQuestion({
      ...showTypeQuetion,
      type: Type,
    });

    // Show danh sách câu hỏi bên cạnh
    setIsLoading(true);
    !showListQuestion && setShowListQuestion(true);
    setDataSource([]);
    setTodoApi({
      ...todoApi,
      Type: Type,
      pageIndex: 1,
    });
  };

  console.log("Question Data: ", questionData);

  const handleChange_select = (selectName, option) => {
    switch (selectName) {
      case "program":
        getDataSubject(option.value);
        setDataSubject(null);

        break;
      case "type-question":
        questionData.ExerciseGroupID = option.value;

        break;
      case "subject":
        questionData.SubjectID = option.value;
        questionData.SubjectName = option.children;

        break;
      case "level":
        questionData.Level = option.value;
        questionData.LevelName = option.children;

        break;
      default:
        break;
    }
    setQuestionData({ ...questionData });

    // kiểm tra mới vào đã chọn đầy đủ 4 trường hay chưa rồi mới show danh sách dạng câu hỏi
    if (!showTypeQuetion.status) {
      if (
        questionData.ExerciseGroupID !== null &&
        questionData.SubjectID !== null &&
        questionData.Level !== null
      ) {
        setShowTypeQuestion({
          ...showTypeQuetion,
          status: true,
        });
      }
    }
  };

  // ON REMOVE DATA
  const onRemoveData = (quesID) => {
    let quesIndex = dataSource.findIndex((item) => item.ID == quesID);
    dataSource.splice(quesIndex, 1);
    setDataSource([...dataSource]);
  };

  // ON FETCH DATA
  const onFetchData = () => {
    scrollToTop(),
      setIsLoading(true),
      setDataSource([]),
      setTodoApi({ ...todoApi, pageIndex: 1, pageSize: 10 });
  };

  // Phân loại dạng câu hỏi để trả ra danh sách
  const returnQuestionType = () => {
    switch (todoApi.Type) {
      /** Q uesion Single */
      case 1:
        return (
          <QuestionSingle
            loadingQuestion={loadingQuestion}
            listQuestion={dataSource}
            onFetchData={onFetchData}
            onRemoveData={(quesID) => onRemoveData(quesID)}
          />
        );
        break;
      case 4:
        return (
          <QuestionMultiple
            loadingQuestion={loadingQuestion}
            listQuestion={dataSource}
            onFetchData={onFetchData}
            onRemoveData={(quesID) => onRemoveData(quesID)}
          />
        );
      default:
        return (
          <p className="text-center">
            <b>Danh sách còn trống</b>
          </p>
        );
        break;
    }
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

    console.log("Height: ", scrollHeight - offsetHeight);
    console.log("Scroll: ", scrollTop);

    if (scrollTop > scrollHeight - offsetHeight - 40) {
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

  console.log("DATA exercise: ", dataSource);

  useEffect(() => {
    getDataProgram(); // Lấy data chương trình
  }, []);

  useEffect(() => {
    if (questionData.Type !== 0) {
      getDataSource();
    }
    questionData.Content = "";
    switch (questionData.Type) {
      case 4:
        questionData.ExerciseAnswer = [];
        break;

      default:
        break;
    }
    setQuestionData({ ...questionData });
  }, [todoApi]);

  return (
    <div className="question-create">
      <TitlePage title="Tạo câu hỏi" />
      <div className="row">
        <div className="col-md-12"></div>
      </div>
      <div className="row mt-3">
        <div className="col-md-8 col-12">
          <Card
            className="card-detail-question"
            title={
              <div className="title-question-bank">
                <h3 className="title-big">
                  <Bookmark /> Danh sách câu hỏi
                </h3>
                {/* <p className="text-lesson">
                  <span className="font-weight-black">Môn học:</span>
                  <span>{questionData?.SubjectName}</span>
                </p> */}
              </div>
            }
            extra={
              <CreateQuestionForm
                questionData={questionData}
                onFetchData={onFetchData}
              />
            }
          >
            {!showListQuestion ? (
              <>
                <p className="font-weight-blue text-center">
                  Vui lòng chọn môn học và dạng câu hỏi
                </p>
                <div className="img-load">
                  <img src="/images/study-min.jpg" alt="" />
                </div>
              </>
            ) : isLoading ? (
              <div className="text-center p-2">
                <Spin />
              </div>
            ) : (
              <div
                className={`question-list active`}
                ref={boxEl}
                onScroll={onScroll}
              >
                {returnQuestionType()}
              </div>
            )}
          </Card>
        </div>
        <div className="col-md-4 col-12">
          <Card className="card-box-type">
            <div className={`row ${showTypeQuetion ? "mb-2" : ""}`}>
              {/** CHỌN CHƯƠNG TRÌNH */}
              <div className="col-md-6 col-12 ">
                <div className="item-select">
                  <Select
                    className="style-input"
                    defaultValue="Chọn chương trình"
                    style={{ width: "100%" }}
                    onChange={(value, option) =>
                      handleChange_select("program", option)
                    }
                  >
                    {dataProgram?.map((item, index) => (
                      <Option key={index} value={item.ID}>
                        {item.ProgramName}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              {/** CHỌN MÔN HỌC */}
              <div className="col-md-6 col-12 ">
                <div className="item-select">
                  {/* <p className="font-weight-black mb-2">Chọn môn học</p> */}
                  <Select
                    loading={loadingSelect}
                    className="style-input"
                    defaultValue="Chọn môn học"
                    style={{ width: "100%" }}
                    onChange={(value, option) =>
                      handleChange_select("subject", option)
                    }
                  >
                    {dataSubject?.map((item, index) => (
                      <Option key={index} value={item.ID}>
                        {item.SubjectName}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              {/** LOẠI CÂU HỎI (SINGLE HOẶC GROUP)  */}
              <div className="col-md-6 col-12 mt-3">
                <div className="item-select">
                  {/* <p className="font-weight-black mb-2">Loại câu hỏi</p> */}
                  <Select
                    className="style-input"
                    defaultValue="Chọn loại câu hỏi"
                    style={{ width: "100%" }}
                    onChange={(value, option) =>
                      handleChange_select("type-question", option)
                    }
                  >
                    <Option value="0">Câu hỏi đơn</Option>
                    <Option value="1">Câu hỏi nhóm</Option>
                  </Select>
                </div>
              </div>

              {/** MỨC ĐỘ  */}
              <div className="col-md-6 col-12 mt-3">
                <div className="item-select">
                  {/* <p className="font-weight-black mb-2">Loại câu hỏi</p> */}
                  <Select
                    className="style-input"
                    defaultValue="Chọn mức độ"
                    style={{ width: "100%" }}
                    onChange={(value, option) =>
                      handleChange_select("level", option)
                    }
                  >
                    <Option value="1">Dễ</Option>
                    <Option value="2">Trung bình</Option>
                    <Option value="3">Khó</Option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="row">
              <div
                className={`wrap-type-question w-100 ${
                  showTypeQuetion.status ? "active" : "nun-active"
                }`}
              >
                {questionData.ExerciseGroupID == 1
                  ? dataTypeGroup?.map((item, index) => (
                      <div className="col-md-12">
                        <div className="box-type-question">
                          <a
                            href="#"
                            onClick={(e) =>
                              changeBoxType(e, item.Type, item.TypeName)
                            }
                            className={
                              item.Type === showTypeQuetion.type ? "active" : ""
                            }
                          >
                            <div className="type-img">
                              <img
                                src={item.Images}
                                alt=""
                                className="img-inner"
                              />
                            </div>
                            <div className="type-detail">
                              <h5 className="number">{item.Number}</h5>
                              <div className="p text">{item.TypeName}</div>
                            </div>
                          </a>
                        </div>
                      </div>
                    ))
                  : dataTypeSingle?.map((item, index) => (
                      <div className="col-md-12">
                        <div className="box-type-question">
                          <a
                            href="#"
                            onClick={(e) =>
                              changeBoxType(e, item.Type, item.TypeName)
                            }
                            className={
                              item.Type === showTypeQuetion.type ? "active" : ""
                            }
                          >
                            <div className="type-img">
                              <img
                                src={item.Images}
                                alt=""
                                className="img-inner"
                              />
                            </div>
                            <div className="type-detail">
                              <h5 className="number">{item.Number}</h5>
                              <div className="p text">{item.TypeName}</div>
                            </div>
                          </a>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

QuestionCreate.layout = LayoutBase;
export default QuestionCreate;
