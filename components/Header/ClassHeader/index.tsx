import {
  Avatar,
  HStack,
  Image,
  Progress,
  Tooltip,
  VStack,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Skeleton,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import SvgIcon from "components/SvgIcon";
import { useStores } from "hooks/useStores";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React from "react";
import routes from "routes";
import { gray500 } from "theme/colors.theme";
import { IClass } from "interfaces/classes";

export interface IClassHeaderProps {
  onExpand?: () => void;
  classDetails?: IClass;
}

const ClassHeader = ({ onExpand, classDetails }: IClassHeaderProps) => {
  const router = useRouter();
  const { settingStore, authStore } = useStores();
  const { isHeaderLoading } = settingStore;
  const name =
    (authStore.user?.firstName ?? "") + " " + (authStore.user?.lastName ?? "");

  const onClickLogo = () => {
    router.push(routes.user.home.value);
  };

  const onExpandSidebar = () => {
    onExpand?.();
  };

  return (
    <VStack w={"100%"} spacing={0} position={"relative"}>
      <HStack
        w={"100%"}
        alignItems={"center"}
        p={5}
        borderBottomWidth={1}
        borderBottomColor={"gray.300"}
      >
        <HStack w={"full"} alignItems={"center"} gap={5} flex={1}>
          <SvgIcon
            iconName={"ic-menu.svg"}
            size={30}
            onClick={onExpandSidebar}
            color={gray500}
          />
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" boxSize={7} />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <HStack w={"full"} alignItems={"center"} gap={5} flex={1}>
                  <Image
                    src="/assets/icons/logo.svg"
                    alt="logo"
                    objectFit={"contain"}
                    w={10}
                    onClick={onClickLogo}
                    _hover={{ cursor: "pointer" }}
                  />
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                href={routes.classes.details.value(classDetails?.id ?? "")}
              >
                <Skeleton isLoaded={!isHeaderLoading}>
                  <VStack alignItems={"start"} gap={0}>
                    <Text fontSize="sm" fontWeight="bold">
                      {classDetails?.name}
                    </Text>
                    <Text fontSize="xs">{classDetails?.description}</Text>
                  </VStack>
                </Skeleton>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </HStack>

        <HStack alignItems={"center"} gap={3}>
          <Tooltip
            label={
              <VStack
                gap={0.5}
                alignItems={"flex-start"}
                justifyContent={"center"}
                w={"full"}
                borderRadius={5}
              >
                <Text fontWeight={"bold"}>{name}</Text>
                <Text>{authStore?.user?.email}</Text>
              </VStack>
            }
            aria-label="A tooltip"
            hasArrow
          >
            <Avatar
              _hover={{
                cursor: "pointer",
              }}
              size={"md"}
              src={authStore.user?.avatar}
              name={name}
              onClick={() => {
                router.push(routes.user.profile.value);
              }}
            />
          </Tooltip>
        </HStack>
      </HStack>
      {isHeaderLoading ? (
        <Progress
          size="xs"
          isIndeterminate={true}
          colorScheme="primary"
          w={"full"}
          position={"absolute"}
          bottom={0}
        />
      ) : null}
    </VStack>
  );
};

export default observer(ClassHeader);
