
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { idiomsApi } from '~/apiBase/options/idioms';

import styles from './AuthLayout.module.scss';

function AuthLayout({ children }) {
    const [idiom, setIdiom] = useState<string>('');
	const [dateState, setDateState] = useState(new Date());

	function getIdiom() {
		(async () => {
			const res = await idiomsApi.getPaged({});
			console.log('idioms', res.data.data);
			if (res.status == 200) {
				setIdiom(res.data.data[0].Idioms);
			}
		})();
	}

	useEffect(() => {
		const timeID = setInterval(() => {
			setDateState(new Date());
		}, 1000);
		return () => {
			clearInterval(timeID);
		};
	}, []);

    useEffect(() => {
        getIdiom();
    }, [])

	const locale = 'en';
	const year = dateState.getFullYear();
	const month = dateState.toLocaleDateString(locale, { month: 'long' });
	const date = dateState.getDate();
	const hour = ('0' + dateState.getHours()).slice(-2);
	const minute = ('0' + dateState.getMinutes()).slice(-2);
	const second = ('0' + dateState.getSeconds()).slice(-2);

	return (
		<>
			<div className={styles.wrapper}>
				<div className={styles['calendar-wrapper']}>
					<div className={styles.calendar}>
						<p className={styles.month_year}>
							{month} {year}
						</p>
						<p className={styles.date}>{date}</p>
						<p className={styles.time}>
							{hour} : {minute} : {second}
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
