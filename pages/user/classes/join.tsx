import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import UserLayout from "components/Layout/UserLayout";
import { useStores } from "hooks/useStores";
import { HStack, Spinner, Text, VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import routes from "routes";
import { usePostJoinClassViaToken } from "API/post/post.classes.join-class";
import React from "react";
import SvgIcon from "components/SvgIcon";
import { green500 } from "theme/colors.theme";

//Path: /user/classes/join?token=token

const JoinClassScreen = () => {
  const { settingStore } = useStores();
  const router = useRouter();
  const toast = useToast();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { mutateAsync } = usePostJoinClassViaToken();

  const onJoinClass = async (token: string, classId?: string) => {
    const { data } = await mutateAsync(token);
    if (data?.message && data?.error && data?.statusCode >= 400) {
      toast({
        title: data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      router.push(routes.user.home.value);
    } else {
      setIsSuccess(true);
      //TODO: redirect to class detail
      router.push(routes.classes.details.value(data?.id ?? ""));
    }
  };

  useEffect(() => {
    if (router?.isReady) {
      const { classId, token } = router.query;
      if (!token) {
        toast({
          title: "Token is invalid",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        // router.push(routes.user.home.value);
      } else {
        onJoinClass(token as string, classId as string);
      }
      settingStore?.setHeaderLoading(false);
    } else {
      settingStore?.setHeaderLoading(true);
    }
  }, [router.isReady]);

  return (
    <UserLayout title="Home">
      <VStack
        w="full"
        flex={1}
        h="full"
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Text
          fontSize={20}
          fontWeight={"bold"}
          color={"gray.500"}
          mb={5}
          textAlign={"center"}
        >
          {!isSuccess ? "Joining class" : ""}
        </Text>
        {!isSuccess ? (
          <Spinner />
        ) : (
          <VStack>
            <SvgIcon iconName={"ic-success.svg"} size={50} color={green500} />
            <Text fontSize={20} fontWeight={"bold"} color={"green.500"} mb={5}>
              Join class success
            </Text>
          </VStack>
        )}
      </VStack>
    </UserLayout>
  );
};

export default withAuth(observer(JoinClassScreen));
