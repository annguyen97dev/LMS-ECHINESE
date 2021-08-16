import React, { Fragment, useEffect, useState } from "react";
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { configApi } from "~/apiBase";
import { Tag, Tooltip, Switch, Input, Button, Space } from "antd";
import { AlertTriangle, X } from "react-feather";
import moment from "moment";
import { useWrap } from "~/context/wrap";
import ConfigVoucherInvoiceForm from "~/components/Global/Option/ConfigVoucherInvoiceForm";

const ConfigVoucherInvoice = () => {
    const [dataTable, setDataTable] = useState<IConfig[]>([]);
    const [isLoading, setIsLoading] = useState({
        type: null,
        status: false,
    });
    const { showNoti } = useWrap();

    const getDataTable = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await configApi.getAll();
			if(res.status == 204) {
				showNoti("danger", "Không có dữ liệu");
			}
			if(res.status == 200){
				setDataTable(res.data.data);
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

    const _onSubmit = async (data: any) => {
        setIsLoading({
          type: "ADD_DATA",
          status: true,
        });
    
        let res = null;
    
        if(data.ID) {
          console.log(data);
          try {
                res = await configApi.update(data);
                res.status === 200 && showNoti('success', "Cập nhật thành công"), getDataTable();
          } catch (error) {
            showNoti("danger", error.message);
          } finally {
            setIsLoading({
              type: "ADD_DATA",
              status: false,
            });
          }
        } else {
          try {
            res = await configApi.add(data);
            res?.status == 200 && afterPost("Thêm");
          } catch (error) {
            showNoti("danger", error.message);
          } finally {
            setIsLoading({
              type: "ADD_DATA",
              status: false,
            });
          }
        }
    
        return res;
    }

    const afterPost = (value) => {
        showNoti("success", `${value} thành công`);
    };

    const columns = [
		{
			title: 'Loại phiếu', 
			dataIndex: 'TypeName', 
		},
		{
			title: 'Nội dung',
			dataIndex: 'ConfigContent',
		},
		{
			title: 'Thêm lúc',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format("DD/MM/YYYY"),
			// ...FilterDateColumn('modDate'),
		},
		{
			render: (record) => (
				<>
          <ConfigVoucherInvoiceForm 
						showIcon={true}
						rowData={record}
						isLoading={isLoading}
						_onSubmit={(data: any) => _onSubmit(data)}
					/>
				</>
			),
		},
	];

    useEffect(() => {
        getDataTable();
    }, []);

    return (
        <>
            <PowerTable 
                loading={isLoading}
                dataSource={dataTable}
                columns={columns}
                TitleCard={
                    <ConfigVoucherInvoiceForm 
                        showAdd={true} 
                        isLoading={isLoading} 
                        _onSubmit={(data: any) => _onSubmit(data)}
                    />}
            />
        </>
    )
}
ConfigVoucherInvoice.layout = LayoutBase;
export default ConfigVoucherInvoice;