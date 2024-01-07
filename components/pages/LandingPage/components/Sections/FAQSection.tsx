import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import React, { useCallback } from "react";
import { Fade } from "react-awesome-reveal";

type Props = {
  id: string;
};

const FAQSection: React.FC<Props> = ({ id }) => {
  const faqData = [
    {
      question: "How do I get started with setting up my class?",
      answer:
        "Getting started is easy and intuitive. First, create your account and log in. Then, you can add your class by entering basic details such as class name and subject. Next, import your student list using our simple upload feature or enter the details manually. Once set up, you can start organizing your gradebook, adding assignments, and tracking student progress right away.",
    },
    {
      question: "Can I customize the grading system to fit my curriculum?",
      answer:
        "Absolutely. Our platform is designed to accommodate a wide range of grading systems. You can customize the grading scales to match your specific needs, whether it's letter grades, percentages, or a point-based system. Additionally, you can weight different types of assignments and tests to reflect their importance in the overall grade. Our goal is to provide you with a flexible tool that adapts to your curriculum.",
    },
    {
      question: "What types of assignments can I track on the platform?",
      answer:
        "Our platform allows you to track various types of assignments including homework, quizzes, projects, and participation. You can set different parameters for each assignment, such as due dates and maximum points, and even categorize them for better organization. Whether it's a daily task or a term project, you'll find the tools to keep everything neatly organized and easily accessible.",
    },
    {
      question: "How secure is student information on the platform?",
      answer:
        "We prioritize the security and privacy of your students' information. Our platform employs advanced security measures including data encryption, secure servers, and regular audits. We are committed to complying with all educational and privacy regulations to ensure that your students' data is protected at all times. You can have peace of mind knowing that sensitive information is handled with the utmost care.",
    },
    {
      question:
        "Can I communicate with parents and students through the website?",
      answer:
        "Yes, our platform includes a secure communication portal designed for teachers, students, and parents. You can send individual messages or group announcements, share progress reports, and provide feedback. The communication portal is encrypted and private, ensuring that conversations remain confidential. This feature makes it easy to keep everyone informed and engaged in the educational process.",
    },
    {
      question: "Is there a mobile app version of the platform?",
      answer:
        "We understand the need for on-the-go access, and that's why our platform is fully mobile-responsive. While we work on developing a dedicated mobile app, you can access all the features through any mobile browser. Whether you're in the classroom, at home, or on the move, you'll have everything you need right at your fingertips.",
    },
    {
      question: "How do I handle attendance tracking and reporting?",
      answer:
        "Attendance tracking is made simple with our platform. You can record attendance with just a few clicks, mark absences, tardiness, and participation, and even add notes for each student. The system also allows you to generate attendance reports for individual students or the whole class, which can be shared with administrators or parents. This feature helps you maintain accurate records and identify attendance patterns that may affect academic performance.",
    },
    {
      question:
        "Can I integrate the platform with other educational tools I’m using?",
      answer:
        "Yes, integration is key to a seamless experience. Our platform can be integrated with various educational tools and systems you may already be using. This includes Learning Management Systems (LMS), student information systems, and other third-party applications. If you have specific tools you wish to integrate, our support team is here to assist and ensure that your workflow is as smooth and efficient as possible.",
    },
    {
      question: "What should I do if I encounter an issue or need assistance?",
      answer:
        "Our dedicated support team is here to help whenever you encounter an issue or have questions. You can contact us via email, phone, or live chat, and expect a prompt and helpful response. Additionally, our website offers a comprehensive knowledge base with guides, FAQs, and tutorials to assist you. We're committed to providing you with the support you need to make the most of the platform.",
    },
    {
      question:
        "Are there training resources available to maximize the use of the platform?",
      answer:
        "Definitely. We offer a range of training resources to help you get the most out of the platform. This includes video tutorials, webinars, and in-depth guides covering various features and best practices. Whether you're a new user or looking to explore more advanced features, our training resources are designed to enhance your experience and empower you in your teaching.",
    },
  ];

  const renderFAQs = useCallback(() => {
    return (
      <Accordion allowToggle maxW="600px">
        {faqData.map((faq, index) => {
          return (
            <AccordionItem key={index} border={0}>
              <AccordionButton p={4}>
                <Box
                  as="span"
                  flex="1"
                  textAlign="left"
                  fontWeight="600"
                  me="5"
                >
                  {faq.question}
                </Box>

                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4}>
                <Text
                  lineHeight={1.6}
                >{faq.answer}</Text>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  }, [faqData]);

  return (
    <VStack
      id={id}
      as="section"
      my={12}
      py={10}
      alignItems={{
        base: "center",
        lg: "stretch",
      }}
    >
      <Heading as="h2" size="xl" mb={5}>
        <Fade triggerOnce>
          <Text>Frequently Asked Questions</Text>
        </Fade>
      </Heading>

      <Stack
        alignItems="stretch"
        direction={{
          base: "column-reverse",
          lg: "row",
        }}
        spacing={10}
      >
        {renderFAQs()}

        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Fade triggerOnce>
            <Image
              src="/assets/faq.svg"
              w={{
                base: "300px",
                md: "400px",
                lg: "800px",
              }}
              minW="400px"
              objectFit="contain"
            />
          </Fade>
        </Box>
      </Stack>
    </VStack>
  );
};

export default observer(FAQSection);
