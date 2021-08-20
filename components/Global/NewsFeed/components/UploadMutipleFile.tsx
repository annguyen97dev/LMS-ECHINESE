import React, { useEffect, useState } from "react";
import { Upload } from "antd";
import { useWrap } from "~/context/wrap";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { newsFeedApi } from "~/apiBase";
import ImgCrop from 'antd-img-crop';
const UploadMutipleFile = (props) => {
  const { getValue, imagesOld } = props;
  const { showNoti } = useWrap();
  const [fileList, setFileList] = useState([]);
  const [list, setList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const beforeUpload = async (file) => {
    console.log("File: ", file);
    let object = {};
    try {
      let res = await newsFeedApi.uploadFile(file);
      if(res.status == 200) {
        showNoti("success", "Upload thành công");
        object = {
          Type: 1,
          NameFile: res.data.data,
          uid: file.uid,
        }
        setList([...list, object]);
      }
    } catch (error) {
      showNoti("danger", error.message);
    }
  }

  const onRemove = (file) => {
    const listNew = list.filter(item => item.uid != file.uid);
    setList(listNew);
  }

  const setDefaultFileList = (imagesOld) => {
    let object = {};
    let newObject = {}
    console.log(imagesOld);

    imagesOld.map(item => {
      object = {
          uid: item.UID,
          status: 'done',
          url: item.NameFile,
      }
      newObject = {
        Type: item.Type,
        NameFile: item.NameFile,
        uid: item.UID
      }
    })
    setList([...list, newObject]);
    setFileList([...fileList, object]);
  }

  useEffect(() => {
    if(imagesOld) {
      setDefaultFileList(imagesOld);
    }
  }, [imagesOld]);

  return (
    <>
      <ImgCrop rotate>
        <Upload
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          beforeUpload={beforeUpload}
          onRemove={onRemove}
        >
          {fileList.length < 5 && '+ Upload'}
          {getValue(list)}
        </Upload>
      </ImgCrop>
    </>
  );
};

export default UploadMutipleFile;
