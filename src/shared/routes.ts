import Brokers from "../components/brokers";
import CreateTopic from "../components/createtopic";
import Splash from "../components/splash";
import Viewer from "../components/viewer";

interface Route {
    component: any;
    exact: boolean;
    path: string;
}

let routes: Route[];

export default routes = [
    {
        component: Splash,
        exact: true,
        path: "/",
    },
    {
        component: Viewer,
        exact: false,
        path: "/topics/view/:id",
    },
    {
        component: CreateTopic,
        exact: false,
        path: "/topics/create",
    },
    {
        component: Brokers,
        exact: false,
        path: "/brokers",
    },
];
