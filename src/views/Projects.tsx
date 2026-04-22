import { Outlet, Link } from "react-router";
import { RouteNames } from '@/models/routes';

function Projects() {
  return <>
    <h1 className="text-4xl mb-10">Projects!</h1>
    <div className="flex justify-around w-2/4 mb-10">
      <Link to={RouteNames.PROJECTS_TICTACTOE} className="hover:text-blue-600 active:text-blue-800">Tic Tac Toe</Link>
      <Link to={RouteNames.PROJECTS_STATE} className="cursor-pointer citrus-clickable">State</Link>
      <Link to={RouteNames.PROJECTS_S3} className="cursor-pointer citrus-clickable">Amazon S3</Link>
      <Link to={RouteNames.PROJECTS_ALIBABA} className="cursor-pointer citrus-clickable">Alibaba OSS</Link>
      <Link to={RouteNames.PROJECTS_PAYPAL} className="cursor-pointer citrus-clickable">Paypal</Link>
      <Link to={RouteNames.PROJECTS_TEST} className="cursor-pointer citrus-clickable">Test</Link>
      <Link to={RouteNames.PROJECTS_CAROUSEL} className="cursor-pointer citrus-clickable">Carousel</Link>
    </div>
    <Outlet/>
  </>
}

export default Projects;
