import { Card, Input, Select, Tooltip } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { Eye } from "react-feather";
import TitlePage from "~/components/Elements/TitlePage";
import PowerTable from "~/components/PowerTable";
import { dataStudent } from "~/lib/customer/dataStudent";
import { fileItems } from "~/lib/document-list/data";
import FileManager, {
  Permissions,
  ItemView,
} from "devextreme-react/file-manager";

// export const AntdFileManager = <T extends AntdFileManagerNode>(
//   props: AntdFileManagerProps<T>
// ): ReactElement => {
//   const { renderType = "table" } = props;
//   const RenderType = getAntdRendererByName<T>(renderType);
//   return <FileManager {...props} renderer={RenderType} />;
// };

const DocumentCourse = (props) => {
  const [itemViewMode, setItemViewMode] = useState("thumbnails");

  const onOptionChanged = (e) => {
    if (e.fullName === "itemView.mode") {
      setItemViewMode(e.value);
    }
  };

  // const getAntdRendererByName = <T extends AntdFileManagerNode>(
  //   name: "table"
  // ): FileManagerRenderComponent<T> => {
  //   if (name === "table") {
  //     return AntdTableRenderer;
  //   }
  //   throw TypeError(`Unknown renderer ${name}`);
  // };

  const customizeIcon = (fileSystemItem) => {
    if (fileSystemItem.isDirectory) {
      return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/folder.svg";
    }

    const fileExtension = fileSystemItem.getFileExtension();
    switch (fileExtension) {
      case ".txt":
        return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-txt.svg";
      case ".rtf":
        return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-rtf.svg";
      case ".xml":
        return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-xml.svg";
      case ".pdf":
        return "/icons/231-pdf.svg";
    }
  };

  return (
    <>
      <Card title="Document course">
        Document course
        {/* <FileManager
          fileSystemProvider={props.fileItems}
          customizeThumbnail={customizeIcon}
          height={750}
          onOptionChanged={onOptionChanged}
        >
          <ItemView mode={itemViewMode}></ItemView>
          <Permissions
            create={true}
            copy={true}
            move={true}
            delete={true}
            rename={true}
            upload={true}
            download={true}
          ></Permissions>
        </FileManager> */}
      </Card>
    </>
  );
};

export default DocumentCourse;
