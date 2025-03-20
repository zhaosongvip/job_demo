const menuItems = [
  {
    key: '1',
    label: '个人资料'
  },
  {
    key: '2',
    label: '退出登录'
  }
];

<Dropdown menu={{ items: menuItems }}>
  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
    用户名 <DownOutlined />
  </a>
</Dropdown> 