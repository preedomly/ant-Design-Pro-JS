import request from '@/utils/request';

export async function getMenus() {
    return request(`/api/menus`);
}
