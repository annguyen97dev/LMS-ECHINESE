import React from "react";
import { Card } from "antd";
import TitlePage from "~/components/TitlePage";
import { fileItems } from "~/lib/document-list/data";
import FileManagerForm from "~/components/Global/FileManager";
import LayoutBase from "~/components/LayoutBase";
const DocumentList = () => {
  return (
    <>
      <div>
        <TitlePage title="Danh sách tài liệu" />
      </div>
      <Card title="Danh sách tài liệu">
        <FileManagerForm fileItems={fileItems} />
      </Card>
    </>
  );
};

DocumentList.layout = LayoutBase;
export default DocumentList;
