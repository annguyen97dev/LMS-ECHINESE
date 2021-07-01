import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { registerAPI as registerAPI } from "~/services/auth";
import styles from "./RegisterForm.module.scss";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Loading from "~/components/Loading";

enum roles {
  user = "user",
  admin = "admin",
  moderator = "moderator",
}
type Inputs = {
  text: string;
  textRequired: string;
};
interface RegisterInputs {
  username: Inputs;
  password: Inputs;
  repassword: Inputs;
  email: Inputs;
  roles: roles[];
}

function index(props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<RegisterInputs>();

  const [checkRePass, setCheckRePass] = useState(false);

  const [loading, setLoading] = useState(false);

  // const [state, setState] = useState();

  const _Submit = async (data: {
    repassword: "";
    password: "";
    username: "";
    roles: [];
    email: "";
  }) => {
    console.log("_Submit data", data);

    setLoading(true);

    if (data.password !== data.repassword) {
      setCheckRePass(true);
    } else {
      setCheckRePass(false);
      try {
        const res = await registerAPI(data);

        console.log("RES: ", res.status);
        if (res.status === 200) {
          toast.success("Đăng kí thành công", {
            duration: 4000,
          });
          setLoading(false);
          setTimeout(() => {
            reset();
          }, 500);
        } else {
          setLoading(false);
          toast.error("Đăng kí không thành công", {
            duration: 4000,
          });
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  const moveToSignIn = (e) => {
    e.preventDefault();
    router.push("/account");
  };

  useEffect(() => {
    return () => {};
  }, []);

  // console.log(watch("username"));
  // console.log(watch("password"));
  /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
  return (
    <>
      <Toaster position="top-center" />
      <div className={styles.container}>
        <div className={styles.wrapBox}>
          <div
            className={styles.imgLogin}
            style={{ backgroundImage: "url('/images/bg-login.png')" }}
          >
            <img src="/img/symbol-login.png" alt="" />
          </div>
          <div className={styles.wrapForm}>
            <form
              onSubmit={handleSubmit(_Submit)}
              className={`${styles.loginForm}`}
            >
              <div className={styles.loginFormImg}>
                <img src="/img/icon-mona.png" alt="" />
              </div>
              <h6 className={styles.title}>Đăng ký</h6>

              {/* <input name="csrfToken" type="hidden" defaultValue={props?.csrfToken} /> */}

              <label className={styles.fcontrol}>Tên đăng nhập</label>

              <input
                name="username"
                placeholder="Nhập tên đăng nhập"
                defaultValue=""
                {...register("username", { required: true })}
              />
              {errors.username && (
                <span className={styles.errorText}>Hãy điền tên đăng nhập</span>
              )}

              <label className={styles.fcontrol}>Email</label>

              <input
                name="email"
                placeholder="Nhập Email"
                defaultValue=""
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className={styles.errorText}>Hãy nhập email</span>
              )}

              <label className={styles.fcontrol}>Mật khẩu</label>
              <input
                type="password"
                name="password"
                defaultValue=""
                {...register("password", { required: true })}
                placeholder="Nhập password"
              />
              {errors.password && (
                <span className={styles.errorText}>Hãy điền mật khẩu</span>
              )}

              <label className={styles.fcontrol}>Nhập lại mật khẩu</label>
              <input
                type="password"
                name="repassword"
                defaultValue=""
                {...register("repassword", { required: true })}
                placeholder="Nhập password"
              />
              {errors.repassword ? (
                <span className={styles.errorText}>Hãy điền mật khẩu</span>
              ) : (
                checkRePass && (
                  <span className={styles.errorText}>
                    Mật khẩu nhập lại chưa đúng
                  </span>
                )
              )}

              {/* <label className={styles.fcontrol}>Chọn quyền</label>
              <select className={styles.loginSelect} name="roles" ref={register({ required: true })} >
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="moderator">mod</option>
              </select>
              {errors.roles && <span>Phải chọn ít nhất một quyền</span>} */}

              <div className={styles.boxSubmit}>
                <input type="submit" value={"Đăng ký"} />
              </div>
              <div className={styles.boxSignup}>
                Bạn đã có tài khoản?{" "}
                <a href="" onClick={moveToSignIn}>
                  Đăng nhập
                </a>
              </div>

              {loading && <div className={styles.loading}></div>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default index;
