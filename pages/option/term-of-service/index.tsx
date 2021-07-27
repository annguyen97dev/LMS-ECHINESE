import React, { Fragment, useEffect, useState } from "react";
import { Card, Button } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";

import { rulesApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const TermOfService = () => {
  const [dataTable, setDataTable] = useState<IRules[]>([]);

	const [isLoading, setIsLoading] = useState({
	  type: "",
	  status: false,
	});
  const { showNoti } = useWrap();

  const onChange = (e) => {
    console.log(e.target.getContent());
  };

  	// GET DATA SERVICE
	const getDataTable = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await rulesApi.getAll();
			if (res.status == 204) {
				showNoti("danger", "Không có dữ liệu");
			}
			if(res.status == 200){
				setDataTable(res.data.data);
				if(res.data.data.length < 1) {
				}
			}
		  } catch (error) {
			showNoti("danger", error.message);
		  } finally {
			setIsLoading({
			  type: "GET_ALL",
			  status: false,
			});
		  }
		})();
	};

  useEffect(() => {
    getDataTable();
  },[]);

  return (
    <div className="row">
      <div className="col-12">
        <TitlePage title="Term of Service Detail" />
      </div>
      <Card>
        <div className="col-12">
          <Editor
            apiKey="la1igo0sfogafdrl7wrj7w9j1mghl7txxke654lgzvkt86im"
            initialValue={dataTable[0]?.RulesContent}
            init={{
              height: 700,
              branding: false,
              plugins: "link image code",
              toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright | code",
            }}
            onChange={onChange}
          />
        </div>
        <div className="row pt-3">
          <div className="col-12 d-flex justify-content-center">
            <div style={{ paddingRight: 5 }}>
              <Button type="primary" size="large">
                Xác nhận
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
