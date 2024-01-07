import {
  Box,
  Center,
  Circle,
  Divider,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  useGetMyNotifications,
  useGetMyUnseenNotifications,
} from "API/get/get.me.notifications";
import EmptyList from "components/EmptyState/EmptyList";
import SvgIcon from "components/SvgIcon";
import { INotification } from "interfaces/user";
import React, { useCallback } from "react";
import { gray700 } from "theme/colors.theme";
import { checkValidArray, getValidArray, timeAgo } from "utils/common";

const BellNotifications = React.memo(() => {
  const { data: unseenNotificationsCount } = useGetMyUnseenNotifications();
  const {
    data: dataNotifications,
    isLoading: isLoadingNotifications,
    mutateAsync,
    reset,
  } = useGetMyNotifications();
  const { data: notifications } = dataNotifications || {};

  const onOpenBellNotifications = () => {
    mutateAsync();
  };

  const onCloseBellNotifications = () => {
    reset();
  };

  const renderNotification = useCallback(
    (notification: INotification) => {
      return (
        <HStack
          key={notification?.id}
          w={"full"}
          alignItems={"center"}
          _hover={{
            cursor: "pointer",
            backgroundColor: "gray.100",
          }}
          px={2}
        >
          <VStack w={"full"} alignItems={"flex-start"} spacing={1} p={2}>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              color={"gray.700"}
              lineHeight={"normal"}
            >
              {notification?.title}
            </Text>
            <Text
              fontSize={"sm"}
              fontWeight={"normal"}
              ml={2}
              color={"gray.500"}
              lineHeight={"normal"}
            >
              {notification?.description}
            </Text>
            <Text
              fontSize={"2xs"}
              fontWeight={"normal"}
              ml={2}
              color={"blue.500"}
              lineHeight={"normal"}
            >
              {timeAgo(notification?.createdAt)}
            </Text>
          </VStack>
          <Circle
            size={"10px"}
            bg={"blue.500"}
            display={notification?.seen ? "none" : "flex"}
          />
        </HStack>
      );
    },
    [notifications]
  );

  return (
    <Popover
      onOpen={onOpenBellNotifications}
      onClose={onCloseBellNotifications}
    >
      <PopoverTrigger>
        <Box
          position={"relative"}
          _hover={{
            cursor: "pointer",
          }}
        >
          <SvgIcon
            iconName={"ic-notification.svg"}
            size={30}
            onClick={() => {}}
            color={gray700}
          />
          <Circle
            position={"absolute"}
            top={-1}
            right={"-5px"}
            size={4}
            bg={"red.500"}
            color={"white"}
            fontSize={"xs"}
            fontWeight={"bold"}
            display={
              Number(unseenNotificationsCount?.data) > 0 ? "flex" : "none"
            }
            alignItems={"center"}
            justifyContent={"center"}
            p={"10px"}
          >
            {unseenNotificationsCount?.data}
          </Circle>
        </Box>
      </PopoverTrigger>
      <PopoverContent m={2} mx={4} boxShadow={"sm"}>
        <PopoverArrow />
        <PopoverCloseButton me={"5px"} mt={"5px"} />
        <PopoverHeader>
          <Text
            fontSize={"md"}
            fontWeight={"bold"}
            color={"gray.700"}
            lineHeight={"normal"}
            textAlign={"center"}
          >
            Notifications
          </Text>
        </PopoverHeader>
        <PopoverBody p={0}>
          <VStack
            maxH={"500px"}
            minH={"200px"}
            overflowY={"auto"}
            w={"full"}
            p={0}
            alignItems={"flex-start"}
          >
            {isLoadingNotifications ? (
              <Center w={"full"} h={"full"} mt={4}>
                <Spinner boxSize={30} />
              </Center>
            ) : !checkValidArray(notifications) ? (
              <EmptyList
                title={"No notifications"}
                description={"You don't have any notifications"}
              />
            ) : (
              <VStack
                w={"full"}
                alignItems={"flex-start"}
                spacing={1}
                divider={
                  <Divider
                    orientation="horizontal"
                    borderColor={"gray.300"}
                    w={"full"}
                  />
                }
              >
                {getValidArray(notifications)?.map(renderNotification)}
              </VStack>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

export default BellNotifications;
