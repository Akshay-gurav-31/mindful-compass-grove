
import { ShoppingBag } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ShopSite {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  categories: string[];
  url: string;
}

const shopSites: ShopSite[] = [
  {
    id: 1,
    name: "Amazon",
    description: "The world's largest online marketplace with millions of products across all categories.",
    imageUrl: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    categories: ["Electronics", "Fashion", "Home", "Books"],
    url: "https://www.amazon.com"
  },
  {
    id: 2,
    name: "Flipkart",
    description: "India's leading e-commerce marketplace with a wide range of products and fast delivery.",
    imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    categories: ["Electronics", "Fashion", "Home", "Appliances"],
    url: "https://www.flipkart.com"
  },
  {
    id: 3,
    name: "Myntra",
    description: "Premium fashion and lifestyle products for men, women, and children.",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    categories: ["Fashion", "Accessories", "Footwear"],
    url: "https://www.myntra.com"
  },
  {
    id: 4,
    name: "Nykaa",
    description: "Beauty and cosmetics retailer offering makeup, skincare, haircare, and wellness products.",
    imageUrl: "https://images.unsplash.com/photo-1522338140505-ddfaf4fcf0d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    categories: ["Beauty", "Makeup", "Skincare"],
    url: "https://www.nykaa.com"
  },
  {
    id: 5,
    name: "Ajio",
    description: "Curated fashion from Indian and international brands for all ages.",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    categories: ["Fashion", "Western", "Ethnic", "Footwear"],
    url: "https://www.ajio.com"
  },
  {
    id: 6,
    name: "Snapdeal",
    description: "Value-focused e-commerce platform with products across various categories.",
    imageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    categories: ["Electronics", "Home", "Fashion", "Daily Needs"],
    url: "https://www.snapdeal.com"
  }
];

const Shop = () => {
  return (
    <MainLayout>
      <div className="elysium-container py-12">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-display font-bold">Online Shopping Destinations</h1>
        </div>
        
        <p className="text-muted-foreground text-lg mb-8">
          Discover the best online shopping websites to find everything you need from fashion to electronics.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopSites.map((site) => (
            <Card key={site.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="h-52 overflow-hidden">
                <img 
                  src={site.imageUrl} 
                  alt={site.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{site.name}</CardTitle>
                <CardDescription>{site.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {site.categories.map((category) => (
                    <Badge key={category} variant="secondary">{category}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Visit Store
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Shop;
