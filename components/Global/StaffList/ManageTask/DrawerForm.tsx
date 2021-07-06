import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { MessageCircle } from 'react-feather';

const DrawerForm = (props: any) => {
    const [visible, setVisible] = useState(false);

    const onClose = () => {
      setVisible(false);
    };

    return (
        <>
            <button
                className="btn border btn-default history"
                onClick={() => {
                    setVisible(true);
                }}
            >
                Lịch sử
            </button>
            <Drawer
                title="Lịch sử hoạt động"
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}
                width={300}
            >
                {props.data?.map((row, index) => {
                    return (
                        <p key={index}><MessageCircle /> {row.text}</p>
                    )
                })}
            </Drawer>
        </>
    )
}

export default DrawerForm;