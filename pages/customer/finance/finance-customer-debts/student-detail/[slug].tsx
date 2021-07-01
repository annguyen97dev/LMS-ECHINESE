import React, { useState } from "react";
import LayoutBase from "~/components/LayoutBase";
import ProfileCustomer from "~/components/Profile/ProfileCustomer/ProfileCustomer";

const CustomerDetail = () => {
  return <ProfileCustomer />;
};
CustomerDetail.layout = LayoutBase;

export default CustomerDetail;
