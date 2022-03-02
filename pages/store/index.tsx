import { Popover } from 'antd';
import Link from 'next/link';
import React from 'react';
import PackageStore from '~/components/Global/Package/PackageStore/PackageStore';
import Store from '~/components/Global/Package/PackageStore/Store';
import LayoutBase from '~/components/LayoutBase';

const PackageStorePage = () => {
	return (
		<div>
			<div className="mb-3">
				<header>
					<div className="shopping__cart-header justify-content-between align-items-center row">
						<div className="header__logo col-6 col-md-3">
							<Link href="https://app.echinese.vn">
								<a href="https://app.echinese.vn">
									<img className="logo-img" src="/images/logo-final.jpg" alt="logo branch"></img>
								</a>
							</Link>
						</div>
						<div className="header__profile col-2 col-md-3">
							<div className="col-setting">
								<ul className="col-setting-list">
									<li className="user">
										<div className="d-inline-block d-md-none  w-25 "></div>
										<div className="d-none d-md-inline-block "></div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</header>
			</div>
			<div className="m-3">
				<Store />
			</div>
		</div>
	);
};

export default PackageStorePage;
