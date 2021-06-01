import React, { useEffect } from 'react'
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Tag, Space, message } from 'antd';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags.map(tag => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];

const DemoTable = (props) => {
    const { route: { cfg }, history } = props;
    useEffect(() => {
        // if (!cfg) {
        //     return history.back()
        // }
        const cfgs = JSON.parse(localStorage.getItem('sysConfig')).filter(x => x.indexOf(cfg) > 0).join().substring(1);
        try {
            const sysConfigs = require(`@config${cfgs}`);
            console.log(sysConfigs)
        } catch (e) {
            message.error('发现错误信息，请重新审查配置文件', 0);
        }
    }, []);

    return (
        <PageContainer>
            <Table columns={columns} dataSource={data} />
        </PageContainer>

    )
}

export default connect(({ demoTable }) => ({
    ...demoTable
}))(DemoTable);

