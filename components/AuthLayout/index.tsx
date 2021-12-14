import React, { useState, useEffect, useLayoutEffect } from 'react';
import { idiomsApi } from '~/apiBase/options/idioms';
import { createDateObject } from '~/utils/functions';

import styles from './AuthLayout.module.scss';

function AuthLayout({ children }) {
	const [idiom, setIdiom] = useState<string>('');
	const [dateState, setDateState] = useState(createDateObject(new Date(), 'en'));

	function getFirstIdiom() {
		(async () => {
            try {
                const res = await idiomsApi.getPaged({});
                if (res.status == 200) {
                    setIdiom(res.data.data[0].Idioms); // lấy cái mới nhất
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
									__html: `${idiom}`
								}}
							></div>
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
