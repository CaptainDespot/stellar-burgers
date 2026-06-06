import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ProfileMenu } from '../../components/profile-menu';

export const ProfileLayout: FC = () => (
  <div
    style={{
      display: 'flex',
      gap: '40px',
      maxWidth: '1240px',
      margin: '40px auto 0'
    }}
  >
    <ProfileMenu />

    <div style={{ flexGrow: 1 }}>
      <Outlet />
    </div>
  </div>
);
