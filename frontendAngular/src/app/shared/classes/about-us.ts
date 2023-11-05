export interface AboutUsData {
    breadcrumb: string;
    aboutSection: {
      image: string;
      title: string;
      content: string[];
    };
    testimonialSection: {
      testimonials: {
        image: string;
        name: string;
        designation: string;
        description: string;
      }[];
    };
    teamSection: {
      teamMembers: {
        image: string;
        name: string;
        designation: string;
      }[];
    };
    serviceSection: {
      services: {
        icon: string;
        title: string;
        description: string;
      }[];
    };
  }
  