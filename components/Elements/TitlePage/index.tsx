import { useEffect } from "react";
import { useWrap } from "~/context/wrap";

export default function TitlePage({ title }: { title: string }) {
  const { getTitlePage } = useWrap();

  useEffect(() => {
    getTitlePage(title);
  }, []);

  return <></>;
}
