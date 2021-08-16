import React, { useEffect, useState } from "react";
import LayoutBase from "~/components/LayoutBase";
import InvoiceForm from "~/components/Global/Customer/Finance/InvoiceForm";
import { invoiceApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { useRouter } from "next/router";

const InvoiceDetail = () => {
  const router = useRouter();
  const slug = router.query.slug;
  const [data, setData] = useState([]);
  const { showNoti } = useWrap();
  
  const getInvoice = async () => {
    try {
      let res = await invoiceApi.export(slug);
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
    getInvoice();
  }, []);

  return <InvoiceForm title="Phiếu thu" data={data} />;
};
InvoiceDetail.layout = LayoutBase;
export default InvoiceDetail;
