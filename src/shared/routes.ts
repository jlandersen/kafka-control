import Brokers from "../components/brokers/Brokers";
import Splash from "../components/splash/Splash";
import Viewer from "../components/viewer/Viewer";

let routes: Array<{
    component: any,
    exact: boolean,
    path: string,
}>;

export default routes = [
    {
        component: Splash,
        exact: true,
        path: "/",
    },
    {
        component: Viewer,
        exact: false,
        path: "/topics/:id",
    },
    {
        component: Brokers,
        exact: false,
        path: "/brokers",
    },
];
