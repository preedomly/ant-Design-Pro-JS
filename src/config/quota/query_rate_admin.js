const queryCfg = {
    name: '安全教育',
    condition: true,
    orderBy: 'PRO_SAFETY_EDUCATION.CREATE_TIME DESC',
    // details: {
    //     dataBagCfg: "dataBag_pro_gcqz",
    //     name: 'GongChengMingChen'
    // },
    operation: {
        add: {
            text: '新建',
            visible: true,
            toolid: 'PRO_CREATE',
            definitionId: 'Process3721653660216:1:60'
        },
        delete: {
            text: '删除',
            visible: true
        },
        view: {
            text: '查看',
            visible: true,
            addition: {
                paramJson: {

                }
            }
        },
        edit: {
            text: '编辑',
            visible: true,
            addition: {
                paramJson: {

                }
            }
        }
    }
}