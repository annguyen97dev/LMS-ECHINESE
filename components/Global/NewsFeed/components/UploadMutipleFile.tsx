import React, { useEffect, useState } from "react";
import { Upload, Form } from "antd";
import { useWrap } from "~/context/wrap";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { newsFeedApi } from "~/apiBase";
import ImgCrop from 'antd-img-crop';
import Modal from "antd/lib/modal/Modal";
import UploadThumb from "./UploadThumb";
import { useForm } from "react-hook-form";

const UploadMutipleFile = (props) => {
  const { getValue, imagesOld } = props;
  const { showNoti } = useWrap();
  const [fileList, setFileList] = useState([]);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  // const [thumbnail, setThumbnail] = useState("");
  const [currentFile, setCurrentFile] = useState();
  const [form] = Form.useForm();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();

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

  const beforeUpload = (file) => {
    console.log("File: ", file);
    let typeFile;
    if(file.type.includes("image")) {
      typeFile = 2;
      uploadFIle(typeFile, file, "")
    }
    if(file.type.includes("audio")) {
      typeFile = 3;
      uploadFIle(typeFile, file, "")
    }
    if(file.type.includes("video")) {
      typeFile = 4;
      setCurrentFile(file);
      setVisible(true);
    }

  }

  const uploadFIle = async (typeFile, file, thumbnail) => {
    let object = {};
    try {
      let res = await newsFeedApi.uploadFile(file);
      if(res.status == 200) {
        showNoti("success", "Upload thành công");
        object = {
          Type: typeFile,
          NameFile: res.data.data,
          uid: file.uid,
          Thumnail: thumbnail
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

  const onSubmit = handleSubmit((data) => {
    uploadFIle(4, currentFile, data.Thumnail);
    setVisible(false);
    form.resetFields();
  })

  useEffect(() => {
    if(imagesOld) {
      setDefaultFileList(imagesOld);
    }
  }, [imagesOld]);

  return (
    <>
      {/* <ImgCrop rotate> */}
        <Upload
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          beforeUpload={beforeUpload}
          onRemove={onRemove}
          accept=".jpeg, .png, .bmp, .mp4, .flv, .mpeg, .mov, .wmv, .mp3"
        >
          {fileList.length < 5 && '+ Upload'}
          {getValue(list)}
        </Upload>
        <Modal
          title="Thêm thumbnail"
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <div className="row">
              <div className="col-12">
                <Form.Item 
                  label="Thumbnail" 
                  name="Thumbnail"
                >
                    <UploadThumb 
                      getValue={(value) => setValue("Thumnail", value)}
                    />
                </Form.Item>
              </div>
            </div>
            <div className="row ">
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Lưu
                  {/* {props.isLoading.type == "ADD_DATA" &&
                    props.isLoading.status && <Spin className="loading-base" />} */}
                </button>
              </div>
            </div>
          </Form>
        </Modal>
      {/* </ImgCrop> */}
    </>
  );
};

export default UploadMutipleFile;
