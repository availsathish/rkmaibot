import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  MessageCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  Upload,
  Image as ImageIcon,
  FileSpreadsheet,
  Camera,
  ShoppingCart,
  FileText,
  Mail,
  Phone,
  Download,
  Copy,
  Star,
  Lightbulb,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  productRecommendations?: Product[];
}

interface Product {
  id: string;
  code: string;
  name: string;
  category: "TOYOTA" | "TSUDAKOMA" | "PICANOL" | "STAUBLI" | "ITEMA";
  price: number;
  stock: number;
  description: string;
  image?: string;
  compatibility?: string[];
  tags?: string[];
}

interface EnquiryItem {
  productId: string;
  quantity: number;
  notes?: string;
}

interface Quotation {
  id: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: (EnquiryItem & { product: Product })[];
  totalAmount: number;
  status: "draft" | "sent" | "accepted" | "rejected";
}

const LOOM_CATEGORIES = [
  "TOYOTA",
  "TSUDAKOMA",
  "PICANOL",
  "STAUBLI",
  "ITEMA",
] as const;

// ProductForm component extracted to fix input typing issues
interface ProductFormProps {
  productFormData: {
    code: string;
    name: string;
    category: Product["category"];
    price: string;
    stock: string;
    description: string;
    image: string;
    compatibility: string;
    tags: string;
  };
  setProductFormData: React.Dispatch<React.SetStateAction<{
    code: string;
    name: string;
    category: Product["category"];
    price: string;
    stock: string;
    description: string;
    image: string;
    compatibility: string;
    tags: string;
  }>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productFormData,
  setProductFormData,
  fileInputRef,
  handleImageUpload,
  isEdit = false
}) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="productCode">Product Code *</Label>
      <Input
        id="productCode"
        value={productFormData.code}
        onChange={(e) =>
          setProductFormData((prev) => ({ ...prev, code: e.target.value }))
        }
        placeholder="e.g., RKM-TOY-001"
      />
    </div>

    <div>
      <Label htmlFor="productName">Product Name *</Label>
      <Input
        id="productName"
        value={productFormData.name}
        onChange={(e) =>
          setProductFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder="Enter product name"
      />
    </div>

    <div>
      <Label htmlFor="category">Category *</Label>
      <Select
        value={productFormData.category}
        onValueChange={(value: Product["category"]) =>
          setProductFormData((prev) => ({ ...prev, category: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select loom manufacturer" />
        </SelectTrigger>
        <SelectContent>
          {LOOM_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="price">Price (₹) *</Label>
        <Input
          id="price"
          type="number"
          value={productFormData.price}
          onChange={(e) =>
            setProductFormData((prev) => ({ ...prev, price: e.target.value }))
          }
          placeholder="0"
        />
      </div>
      <div>
        <Label htmlFor="stock">Stock Quantity *</Label>
        <Input
          id="stock"
          type="number"
          value={productFormData.stock}
          onChange={(e) =>
            setProductFormData((prev) => ({ ...prev, stock: e.target.value }))
          }
          placeholder="0"
        />
      </div>
    </div>

    <div>
      <Label htmlFor="compatibility">Compatibility (comma-separated)</Label>
      <Input
        id="compatibility"
        value={productFormData.compatibility}
        onChange={(e) =>
          setProductFormData((prev) => ({ ...prev, compatibility: e.target.value }))
        }
        placeholder="e.g., Toyota G810, Toyota G820"
      />
    </div>

    <div>
      <Label htmlFor="tags">Tags (comma-separated)</Label>
      <Input
        id="tags"
        value={productFormData.tags}
        onChange={(e) =>
          setProductFormData((prev) => ({ ...prev, tags: e.target.value }))
        }
        placeholder="e.g., reed, shuttle, weaving"
      />
    </div>

    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={productFormData.description}
        onChange={(e) =>
          setProductFormData((prev) => ({
            ...prev,
            description: e.target.value,
          }))
        }
        placeholder="Enter product description"
        rows={3}
      />
    </div>

    <div>
      <Label>Product Image</Label>
      <div className="mt-2 space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {productFormData.image && (
          <div className="relative w-full h-32 border rounded-lg overflow-hidden">
            <img
              src={productFormData.image}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() =>
                setProductFormData((prev) => ({ ...prev, image: "" }))
              }
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const FAQ_DATA = [
  {
    question: "What loom types do you support?",
    answer: "We support all major loom manufacturers: Toyota, Tsudakoma, Picanol, Staubli, and Itema. Our parts are compatible with various loom models from these brands.",
  },
  {
    question: "Do you provide warranty on spare parts?",
    answer: "Yes, all RKM Loom Spares come with a 1-year warranty. We use premium materials and follow strict quality control processes.",
  },
  {
    question: "What is your delivery time?",
    answer: "Standard delivery takes 3-5 business days, and express delivery takes 1-2 business days across India.",
  },
  {
    question: "Can you help identify unknown spare parts?",
    answer: "Yes! Use our image recognition feature to upload a photo of your spare part, and our AI will help identify it and suggest compatible products.",
  },
];

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm RKM Assistant. I can help you with loom spares, product identification, recommendations, and quotations. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      code: "RKM-TOY-001",
      name: "Shuttle Loom Reed",
      category: "TOYOTA",
      price: 2500,
      stock: 45,
      description: "High-quality reed for Toyota shuttle looms",
      image:
        "https://images.unsplash.com/photo-1565731137738-b2a2316cc7e4?w=400&h=300&fit=crop",
      compatibility: ["Toyota G810", "Toyota G820"],
      tags: ["reed", "shuttle", "weaving"],
    },
    {
      id: "2",
      code: "RKM-TSU-002",
      name: "Heddle Hooks Set",
      category: "TSUDAKOMA",
      price: 150,
      stock: 120,
      description: "Durable heddle hooks for Tsudakoma textile production",
      image:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop",
      compatibility: ["Tsudakoma ZAX", "Tsudakoma ZW"],
      tags: ["heddle", "hooks", "accessories"],
    },
    {
      id: "3",
      code: "RKM-PIC-003",
      name: "Adjustable Loom Temple",
      category: "PICANOL",
      price: 3200,
      stock: 25,
      description: "Premium adjustable temple for Picanol fabric weaving",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      compatibility: ["Picanol OMNIplus", "Picanol TERRAplus"],
      tags: ["temple", "adjustable", "fabric"],
    },
    {
      id: "4",
      code: "RKM-TOY-004",
      name: "Piston Rings for Airjet",
      category: "TOYOTA",
      price: 450,
      stock: 80,
      description: "High-performance piston rings for Toyota Airjet looms",
      compatibility: ["Toyota JAT710", "Toyota JAT810"],
      tags: ["piston", "rings", "airjet"],
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("chat");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isImportDataOpen, setIsImportDataOpen] = useState(false);
  const [isImageRecognitionOpen, setIsImageRecognitionOpen] = useState(false);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [enquiryCart, setEnquiryCart] = useState<EnquiryItem[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [recognitionImage, setRecognitionImage] = useState<string>("");
  const [recognitionResult, setRecognitionResult] = useState<Product[]>([]);
  const [quotationForm, setQuotationForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [productFormData, setProductFormData] = useState({
    code: "",
    name: "",
    category: "" as Product["category"],
    price: "",
    stock: "",
    description: "",
    image: "",
    compatibility: "",
    tags: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const imageRecognitionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");

    // Simulate bot response with product recommendations
    setTimeout(() => {
      const response = getBotResponse(currentInput);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.content,
        timestamp: new Date(),
        productRecommendations: response.recommendations,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): { content: string; recommendations?: Product[] } => {
    const input = userInput.toLowerCase();
    
    // Check for FAQ matches
    const faqMatch = FAQ_DATA.find(faq => 
      input.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' '))
    );
    
    if (faqMatch) {
      return { content: faqMatch.answer };
    }

    // Product recommendations based on queries
    if (input.includes("piston rings") && input.includes("airjet")) {
      const recommendations = products.filter(p => 
        p.tags?.includes("piston") || p.tags?.includes("airjet")
      );
      return {
        content: "I found piston rings for Airjet looms! Here are the available options:",
        recommendations
      };
    }

    if (input.includes("reed") || input.includes("shuttle")) {
      const recommendations = products.filter(p => 
        p.tags?.includes("reed") || p.tags?.includes("shuttle")
      );
      return {
        content: "Here are the reed and shuttle-related parts available:",
        recommendations
      };
    }

    if (input.includes("heddle") || input.includes("hooks")) {
      const recommendations = products.filter(p => 
        p.tags?.includes("heddle") || p.tags?.includes("hooks")
      );
      return {
        content: "I found heddle hooks and related accessories:",
        recommendations
      };
    }

    if (input.includes("temple")) {
      const recommendations = products.filter(p => 
        p.tags?.includes("temple")
      );
      return {
        content: "Here are the temple options for your loom:",
        recommendations
      };
    }

    // Category-specific responses
    if (input.includes("toyota")) {
      const recommendations = products.filter(p => p.category === "TOYOTA");
      return {
        content: "Here are all Toyota loom spare parts:",
        recommendations
      };
    }

    if (input.includes("tsudakoma")) {
      const recommendations = products.filter(p => p.category === "TSUDAKOMA");
      return {
        content: "Here are Tsudakoma loom spare parts:",
        recommendations
      };
    }

    if (input.includes("picanol")) {
      const recommendations = products.filter(p => p.category === "PICANOL");
      return {
        content: "Here are Picanol loom spare parts:",
        recommendations
      };
    }

    if (input.includes("price") || input.includes("cost")) {
      return {
        content: "Our loom spare prices vary by manufacturer. Toyota parts start from ₹450, Tsudakoma from ₹150, and Picanol from ₹3,200. Would you like specific pricing?"
      };
    }

    if (input.includes("stock") || input.includes("available")) {
      return {
        content: "We maintain good stock levels across all manufacturers. Current stock includes 45 Toyota reeds, 120 Tsudakoma hooks, and 25 Picanol temples."
      };
    }

    if (input.includes("quotation") || input.includes("quote")) {
      return {
        content: "I can help you generate a quotation! Add products to your enquiry cart and I'll create a professional quote for you."
      };
    }

    if (input.includes("identify") || input.includes("unknown part")) {
      return {
        content: "Use our image recognition feature! Upload a photo of your spare part and I'll help identify it."
      };
    }

    return {
      content: "I can help you with Toyota, Tsudakoma, Picanol, Staubli, and Itema loom spares. Try asking about specific parts like 'piston rings for airjet loom' or use our image recognition to identify unknown parts!"
    };
  };

  const startVoiceRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProductFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRecognition = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setRecognitionImage(result);
        // Simulate AI image recognition
        setTimeout(() => {
          const randomProducts = products.slice(0, 2);
          setRecognitionResult(randomProducts);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate CSV import
      const sampleImportedProducts: Product[] = [
        {
          id: Date.now().toString(),
          code: "RKM-IMP-001",
          name: "Imported Reed Set",
          category: "TOYOTA",
          price: 1200,
          stock: 30,
          description: "Imported from CSV data",
          tags: ["imported", "reed"],
        },
        {
          id: (Date.now() + 1).toString(),
          code: "RKM-IMP-002",
          name: "Imported Hook Set",
          category: "TSUDAKOMA",
          price: 800,
          stock: 50,
          description: "Imported from CSV data",
          tags: ["imported", "hooks"],
        },
      ];
      
      setProducts(prev => [...prev, ...sampleImportedProducts]);
      setIsImportDataOpen(false);
    }
  };

  const resetProductForm = () => {
    setProductFormData({
      code: "",
      name: "",
      category: "" as Product["category"],
      price: "",
      stock: "",
      description: "",
      image: "",
      compatibility: "",
      tags: "",
    });
  };

  const handleAddProduct = () => {
    if (
      !productFormData.code ||
      !productFormData.name ||
      !productFormData.category ||
      !productFormData.price ||
      !productFormData.stock
    ) {
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      code: productFormData.code,
      name: productFormData.name,
      category: productFormData.category,
      price: parseFloat(productFormData.price),
      stock: parseInt(productFormData.stock),
      description: productFormData.description,
      image: productFormData.image || undefined,
      compatibility: productFormData.compatibility ? productFormData.compatibility.split(",").map(s => s.trim()) : undefined,
      tags: productFormData.tags ? productFormData.tags.split(",").map(s => s.trim()) : undefined,
    };

    setProducts((prev) => [...prev, newProduct]);
    resetProductForm();
    setIsAddProductOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      code: product.code,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      image: product.image || "",
      compatibility: product.compatibility?.join(", ") || "",
      tags: product.tags?.join(", ") || "",
    });
    setIsEditProductOpen(true);
  };

  const handleUpdateProduct = () => {
    if (
      !editingProduct ||
      !productFormData.code ||
      !productFormData.name ||
      !productFormData.category ||
      !productFormData.price ||
      !productFormData.stock
    ) {
      return;
    }

    const updatedProduct: Product = {
      ...editingProduct,
      code: productFormData.code,
      name: productFormData.name,
      category: productFormData.category,
      price: parseFloat(productFormData.price),
      stock: parseInt(productFormData.stock),
      description: productFormData.description,
      image: productFormData.image || undefined,
      compatibility: productFormData.compatibility ? productFormData.compatibility.split(",").map(s => s.trim()) : undefined,
      tags: productFormData.tags ? productFormData.tags.split(",").map(s => s.trim()) : undefined,
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)),
    );
    resetProductForm();
    setEditingProduct(null);
    setIsEditProductOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const addToEnquiryCart = (productId: string, quantity: number = 1) => {
    setEnquiryCart(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromEnquiryCart = (productId: string) => {
    setEnquiryCart(prev => prev.filter(item => item.productId !== productId));
  };

  const generateQuotation = () => {
    if (enquiryCart.length === 0 || !quotationForm.customerName) return;

    const quotationItems = enquiryCart.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      return { ...item, product };
    });

    const totalAmount = quotationItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const newQuotation: Quotation = {
      id: Date.now().toString(),
      date: new Date(),
      customerName: quotationForm.customerName,
      customerEmail: quotationForm.customerEmail,
      customerPhone: quotationForm.customerPhone,
      items: quotationItems,
      totalAmount,
      status: "draft",
    };

    setQuotations(prev => [...prev, newQuotation]);
    setEnquiryCart([]);
    setQuotationForm({ customerName: "", customerEmail: "", customerPhone: "" });
    setIsQuotationOpen(false);
  };

  const sendQuotationViaWhatsApp = (quotation: Quotation) => {
    const message = `RKM Loom Spares Quotation\n\nCustomer: ${quotation.customerName}\nDate: ${quotation.date.toLocaleDateString()}\n\nItems:\n${quotation.items.map(item => `${item.product.name} (${item.product.code}) - Qty: ${item.quantity} - ₹${item.product.price * item.quantity}`).join('\n')}\n\nTotal: ₹${quotation.totalAmount.toLocaleString()}\n\nContact us for more details!`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const enquiryCartItems = enquiryCart.map(item => {
    const product = products.find(p => p.id === item.productId)!;
    return { ...item, product };
  });

  const enquiryTotal = enquiryCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary/5">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="https://cdn.builder.io/api/v1/assets/23768d4150264c7687d71bb9e74d2c80/whatsapp_image_2024-03-27_at_2.03.16_pm-removebg-preview-1-2-1581cd?format=webp&width=800"
                alt="RKM Loom Spares"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-primary">
                  RKM LOOM SPARES
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Textile Solutions
                </p>
              </div>
            </div>

            {/* Enquiry Cart Badge */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                className="relative"
                onClick={() => setSelectedTab("quotations")}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Enquiry Cart
                {enquiryCart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {enquiryCart.length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Button
                variant={selectedTab === "chat" ? "default" : "ghost"}
                onClick={() => setSelectedTab("chat")}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>AI Assistant</span>
              </Button>
              <Button
                variant={selectedTab === "products" ? "default" : "ghost"}
                onClick={() => setSelectedTab("products")}
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>Products</span>
              </Button>
              <Button
                variant={selectedTab === "quotations" ? "default" : "ghost"}
                onClick={() => setSelectedTab("quotations")}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Quotations</span>
                {enquiryCart.length > 0 && (
                  <Badge variant="secondary">{enquiryCart.length}</Badge>
                )}
              </Button>
              <Button
                variant={selectedTab === "analytics" ? "default" : "ghost"}
                onClick={() => setSelectedTab("analytics")}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-primary/10">
              <nav className="flex flex-col space-y-2">
                <Button
                  variant={selectedTab === "chat" ? "default" : "ghost"}
                  onClick={() => {
                    setSelectedTab("chat");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-start space-x-2 w-full"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>AI Assistant</span>
                </Button>
                <Button
                  variant={selectedTab === "products" ? "default" : "ghost"}
                  onClick={() => {
                    setSelectedTab("products");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-start space-x-2 w-full"
                >
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                </Button>
                <Button
                  variant={selectedTab === "quotations" ? "default" : "ghost"}
                  onClick={() => {
                    setSelectedTab("quotations");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-start space-x-2 w-full relative"
                >
                  <FileText className="h-4 w-4" />
                  <span>Quotations</span>
                  {enquiryCart.length > 0 && (
                    <Badge variant="secondary">{enquiryCart.length}</Badge>
                  )}
                </Button>
                <Button
                  variant={selectedTab === "analytics" ? "default" : "ghost"}
                  onClick={() => {
                    setSelectedTab("analytics");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-start space-x-2 w-full"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          {/* AI Chat Assistant */}
          <TabsContent value="chat" className="space-y-4">
            <div className="flex gap-4">
              <Card className="flex-1 h-[600px] flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <span>AI Voice Assistant</span>
                    <Badge variant="secondary">Voice Enabled</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <ScrollArea className="flex-1 px-6">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="space-y-3">
                          <div
                            className={`flex items-start space-x-3 ${
                              message.type === "user"
                                ? "flex-row-reverse space-x-reverse"
                                : ""
                            }`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.type === "bot" ? (
                                  <Bot className="h-4 w-4" />
                                ) : (
                                  <User className="h-4 w-4" />
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-lg px-4 py-2 max-w-md ${
                                message.type === "user"
                                  ? "bg-primary text-primary-foreground ml-auto"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          
                          {/* Product Recommendations */}
                          {message.productRecommendations && (
                            <div className="ml-11 space-y-2">
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Lightbulb className="h-4 w-4" />
                                <span>Recommended Products:</span>
                              </div>
                              <div className="grid gap-2">
                                {message.productRecommendations.map((product) => (
                                  <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                    <div className="flex items-center space-x-3">
                                      {product.image && (
                                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                      )}
                                      <div>
                                        <p className="font-medium text-sm">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{product.code}</p>
                                        <p className="text-sm font-semibold">₹{product.price.toLocaleString()}</p>
                                      </div>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      onClick={() => addToEnquiryCart(product.id)}
                                      className="flex items-center space-x-1"
                                    >
                                      <Plus className="h-3 w-3" />
                                      <span>Add</span>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="flex-shrink-0 p-6 border-t">
                    <div className="flex space-x-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about parts, prices, or type 'I want piston rings for airjet loom'..."
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1"
                      />
                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        size="icon"
                        onClick={
                          isRecording
                            ? stopVoiceRecognition
                            : startVoiceRecognition
                        }
                        className={isRecording ? "animate-pulse" : ""}
                      >
                        {isRecording ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    {isListening && (
                      <p className="text-sm text-muted-foreground mt-2 flex items-center">
                        <span className="animate-pulse mr-2">🎙️</span>
                        Listening... Speak now
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Sidebar */}
              <Card className="w-80 h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setIsImageRecognitionOpen(true)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Identify Unknown Part
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Common Queries</h4>
                    <div className="space-y-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => setInputMessage("I want piston rings for airjet loom")}
                      >
                        Piston rings for airjet loom
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => setInputMessage("Show me Toyota reed parts")}
                      >
                        Toyota reed parts
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => setInputMessage("Heddle hooks for Tsudakoma")}
                      >
                        Heddle hooks for Tsudakoma
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => setInputMessage("What parts do you have for Picanol loom?")}
                      >
                        Picanol loom parts
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Enquiry Cart</h4>
                    {enquiryCart.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No items in cart</p>
                    ) : (
                      <div className="space-y-2">
                        {enquiryCartItems.slice(0, 3).map(item => (
                          <div key={item.productId} className="flex justify-between items-center text-xs">
                            <span className="truncate">{item.product.name}</span>
                            <span>×{item.quantity}</span>
                          </div>
                        ))}
                        {enquiryCart.length > 3 && (
                          <p className="text-xs text-muted-foreground">+{enquiryCart.length - 3} more items</p>
                        )}
                        <Button size="sm" className="w-full" onClick={() => setSelectedTab("quotations")}>
                          View Cart (₹{enquiryTotal.toLocaleString()})
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Management */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                {/* Import Data Button */}
                <Dialog open={isImportDataOpen} onOpenChange={setIsImportDataOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Product Data</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Upload a CSV file with product data. Required columns: code, name, category, price, stock, description
                      </p>
                      <Button
                        onClick={() => importInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Select CSV File
                      </Button>
                      <input
                        ref={importInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Image Recognition Button */}
                <Dialog open={isImageRecognitionOpen} onOpenChange={setIsImageRecognitionOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Camera className="h-4 w-4 mr-2" />
                      ID Unknown Part
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Image Recognition</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Upload a photo of your spare part and our AI will help identify it
                      </p>
                      <Button
                        onClick={() => imageRecognitionInputRef.current?.click()}
                        className="w-full"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take/Upload Photo
                      </Button>
                      <input
                        ref={imageRecognitionInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageRecognition}
                        className="hidden"
                      />
                      
                      {recognitionImage && (
                        <div className="space-y-4">
                          <img 
                            src={recognitionImage} 
                            alt="Recognition input" 
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          {recognitionResult.length > 0 ? (
                            <div className="space-y-2">
                              <h4 className="font-medium">Possible Matches:</h4>
                              {recognitionResult.map(product => (
                                <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.code}</p>
                                    <p className="text-sm font-semibold">₹{product.price.toLocaleString()}</p>
                                  </div>
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      addToEnquiryCart(product.id);
                                      setIsImageRecognitionOpen(false);
                                    }}
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              <span className="ml-2">Analyzing image...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isAddProductOpen}
                  onOpenChange={setIsAddProductOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full sm:w-auto"
                      onClick={resetProductForm}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <ProductForm
                      productFormData={productFormData}
                      setProductFormData={setProductFormData}
                      fileInputRef={fileInputRef}
                      handleImageUpload={handleImageUpload}
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddProductOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddProduct}>Add Product</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    {product.image && (
                      <div className="w-full h-48 mb-3 rounded-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {product.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground font-mono">
                          {product.code}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {product.category}
                        </Badge>
                        {product.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Product
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}
                                "? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.description}
                    </p>
                    {product.compatibility && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Compatible with:</p>
                        <p className="text-xs text-muted-foreground">{product.compatibility.join(", ")}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-lg font-semibold">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock} units
                        </p>
                      </div>
                      <Badge
                        variant={product.stock > 20 ? "default" : "destructive"}
                      >
                        {product.stock > 20 ? "In Stock" : "Low Stock"}
                      </Badge>
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => addToEnquiryCart(product.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Enquiry
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Product Dialog */}
            <Dialog
              open={isEditProductOpen}
              onOpenChange={setIsEditProductOpen}
            >
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <ProductForm
                  productFormData={productFormData}
                  setProductFormData={setProductFormData}
                  fileInputRef={fileInputRef}
                  handleImageUpload={handleImageUpload}
                  isEdit={true}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditProductOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateProduct}>Update Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Quotations & Order Management */}
          <TabsContent value="quotations" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Enquiry Cart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Enquiry Cart</span>
                    {enquiryCart.length > 0 && (
                      <Badge variant="secondary">{enquiryCart.length}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {enquiryCart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No items in enquiry cart</p>
                      <p className="text-sm text-muted-foreground mt-1">Add products from the catalog to create quotations</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enquiryCartItems.map(item => (
                        <div key={item.productId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {item.product.image && (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">{item.product.code}</p>
                              <p className="text-sm font-semibold">₹{item.product.price.toLocaleString()} × {item.quantity}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newCart = enquiryCart.map(cartItem =>
                                    cartItem.productId === item.productId
                                      ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) }
                                      : cartItem
                                  );
                                  setEnquiryCart(newCart);
                                }}
                              >
                                -
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addToEnquiryCart(item.productId)}
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromEnquiryCart(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total:</span>
                        <span className="text-lg font-bold">₹{enquiryTotal.toLocaleString()}</span>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => setIsQuotationOpen(true)}
                        disabled={enquiryCart.length === 0}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Quotation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Previous Quotations */}
              <Card>
                <CardHeader>
                  <CardTitle>Previous Quotations</CardTitle>
                </CardHeader>
                <CardContent>
                  {quotations.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No quotations generated yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quotations.slice(0, 5).map(quotation => (
                        <div key={quotation.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{quotation.customerName}</p>
                              <p className="text-sm text-muted-foreground">{quotation.date.toLocaleDateString()}</p>
                            </div>
                            <Badge variant={quotation.status === "sent" ? "default" : "secondary"}>
                              {quotation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {quotation.items.length} items • ₹{quotation.totalAmount.toLocaleString()}
                          </p>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => sendQuotationViaWhatsApp(quotation)}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              WhatsApp
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Generate Quotation Dialog */}
            <Dialog open={isQuotationOpen} onOpenChange={setIsQuotationOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Generate Quotation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={quotationForm.customerName}
                      onChange={(e) => setQuotationForm(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={quotationForm.customerEmail}
                      onChange={(e) => setQuotationForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="customer@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone</Label>
                    <Input
                      id="customerPhone"
                      value={quotationForm.customerPhone}
                      onChange={(e) => setQuotationForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsQuotationOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={generateQuotation} disabled={!quotationForm.customerName}>
                    Generate Quotation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Analytics Dashboard */}
          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-2xl font-bold">Business Analytics</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active in inventory
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Stock Value
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹
                    {products
                      .reduce((sum, p) => sum + p.price * p.stock, 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current inventory value
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Quotations
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quotations.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total quotations sent
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    AI Interactions
                  </CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messages.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total messages today
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Loom Manufacturer Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {LOOM_CATEGORIES.map((category) => {
                    const categoryProducts = products.filter(
                      (p) => p.category === category,
                    );
                    const categoryStock = categoryProducts.reduce(
                      (sum, p) => sum + p.stock,
                      0,
                    );
                    const categoryValue = categoryProducts.reduce(
                      (sum, p) => sum + p.price * p.stock,
                      0,
                    );

                    return (
                      <div
                        key={category}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{category}</h4>
                          <p className="text-sm text-muted-foreground">
                            {categoryProducts.length} products • {categoryStock}{" "}
                            units
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{categoryValue.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Value
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
