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
import { useEffect } from "react";

const ClassDetail = () => {
  const router = useRouter();
  const { settingStore } = useStores();
  const {
    data: classDetails,
    isLoading,
    isError,
    error,
  } = useGetClassDetails(router?.query?.id as string);

  useEffect(() => {
    settingStore.setHeaderLoading(isLoading);
  }, [isLoading]);


  return (
    <ClassLayout
      title={classDetails?.name ?? "Class"}
      details={classDetails ?? {}}
    >
      <VStack w="full" flex={1} h="full" alignItems={"start"} py={5} gap={5}>
        <Tabs position="relative" variant="unstyled" w="full">
          <TabList borderBottomWidth={1} px={3}>
            <Tab
              py={2}
              _selected={{
                color: "primary.500",
                fontWeight: "bold",
              }}
            >
              Stream
            </Tab>
            <Tab
              py={2}
              _selected={{
                color: "primary.500",
                fontWeight: "bold",
              }}
            >
              Classwork
            </Tab>
            <Tab
              py={2}
              _selected={{
                color: "primary.500",
                fontWeight: "bold",
              }}
            >
              People
            </Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="3px"
            bg="primary.500"
            borderTopRadius="3px"
          />
          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </ClassLayout>
  );
};

export default withAuth(observer(ClassDetail));
