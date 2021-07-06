import React, { useState, useReducer } from "react";

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
const { Option, OptGroup } = Select;
const content = (
  <div className="question-bank-info">
    <ul className="list">
      <li className="list-item">
        <span className="list-title">Môn học:</span>
        <span className="list-text">English</span>
      </li>
      <li className="list-item">
        <span className="list-title">Loại môn học:</span>
        <span className="list-text">Phát âm</span>
      </li>
      <li className="list-item">
        <span className="list-title">Loại câu hỏi:</span>
        <span className="list-text">Câu hỏi nhóm</span>
      </li>
      <li className="list-item">
        <span className="list-title">Mức độ:</span>
        <span className="list-text">Rất khó</span>
      </li>
      <li className="list-item mb-0">
        <span className="list-title">Học kỳ:</span>
        <span className="list-text">học kỳ II</span>
      </li>
      <li className="list-item mb-0">
        <span className="list-title">File:</span>
        <span className="list-text">không có</span>
      </li>
    </ul>
  </div>
);

const dataLesson = [
  {
    LessonName: "Ngoại ngữ",
    Value: "language",
    LessonChild: [
      {
        LessonName: "Tiếng Anh",
        Value: "english",
      },
      {
        LessonName: "Tiếng Pháp",
        Value: "France",
      },
    ],
  },
  {
    LessonName: "Ngữ văn",
    Value: "nv",
    LessonChild: [],
  },
  {
    LessonName: "Toán",
    Value: "match",
    LessonChild: [],
  },
];

const dataQuestion = [
  {
    TypeQues: "",
    TextQues:
      "Jack's father is a farmer, he 55 years old and he work in ... company",
    AnswerList: [
      {
        TextAns: "Đáp án",
        Correct: true,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
    ],
  },
  {
    TypeQues: "",
    TextQues:
      "Jack's father is a farmer, he 55 years old and he work in ... company",
    AnswerList: [
      {
        TextAns: "Đáp án",
        Correct: true,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
    ],
  },
  {
    TypeQues: "",
    TextQues:
      "Jack's father is a farmer, he 55 years old and he work in ... company",
    AnswerList: [
      {
        TextAns: "Đáp án",
        Correct: true,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
    ],
  },
  {
    TypeQues: "",
    TextQues:
      "Jack's father is a farmer, he 55 years old and he work in ... company",
    AnswerList: [
      {
        TextAns: "Đáp án",
        Correct: true,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
    ],
  },
  {
    TypeQues: "",
    TextQues:
      "Jack's father is a farmer, he 55 years old and he work in ... company",
    AnswerList: [
      {
        TextAns: "Đáp án",
        Correct: true,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
    ],
  },
  {
    TypeQues: "",
    TextQues:
      "Jack's father is a farmer, he 55 years old and he work in ... company",
    AnswerList: [
      {
        TextAns: "Đáp án",
        Correct: true,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
    ],
  },
  {
    TypeQues: "",
    TextQues:
      "Jack's father is a farmer, he 55 years old and he work in ... company",
    AnswerList: [
      {
        TextAns: "Đáp án",
        Correct: true,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
      {
        TextAns: "Đáp án",
        Correct: false,
      },
    ],
  },
];

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
  tab: string;
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, isLoadingSet] = useState(false);

  console.log("STATE is: ", state);

  const changeBoxType = (e: any, TabName: string) => {
    e.preventDefault();
    dispatch({
      type: "changeTab",
      tab: TabName,
      isShow: state.showBoxType,
      questionType: state.typeQuestion,
    });
  };

  const handleChange_selectLesson = (value) => {
    console.log(`selected ${value}`);

    !state.showBoxType &&
      dispatch({
        type: "showBoxType",
        tab: "",
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
      tab: "",
      isShow: true,
      questionType: state.typeQuestion,
    });
  };

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
            extra={<CreateQuestionForm isEdit={false} />}
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
              {/** CHỌN MÔN HỌC */}
              <div className="col-md-6 col-12 ">
                <div className="item-select">
                  {/* <p className="font-weight-black mb-2">Chọn môn học</p> */}
                  <Select
                    className="style-input"
                    defaultValue="Chọn môn học"
                    style={{ width: "100%" }}
                    onChange={handleChange_selectLesson}
                  >
                    {dataLesson?.map((item, index) =>
                      item.LessonChild?.length > 0 ? (
                        <OptGroup label={item.LessonName}>
                          {item.LessonChild?.map((lesson, index) => (
                            <Option value={lesson.Value}>
                              {lesson.LessonName}
                            </Option>
                          ))}
                        </OptGroup>
                      ) : (
                        <Option value={item.Value}>{item.LessonName}</Option>
                      )
                    )}
                  </Select>
                </div>
              </div>

              {/** LOẠI MÔN HỌC  */}
              <div className="col-md-6 col-12">
                <div className="item-select">
                  {/* <p className="font-weight-black mb-2">Loại môn học</p> */}
                  <Select
                    className="style-input"
                    defaultValue="Chọn loại môn học"
                    style={{ width: "100%" }}
                    // onChange={handleChange_selectType}
                  >
                    <Option value="1">Phát âm</Option>
                    <Option value="2">Ngữ pháp</Option>
                  </Select>
                </div>
              </div>

              {/** LOẠI CÂU HỎI (SINGLE HOẶC GROUP)  */}
              <div className="col-md-12 col-12 mt-3">
                <div className="item-select">
                  {/* <p className="font-weight-black mb-2">Loại câu hỏi</p> */}
                  <Select
                    className="style-input"
                    defaultValue="Chọn loại câu hỏi"
                    style={{ width: "100%" }}
                    onChange={handleChange_selectType}
                  >
                    <Option value="single">Câu hỏi đơn</Option>
                    <Option value="group">Câu hỏi nhóm</Option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="row">
              <div
                className={`wrap-type-question ${
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
