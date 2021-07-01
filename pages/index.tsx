import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import Date from "../components/date";
import Dashboard from "~/pages/dashboard";
import { signIn, signOut, useSession } from "next-auth/client";
import SignIn from "./auth/signin";
import id from "date-fns/esm/locale/id/index.js";

import LayoutBase from "~/components/LayoutBase";

function Home() {
  // const [session, loading] = useSession();
  // console.log("Session in index: ", session);

  // if (loading) return ".....loading";

  // if (!session) {
  //   signIn();
  // }
  return (
    <>
      <Dashboard />
    </>
  );
}

Home.layout = LayoutBase;

export default Home;
