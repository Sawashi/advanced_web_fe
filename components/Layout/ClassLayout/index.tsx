import {
  Center,
  HStack,
  Spinner,
  Stack,
  VStack,
  chakra,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { ReactNode, useEffect } from "react";
import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import SideBar, { ISidebarRefProps } from "../UserLayout/components/Sidebar";
import ClassHeader from "components/Header/ClassHeader";
import { IClass } from "interfaces/classes";
import { useStores } from "hooks/useStores";
import { EUserRole } from "enums/auth";

interface IClassLayoutProps {
  title?: string;
  children?: ReactNode;
  details: IClass;
  isLoading?: boolean;
}

const ClassLayout = (props: IClassLayoutProps) => {
  const { authStore } = useStores();
  const toast = useToast();
  useEffect(() => {
    if (authStore?.user?.id && authStore?.user?.role === EUserRole.ADMIN) {
      toast({
        status: "error",
        description: "You are not user",
      });
      authStore.logout();
    }
  }, []);
  const { title, children, details, isLoading = false } = props;
  const sideBarRef = React.useRef<ISidebarRefProps>(null);

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/assets/icons/logo.svg" />
      </Head>
      <chakra.main height={"100vh"} flexDir={"column"} display={"flex"}>
        <ClassHeader
          onExpand={() => {
            sideBarRef.current?.onExpand();
          }}
          classDetails={details}
        />
        <HStack flex={1} alignItems="stretch" spacing={0}>
          <SideBar ref={sideBarRef} />
          <Stack h={"100%"} overflow={"auto"} w={"full"} flex={1}>
            {isLoading ? (
              <Center mt={20}>
                <Spinner boxSize={30} />
              </Center>
            ) : (
              <>{children}</>
            )}
          </Stack>
        </HStack>
      </chakra.main>
    </>
  );
};

export default withAuth(observer(ClassLayout));
