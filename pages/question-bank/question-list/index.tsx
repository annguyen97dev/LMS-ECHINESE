// import React, { useState, useRef, useEffect } from "react";

// import { Popover, Card, Tooltip, Select, Spin } from "antd";
// import TitlePage from "~/components/Elements/TitlePage";
// import { Info, Bookmark, Edit, Trash2 } from "react-feather";
// import CreateQuestionForm from "~/components/Global/QuestionBank/CreateQuestionForm";
// import { dataTypeGroup, dataTypeSingle } from "~/lib/question-bank/dataBoxType";
// import { data } from "~/lib/option/dataOption2";
// import LayoutBase from "~/components/LayoutBase";
// import QuestionSingle from "~/components/Global/QuestionBank/QuestionShow/QuestionSingle";
// import QuestionMultiple from "~/components/Global/QuestionBank/QuestionShow/QuestionMultiple";
// import QuestionWrite from "~/components/Global/QuestionBank/QuestionShow/QuestionWritting";
// import {
//   programApi,
//   subjectApi,
//   exerciseApi,
//   exerciseGroupApi,
// } from "~/apiBase";
// import { useWrap } from "~/context/wrap";
// import { questionObj } from "~/lib/TypeData";
// import GroupWrap from "~/components/Global/QuestionBank/GroupWrap";
// import QuestionWritting from "~/components/Global/QuestionBank/QuestionShow/QuestionWritting";
// import QuestionTyping from "~/components/Global/QuestionBank/QuestionShow/QuestionTyping";
// import QuestionDrag from "~/components/Global/QuestionBank/QuestionShow/QuestionDrag";
// import QuestionMap from "~/components/Global/QuestionBank/QuestionShow/QuestionMap";

// const { Option, OptGroup } = Select;
// let isOpenTypeQuestion = false;
// const listTodoApi = {
//   pageSize: 10,
//   pageIndex: 1,
//   SubjectID: null,
//   Type: null,
//   Level: null,
//   ExerciseGroupID: null,
//   ExamTopicType: null,
// };

// const listAlphabet = [
//   "A",
//   "B",
//   "C",
//   "D",
//   "F",
//   "G",
//   "H",
//   "I",
//   "J",
//   "K",
//   "L",
//   "M",
//   "N",
//   "O",
//   "P",
//   "Q",
//   "R",
//   "S",
//   "T",
//   "U",
//   "V",
// ];

// const QuestionList = () => {
//   const { showNoti } = useWrap();
//   const [isLoading, setIsLoading] = useState(false);
//   const [dataProgram, setDataProgram] = useState<IProgram[]>(null);
//   const [dataSubject, setDataSubject] = useState<ISubject[]>(null);
//   const [loadingSelect, setLoadingSelect] = useState(false);
//   const [questionData, setQuestionData] = useState(questionObj);
//   const [showListQuestion, setShowListQuestion] = useState(false);
//   const [showTypeQuetion, setShowTypeQuestion] = useState({
//     type: null,
//     status: false,
//   });
//   const [todoApi, setTodoApi] = useState(listTodoApi);
//   const [dataSource, setDataSource] = useState([]);
//   const boxEl = useRef(null);
//   const [totalPageIndex, setTotalPageIndex] = useState(0);
//   const [loadingQuestion, setLoadingQuestion] = useState(false);
//   const [isGroup, setIsGroup] = useState({
//     id: null,
//     status: null,
//   });
//   const [valueSubject, setValueSubject] = useState("Ch???n m??n h???c");
//   const [dataGroup, setDataGroup] = useState([]);
//   const [dataExercise, setDataExercise] = useState();

//   // Ph??n lo???i d???ng c??u h???i ????? tr??? ra danh s??ch
//   const returnQuestionType = () => {
//     // console.log("Type is: ", todoApi.Type);

//     switch (todoApi.Type) {
//       /** Quesion Single */
//       case 1:
//         return (
//           <GroupWrap
//             isGroup={isGroup}
//             listQuestion={dataGroup}
//             onFetchData={onFetchData}
//             onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//             getGroupID={(groupID) => setIsGroup({ ...isGroup, id: groupID })}
//             onEditData={(data) => onEditData(data)}
//             onAddData={(data) => onAddData(data)}
//           >
//             <QuestionSingle
//               listAlphabet={listAlphabet}
//               isGroup={isGroup}
//               loadingQuestion={loadingQuestion}
//               listQuestion={dataSource}
//               onFetchData={onFetchData}
//               onEditData={(data) => onEditData(data)}
//               onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//             />
//           </GroupWrap>
//         );
//         break;
//       /** Quesion Multiple */
//       case 4:
//         return (
//           <GroupWrap
//             isGroup={isGroup}
//             listQuestion={dataGroup}
//             onFetchData={onFetchData}
//             onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//             getGroupID={(groupID) => setIsGroup({ ...isGroup, id: groupID })}
//             onEditData={(data) => onEditData(data)}
//             onAddData={(data) => onAddData(data)}
//           >
//             <QuestionMultiple
//               listAlphabet={listAlphabet}
//               isGroup={isGroup}
//               loadingQuestion={loadingQuestion}
//               listQuestion={dataSource}
//               onFetchData={onFetchData}
//               onEditData={(data) => onEditData(data)}
//               onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//             />
//           </GroupWrap>
//         );
//         break;
//       /** Quesion Writting */
//       case 6:
//         return (
//           <QuestionWritting
//             listAlphabet={listAlphabet}
//             isGroup={isGroup}
//             loadingQuestion={loadingQuestion}
//             listQuestion={dataSource}
//             onFetchData={onFetchData}
//             onEditData={(data) => onEditData(data)}
//             onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//           />
//         );
//         break;
//       /** Quesion Typing */
//       case 3:
//         return (
//           <GroupWrap
//             isGroup={isGroup}
//             listQuestion={dataGroup}
//             onFetchData={onFetchData}
//             onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//             getGroupID={(groupID) => setIsGroup({ ...isGroup, id: groupID })}
//             onEditData={(data) => onEditData(data)}
//             onAddData={(data) => onAddData(data)}
//           >
//             <QuestionTyping
//               listAlphabet={listAlphabet}
//               isGroup={isGroup}
//               loadingQuestion={loadingQuestion}
//               listQuestion={dataExercise}
//               onFetchData={onFetchData}
//               onEditData={(data) => onEditData(data)}
//               onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//             />
//           </GroupWrap>
//         );
//         break;
//       /** Quesion Drag */
//       case 2:
//         return (
//           <GroupWrap
//             isGroup={isGroup}
//             listQuestion={dataGroup}
//             onFetchData={onFetchData}
//             onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//             getGroupID={(groupID) => setIsGroup({ ...isGroup, id: groupID })}
//             onEditData={(data) => onEditData(data)}
//             onAddData={(data) => onAddData(data)}
//           >
//             <QuestionDrag
//               listAlphabet={listAlphabet}
//               isGroup={isGroup}
//               loadingQuestion={loadingQuestion}
//               listQuestion={dataExercise}
//               onFetchData={onFetchData}
//               onEditData={(data) => onEditData(data)}
//               onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//             />
//           </GroupWrap>
//         );
//         break;
//       /** Quesion Map */
//       case 5:
//         return (
//           <GroupWrap
//             isGroup={isGroup}
//             listQuestion={dataGroup}
//             onFetchData={onFetchData}
//             onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//             getGroupID={(groupID) => setIsGroup({ ...isGroup, id: groupID })}
//             onEditData={(data) => onEditData(data)}
//             onAddData={(data) => onAddData(data)}
//           >
//             <QuestionMap
//               listAlphabet={listAlphabet}
//               isGroup={isGroup}
//               loadingQuestion={loadingQuestion}
//               listQuestion={dataSource}
//               onFetchData={onFetchData}
//               onEditData={(data) => onEditData(data)}
//               onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
//             />
//           </GroupWrap>
//         );
//         break;
//       default:
//         return (
//           <p className="text-center">
//             <b>Danh s??ch c??n tr???ng</b>
//           </p>
//         );
//         break;
//     }
//   };

//   // GET DATA SOURCE - DATA EXERCISE
//   const getDataSource = async () => {
//     let res = null;
//     try {
//       if (!isGroup.status) {
//         res = await exerciseApi.getAll({ ...todoApi, ExerciseGroupID: 0 });
//       } else {
//         res = await exerciseGroupApi.getAll(todoApi);
//       }

//       if (res.status == 200) {
//         // X??t coi n??y c??u h???i nh??m hay ????n
//         if (!isGroup.status) {
//           let cloneData = [...dataSource];
//           res.data.data.forEach((item, index) => {
//             cloneData.push(item);
//           });

//           setDataSource([...cloneData]);
//         } else {
//           let cloneData = [...dataGroup];
//           res.data.data.forEach((item, index) => {
//             cloneData.push(item);
//           });

//           setDataGroup([...cloneData]);
//         }

//         // todoApi.pageIndex == 1 && showNoti("success", "Th??nh c??ng");
//         // !showListQuestion && setShowListQuestion(true);

//         // Caculator pageindex
//         let totalPage = Math.ceil(res.data.totalRow / 10);
//         setTotalPageIndex(totalPage);
//       }

//       if (res.status == 204) {
//         // showNoti("danger", "Kh??ng c?? d??? li???u");
//         if (!isGroup.status) {
//           if (todoApi.Type == 3) {
//             setShowListQuestion(false);
//           }
//         } else {
//           setShowListQuestion(true);
//         }
//       }
//     } catch (error) {
//       showNoti("danger", error.message);
//     } finally {
//       setIsLoading(false);
//       loadingQuestion && setLoadingQuestion(false);
//     }
//   };

//   // GET DATA PROGRAM
//   const getDataProgram = async () => {
//     try {
//       let res = await programApi.getAll({ pageIndex: 1, pageSize: 999999 });
//       res.status == 200 && setDataProgram(res.data.data);
//       res.status == 204 && showNoti("danger", "Ch????ng tr??nh kh??ng c?? d??? li???u");
//     } catch (error) {
//       showNoti("danger", error.message);
//     } finally {
//     }
//   };

//   // GET DATA SUBJECT
//   const getDataSubject = async (id) => {
//     setLoadingSelect(true);
//     try {
//       let res = await subjectApi.getAll({
//         pageIndex: 1,
//         pageSize: 999999,
//         ProgramID: id,
//       });
//       res.status == 200 && setDataSubject(res.data.data);
//       res.status == 204 && showNoti("danger", "M??n h???c kh??ng c?? d??? li???u");
//     } catch (error) {
//       showNoti("danger", error.message);
//     } finally {
//       setLoadingSelect(false);
//     }
//   };

//   // CH???N D???NG C??U H???I (CHOICE, MULTIPLE,...)
//   const changeBoxType = (e: any, Type: number, TypeName: string) => {
//     e.preventDefault();

//     questionData.Type = Type;
//     questionData.TypeName = TypeName;

//     // Ki???m d???ng c??u h???i g?? ????? thay ?????i list answer
//     switch (Type) {
//       case 4:
//         questionData.ExerciseAnswer = [];
//         // setQuestionData({ ...questionData });
//         break;
//       case 1:
//         questionData.ExerciseAnswer = questionObj.ExerciseAnswer;
//         break;
//       // case 3:
//       //   questionData.ExerciseList = [];
//       default:
//         break;
//     }

//     // Add value v??o data chung
//     setQuestionData({ ...questionData });

//     // Active
//     setShowTypeQuestion({
//       ...showTypeQuetion,
//       type: Type,
//     });

//     // Show danh s??ch c??u h???i b??n c???nh
//     setIsLoading(true);
//     !showListQuestion && setShowListQuestion(true);
//     setDataSource([]);
//     setDataGroup([]);
//     setTodoApi({
//       ...todoApi,
//       Type: Type,
//       SubjectID: questionData.SubjectID,
//       Level: questionData.Level,
//       pageIndex: 1,
//     });
//   };

//   // console.log("Question Data b??n ngo??i: ", questionData);

//   // HANDLE CHANGE SELECT - THAO T??C V???I C??C SELECT
//   const handleChange_select = (selectName, option) => {
//     setDataSource([]);
//     setDataGroup([]);

//     switch (selectName) {
//       // -- Ch???n ch????ng tr??nh
//       case "program":
//         getDataSubject(option.value);
//         setDataSubject(null);
//         setValueSubject("Ch???n m??n h???c");
//         showListQuestion &&
//           (setIsLoading(true),
//           setTodoApi({
//             ...todoApi,
//             pageIndex: 1,
//             SubjectID: null,
//           }));
//         setShowTypeQuestion({
//           type: null,
//           status: false,
//         });
//         setShowListQuestion(false);
//         break;

//       // -- Ch???n lo???i c??u h???i ????n hay nh??m
//       case "type-question-group":
//         // questionData.ExerciseGroupID = option.value;
//         isOpenTypeQuestion = true;
//         if (option.value == 0) {
//           setIsGroup({
//             id: null,
//             status: false,
//           });
//         } else {
//           setIsGroup({
//             ...isGroup,
//             status: true,
//           });
//         }
//         showListQuestion &&
//           (setIsLoading(true),
//           setTodoApi({
//             ...todoApi,
//             pageIndex: 1,
//           }));

//         break;

//       // -- Ch???n m??n h???c
//       case "subject":
//         questionData.SubjectID = option.value;
//         questionData.SubjectName = option.children;
//         setValueSubject(option.value);

//         showListQuestion &&
//           (setIsLoading(true),
//           setTodoApi({
//             ...todoApi,
//             SubjectID: option.value,
//             pageIndex: 1,
//           }));

//         break;

//       // -- Ch???n level (D???, trung b??nh, kh??)
//       case "level":
//         questionData.Level = option.value;
//         questionData.LevelName = option.children;
//         showListQuestion &&
//           (setIsLoading(true),
//           setTodoApi({
//             ...todoApi,
//             Level: option.value,
//           }));
//         break;
//       default:
//         break;
//     }
//     setQuestionData({ ...questionData });

//     // ki???m tra m???i v??o ???? ch???n ?????y ????? 4 tr?????ng hay ch??a r???i m???i show danh s??ch d???ng c??u h???i
//     if (!showTypeQuetion.status) {
//       if (
//         questionData.ExerciseGroupID !== null &&
//         questionData.SubjectID !== null &&
//         questionData.Level !== null &&
//         isOpenTypeQuestion == true
//       ) {
//         setShowTypeQuestion({
//           ...showTypeQuetion,
//           status: true,
//         });
//       }
//     }
//   };

//   // ON ADD NEW DATA
//   const addDataGroup = (dataAdd) => {
//     dataGroup.splice(0, 0, dataAdd);
//     setDataGroup([...dataGroup]);
//   };

//   const addDataSingle = (dataAdd) => {
//     dataSource.splice(0, 0, dataAdd);
//     setDataSource([...dataSource]);
//   };

//   const onAddData = (dataAdd) => {
//     console.log("DATA add outside: ", dataAdd);

//     if (!isGroup.status) {
//       addDataSingle(dataAdd);
//     } else {
//       if (dataAdd.ExerciseGroupID) {
//         addDataSingle(dataAdd);
//       } else {
//         addDataGroup(dataAdd);
//       }
//     }
//     questionData.Content = "";
//     setQuestionData({ ...questionData });
//   };

//   // console.log("DATA SOURCE: ", dataSource);
//   // console.log("DATA GROUP: ", dataGroup);

//   // ON EDIT DATA

//   // console.log("Data Exercise: ", dataExercise);

//   const editDataGroup = (dataEdit) => {
//     let index = dataGroup.findIndex((item) => item.ID == dataEdit.ID);
//     dataGroup.splice(index, 1, dataEdit);

//     // let exerciseList = [...dataEdit.ExerciseList];

//     setDataExercise(dataEdit);
//     setDataGroup([...dataGroup]);
//   };

//   const editDataSingle = (dataEdit) => {
//     if (dataEdit.Type == 4) {
//       let newAnswerList = dataEdit.ExerciseAnswer.filter(
//         (item) => item.Enable !== false
//       );
//       dataEdit.ExerciseAnswer = newAnswerList;
//     }

//     let index = dataSource.findIndex((item) => item.ID == dataEdit.ID);
//     dataSource.splice(index, 1, dataEdit);

//     setDataSource([...dataSource]);
//   };

//   const onEditData = (dataEdit) => {
//     console.log("DATA edit outside ", dataEdit);

//     if (!isGroup.status) {
//       // N???u l?? d???ng c??u h???i nhi???u ????p ??n th?? ph???i x??a n?? ??i
//       editDataSingle(dataEdit);
//     } else {
//       if (dataEdit.ExerciseGroupID) {
//         editDataSingle(dataEdit);
//       } else {
//         editDataGroup(dataEdit);
//       }
//     }

//     questionData.Content = "";
//     setQuestionData({ ...questionData });
//   };

//   // ON REMOVE DATA
//   const removeDataSingle = (dataRemove) => {
//     let quesIndex = dataSource.findIndex((item) => item.ID == dataRemove.ID);
//     dataSource.splice(quesIndex, 1);
//     setDataSource([...dataSource]);
//   };

//   const removeDataGroup = (dataRemove) => {
//     console.log("Data remove outside: ", dataRemove);
//     if (dataRemove.isDeleteExercise) {
//       setDataExercise(dataRemove);
//     } else {
//       let quesIndex = dataGroup.findIndex((item) => item.ID == dataRemove);
//       dataGroup.splice(quesIndex, 1);
//       setDataGroup([...dataGroup]);
//     }
//   };

//   const onRemoveData = (dataRemove) => {
//     if (!isGroup.status) {
//       removeDataSingle(dataRemove);
//     } else {
//       if (dataRemove.ExerciseGroupID) {
//         removeDataSingle(dataRemove);
//       } else {
//         removeDataGroup(dataRemove);
//       }
//     }
//   };

//   // ON FETCH DATA
//   const onFetchData = () => {
//     scrollToTop(), setIsLoading(true), setDataSource([]), setDataGroup([]);
//     setTodoApi({ ...todoApi, pageIndex: 1, pageSize: 10 });
//   };

//   // SCROLL TO TOP
//   const scrollToTop = () => {
//     boxEl.current.scrollTo(0, 0);
//   };

//   // ON SCROLL
//   const onScroll = () => {
//     const scrollHeight = boxEl.current.scrollHeight;
//     const offsetHeight = boxEl.current.offsetHeight;
//     const scrollTop = boxEl.current.scrollTop;

//     // console.log("Height: ", scrollHeight - offsetHeight);
//     // console.log("Scroll: ", scrollTop);

//     if (scrollTop > scrollHeight - offsetHeight - 40) {
//       if (todoApi.pageIndex < totalPageIndex) {
//         setLoadingQuestion(true);

//         if (scrollTop > 0 && loadingQuestion == false) {
//           setTodoApi({
//             ...todoApi,
//             pageIndex: todoApi.pageIndex + 1,
//           });
//         }
//       }
//     }
//   };

//   // console.log("DATA exercise: ", dataSource);

//   useEffect(() => {
//     getDataProgram(); // L???y data ch????ng tr??nh
//   }, []);

//   useEffect(() => {
//     if (questionData.Type !== 0) {
//       getDataSource();
//     }
//     questionData.Content = "";
//     switch (questionData.Type) {
//       case 4:
//         questionData.ExerciseAnswer = [];
//         break;

//       default:
//         break;
//     }
//     setQuestionData({ ...questionData });
//   }, [todoApi]);

//   return (
//     <div className="question-create">
//       <TitlePage title="T???o c??u h???i" />
//       <div className="row">
//         <div className="col-md-12"></div>
//       </div>
//       <div className="row">
//         <div className="col-md-8 col-12">
//           <Card
//             className="card-detail-question"
//             title={
//               <div className="title-question-bank">
//                 <h3 className="title-big">
//                   <Bookmark />{" "}
//                   {!isGroup.status
//                     ? "Danh s??ch c??u h???i"
//                     : "Danh s??ch nh??m c??u h???i"}
//                 </h3>
//                 <p
//                   style={{
//                     paddingLeft: "30px",
//                     fontSize: "13px",
//                     marginBottom: "0",
//                     fontWeight: 500,
//                     color: "#777777",
//                   }}
//                 >
//                   {questionData.TypeName}
//                 </p>
//                 {/* <p className="text-lesson">
//                   <span className="font-weight-black">M??n h???c:</span>
//                   <span>{questionData?.SubjectName}</span>
//                 </p> */}
//               </div>
//             }
//             extra={
//               <CreateQuestionForm
//                 questionData={questionData}
//                 onFetchData={onFetchData}
//                 isGroup={isGroup}
//                 onAddData={(data) => onAddData(data)}
//               />
//             }
//           >
//             {!showListQuestion ? (
//               <>
//                 <p className="font-weight-primary text-center">
//                   Vui l??ng ch???n m??n h???c v?? d???ng c??u h???i
//                 </p>
//                 <div className="img-load">
//                   <img src="/images/study-min.jpg" alt="" />
//                 </div>
//               </>
//             ) : isLoading ? (
//               <div className="text-center p-2">
//                 <Spin />
//               </div>
//             ) : (
//               <div
//                 className={`question-list active`}
//                 ref={boxEl}
//                 onScroll={onScroll}
//               >
//                 {returnQuestionType()}
//               </div>
//             )}
//           </Card>
//         </div>
//         <div className="col-md-4 col-12">
//           <Card className="card-box-type">
//             <div className={`row ${showTypeQuetion ? "mb-2" : ""}`}>
//               {/** CH???N CH????NG TR??NH */}
//               <div className="col-md-6 col-12 ">
//                 <div className="item-select">
//                   <Select
//                     className="style-input"
//                     defaultValue="Ch???n ch????ng tr??nh"
//                     style={{ width: "100%" }}
//                     onChange={(value, option) =>
//                       handleChange_select("program", option)
//                     }
//                   >
//                     {dataProgram?.map((item, index) => (
//                       <Option key={index} value={item.ID}>
//                         {item.ProgramName}
//                       </Option>
//                     ))}
//                   </Select>
//                 </div>
//               </div>
//               {/** CH???N M??N H???C */}
//               <div className="col-md-6 col-12 ">
//                 <div className="item-select">
//                   {/* <p className="font-weight-black mb-2">Ch???n m??n h???c</p> */}
//                   <Select
//                     loading={loadingSelect}
//                     className="style-input"
//                     defaultValue="Ch???n m??n h???c"
//                     value={valueSubject}
//                     style={{ width: "100%" }}
//                     onChange={(value, option) =>
//                       handleChange_select("subject", option)
//                     }
//                   >
//                     {dataSubject?.map((item, index) => (
//                       <Option key={index} value={item.ID}>
//                         {item.SubjectName}
//                       </Option>
//                     ))}
//                   </Select>
//                 </div>
//               </div>

//               {/** LO???I C??U H???I (SINGLE HO???C GROUP)  */}
//               <div className="col-md-6 col-12 mt-3">
//                 <div className="item-select">
//                   {/* <p className="font-weight-black mb-2">Lo???i c??u h???i</p> */}
//                   <Select
//                     className="style-input"
//                     defaultValue="Ch???n lo???i c??u h???i"
//                     style={{ width: "100%" }}
//                     onChange={(value, option) =>
//                       handleChange_select("type-question-group", option)
//                     }
//                   >
//                     <Option value={0}>C??u h???i ????n</Option>
//                     <Option value={1}>C??u h???i nh??m</Option>
//                   </Select>
//                 </div>
//               </div>

//               {/** M???C ?????  */}
//               <div className="col-md-6 col-12 mt-3">
//                 <div className="item-select">
//                   {/* <p className="font-weight-black mb-2">Lo???i c??u h???i</p> */}
//                   <Select
//                     className="style-input"
//                     defaultValue="Ch???n m???c ?????"
//                     style={{ width: "100%" }}
//                     onChange={(value, option) =>
//                       handleChange_select("level", option)
//                     }
//                   >
//                     <Option value={1}>D???</Option>
//                     <Option value={2}>Trung b??nh</Option>
//                     <Option value={3}>Kh??</Option>
//                   </Select>
//                 </div>
//               </div>
//             </div>
//             <div className="row">
//               <div
//                 className={`wrap-type-question w-100 ${
//                   showTypeQuetion.status ? "active" : "nun-active"
//                 }`}
//               >
//                 {isGroup.status
//                   ? dataTypeGroup?.map((item, index) => (
//                       <div className="col-md-12" key={index}>
//                         <div className="box-type-question">
//                           <a
//                             href="#"
//                             onClick={(e) =>
//                               changeBoxType(e, item.Type, item.TypeName)
//                             }
//                             className={
//                               item.Type === showTypeQuetion.type ? "active" : ""
//                             }
//                           >
//                             <div className="type-img">
//                               <img
//                                 src={item.Images}
//                                 alt=""
//                                 className="img-inner"
//                               />
//                             </div>
//                             <div className="type-detail">
//                               {/* <h5 className="number">{item.Number}</h5> */}
//                               <div className="p text">{item.TypeName}</div>
//                             </div>
//                           </a>
//                         </div>
//                       </div>
//                     ))
//                   : dataTypeSingle?.map((item, index) => (
//                       <div className="col-md-12" key={index}>
//                         <div className="box-type-question">
//                           <a
//                             href="#"
//                             onClick={(e) =>
//                               changeBoxType(e, item.Type, item.TypeName)
//                             }
//                             className={
//                               item.Type === showTypeQuetion.type ? "active" : ""
//                             }
//                           >
//                             <div className="type-img">
//                               <img
//                                 src={item.Images}
//                                 alt=""
//                                 className="img-inner"
//                               />
//                             </div>
//                             <div className="type-detail">
//                               {/* <h5 className="number">{item.Number}</h5> */}
//                               <div className="p text">{item.TypeName}</div>
//                             </div>
//                           </a>
//                         </div>
//                       </div>
//                     ))}
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// QuestionList.layout = LayoutBase;
// export default QuestionList;

import React from 'react';
import QuestionCreate from '~/components/Global/QuestionBank/QuestionCreate';
import LayoutBase from '~/components/LayoutBase';

const QuestionList = () => {
	return <QuestionCreate />;
};

QuestionList.layout = LayoutBase;
export default QuestionList;
