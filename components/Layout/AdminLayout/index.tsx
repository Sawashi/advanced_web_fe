import { HStack, Stack, chakra, useDisclosure } from "@chakra-ui/react";
import withAuth from "HOCs/withAuth";
import AdminHeader from "components/Header/AdminHeader";
import CreateClassModal from "components/pages/Classes/CreateClassModal";
import JoinClassModal from "components/pages/HomePage/JoinClassModal";
import { observer } from "mobx-react";
import Head from "next/head";
import React, { ReactNode } from "react";
import SideBar, { ISidebarRefProps } from "./components/Sidebar";

interface IAuthenticationLayoutProps {
  title?: string;
  children?: ReactNode;
}

const UserLayout = (props: IAuthenticationLayoutProps) => {
  const { title, children } = props;
  const sideBarRef = React.useRef<ISidebarRefProps>(null);
  const {
    isOpen: isOpenJoinClass,
    onClose: onCloseJoinClass,
    onOpen: onOpenJoinClass,
  } = useDisclosure();

  const {
    isOpen: isOpenCreateClass,
    onClose: onCloseCreateClass,
    onOpen: onOpenCreateClass,
  } = useDisclosure();

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/assets/icons/logo.svg" />
      </Head>
      <chakra.main height={"100vh"} flexDir={"column"} display={"flex"}>
        <AdminHeader
          onExpand={() => {
            sideBarRef.current?.onExpand();
          }}
        />
        <HStack
          background="background.primary"
          alignItems="stretch"
          flex={1}
          spacing={0}
        >
          <SideBar ref={sideBarRef} />
          <Stack h={"100%"} overflow={"auto"} w={"full"} flex={1}>
            {children}
          </Stack>
          <JoinClassModal
            isVisible={isOpenJoinClass}
            onClose={onCloseJoinClass}
          />
          <CreateClassModal
            isVisible={isOpenCreateClass}
            onClose={onCloseCreateClass}
          />
        </HStack>
      </chakra.main>
    </>
  );
};

export default withAuth(observer(UserLayout));
