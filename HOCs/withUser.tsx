import { useRouter } from "next/router";
import { useEffect } from "react";
import { useStores } from "hooks/useStores";
import routes from "routes";
import { observer } from "mobx-react";
import { useToast } from "@chakra-ui/react";
import { EUserRole } from "enums/auth";

const withUser = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();
    const toast = useToast();
    const { authStore } = useStores();

    // useEffect(() => {
    //   if (authStore?.user?.id && authStore?.user?.role === EUserRole.ADMIN) {
    //     toast({
    //       status: "error",
    //       description: "You are not user",
    //     });
    //     // TODO: fix logout - Not force logout - just redirect to forbidden page
    //     authStore.logout();
    //   }
    // }, [authStore?.user]);

    return <WrappedComponent {...props} />;
  };

  return observer(Wrapper);
};

export default withUser;
