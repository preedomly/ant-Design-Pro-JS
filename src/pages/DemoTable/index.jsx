import React, { useState, useEffect } from 'react'
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Tag, Space } from 'antd';
// import { panelCtrl } from '@/components/controls'

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

const datas = [
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
    // const { route: { cfg }, history } = props;
    const [state, setstate] = useState({
        top: {
            condition: true,
        },
        center: [
            [
                {
                    type: 'actionButton',
                    value: [{ type: 'export', path: 'xxx/xxx' }],
                    size: 5,
                }
            ],
            [
                {
                    type: 'tree',
                    path: '',
                    size: 30,
                }, {
                    type: 'table',
                    path: '',
                    size: 67,
                }
            ],
            {
                type: 'ces',
                value: [{ type: 'export', path: 'xxx/xxx' }],
                size: 5,
            }
        ],
        bottom: [],
    });


    const makeChildeDom = (data) => {
        const ps = []
        if (Array.isArray(data)) {
            data.forEach(x => {
                if (Array.isArray(x)) {
                    ps.push(makeChildeDom(x))
                } else {
                    ps.push(<div key={x.type}>{x.type}</div>)
                }
            })
            return ps;
        }
    }

    const makeFather = (data, size = [100]) => {
        const ps = [];
        if (Array.isArray(data)) {
            <div size={size}>
                {
                    data.map(p => {
                        if (Array.isArray(p)) {
                            ps.push(
                                <div>
                                    {makeFather(p, p.reduce((arr, cur) => { arr.push(cur.size); return arr }, []))}
                                </div>
                            )
                        }
                        ps.push(makeChildeDom(p))
                    })
                }
            </div>
            return ps;
        }
    }


    // useEffect(() => {
    //     const cfgs = JSON.parse(localStorage.getItem('sysConfig')).filter(x => x.indexOf(cfg) > 0).join().substring(1);
    //     try {
    //         const sysConfigs = require(`@/config${cfgs}`);
    //         console.log('sysConfigs', sysConfigs)
    //     } catch (e) {
    //         message.error('发现错误信息，请重新审查配置文件', 0);
    //     }
    // }, []);

    return (
        <PageContainer>
            {
                state.top.condition && <div>123</div>
            }
            {
                Array.isArray(state.center)
                    ? makeFather(state.center)
                    : <div>345</div>
            }
        </PageContainer>

    )
}

export default connect(({ demoTable }) => ({
    ...demoTable
}))(DemoTable);

