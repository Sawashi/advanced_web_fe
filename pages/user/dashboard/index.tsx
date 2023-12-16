import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";

const Dashboard = () => {
  return <UserLayout title="Home"></UserLayout>;
};

export default withAuth(observer(Dashboard));
