import { Switch } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { idiomsApi } from '~/apiBase/options/idioms';
import FeedbackDelete from '~/components/Global/Option/Feedback/FeedbackDelete';
import IdiomsForm from '~/components/Global/Option/IdiomsForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Text from 'antd/lib/typography/Text';

const Idioms = () => {
	const onSearch = (data) => {
		setCurrentPage(1);
		setParams({
			...listParamsDefault,
			search: data
		});
	};

	const handleReset = () => {
		setCurrentPage(1);
		setParams(listParamsDefault);
	};
	const columns = [
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy',
			render: (CreatedBy) => <div style={{ width: '120px' }}>{CreatedBy}</div>
		},
		{
			title: 'Câu thành ngữ',
			dataIndex: 'Idioms',
			...FilterColumn('Idioms', onSearch, handleReset, 'text'),
			render: (text) => ReactHtmlParser(text)
		},
		{
			title: 'Trạng thái',
			render: (data) => (
				<Fragment>
					<Switch
						checkedChildren="Hiện"
						unCheckedChildren="Ẩn"
						checked={data.Enable}
						size="default"
						onChange={async (check: boolean) => {
							setIsLoading({
								type: 'GET_ALL',
								status: true
							});
							try {
								let res = await idiomsApi.update({ ...data, Enable: check });
								res.status == 200 && setParams({ ...params, pageIndex: currentPage }),
									showNoti('success', res.data.message);
							} catch (error) {
								showNoti('danger', error.Message);
							} finally {
								setIsLoading({
									type: 'GET_ALL',
									status: false
								});
							}
						}}
					/>
				</Fragment>
			)
		},
		{
			render: (data) => (
				<>
					<IdiomsForm
						idiomsDetail={data}
						idiomsId={data.ID}
						reloadData={(firstPage) => {
							getDataIdioms(firstPage);
						}}
						currentPage={currentPage}
					/>
				</>
			)
		}
	];
	const [currentPage, setCurrentPage] = useState(1);

	const { showNoti, pageSize } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [idioms, setIdioms] = useState<IIdioms[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});
	const listParamsDefault = {
		pageSize: pageSize,
		pageIndex: currentPage,
		search: null
	};
	const [params, setParams] = useState(listParamsDefault);

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: currentPage
		});
	};

	const getDataIdioms = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await idiomsApi.getPaged({ ...params, pageIndex: page });
                
				res.status == 200 && setIdioms(res.data.data);
				if (res.status == 204) {
					showNoti('danger', 'Không tìm thấy dữ liệu!');
					setCurrentPage(1);
					setParams(listParamsDefault);
					setIdioms([]);
				} else setTotalPage(res.data.totalRow);
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		})();
	};

	useEffect(() => {
		getDataIdioms(currentPage);
	}, [params]);

	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Thành ngữ lịch"
			TitleCard={
				<IdiomsForm
					reloadData={(firstPage) => {
						setCurrentPage(1);
						getDataIdioms(firstPage);
					}}
				/>
			}
			dataSource={idioms}
			columns={columns}
		/>
	);
};
Idioms.layout = LayoutBase;
export default Idioms;
