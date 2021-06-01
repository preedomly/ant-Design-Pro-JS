import { getMenus } from '@/services/menu';
import { isUrl } from '@/utils/utils';



export default {
    namespace: 'demoTable',
    state: {
        menusData: [],
    },
    effects: {
        *fetchMenuData(_, { call, put }) {
            const res = yield call(getMenus);
            console.log(res)
            // 改造导航菜单 =》 进阶 =》 UMI 数据改造
            const formatter = (data = [], parentPath = '/', parentAuthority) => {
                return data.map(item => {
                    let { path } = item;
                    if (!isUrl(path)) {
                        path = parentPath + item.path;
                    }
                    // if (item.icon) {
                    //     icon = item.icon.replace('icon-', '');
                    // }
                    const result = {
                        ...item,
                        path,
                        authority: item.authority || parentAuthority,
                    };
                    if (item.children) {
                        result.children = formatter(item.children,
                            `${parentPath}${item.path}/`, item.authority);
                    }
                    return result;
                });
            }
            yield put({
                type: 'saveMenusData',
                payload: { menusData: formatter(res) },
            })
        }
    },
    reducers: {
        saveMenusData(state, payload) {
            console.log(payload)
            return {
                ...state,
                ...payload.payload
            }
        }
    },
};
