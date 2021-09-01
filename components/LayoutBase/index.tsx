import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "./layout";
import { signIn, useSession } from "next-auth/client";
import Lottie from "react-lottie";
import panda from "~/public/loading/panda.json";

const LayoutBase = ({ children }) => {
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(true);

  // Get path and slug
  const router = useRouter();
  const slug = router.query.slug;
  let path: string = router.pathname;
  let pathString: string[] = path.split("/");
  // ---------------------

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: panda,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  console.log("Session: ", session);

  useEffect(() => {
    if (typeof session !== "undefined") {
      if (session == null) {
        // console.log("Test path: ", path.search("signin") < 0);
        if (path.search("signin") < 0) {
          signIn();
        }
      } else {
        // console.log('LOADING FALSE');
        setIsLoading(false);
      }
    }
  }, [session]);

  return (
    <>
      {isLoading ? (
        <div className="loading-layout">
          {/* <Lottie options={defaultOptions} height="auto" width="60vw" /> */}

          <div className="scene">
            <div className="plane">
              <div className="cube cube--0">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
              </div>
              <div className="shadow shadow--0"></div>
              <div className="cube cube--1">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
              </div>
              <div className="shadow shadow--1"></div>
              <div className="cube cube--2">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
              </div>
              <div className="shadow shadow--2"></div>
              <div className="cube cube--3">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
              </div>
              <div className="shadow shadow--3"></div>
              <div className="cube cube--4">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
              </div>
              <div className="shadow shadow--4"></div>
              <div className="cube cube--5">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
              </div>
              <div className="shadow shadow--5"></div>
              <div className="cube cube--6">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
              </div>
              <div className="shadow shadow--6"></div>
              <div className="cube cube--7">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
              </div>
              <div className="shadow shadow--7"></div>
            </div>
          </div>
        </div>
      ) : (
        session.accessToken && <Layout>{children}</Layout>
      )}

      {/* <Layout>{children}</Layout> */}
    </>
  );
};

export default LayoutBase;
