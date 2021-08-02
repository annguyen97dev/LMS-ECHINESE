import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useRouter } from "next/router";
import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userInformationApi } from "~/apiBase";

export type IProps = {
  getTitlePage: Function;
  titlePage: string;
  getRouter: any;
  showNoti: Function;
  getDataUser: Function;
  userInformation: IUser;
};

const WrapContext = createContext<IProps>({
  titlePage: "",
  getRouter: "",
  getTitlePage: () => {},
  showNoti: () => {},
  getDataUser: () => {},
  userInformation: null,
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
  const [userInfo, setUserInfo] = useState<IUser>(null);
  // --- Get Title Page ---
  const getTitlePage = (title) => {
    setTitlePage(title);
  };

  // --- Show Notification ---
  const showNoti = (type: string, content: string) => {
    const nodeNoti = () => {
      return (
        <div className={`noti-box`}>
          <div className="noti-box__content">
            <span className="icon">
              {type == "danger" ? (
                <WarningOutlined />
              ) : (
                type == "success" && <CheckCircleOutlined />
              )}
            </span>
            <span className="text">{content}</span>
          </div>
        </div>
      );
    };

    switch (type) {
      case "success":
        toast.success(nodeNoti);
        break;
      case "danger":
        toast.error(nodeNoti);
        break;
      case "warning":
        toast.warning(nodeNoti);
        break;
      default:
        break;
    }
  };

  // --- Get Data User ---
  const getDataUser = (data) => {
    data && setUserInfo(data);
  };

  useEffect(() => {
    if (localStorage.getItem("dataUserEchinese") !== null) {
      const user = JSON.parse(localStorage.getItem("dataUserEchinese"));
      setUserInfo(user);
    }
  }, []);

  return (
    <>
      <WrapContext.Provider
        value={{
          titlePage: titlePage,
          getTitlePage,
          getRouter,
          showNoti,
          getDataUser,
          userInformation: userInfo,
        }}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {children}
      </WrapContext.Provider>
    </>
  );
};

export const useWrap = () => useContext(WrapContext);
