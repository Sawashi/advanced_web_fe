import withAuth from "HOCs/withAuth";
import { observer } from "mobx-react";
import {
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  HStack,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGetClassDetails } from "API/get/get.class.details";
import ClassLayout from "components/Layout/ClassLayout";
import { useStores } from "hooks/useStores";
import { useEffect, useMemo, useState } from "react";
import NotFoundClass from "components/pages/Classes/NotFoundClass";
import PeopleScene from "components/pages/Classes/Sections/PeopleScene";
import StreamScene from "components/pages/Classes/Sections/StreamScene";
import { getValidArray } from "utils/common";
import SvgIcon from "components/SvgIcon";
import UpdateClassModal from "components/pages/Classes/UpdateClassModal";
import GradeStructureScene from "components/pages/Classes/Sections/GradeStructureScene";
import StudentsScene from "components/pages/Classes/Sections/StudentsScene";

const ClassDetail = () => {
  const router = useRouter();
  const { settingStore, classStore } = useStores();
  const { isStudentOfClass } = classStore;
  const {
    data: classDetails,
    isLoading,
    isError,
    refetch,
  } = useGetClassDetails(router?.query?.id as string);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    settingStore.setHeaderLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (classDetails) {
      classStore.setCurrentClass(classDetails);
    }
  }, [classDetails]);

  useEffect(() => {
    if (router?.isReady) {
      refetch();
    }
  }, [router?.isReady]);

  const tabListRender = useMemo(
    () => [
      {
        name: "Stream",
        component: (
          <StreamScene
            details={classDetails ?? {}}
            isStudentOfClass={isStudentOfClass}
          />
        ),
      },
      {
        name: "People",
        component: <PeopleScene details={classDetails ?? {}} />,
      },
      {
        name: "Grade structure",
        component: <GradeStructureScene details={classDetails ?? {}} />,
      },
      {
        name: "Students",
        component: <StudentsScene details={classDetails ?? {}} />,
      },
    ],
    [classDetails, isStudentOfClass]
  );

  return (
    <ClassLayout
      title={
        `${classDetails?.name ?? "Class"} | ${
          classDetails?.description ?? ""
        }` ?? "Class"
      }
      details={classDetails ?? {}}
      isLoading={isLoading || !router?.isReady}
    >
      <VStack w="full" flex={1} h="full" alignItems={"start"} gap={5}>
        {isError ? (
          <VStack flex={1} w={"full"} justifyContent={"center"}>
            <NotFoundClass />
          </VStack>
        ) : (
          <Tabs position="relative" variant="unstyled" w="full">
            <TabList
              borderBottomWidth={1}
              p={3}
              _active={{
                color: isStudentOfClass ? "green.500" : "primary.500",
                fontWeight: "bold",
              }}
              position={"relative"}
            >
              {getValidArray(tabListRender)
                ?.filter((tab) => !!tab)
                ?.map((tab) => (
                  <Tab
                    key={tab?.name}
                    _selected={{
                      color: isStudentOfClass ? "green.500" : "primary.500",
                      fontWeight: "bold",
                    }}
                  >
                    {tab?.name}
                  </Tab>
                ))}

              <Tooltip label={"Edit class"}>
                <Button
                  display={isStudentOfClass ? "none" : "flex"}
                  zIndex={1}
                  rounded={"full"}
                  position={"absolute"}
                  onClick={() => {
                    setIsModalVisible(true);
                  }}
                  variant={"icon"}
                  right={"20px"}
                >
                  <SvgIcon
                    iconName={"ic-edit.svg"}
                    fill="black"
                    color="black"
                  />
                </Button>
              </Tooltip>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="3px"
              bgColor={isStudentOfClass ? "green.500" : "primary.500"}
              borderTopRadius="3px"
            />
            <TabPanels>
              {getValidArray(tabListRender)?.map((tab) => (
                <TabPanel>{tab?.component}</TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        )}
      </VStack>
      <UpdateClassModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </ClassLayout>
  );
};

export default withAuth(observer(ClassDetail));
