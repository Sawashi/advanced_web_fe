import { Box, Container, VStack, chakra } from "@chakra-ui/react";
import Footer from "components/pages/LandingPage/components/Footer";
import Header from "components/pages/LandingPage/components/Header";
import FAQSection from "components/pages/LandingPage/components/Sections/FAQSection";
import FeaturesSection from "components/pages/LandingPage/components/Sections/FeaturesSection";
import HeroSection from "components/pages/LandingPage/components/Sections/HeroSection";
import TestimonialsSection from "components/pages/LandingPage/components/Sections/TestimonialsSection";
import { observer } from "mobx-react";

interface ISection {
  id: string;
  label: string;
  component: React.FC<{ id: string }>;
}

const LandingPage: React.FC = () => {
  const sections: ISection[] = [
    {
      id: "hero",
      label: "Home",
      component: HeroSection,
    },
    {
      id: "features",
      label: "Features",
      component: FeaturesSection,
    },
    {
      id: "testimonials",
      label: "Testimonials",
      component: TestimonialsSection,
    },
    {
      id: "faq",
      label: "FAQ",
      component: FAQSection,
    },
  ];

  return (
    <VStack minH="100vh" bg="#fafafa" alignItems="stretch" gap={0}>
      <Header sections={sections} />

      <Container as="main" width="100%" maxW="container.2xl" flex={1}>
        {sections.map((section) => {
          const SectionComponent = section.component;

          return <SectionComponent key={section.id} id={section.id} />;
        })}
      </Container>

      <Footer />
    </VStack>
  );
};

export default observer(LandingPage);
