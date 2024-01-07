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
  Text,
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
import GradeStructureScene from "GradeStructureScene";
import StudentsScene from "components/pages/Classes/Sections/StudentsScene";
import { red500 } from "theme/colors.theme";
import Modal from "components/Modal";
import { usePatchLeaveClass } from "API/patch/patch.class.leave-class";
import routes from "routes";
import TeacherGradeBoard from "components/pages/Classes/Sections/GradeBoardScene/TeacherGradeBoard";
import { ETabName } from "enums/classes";
import StudentGradeBoard from "components/pages/Classes/Sections/GradeBoardScene/StudentGradeBoard";
import { useGetUserMappedStudent } from "API/get/get.class.user-mapped-student";
import TeacherReviewsScene from "components/pages/Classes/Sections/ReviewsScene/TeacherReviewsScene";

const ClassDetail = () => {
  const router = useRouter();
  const { settingStore, classStore } = useStores();
  const { isStudentOfClass, isTeacherOfClass, isOwnerOfClass, currentClass } =
    classStore;
  const {
    data: classDetails,
    isLoading,
    refetch,
  } = useGetClassDetails(router?.query?.id as string);
  const {
    data: studentMapped,
    isLoading: isLoadingStudentMapped,
    refetch: refetchStudentMapped,
  } = useGetUserMappedStudent({
    classId: router?.query?.id as string,
  });
  const { mutateAsync: leaveClass, isLoading: isLeaveLoading } =
    usePatchLeaveClass(currentClass?.id ?? "");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [tabName, setTabName] = useState<ETabName>();
  const [tabIndex, setTabIndex] = useState(0);
  const titleHeader =
    classDetails?.name && classDetails?.description
      ? `${classDetails?.name ?? "Class"} ${
          "| " + classDetails?.description ?? ""
        }`
      : "Class";

  const tabListRender = useMemo(() => {
    let tabs = [
      {
        name: "Stream",
        component: (
          <StreamScene
            details={classDetails ?? {}}
            isStudentOfClass={isStudentOfClass}
          />
        ),
        tabName: ETabName.Stream,
      },
      {
        name: "People",
        component: <PeopleScene details={classDetails ?? {}} />,
        tabName: ETabName.People,
      },
      {
        name: "Students",
        component: <StudentsScene details={classDetails ?? {}} />,
        tabName: ETabName.Students,
      },
      {
        name: "Grade structure",
        component: <GradeStructureScene details={classDetails ?? {}} />,
        tabName: ETabName.GradeStructure,
      },
    ];
    if (!isStudentOfClass) {
      tabs = tabs.concat([
        {
          name: "Manage grade",
          component: <TeacherGradeBoard details={classDetails ?? {}} />,
          tabName: ETabName.GradeBoard,
        },
        {
          name: "Reviews",
          component: <TeacherReviewsScene details={classDetails ?? {}} />,
          tabName: ETabName.Reviews,
        },
      ]);
    } else {
      tabs = tabs.concat([
        {
          name: "My grade",
          component: <StudentGradeBoard details={classDetails ?? {}} />,
          tabName: ETabName.GradeBoard,
        },
      ]);
    }
    return tabs;
  }, [classDetails, isStudentOfClass]);

  const handleLeaveClass = async () => {
    try {
      await leaveClass();
      setIsDeleteModalVisible(false);
      router.push(routes.classes.value);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeTab = (index: number) => {
    setTabIndex(index);
    settingStore?.setClassSectionTab(tabListRender?.[index]?.tabName);
    router.push(
      `${routes.classes.value}/${router?.query?.id}?tab=${tabListRender?.[index]?.tabName}`
    );
  };

  useEffect(() => {
    settingStore.setHeaderLoading(
      isLoading || isLeaveLoading || isLoadingStudentMapped
    );
  }, [isLoading, isLeaveLoading, isLoadingStudentMapped]);

  useEffect(() => {
    if (classDetails) {
      classStore.setCurrentClass(classDetails);
      classStore?.fetchClassStudents(classDetails?.id);
    }
  }, [classDetails]);

  useEffect(() => {
    if (router?.isReady) {
      refetch();
      refetchStudentMapped();
      const tabName = router?.query?.tab;
      const isValidTabName = Object.values(ETabName)?.includes(
        tabName as ETabName
      );
      if (isValidTabName) {
        setTabName(tabName as ETabName);
      } else {
        setTabName(ETabName.Stream);
      }
    }
  }, [router?.isReady]);

  useEffect(() => {
    const tabIndex = tabListRender?.findIndex(
      (tab) => tab?.tabName === tabName
    );
    if (tabIndex >= 0) {
      setTabIndex(tabIndex);
      return;
    }
    setTabIndex(0);
  }, [tabName, tabListRender]);

  useEffect(() => {
    classStore.setCurrentStudentId(studentMapped?.studentId ?? null);
  }, [studentMapped]);

  return (
    <ClassLayout
      title={titleHeader}
      details={classDetails ?? {}}
      isLoading={isLoading || !router?.isReady}
    >
      <VStack
        w="full"
        flex={1}
        h="full"
        alignItems={"start"}
        gap={5}
        minW={"fit-content"}
      >
        {!classDetails ? (
          <VStack flex={1} w={"full"} justifyContent={"center"}>
            <NotFoundClass />
          </VStack>
        ) : (
          <Tabs
            variant="unstyled"
            w="full"
            index={tabIndex}
            onChange={onChangeTab}
            isLazy={true}
          >
            <HStack
              w={"full"}
              justifyContent={"space-between"}
              alignItems={"center"}
              position={"relative"}
              borderBottomWidth={1}
              gap={5}
            >
              <TabList
                flex={1}
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
              </TabList>

              <HStack alignItems={"center"} gap={3}>
                <Tooltip label={"Edit class"}>
                  <Button
                    display={isStudentOfClass ? "none" : "flex"}
                    rounded={"full"}
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

                {isStudentOfClass || (isTeacherOfClass && !isOwnerOfClass) ? (
                  <Tooltip label={"Leave class"}>
                    <Button
                      rounded={"full"}
                      onClick={() => {
                        setIsDeleteModalVisible(true);
                      }}
                      variant={"icon"}
                      right={"20px"}
                    >
                      <SvgIcon
                        iconName={"ic-exit.svg"}
                        fill="black"
                        color={red500}
                      />
                    </Button>
                  </Tooltip>
                ) : null}
              </HStack>
            </HStack>

            <TabIndicator
              mt="-1.5px"
              height="3px"
              bgColor={isStudentOfClass ? "green.500" : "primary.500"}
              borderTopRadius="3px"
            />

            <TabPanels
              overflowY={"auto"}
              maxHeight={"calc(100vh - 154px)"}
              h="full"
            >
              {getValidArray(tabListRender)?.map((tab) => (
                <TabPanel key={tab.name}>{tab?.component}</TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        )}
      </VStack>

      <UpdateClassModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <Modal
        isVisible={isDeleteModalVisible}
        title={"Leave class"}
        onClose={() => {
          setIsDeleteModalVisible(false);
        }}
        actions={[
          <Button
            key={"cancel"}
            variant={"ghost"}
            color={"red.500"}
            onClick={handleLeaveClass}
          >
            Leave
          </Button>,
        ]}
      >
        <Text>
          Are you sure you want to leave this class? You will lose all your
          progress.
        </Text>
      </Modal>
    </ClassLayout>
  );
};

export default withAuth(observer(ClassDetail));
