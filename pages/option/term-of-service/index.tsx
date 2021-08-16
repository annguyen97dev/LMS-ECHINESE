import React, { Fragment, useEffect, useState } from "react";
import { Card, Button, Spin } from "antd";
// import { Editor } from "@tinymce/tinymce-react";
import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";

import { rulesApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const TermOfService = () => {
  const [data, setData] = useState(null);
  const [dataContent, setDataContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showNoti } = useWrap();

  const fetchContract = async () => {
    try {
      let res = await rulesApi.getAll({});

      if (res.status === 200) {
        if (typeof res.data.data === "object") {
          setData(res.data.data);
        }
      } else if (res.status === 204) {
        showNoti("danger", "Không tìm thấy");
      }
    } catch (error) {
      showNoti("danger", error.message);
    }
  };
  const changeContractContent = (e) => {
    setDataContent(e.target.getContent());
  };
  const updateData = async () => {
    if (!dataContent) {
      showNoti("danger", "Bạn chưa sửa đổi");
      return;
    }
    setIsLoading(true);
    try {
      let res = await rulesApi.update({
        ...data,
        RulesContent: dataContent,
      });
      showNoti("success", res.data.message);
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setDataContent("");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <TitlePage title="Contract Detail" />
      </div>
      <Card>
        <div className="col-12">
          {/* <Editor
						apiKey="la1igo0sfogafdrl7wrj7w9j1mghl7txxke654lgzvkt86im"
						initialValue={data?.RulesContent}
						init={{
							height: 700,
							branding: false,
							plugins: 'link image code',
							toolbar:
								'undo redo | bold italic | alignleft aligncenter alignright | code',
						}}
						onChange={changeContractContent}
					/> */}
        </div>
        <div className="row pt-3">
          <div className="col-12 d-flex justify-content-center">
            <div style={{ paddingRight: 5 }}>
              <Button type="primary" size="large" onClick={updateData}>
                Xác nhận
                {isLoading && <Spin className="loading-base" />}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
TermOfService.layout = LayoutBase;
export default TermOfService;
