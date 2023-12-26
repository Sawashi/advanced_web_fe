import {
  VStack,
  Text,
  Heading,
  Divider,
  HStack,
  Button,
  Tooltip,
  Code,
  useToast,
} from "@chakra-ui/react";
import Modal from "components/Modal";
import SvgIcon from "components/SvgIcon";
import { useStores } from "hooks/useStores";
import { IAttendee } from "interfaces/classes";
import React from "react";
import { getValidArray } from "utils/common";
import Attendance from "./Attendance";
import { HOST } from "constants/common";
import {
  useCreateClassToken,
  useSendInvitationMail,
} from "API/post/post.classes.manage-class";
import { EClassRole } from "enums/classes";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IInviteEmailsSchema,
  InviteEmailsSchema,
} from "constants/validation/classes";
import FormInput from "components/FormInput";

const Teachers = ({
  data,
  refetch,
}: {
  data?: IAttendee[];
  refetch?: () => Promise<void>;
}) => {
  const toast = useToast();
  const { classStore } = useStores();
  const { isStudentOfClass } = classStore;
  const [isShowingAddTeacher, setIsShowingAddTeacher] = React.useState(false);
  const method = useForm<IInviteEmailsSchema>({
    resolver: yupResolver(InviteEmailsSchema),
    reValidateMode: "onChange",
    mode: "all",
    defaultValues: {
      emails: [{ email: "" }],
    },
  });
  const { handleSubmit, control, reset } = method;
  const { mutateAsync: generateClassToken, isLoading: isGeneratingClass } =
    useCreateClassToken();

  const {
    mutateAsync: sendInvitationMail,
    isLoading: isSendingInvitationMail,
  } = useSendInvitationMail();

  const {
    fields: emailFields,
    append: emailAppend,
    remove: emailRemove,
  } = useFieldArray({
    control,
    name: "emails",
  });

  const onCloseCreateLink = () => {
    setIsShowingAddTeacher(false);
    reset();
  };

  const onGenerateLink = async () => {
    try {
      const data = await generateClassToken({
        classId: classStore?.currentClass?.id ?? "",
        role: EClassRole.TEACHER,
        expiresIn: "1d",
      });
      const token = data?.token;
      if (token) {
        toast({
          title: "Link copied to clipboard",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigator.clipboard.writeText(
          `${HOST ?? ""}/users/classes/join?token=${token}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSendingEmails = async (data: IInviteEmailsSchema) => {
    try {
      const { emails } = data;
      await Promise.all(
        getValidArray(emails).map(async (item) => {
          const res = await sendInvitationMail({
            classId: classStore?.currentClass?.id ?? "",
            role: EClassRole.TEACHER,
            email: item?.email,
          });
          if (res?.data?.statusCode !== 200) {
            throw new Error("Something went wrong");
          }
        })
      );
      toast({
        title: "Success",
        description: "Invitation mail sent successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while sending invitation mail",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      classStore?.fetchCurrentClass();
      onCloseCreateLink();
      refetch?.();
    }
  };

  return (
    <FormProvider {...method}>
      <VStack
        divider={<Divider h={"1px"} w={"full"} bgColor={"blue.800"} />}
        w={"full"}
        alignItems={"start"}
        gap={5}
      >
        <HStack
          w={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Heading size="lg">Teachers</Heading>
          <HStack gap={3} justifyItems={"end"} alignItems={"center"}>
            <Text>{`${data?.length ?? 0} teachers`}</Text>
            {!isStudentOfClass && (
              <Tooltip label={"Add teacher"}>
                {/* TODO: Add teacher */}
                <Button
                  variant={"icon"}
                  onClick={() => {
                    setIsShowingAddTeacher(true);
                  }}
                >
                  <SvgIcon iconName={"ic-add.svg"} />
                </Button>
              </Tooltip>
            )}
          </HStack>
        </HStack>
        <VStack
          divider={<Divider h={"1px"} w={"full"} />}
          w={"full"}
          alignItems={"start"}
          gap={3}
        >
          {getValidArray(data)?.map((item) => (
            <Attendance
              profile={item?.user}
              refetch={refetch}
              role={item?.role}
            />
          ))}
        </VStack>
      </VStack>
      <Modal
        isVisible={isShowingAddTeacher && !isStudentOfClass}
        onClose={onCloseCreateLink}
        title={"Add teacher"}
        actions={[
          <Button colorScheme="blue" onClick={onCloseCreateLink}>
            Close
          </Button>,
          <Button
            variant="primary"
            onClick={handleSubmit(onSendingEmails)}
            isLoading={isSendingInvitationMail}
          >
            Add
          </Button>,
        ]}
      >
        <VStack
          w="full"
          divider={<Divider h={"1px"} w={"full"} bgColor={"gray.400"} />}
          alignItems={"start"}
          gap={3}
          pt={5}
        >
          {/* Add by link */}
          <VStack w="full">
            <Text
              fontSize={"lg"}
              color={"gray.700"}
              fontWeight={"bold"}
              w={"full"}
            >
              Generate a link
            </Text>
            <HStack
              w={"full"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={3}
            >
              <Code
                fontSize={"md"}
                color={"gray.700"}
                fontWeight={"normal"}
                w={"full"}
                flex={1}
                p={1}
              >{`${HOST}/users/classes/join?token=...`}</Code>
              <Button
                onClick={onGenerateLink}
                isLoading={isGeneratingClass}
                variant={"icon"}
                p={0}
              >
                <SvgIcon iconName={"ic-copy.svg"} size={30} />
              </Button>
            </HStack>
          </VStack>

          {/* Add by email */}
          <VStack w="full">
            <Text
              fontSize={"lg"}
              color={"gray.700"}
              fontWeight={"bold"}
              w={"full"}
            >
              Enter email(s)
            </Text>
            <VStack w={"full"} alignItems={"start"} gap={3}>
              {emailFields?.map((item, index) => (
                <HStack w={"full"} key={item.id}>
                  <FormInput
                    name={`emails[${index}].email`}
                    placeholder={"Email"}
                    key={item.id}
                  />
                  <Button
                    variant={"icon"}
                    onClick={() => {
                      emailRemove(index);
                    }}
                  >
                    <SvgIcon iconName={"ic-close.svg"} size={20} />
                  </Button>
                </HStack>
              ))}
              <Button
                flexDirection={"row"}
                onClick={() => {
                  emailAppend({
                    email: "",
                  });
                }}
              >
                <SvgIcon iconName={"ic-add.svg"} size={20} />
                <Text>Add mail</Text>
              </Button>
            </VStack>
          </VStack>

          <Text
            fontSize={"sm"}
            color={"gray.700"}
            fontWeight={"normal"}
            w={"full"}
          >
            Teacher will be added to your class and will be able to manage it
            like you, except for deleting class.
          </Text>
        </VStack>
      </Modal>
    </FormProvider>
  );
};

export default Teachers;
