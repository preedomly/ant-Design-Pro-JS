/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import { Link, connect, history } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.svg';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/** Use Authorized check all menu item */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} Produced by Ant Group Experience Technology Department`}
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    menus,
    location = {
      pathname: '/',
    },
  } = props;
  const menuDataRef = useRef([]);


  useEffect(() => {
    // setMenuData([]);
    // setLoading(true);
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });

      // fetch('https://dhstatic.bthome.com/dev/web/consult/jsons.json')
      //   .then(response => response.json())
      //   .then(data => {
      //     setMenuData(data || []);
      //     setLoading(false);
      //   });
    }
  }, []);
  /** Init variables */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );

  return (
    <ProLayout
      logo={logo}
      // menu={{ loading }}
      // style={{
      //   height: '100vh',
      //   border: '1px solid #ddd',
      // }}
      collapsedButtonRender={false}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      location={{
        pathname: '/welcome/welcome',
      }}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }

        return (
          <Link to={menuItemProps.path}>
            {/* {menuItemProps.pro_layout_parentKeys &&
              menuItemProps.pro_layout_parentKeys.length > 0 &&
              menuItemProps.icon} */}
            {defaultDom}
          </Link>
        );
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => {
        if (settings.footerRender || settings.footerRender === undefined) {
          return defaultFooterDom;
        }

        return null;
      }}
      menuDataRender={menuDataRender}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
      // menuDataRender={() => menuData}
      rightContentRender={() => <RightContent />}
      waterMarkProps={{
        content: '卢月测试专列',
        fontColor: 'rgba(24,144,255,0.15)',
      }}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings, menus }) => ({
  collapsed: global.collapsed,
  settings,
  menus,
}))(BasicLayout);
