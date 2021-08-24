import ProfileBase from "~/components/Profile";
import LayoutBase from "~/components/LayoutBase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWrap } from "~/context/wrap";
import { contractCustomerListApi } from "~/apiBase";
import { Button, Card, Spin } from "antd";
import TitlePage from "~/components/TitlePage";
// import { Editor } from "@tinymce/tinymce-react";

const ContractCustomerDetail = () => {
  const router = useRouter();
  const slug = router.query.slug;
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [dataContract, setDataContract] = useState<any>({});
  const [contractContent, setContractContent] = useState("");

  const getContractDetail = async () => {
    setIsLoading({
      type: "GET_BYID",
      status: true,
    });
    try {
      let res = await contractCustomerListApi.getDetail(Number(slug));
      res.status === 200 && setDataContract(res.data.data);
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_BYID",
        status: false,
      });
    }
  };

  const changeContractContent = (e) => {
    setContractContent(e.target.getContent());
  };
  const updateContract = async () => {
    if (!contractContent) {
      showNoti("danger", "Bạn chưa sửa đổi");
      return;
    }
    setIsLoading({
      type: "UPDATE",
      status: true,
    });
    try {
      let res = await contractCustomerListApi.update({
        ...dataContract,
        ContractContent: contractContent,
      });
      res.status == 200 && showNoti("success", res.data.message),
        getContractDetail();
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setContractContent("");
      setIsLoading({
        type: "UPDATE",
        status: false,
      });
    }
  };

  useEffect(() => {
    getContractDetail();
    console.log(dataContract);
  }, []);

  if (!isLoading.status) {
    return (
      <div className="row">
        <div className="col-12">
          <TitlePage title="Chi tiết hợp đồng" />
        </div>
        <Card title={dataContract?.CourseName}>
          <div className="col-12">
            {/* <Editor
                apiKey="la1igo0sfogafdrl7wrj7w9j1mghl7txxke654lgzvkt86im"
                initialValue={dataContract?.ContractContent}
                init={{
                    height: 700,
                    branding: false,
                    plugins: "link image code",
                    toolbar:
                    "undo redo | bold italic | alignleft aligncenter alignright | code",
                }}
                onChange={changeContractContent}
                /> */}
          </div>
          <div className="row pt-3">
            <div className="col-12 d-flex justify-content-center">
              <div style={{ paddingRight: 5 }}>
                <Button type="primary" size="large" onClick={updateContract}>
                  Xác nhận
                  {isLoading.status && <Spin className="loading-base" />}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  } else {
    return (
      <div className="text-center">
        <Spin />
      </div>
    );
  }
};
ContractCustomerDetail.layout = LayoutBase;
export default ContractCustomerDetail;
