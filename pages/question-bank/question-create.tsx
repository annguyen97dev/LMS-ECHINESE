import React, { useState, useReducer, useEffect } from "react";

import { Popover, Card, Tooltip, Select, Spin } from "antd";
import TitlePage from "~/components/Elements/TitlePage";
import { Info, Bookmark, Edit, Trash2 } from "react-feather";
import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";
import { type } from "os";
import { dataBoxType } from "~/lib/question-bank/dataBoxType";
import { data } from "~/lib/option/dataOption2";
import SelectFilterBox from "~/components/Elements/SelectFilterBox";
import LayoutBase from "~/components/LayoutBase";
import QuestionSingle from "~/components/Global/QuestionBank/QuestionSingle";
import QuestionMultiple from "~/components/Global/QuestionBank/QuestionMultiple";
import QuestionWrite from "~/components/Global/QuestionBank/QuestionWrite";
import { programApi, subjectApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const { Option, OptGroup } = Select;

const objData = {
  ExerciseGroupID: 0,
  SubjectID: null,
  SubjectName: "",
  DescribeAnswer: "",
  Level: null,
  LevelName: "",
  LinkAudio: "",
  Type: 0,
  TypeName: "",
  ExerciseAnswer: [
    {
      ID: 1,
      AnswerContent: "",
      isTrue: null,
    },
    {
      ID: 2,
      AnswerContent: "",
      isTrue: null,
    },
    {
      ID: 3,
      AnswerContent: "",
      isTrue: null,
    },
    {
      ID: 4,
      AnswerContent: "",
      isTrue: null,
    },
  ],
};

type initialState = {
  boxActive: string;
  showBoxType: boolean;
  typeQuestion: string;
  course: string;
};

type state = {
  boxActive: string;
  showBoxType: boolean;
  typeQuestion: string;
  course: string;
};

type action = {
  type: string;
  tab: number;
  isShow: boolean;
  questionType: string;
};

const initialState: initialState = {
  boxActive: "all", // Dạng câu hỏi 1 hay nhiều, map, ...
  typeQuestion: "single", // Câu hỏi đơn hoặc nhóm
  showBoxType: true, // xác định mới vào mở hay chưa
  course: "", // chọn khóa học
};

const reducer = (state: state, action: action) => {
  switch (action.type) {
    case "changeTab":
      return { ...state, boxActive: action.tab };
    case "showBoxType":
      return { ...state, showBoxType: action.isShow };
    case "showQuestionType":
      return { ...state, showQuestionType: action.questionType };
    default:
      throw new Error();
  }
};

const QuestionCreate = () => {
  const { showNoti } = useWrap();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, isLoadingSet] = useState(false);
  const [dataProgram, setDataProgram] = useState<IProgram[]>(null);
  const [dataSubject, setDataSubject] = useState<ISubject[]>(null);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [questionData, setQuestionData] = useState(objData);

  console.log("STATE is: ", state);

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

  const changeBoxType = (e: any, TabName: number) => {
    e.preventDefault();

    questionData.Type = TabName;
    setQuestionData({ ...questionData });

    dispatch({
      type: "changeTab",
      tab: TabName,
      isShow: state.showBoxType,
      questionType: state.typeQuestion,
    });
  };

  console.log("Question Data: ", questionData);

  const handleChange_select = (selectName, option) => {
    console.log(`Option:  ${option}`);

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
      default:
        break;
    }
    setQuestionData({ ...questionData });

    !state.showBoxType &&
      dispatch({
        type: "showBoxType",
        tab: null,
        isShow: true,
        questionType: state.typeQuestion,
      });
    isLoadingSet(true);

    setTimeout(() => {
      isLoadingSet(false);
    }, 1000);
  };

  const handleChange_selectType = (value) => {
    dispatch({
      type: "showQuestionType",
      tab: null,
      isShow: true,
      questionType: state.typeQuestion,
    });
  };

  useEffect(() => {
    getDataProgram();
  }, []);

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
                <p className="text-lesson">
                  <span className="font-weight-black">Môn học:</span>
                  <span>Tiếng anh</span>
                </p>
              </div>
            }
            extra={
              <CreateQuestionForm questionData={questionData} isEdit={false} />
            }
          >
            {!state.showBoxType ? (
              <>
                <p className="font-weight-blue text-center">
                  Vui lòng chọn môn học
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
                className={`question-list ${state.showBoxType ? "active" : ""}`}
              >
                {/** Q uesion Single */}
                <QuestionSingle />
                {/** Quesion Multiple */}
                <QuestionMultiple />
                {/** Question Write */}
                <QuestionWrite />
              </div>
            )}
          </Card>
        </div>
        <div className="col-md-4 col-12">
          <Card className="card-box-type">
            <div className={`row ${state.showBoxType ? "mb-2" : ""}`}>
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
                  state.showBoxType ? "active" : "nun-active"
                }`}
              >
                {dataBoxType?.map((item, index) => (
                  <div className="col-md-12">
                    <div className="box-type-question">
                      <a
                        href="#"
                        onClick={(e) => changeBoxType(e, item.TabName)}
                        className={
                          item.TabName === state.boxActive ? "active" : ""
                        }
                      >
                        <div className="type-img">
                          <img src={item.Images} alt="" className="img-inner" />
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
