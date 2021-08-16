import React, { useEffect, useState } from "react";
import LayoutBase from "~/components/LayoutBase";
import InvoiceForm from "~/components/Global/Customer/Finance/InvoiceForm";
import { voucherApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { useRouter } from "next/router";

const InvoiceDetail = () => {
  const router = useRouter();
  const slug = router.query.slug;
  const [data, setData] = useState([]);
  const { showNoti } = useWrap();
  
  const getVoucher = async () => {
    try {
      let res = await voucherApi.export(slug);
      if(res.status == 200) {
        setData(res.data.data);
      }
      if(res.status == 204) {
        showNoti("danger", "Không có dữ liệu")
      }
    } catch (error) {
      showNoti("danger", error.message)
    }
  }

  console.log(data);

  useEffect(() => {
    getVoucher();
  }, []);

  return <InvoiceForm title="Phiếu chi" data={data} />;
};
InvoiceDetail.layout = LayoutBase;
export default InvoiceDetail;
