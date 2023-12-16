import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";

const Home = () => {
  return <UserLayout title="Home"></UserLayout>;
};

export default withAuth(observer(Home));
