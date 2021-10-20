import Reac, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doneTestApi } from "~/apiBase/done-test/dont-test";
import { useWrap } from "~/context/wrap";
import { useDoneTest } from "~/context/useDoneTest";
import { Card } from "antd";
import PowerTable from "~/components/PowerTable";
import TitlePage from "~/components/TitlePage";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";

type convertData = {
  key: number;

  yourAnswer: string;
  correctAnswer: string;
  question: string;
  isResult: boolean;
};

const DoneTestMain = () => {
  const router = useRouter();
  const { showNoti } = useWrap();
  const SetPackageResultID = router.query.SetPackageResultID as string;
  const { getDoneTestData } = useDoneTest();
  const [dataResultTest, setDataResultTest] = useState<convertData[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [listQuestionID, setListQuestionID] = useState([]); // Lấy tất cả ID đã có
  const [listGroupID, setListGroupID] = useState([]); // Lấy tất cả group ID đã có

  const columns = [
    {
      title: "",
      dataIndex: "",
      key: "number",
      render: (text, data, index) => <>{index + 1 + "/"}</>,
    },
    {
      title: "Câu hỏi",
      dataIndex: "question",
      key: "number",
      render: (text) => <>{ReactHtmlParser(text)}</>,
    },
    {
      title: "Câu trả lời của bạn",
      dataIndex: "yourAnswer",
      key: "yourAnswer",
    },
    {
      title: "Đáp án",
      dataIndex: "correctAnswer",
      key: "correctAnswer",
    },
  ];

  console.log("Data Result Test: ", dataResultTest);
  console.log("List question ID: ", listQuestionID);

  const getDataResultTest = async () => {
    let cloneListQuestionID = [...listQuestionID];
    let cloneListGroupID = [...listGroupID];
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      let res = await doneTestApi.getAll({
        selectAll: true,
        SetPackageResultID: parseInt(SetPackageResultID),
      });
      if (res.status === 200) {
        convertData(res.data.data);
        // Add questionid to list
        res.data.data.forEach((item, index) => {
          if (item.Enable) {
            item.ExerciseGroupID !== 0 &&
              cloneListGroupID.push(item.ExerciseGroupID);
            item.SetPackageExerciseStudent.forEach((ques) => {
              cloneListQuestionID.push(ques.ExerciseID);
            });
          }
        });
        getDoneTestData(res.data.data);
        setListGroupID([...cloneListGroupID]);
        setListQuestionID([...cloneListQuestionID]);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  const convertData = (data) => {
    const returnCorrectAnswer = (dataReturn) => {
      let text = "";

      dataReturn.SetPackageExerciseAnswerStudent.every((item) => {
        if (item.isTrue) {
          text = item.ExerciseAnswerContent;
          return false;
        }
        return true;
      });

      return text;
    };

    const returnYourAnswer = (dataReturn) => {
      let text = "";

      dataReturn.SetPackageExerciseAnswerStudent.every((item) => {
        if (item.AnswerID !== 0) {
          text = item.AnswerContent;
          return false;
        }
        return true;
      });

      return text;
    };

    data.forEach((item) => {
      item.SetPackageExerciseStudent.forEach((ques) => {
        dataResultTest.push({
          key: ques.ID,
          question: ques.Content,
          yourAnswer: returnYourAnswer(ques),
          correctAnswer: returnCorrectAnswer(ques),
          isResult: ques.isTrue,
        });
      });
    });

    setDataResultTest([...dataResultTest]);
  };

  useEffect(() => {
    getDataResultTest();
  }, []);

  return (
    <div className="done-test-card">
      <TitlePage title="Kết quả làm bài" />
      <Card title="Kết quả làm bài">
        <div className="wrap-box-info">
          <div className="box-info">
            <div className="box-info__item box-info__score">
              Số điểm
              <span className="number">10</span>
            </div>
            <div className="box-info__item box-info__correct">
              Số câu đúng
              <span className="number">10.10</span>
            </div>
          </div>
        </div>
        <div className="done-test-table">
          <PowerTable
            dataSource={dataResultTest}
            columns={columns}
            loading={isLoading}
          />
        </div>
      </Card>
    </div>
  );
};

export default DoneTestMain;
