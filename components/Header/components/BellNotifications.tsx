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
  useDisclosure,
} from "@chakra-ui/react";
import {
  useGetMyNotifications,
  useGetMyUnseenNotifications,
} from "API/get/get.me.notifications";
import { usePatchSeenNotification } from "API/patch/patch.notification.seen";
import EmptyList from "components/EmptyState/EmptyList";
import SvgIcon from "components/SvgIcon";
import { ENotificationType, ETabName } from "enums/classes";
import { INotification } from "interfaces/user";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQueryClient } from "react-query";
import routes from "routes";
import { gray700 } from "theme/colors.theme";
import { checkValidArray, getValidArray, timeAgo } from "utils/common";

const NotificationItem = React.memo(
  ({
    notification,
    onSuccess,
  }: {
    notification: INotification;
    onSuccess: () => void;
  }) => {
    const { mutateAsync: mutatePatchSeenNotification } =
      usePatchSeenNotification({
        notificationId: notification?.id,
        onSuccess,
      });
    const dataParse = JSON.parse(notification?.data ?? "{}");
    const router = useRouter();

    const onClick = async () => {
      if (!notification?.seen) {
        await mutatePatchSeenNotification();
      }
      switch (notification?.type) {
        case ENotificationType.GRADE_COMPOSITION_FINALIZED:
          router
            .push(
              routes.classes.details.value(
                dataParse?.classId,
                ETabName.GradeBoard
              )
            )
            .then(() => {
              router.reload();
            });
          break;
        case ENotificationType.COMMENT:
        case ENotificationType.COMMENT_REPLY:
        case ENotificationType.GRADE_REVIEW_REQUESTED:
        case ENotificationType.MARK_REVIEW_DECISION:
          router
            .push(
              routes.classes.details.value(
                dataParse?.classId,
                ETabName.Reviews
              ) + `&reviewId=${dataParse?.reviewId}`
            )
            .then(() => {
              router.reload();
            });
          break;
      }
    };

    return (
      <HStack
        key={notification?.id}
        w={"full"}
        alignItems={"center"}
        _hover={{
          cursor: "pointer",
          backgroundColor: "gray.100",
        }}
        onClick={onClick}
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
            color={"gray.500"}
            lineHeight={"normal"}
          >
            {notification?.description}
          </Text>
          <Text
            fontSize={"2xs"}
            fontWeight={"normal"}
            color={"gray.600"}
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
  }
);

const BellNotifications = React.memo(() => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data: unseenNotificationsCount } = useGetMyUnseenNotifications();
  const {
    data: dataNotifications,
    fetchNextPage: fetchNextPageNotifications,
    hasNextPage: hasNextPageNotifications,
    isLoading: isLoadingNotifications,
    reset: resetNotifications,
  } = useGetMyNotifications(isOpen);

  const notifications = dataNotifications?.pages?.flatMap((page) => page?.data);

  const onOpenBellNotifications = () => {
    onOpen();
    resetNotifications();
  };

  const onCloseBellNotifications = () => {
    onClose();
  };

  const renderNotification = useCallback(
    (notification: INotification) => {
      return (
        <NotificationItem
          key={notification?.id}
          notification={notification}
          onSuccess={() => {
            onClose();
          }}
        />
      );
    },
    [notifications]
  );

  return (
    <Popover
      onOpen={onOpenBellNotifications}
      onClose={onCloseBellNotifications}
      isOpen={isOpen}
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
      <PopoverContent
        m={2}
        mx={4}
        minW={"320px"}
        _focus={{
          boxShadow: "none",
        }}
        minH={"300px"}
      >
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
          <VStack w={"full"} p={0} alignItems={"flex-start"}>
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
              <InfiniteScroll
                dataLength={getValidArray(notifications)?.length ?? 0}
                hasMore={!!hasNextPageNotifications}
                loader={null}
                next={fetchNextPageNotifications}
                scrollableTarget="scrollableDiv"
              >
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
                  id="scrollableDiv"
                  maxH={"450px"}
                  overflowY={"auto"}
                >
                  {getValidArray(notifications)?.map(renderNotification)}
                </VStack>
              </InfiniteScroll>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});

export default BellNotifications;
