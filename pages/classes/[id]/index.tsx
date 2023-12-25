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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGetClassDetails } from "API/get/get.class.details";
import ClassLayout from "components/Layout/ClassLayout";
import { useStores } from "hooks/useStores";
import { useEffect, useMemo } from "react";
import NotFoundClass from "components/pages/Classes/NotFoundClass";
import PeopleScene from "components/pages/Classes/Sections/PeopleScene";
import StreamScene from "components/pages/Classes/Sections/StreamScene";
import { getValidArray } from "utils/common";

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

  useEffect(() => {
    settingStore.setHeaderLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (classDetails) {
      classStore.setCurrentClass(classDetails);
    }
  }, [classDetails]);

  useEffect(() => {
    console.log(router?.isReady);
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
        name: "Classwork",
        component: <VStack flex={1} w={"full"}></VStack>,
      },
      {
        name: "People",
        component: <PeopleScene details={classDetails ?? {}} />,
      },
      !isStudentOfClass
        ? {
            name: "Grades",
            component: <VStack flex={1} w={"full"}></VStack>,
          }
        : null,
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
            >
              {getValidArray(tabListRender)?.map((tab) => (
                <Tab
                  _selected={{
                    color: isStudentOfClass ? "green.500" : "primary.500",
                    fontWeight: "bold",
                  }}
                >
                  {tab?.name}
                </Tab>
              ))}
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
    </ClassLayout>
  );
};

export default withAuth(observer(ClassDetail));
