import {
  HStack,
  Stack,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { ReactNode } from "react";
import withAuth from "HOCs/withAuth";
import UserHeader from "components/Header/UserHeader";
import SideBar, { ISidebarRefProps } from "./components/Sidebar";
import { observer } from "mobx-react";
import JoinClassModal from "components/pages/HomePage/JoinClassModal";
import CreateClassModal from "components/pages/Classes/CreateClassModal";
import withUser from "HOCs/withUser";

interface IAuthenticationLayoutProps {
  title?: string;
  children?: ReactNode;
  onCloseCreateClassModal?: () => void;
  onCloseJoinClassModal?: () => void;
}

const UserLayout = (props: IAuthenticationLayoutProps) => {
  const { title, children,
    onCloseCreateClassModal,
    onCloseJoinClassModal
  } = props;
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

  const handleCloseCreateClassModal = () => {
    onCloseCreateClassModal?.();
    onCloseCreateClass();
  }

  const handleCloseJoinClassModal = () => {
    onCloseJoinClass();
    onCloseJoinClassModal?.();
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/assets/icons/logo.svg" />
      </Head>
      <chakra.main height={"100vh"} flexDir={"column"} display={"flex"}>
        <UserHeader
          onExpand={() => {
            sideBarRef.current?.onExpand();
          }}
          onJoinClass={onOpenJoinClass}
          onCreateClass={onOpenCreateClass}
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
            onClose={handleCloseJoinClassModal}
          />
          <CreateClassModal
            isVisible={isOpenCreateClass}
            onClose={handleCloseCreateClassModal}
          />
        </HStack>
      </chakra.main>
    </>
  );
};

export default withUser(withAuth(observer(UserLayout)));
