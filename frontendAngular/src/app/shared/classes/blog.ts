interface Blog {
    images: {
      public_id: string;
      url: string;
    }[];
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    category: string;
    tags: string;
    shopId: string;
    shop: {
    };
    reviews: {
      user: {
      };
      rating: number;
      comment: string;
      blogId: string;
      createdAt: Date;
    }[];
    ratings: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export default Blog;
  