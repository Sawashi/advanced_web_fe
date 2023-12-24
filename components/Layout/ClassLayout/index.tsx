import { HStack, Stack, chakra } from "@chakra-ui/react";
import Head from "next/head";
import React, { ReactNode } from "react";
import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import SideBar, { ISidebarRefProps } from "../UserLayout/components/Sidebar";
import ClassHeader from "components/Header/ClassHeader";
import { IClass } from "interfaces/classes";

interface IClassLayoutProps {
  title?: string;
  children?: ReactNode;
  details: IClass;
}

const ClassLayout = (props: IClassLayoutProps) => {
  const { title, children, details } = props;
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
        </HStack>
      </chakra.main>
    </>
  );
};

export default withAuth(observer(ClassLayout));
