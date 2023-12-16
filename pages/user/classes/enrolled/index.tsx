import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";
import { useGetClassesAsStudent } from "API/get/get.classes.student";
import { useStores } from "hooks/useStores";

const EnrolledClasses = () => {
  const { authStore, settingStore } = useStores();
  const { data: studentClasses } = useGetClassesAsStudent(
    authStore?.user?.id ?? ""
  );
  console.log(studentClasses);

  return <UserLayout title="Home"></UserLayout>;
};

export default withAuth(observer(EnrolledClasses));
