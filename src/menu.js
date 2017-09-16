import React from 'react';
import { MenuItemLink } from 'admin-on-rest';
import { Menu } from 'admin-on-rest';
import ViewListIcon from 'material-ui/svg-icons/action/view-list';

export default ({ resources, onMenuTap, logout }) => {
  const onTapMenu = onMenuTap || (() => {});
  return (
    <div>
      <Menu resources={resources} onMenuTap={onTapMenu} />
      <MenuItemLink to="/config" primaryText="Configuration"
        leftIcon={<ViewListIcon />} onTouchTap={onTapMenu} />
      {logout}
    </div>
  );
}
