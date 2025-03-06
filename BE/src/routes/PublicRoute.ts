/***
 * NOTE: put all the static routes before the dynamic routes
 */

interface PublicRoutes {
  path: string;
  method: string;
}

const publicRoutes: PublicRoutes[] = [
  // Assets
  { path: "/assets/:something", method: "GET" },
];

export default publicRoutes;
