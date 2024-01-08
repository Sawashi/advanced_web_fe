import AdminLayout from "components/Layout/AdminLayout";
import {
  Button,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  ring,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "API/get/get.me";
import { useStores } from "hooks/useStores";
import { getAllAccounts } from "API/get/get.account";
import { IUser } from "interfaces/user";

import { updateSomeoneAccount } from "API/patch/patch.auth.account";
import NewPagination from "components/NewPagination/NewPagination";
import { set } from "lodash";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "components/FormInput";
import PasswordField from "components/PasswordField";
import { SubmitButton } from "components/pages/AuthenticatePage/authenticatePage.styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { IRegisterSchema, RegisterSchema } from "constants/validation/auth";
import React from "react";
import { createUserByAdmin } from "API/post/post.auth.sign-up";
import routes from "routes";
const ManageAccounts = () => {
  const [userLists, setUserLists] = useState<IUser[]>();
  const [ListToShow, setListToShow] = useState<IUser[]>();
  const toast = useToast();
  const [inputValue, setInputValue] = useState<string>("");
  const { authStore } = useStores();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string>(""); // Track the column to be sorted
  const [pageNow, setPageNow] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [wannaAdmin, setWannaAdmin] = useState<boolean>(false);
  const userListsSorted = ListToShow; // Create a copy to avoid mutating the original array
  const router = useRouter();
  const {
    isOpen: isOpenCreateUser,
    onClose: onCloseCreateUser,
    onOpen: onOpenCreateUser,
  } = useDisclosure();
  //Handle create
  const method = useForm<IRegisterSchema>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(RegisterSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = method;

  const handleSort = (column: string) => {
    // If clicking on the same column, toggle the sort order
    const newSortOrder =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";

    setSortOrder(newSortOrder);
    setSortColumn(column);

    userListsSorted?.sort((a, b) => {
      // Sort alphabetically based on the column
      const valueA = String(a[column]).toLowerCase();
      const valueB = String(b[column]).toLowerCase();

      return newSortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };
  const renderSortIcon = (column: string) => {
    if (column === sortColumn) {
      return sortOrder === "asc" ? (
        <Text as="span">v</Text>
      ) : (
        <Text as="span">^</Text>
      );
    }
    return null;
  };
  const getUserListsAtPage = async (pageNumber: number) => {
    try {
      const res1 = await getAllAccounts(pageNumber.toString());
      setUserLists(res1.data);
      setListToShow(res1.data);
      setPageNow(pageNumber);
      setTotalPages(res1.meta.totalPages);
    } catch (error) {
      toast({
        status: "error",
        description: "Get user list failed",
      });
    }
  };
  async function onSubmit(data: IRegisterSchema): Promise<void> {
    const res = await createUserByAdmin({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob as string,
      role: wannaAdmin ? "admin" : "user",
    });
    if (res?.error) {
      //check if error.message is an array
      if (res.error.message instanceof Array) {
        toast({
          status: "error",
          description: res?.message[0],
        });
      } else {
        toast({
          status: "error",
          description: res?.message,
        });
      }
    } else {
      toast({
        status: "success",
        description: "Created user!",
      });
    }
    getUserListsAtPage(1);
  }
  useEffect(() => {
    async function getInfoForCurrentUser() {
      try {
        const res = await getCurrentUser();
        if (res.role !== "admin") {
          router.replace(routes.error[403].value);
        } else {
          getUserListsAtPage(1);
        }
      } catch (error) {
        toast({
          status: "error",
          description: "Something went wrong",
        });
        router.push("auth/login");
      }
    }
    getInfoForCurrentUser();
  }, []);
  const onClickBan = async (id: string) => {
    try {
      const resBan = await updateSomeoneAccount(id, { status: "blocked" });
      if (resBan) {
        toast({
          status: "success",
          description: "Ban account successfully",
        });
      }
      try {
        await getUserListsAtPage(pageNow);
      } catch (error) {}
    } catch (error) {
      toast({
        status: "error",
        description: "Ban account failed",
      });
    }
  };
  const onClickUnban = async (id: string) => {
    try {
      const resBan = await updateSomeoneAccount(id, { status: "active" });
      if (resBan) {
        toast({
          status: "success",
          description: "Unban account successfully",
        });
      }
      try {
        await getUserListsAtPage(pageNow);
      } catch (error) {}
    } catch (error) {
      toast({
        status: "error",
        description: "Unban account failed",
      });
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    setListToShow(
      userLists?.filter((user) => user?.email?.includes(inputValue ?? ""))
    );
  }, [inputValue]);
  return (
    <AdminLayout title="Manage accounts">
      <VStack w="full" flex={1} h="full" alignItems={"center"} p={5} gap={5}>
        <VStack w="full" flex={1} h="full" alignItems={"left"} p={5} gap={5}>
          <Heading as="h2" size="2xl" noOfLines={1}>
            Account list
          </Heading>
          <Input
            variant="outline"
            placeholder="Search by email"
            onChange={handleInputChange}
            value={inputValue}
          />
          <HStack>
            <Button
              as={"div"}
              variant={"ghost"}
              borderRadius={"full"}
              _hover={{
                bgColor: "gray.200",
              }}
              onClick={() => onOpenCreateUser()}
            >
              Create user
            </Button>
          </HStack>
          <TableContainer>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th onClick={() => handleSort("userId")}>
                    ID {renderSortIcon("userId")}
                  </Th>
                  <Th onClick={() => handleSort("firstName")}>
                    Name {renderSortIcon("firstName")}
                  </Th>
                  <Th onClick={() => handleSort("email")}>
                    Email {renderSortIcon("email")}
                  </Th>
                  <Th onClick={() => handleSort("status")}>
                    Status {renderSortIcon("status")}
                  </Th>
                  <Th onClick={() => handleSort("createdAt")}>
                    Date created {renderSortIcon("createdAt")}
                  </Th>
                  <Th onClick={() => handleSort("status")}>
                    Role {renderSortIcon("status")}
                  </Th>
                  <Th>Functions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ListToShow?.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.id}</Td>
                    <Td>{user.firstName + " " + user.lastName}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      {user.status == "pending" ? (
                        <Tag variant="solid" colorScheme="yellow">
                          Pending
                        </Tag>
                      ) : (
                        <></>
                      )}
                      {user.status == "active" ? (
                        <Tag variant="solid" colorScheme="green">
                          Active
                        </Tag>
                      ) : (
                        <></>
                      )}
                      {user.status == "blocked" ? (
                        <Tag variant="solid" colorScheme="red">
                          Banned
                        </Tag>
                      ) : (
                        <></>
                      )}
                    </Td>
                    <Td>{user.createdAt?.toString()}</Td>
                    <Td>{user.role}</Td>
                    <Td>
                      {user.role === "user" && (user.status == "active" || user.status == "pending") ? (
                        <Button
                          colorScheme="red"
                          variant="solid"
                          onClick={() => onClickBan(user.id ?? "")}
                        >
                          Ban
                        </Button>
                      ) : (
                        <></>
                      )}

                      {user.status == "blocked" ? (
                        <Button
                          colorScheme="green"
                          variant="solid"
                          onClick={() => onClickUnban(user.id ?? "")}
                        >
                          Unban
                        </Button>
                      ) : (
                        <></>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <NewPagination
            currentPage={pageNow}
            totalPages={totalPages}
            isDisabled={false}
            getUserListAtPage={getUserListsAtPage}
          />
        </VStack>
        <Modal isOpen={isOpenCreateUser} onClose={onCloseCreateUser}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create a new user</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormProvider {...method}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing="6">
                    <FormInput
                      name="email"
                      label="Email address"
                      placeholder="Your email"
                      type="email"
                      isRequired={true}
                    />
                    <PasswordField
                      name="password"
                      label="Your Password"
                      placeholder="Your Password"
                    />
                    <FormInput
                      name="dob"
                      label="Date of birth"
                      placeholder="YYYY-MM-DD"
                      isRequired={false}
                      maxLength={10}
                    />
                    <FormInput
                      name="firstName"
                      label="First name"
                      placeholder="Your first name"
                    />
                    <FormInput
                      name="lastName"
                      label="Last name"
                      placeholder="Your last name"
                    />
                    <label>Enable admin role?</label>
                    <Switch
                      onChange={() => setWannaAdmin(!wannaAdmin)}
                    ></Switch>
                    <HStack>
                      <Button colorScheme="blue" onClick={onCloseCreateUser}>
                        Close
                      </Button>
                      <SubmitButton type="submit" isLoading={isSubmitting}>
                        Submit
                      </SubmitButton>
                    </HStack>
                  </Stack>
                </form>
              </FormProvider>
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </AdminLayout>
  );
};
export default ManageAccounts;
