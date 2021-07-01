import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/client";
import { is } from "date-fns/locale";

const Auth = ({ children }) => {
  // Get path and slug
  const router = useRouter();
  const slug = router.query.slug;
  let path: string = router.pathname;
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Session: ", session);

    if (typeof session !== "undefined") {
      if (session == null) {
        // console.log("Test path: ", path.search("signin") < 0);
        if (path.search("signin") < 0) {
          signIn();
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [session]);

  return <>{isLoading ? <div>Loading...</div> : { children }}</>;
};

export default Auth;
