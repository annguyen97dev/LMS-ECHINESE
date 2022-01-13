import React, { FC } from 'react';
import Link from 'next/link';
import 'react-circular-progressbar/dist/styles.css';

type hProps = {
	params: any;
	onClick: any;
};

const HeaderVideo: FC<hProps> = ({ params, onClick }): JSX.Element => {
	return (
		<div className="row video-header pl-5 pr-5 video-shadow">
			<div className="row p-0">
				<div className="app-header-logo">
					<Link href="/">
						<a href="#">
							<img className="logo-img" src="/images/logo-final.jpg"></img>
						</a>
					</Link>
				</div>
				<div className="row video-header__title">
					<a className="video-header__video-title">{params.name}</a>
				</div>
			</div>
			<div className="row p-0 video-header__header-right">
				<div className="row video-header__progress">
					<div className="row mr-4 video-header__progress-bar-container"></div>
					<span className="video-header__video-title">Hoàn thành {params.complete}</span>
				</div>
				<div onClick={onClick} className="video-header__playlist">
					<i className="fas fa-list-ul "></i>
				</div>
			</div>
		</div>
	);
};

export default HeaderVideo;
