import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useRouter } from "next/router";
import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";

export type IProps = {
  getTitlePage: Function;
  titlePage: string;
  getRouter: any;
  showNoti: Function;
};

const WrapContext = createContext<IProps>({
  titlePage: "",
  getRouter: "",
  getTitlePage: () => {},
  showNoti: () => {},
});

// const initialState = {
//   noti: "",
// };

// function reducer() {}

export const WrapProvider = ({ children }) => {
  const [titlePage, setTitlePage] = useState("");
  const router = useRouter();
  const getRouter = router.pathname;
  const [typeNoti, setTypeNoti] = useState({
    content: "",
    type: "",
  });
  // const [state, dispatch] = useReducer(reducer, initialState);

  const getTitlePage = (title) => {
    setTitlePage(title);
  };

  const showNoti = (type: string, content: string) => {
    setTypeNoti({
      content: content,
      type: type,
    });

    setTimeout(() => {
      setTypeNoti({
        content: "",
        type: "",
      });
    }, 3000);
  };

  return (
    <>
      <WrapContext.Provider
        value={{
          titlePage: titlePage,
          getTitlePage,
          getRouter,
          showNoti,
        }}
      >
        <div className={`noti-box ${typeNoti.type}`}>
          <div className="noti-box__content">
            <span className="icon">
              {typeNoti.type == "danger" ? (
                <WarningOutlined />
              ) : (
                typeNoti.type == "success" && <CheckCircleOutlined />
              )}
            </span>
            <span className="text">{typeNoti.content}</span>
          </div>
        </div>
        {children}
      </WrapContext.Provider>
    </>
  );
};

export const useWrap = () => useContext(WrapContext);
