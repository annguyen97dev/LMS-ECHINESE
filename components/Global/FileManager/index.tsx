import React, { useState } from "react";
import FileManager, {
  Permissions,
  ItemView,
} from "devextreme-react/file-manager";

const FileManagerForm = (props) => {
  const [itemViewMode, setItemViewMode] = useState("thumbnails");

  const onOptionChanged = (e) => {
    if (e.fullName === "itemView.mode") {
      setItemViewMode(e.value);
    }
  };

  return (
    <>
      <FileManager
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
      </FileManager>
    </>
  );
};

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

export default FileManagerForm;
