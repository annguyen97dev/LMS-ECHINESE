import { Modal } from 'antd';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { rulesApi } from '~/apiBase';
import { idiomsApi } from '~/apiBase/options/idioms';
import { createDateObject } from '~/utils/functions';

import styles from './AuthLayout.module.scss';
import ReactHtmlParser from 'react-html-parser';

function AuthLayout({ children }) {
	const [idiom, setIdiom] = useState<{ content: string; author: string }>({ content: '', author: '' });
	const [dateState, setDateState] = useState(createDateObject(new Date(), 'en'));
	const [isVisible, setIsVisible] = useState(false);
	const [termContent, setTermContent] = useState(null);

	function getFirstIdiom() {
		(async () => {
			try {
				const res = await idiomsApi.getRandom();

				if (res.status == 200) {
					const content = res.data.data.Idioms;
					const author = res.data.data.CreatedBy;
					setIdiom({ content, author }); // lấy cái mới nhất
				}
			} catch (error) {
				console.log(error);
			}
		})();
	}

	const getTermsInformation = async () => {
		try {
			let res = await rulesApi.getAll({});
			if (res.status) {
				setTermContent(res.data.data);
			}
		} catch (error) {
		} finally {
		}
	};

	useEffect(() => {
		const timeID = setInterval(() => {
			setDateState(createDateObject(new Date(), 'en'));
		}, 1000);
		return () => {
			clearInterval(timeID);
		};
	}, []);

	useEffect(() => {
		getFirstIdiom();
		getTermsInformation();
	}, []);

	return (
		<>
			<Modal
				style={{ overflow: 'hidden' }}
				zIndex={99999}
				width={1000}
				footer={false}
				visible={isVisible}
				onCancel={() => {
					setIsVisible(false);
				}}
			>
				<div className="row ">
					<div className="col-12 term__service mb-4">{ReactHtmlParser(termContent && termContent.RulesContent)}</div>

					<div className="col-12">
						<button
							className="btn btn-primary w-100"
							onClick={() => {
								setIsVisible(false);
							}}
						>
							Xác nhận
						</button>
					</div>
				</div>
			</Modal>
			<div className={styles.wrapper}>
				<div className={styles['image-wrapper']}>
					<div className={styles['calendar-wrapper']}>
						<div className={styles.calendar}>
							<p className={styles.month_year}>
								{dateState.month} {dateState.year}
							</p>

							<p className={styles.date}>{dateState.date}</p>

							<p className={styles.time}>
								{dateState.hour} : {dateState.minute} : {dateState.second}
							</p>

							<div className={styles.slogan}>
								<div
									className={styles.text}
									dangerouslySetInnerHTML={{
										__html: `${idiom.content}`
									}}
								></div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.content}>{children}</div>
			</div>

			<div className={styles.footer}>
				<div className={styles.footer__left}>
					<span>© </span>
					<span>2021 ECHINESE</span>
				</div>

				<div
					className={styles.rules}
					onClick={() => {
						setIsVisible(true);
					}}
				>
					<a>điều khoản</a>
				</div>
			</div>
		</>
	);
}

export default AuthLayout;
