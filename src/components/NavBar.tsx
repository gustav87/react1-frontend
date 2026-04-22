import './NavBar.css';
import { RouteNames } from '@/models/routes';
import { Link, useLocation } from "react-router";
import useLoginStore from '@/store/loginStore';

function NavBar() {
  const path = useLocation().pathname;
  const setSelected = (incoming: string): string => path.includes(incoming) ? "text-blue-600 citrus-navbar__disabled" : "";
  const navItemStyle = "p-2 citrus-clickable";
  const username = useLoginStore((state) => state.username);
  const resetLogin = useLoginStore((state) => state.resetLogin);

  const isLoggedIn = !!username;

  return (
    <div className="bg-zinc-700 mb-5 uppercase font-bold text-white">
      <ul className="flex items-center h-20">
        <li className="mr-12 ml-4">
          <Link to={RouteNames.HOME}><img src="/klaus.png" width="70px" className="klaus"/></Link>
        </li>
        <li className="mr-6">
          <Link to={RouteNames.PROJECTS} className={`${navItemStyle} ${setSelected(RouteNames.PROJECTS)}`}>Projects</Link>
        </li>
        <li className="mr-6">
          <Link to={RouteNames.CONTACT} className={`${navItemStyle} ${setSelected(RouteNames.CONTACT)}`}>Contact</Link>
        </li>
        {!isLoggedIn && (
          <div className="ml-auto flex mr-8">
            <li className="mr-6">
              <Link to={RouteNames.LOGIN} className={`${navItemStyle} ${setSelected(RouteNames.LOGIN)}`}>Log in</Link>
            </li>
            <li>
              <Link to={RouteNames.SIGN_UP} className={`${navItemStyle} ${setSelected(RouteNames.SIGN_UP)}`}>Sign up</Link>
            </li>
          </div>
        )}
        {isLoggedIn && (
          <div className="ml-auto mr-8 flex">
            <div className="p-2">[{username}]</div>
            <li className={`cursor-pointer ${navItemStyle}`} onClick={resetLogin}>
              Log out
            </li>
          </div>
        )}
      </ul>
    </div>
  );
}

export default NavBar;
