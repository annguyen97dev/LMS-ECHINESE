import React, { useState, useEffect, useLayoutEffect } from 'react';
import { idiomsApi } from '~/apiBase/options/idioms';
import { createDateObject } from '~/utils/functions';

import styles from './AuthLayout.module.scss';

function AuthLayout({ children }) {
	const [idiom, setIdiom] = useState<{ content: string; author: string }>({ content: '', author: '' });
	const [dateState, setDateState] = useState(createDateObject(new Date(), 'en'));

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
	}, []);

	return (
		<>
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
								{/* <p>{idiom.author}</p> */}
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

				<div className={styles.rules}>
					<a>điều khoản</a>
				</div>
			</div>
		</>
	);
}

export default AuthLayout;
