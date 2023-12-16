import { HStack, Stack, chakra } from "@chakra-ui/react";
import Head from "next/head";
import React, { ReactNode } from "react";
import withAuth from "HOCs/withAuth";
import Header from "components/Header";
import UserHeader from "components/Header/UserHeader";

interface IAuthenticationLayoutProps {
  title?: string;
  children?: ReactNode;
}

const UserLayout = (props: IAuthenticationLayoutProps) => {
  const { title, children } = props;
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/assets/icons/logo.svg" />
      </Head>
      <chakra.main>
        <UserHeader />
        <HStack h="full">{children}</HStack>
      </chakra.main>
    </>
  );
};

export default withAuth(UserLayout);
