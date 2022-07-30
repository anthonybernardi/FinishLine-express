/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogout } from 'react-google-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../services/auth.hooks';
import { routes } from '../../../routes';
import styles from './nav-user-menu.module.css';

const NavUserMenu: React.FC = () => {
  const history = useNavigate();
  const auth = useAuth();

  const { signOut, loaded } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID!,
    onLogoutSuccess: () => {
      auth!.signout();
      history(routes.HOME);
    }
  });

  return (
    <NavDropdown
      className="m-auto"
      title={<FontAwesomeIcon icon={faUserCircle} size="2x" inverse />}
      id="user-dropdown"
      alignRight
    >
      <NavDropdown.ItemText>Logged in as: {auth.user?.emailId}</NavDropdown.ItemText>
      <NavDropdown.Divider />
      <NavDropdown.Item className={styles.UserMenuItem}>
        <Link className={'nav-link ' + styles.dropdownItems} role="button" to={routes.SETTINGS}>
          Settings
        </Link>
      </NavDropdown.Item>
      <NavDropdown.Item className={styles.UserMenuItem}>
        <button className={'nav-link ' + styles.dropdownItems} onClick={signOut} disabled={!loaded}>
          Logout
        </button>
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default NavUserMenu;
