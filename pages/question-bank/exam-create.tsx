import React, { useRef, useState, useEffect } from "react";

import { Popover, Card, Spin, Skeleton, Select, Modal } from "antd";
import TitlePage from "~/components/Elements/TitlePage";
import { Bookmark, Trash2 } from "react-feather";
import { AudioOutlined } from "@ant-design/icons";
import CreateExamForm from "~/components/Global/QuestionBank/CreateExamForm";
import LayoutBase from "~/components/LayoutBase";
import Link from "next/link";
import { examTopicApi, programApi, subjectApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import SearchBox from "~/components/Elements/SearchBox";

const { Option, OptGroup } = Select;

type dataOject = {
  title: string;
  value: number;
};

const DeleteExam = (props) => {
  const { examID, onFetchData } = props;
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let res = await examTopicApi.update({ ID: examID, Enable: false });
      if (res.status == 200) {
        onFetchData && onFetchData();
        showNoti("success", "Xóa thành công");
        setIsModalVisible(false);
      }
    } catch (error) {
      showNoti("danger", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <button className="btn btn-icon delete" onClick={showModal}>
        <Trash2 />
      </button>
      <Modal
        title="Chú ý!"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={
          <div className="text-center">
            <button className="btn btn-light mr-2" onClick={handleCancel}>
              Đóng
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Lưu
              {isLoading && <Spin className="loading-base" />}
            </button>
          </div>
        }
      >
        <p style={{ fontWeight: 500 }}>Bạn có chắc muốn xóa đề thi này?</p>
      </Modal>
    </>
  );
};

const ExamCreate = (props) => {
  const { showNoti } = useWrap();
  const [dataExam, setDataExam] = useState<IExamTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const listTodoApi = {
    pageIndex: 1,
    pageSize: 10,
    SubjectID: null,
    Type: null,
    Code: null,
  };
  const [todoApi, setTodoApi] = useState(listTodoApi);
  const [dataProgram, setDataProgram] = useState<dataOject[]>([]);
  const [dataSubject, setDataSubject] = useState<dataOject[]>([]);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [totalPageIndex, setTotalPageIndex] = useState(0);
  const boxEl = useRef(null);
  const [valueSubject, setValueSubject] = useState("Chọn môn học");

  const getAllExam = async () => {
    try {
      let res = await examTopicApi.getAll(todoApi);
      if (res.status == 200) {
        let cloneData = [...dataExam];
        res.data.data.forEach((item, index) => {
          cloneData.push(item);
        });

        setDataExam([...cloneData]);

        // Caculator pageindex
        let totalPage = Math.ceil(res.data.totalRow / 10);
        setTotalPageIndex(totalPage);
      }
      if (res.status == 204) {
        setDataExam([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      loadingQuestion && setLoadingQuestion(false);
    }
  };

  // GET DATA PROGRAM
  const getDataProgram = async () => {
    try {
      let res = await programApi.getAll({ pageIndex: 1, pageSize: 999999 });
      if (res.status == 200) {
        let newData = res.data.data.map((item) => ({
          title: item.ProgramName,
          value: item.ID,
        }));
        setDataProgram(newData);
      }

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
      if (res.status == 200) {
        let newData = res.data.data.map((item) => ({
          title: item.SubjectName,
          value: item.ID,
        }));
        setDataSubject(newData);
      }

      res.status == 204 && showNoti("danger", "Môn học không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingSelect(false);
    }
  };

  // SELECT PROGRAM
  const handleSelect_Program = (value) => {
    setValueSubject("Chọn môn học");
    setDataExam([]);
    getDataSubject(value);
  };

  // SELECT SUBJECT
  const handleSelect_Subject = (value) => {
    setValueSubject(value);

    reloadData();
    setTodoApi({ ...todoApi, pageIndex: 1, pageSize: 10, SubjectID: value });
  };

  // SELECT TYPE
  const handleSelect_Type = (value) => {
    reloadData();
    setTodoApi({ ...todoApi, pageIndex: 1, pageSize: 10, Type: value });
  };

  // ON FETCH DATA
  const onFetchData = () => {
    reloadData();
    setTodoApi({ ...todoApi, pageIndex: 1, pageSize: 10 });
  };

  // RELOAD DATA
  const reloadData = () => {
    scrollToTop(), setIsLoading(true), setDataExam([]);
  };

  // ON SEARCH
  const handleSearch = (value) => {
    reloadData();
    setTodoApi({
      ...listTodoApi,
      Code: value,
    });
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

    // console.log("Height: ", scrollHeight - offsetHeight);
    // console.log("Scroll: ", scrollTop);

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

  useEffect(() => {
    getDataProgram();
    getAllExam();
  }, [todoApi]);

  return (
    <div className="question-create exam-create">
      <TitlePage title="Tạo đề thi" />

      <div className="row">
        <div className="col-md-8 col-12">
          <Card
            className="card-detail-exam card-detail-question"
            title={
              <div className="title-question-bank">
                <h3 className="title-big">
                  <Bookmark /> Danh sách đề thi
                </h3>
              </div>
            }
            extra={<CreateExamForm onFetchData={() => onFetchData()} />}
          >
            <div className="question-list" ref={boxEl} onScroll={onScroll}>
              <div className="row mb-3">
                <div className="col-12">
                  <SearchBox
                    placeholder={"Tìm theo mã đề thi"}
                    handleSearch={(value) => handleSearch(value)}
                  />
                </div>
              </div>
              {isLoading ? (
                <div className="text-center p-2">
                  <Spin />
                </div>
              ) : dataExam?.length == 0 ? (
                <p className="text-center">
                  <b>Danh sách còn trống</b>
                </p>
              ) : (
                <div className="row">
                  {dataExam?.map((item, index) => (
                    <div className="col-md-6 col-12" key={index}>
                      <div className="package-set">
                        <div className="edit-exam">
                          <CreateExamForm
                            onFetchData={() => onFetchData()}
                            dataItem={item}
                          />
                          <DeleteExam
                            examID={item.ID}
                            onFetchData={onFetchData}
                          />
                        </div>
                        <div className="wrap-set">
                          <div className="wrap-set-content">
                            <div className="box-title">
                              <h6 className="set-title">{item.Name}</h6>
                              <p className="code">
                                <span>Mã: </span> {item.Code}
                              </p>
                            </div>
                            <ul className="set-list">
                              <li className="status">
                                Môn học: <span>{item.SubjectName}</span>
                              </li>
                              <li className="price">
                                Dạng: <span>{item.TypeName}</span>
                              </li>
                              <li className="time">
                                Thời gian: <span>{item.Time} phút</span>
                              </li>
                            </ul>

                            {/* <p className="set-des">{item.Description}</p> */}
                            <div className="set-btn">
                              <Link
                                href={{
                                  pathname: "/question-bank/exam-detail/[slug]",
                                  query: { slug: item.ID },
                                }}
                              >
                                <a className="btn btn-warning">Xem chi tiết</a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loadingQuestion && (
                    <>
                      <div className="col-md-6 col-12">
                        <Skeleton />
                      </div>
                      <div className="col-md-6 col-12">
                        <Skeleton />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
        <div className="col-md-4 col-12">
          <Card className="card-box-type" title="Lọc nhanh">
            <div className="row mb-2">
              {/** CHỌN CHƯƠNG TRÌNH */}
              <div className="col-md-6 col-12 ">
                <div className="item-select">
                  <Select
                    className="style-input"
                    defaultValue="Chọn chương trình"
                    style={{ width: "100%" }}
                    onChange={(value, option) => handleSelect_Program(value)}
                  >
                    {dataProgram?.map((item, index) => (
                      <Option key={index} value={item.value}>
                        {item.title}
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
                    value={valueSubject}
                    style={{ width: "100%" }}
                    onChange={(value, option) => handleSelect_Subject(value)}
                  >
                    {dataSubject?.map((item, index) => (
                      <Option key={index} value={item.value}>
                        {item.title}
                      </Option>
                    ))}
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
                    onChange={(value, option) => handleSelect_Type(value)}
                  >
                    <Option value={1}>Trắc nghiệm</Option>
                    <Option value={2}>Tự luận</Option>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
ExamCreate.layout = LayoutBase;
export default ExamCreate;
