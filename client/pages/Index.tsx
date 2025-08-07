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
import { Switch } from "@/components/ui/switch";
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
  AlertTriangle,
  CheckCircle,
  Database,
  Globe,
  Languages,
  GitCompare,
  RefreshCw,
  Bell,
  Truck,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  productRecommendations?: Product[];
  language?: "en" | "ta";
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
  specifications?: Record<string, string>;
  isLowStock?: boolean;
  lastRestocked?: Date;
}

interface EnquiryItem {
  productId: string;
  quantity: number;
  notes?: string;
}

interface Estimation {
  id: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: (EnquiryItem & { product: Product })[];
  totalAmount: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  validUntil: Date;
}

interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  type: "low_stock" | "out_of_stock" | "restocked";
  timestamp: Date;
  read: boolean;
}

const LOOM_CATEGORIES = [
  "TOYOTA",
  "TSUDAKOMA",
  "PICANOL",
  "STAUBLI",
  "ITEMA",
] as const;

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

// Tamil translations for voice commands
const TAMIL_TRANSLATIONS = {
  "stock check": "ஸ்டாக் சரிபார்",
  "add to cart": "கார்ட்டில் சேர்",
  "price check": "விலை சரிபார்",
  "quotation": "மதிப்பீடு",
  "compatible": "பொருத்தம்",
};

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
    specifications: string;
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
    specifications: string;
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
      <Label htmlFor="specifications">Specifications (key:value, comma-separated)</Label>
      <Input
        id="specifications"
        value={productFormData.specifications}
        onChange={(e) =>
          setProductFormData((prev) => ({ ...prev, specifications: e.target.value }))
        }
        placeholder="e.g., material:steel, weight:2kg, size:10cm"
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

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm RKM Assistant. I can help you with loom spares, compatibility checks, product comparisons, and estimations. Try saying 'Add 10 bobbin holders and 5 heald wires' or ask about compatibility!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ta">("en");
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
      compatibility: ["Toyota G810", "Toyota G820", "Toyota G6"],
      tags: ["reed", "shuttle", "weaving"],
      specifications: { material: "stainless steel", dents: "120", width: "190cm" },
      isLowStock: false,
      lastRestocked: new Date(),
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
      compatibility: ["Tsudakoma ZAX", "Tsudakoma ZW", "Tsudakoma ZU"],
      tags: ["heddle", "hooks", "accessories"],
      specifications: { material: "hardened steel", quantity: "100", size: "standard" },
      isLowStock: false,
      lastRestocked: new Date(),
    },
    {
      id: "3",
      code: "RKM-PIC-003",
      name: "Adjustable Loom Temple",
      category: "PICANOL",
      price: 3200,
      stock: 5,
      description: "Premium adjustable temple for Picanol fabric weaving",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      compatibility: ["Picanol OMNIplus", "Picanol TERRAplus", "Picanol GTMax"],
      tags: ["temple", "adjustable", "fabric"],
      specifications: { width: "adjustable", material: "aluminum", weight: "1.5kg" },
      isLowStock: true,
      lastRestocked: new Date(),
    },
    {
      id: "4",
      code: "RKM-TOY-004",
      name: "Piston Rings for Airjet",
      category: "TOYOTA",
      price: 450,
      stock: 80,
      description: "High-performance piston rings for Toyota Airjet looms",
      compatibility: ["Toyota JAT710", "Toyota JAT810", "Toyota JAT610"],
      tags: ["piston", "rings", "airjet"],
      specifications: { material: "carbon steel", diameter: "25mm", thickness: "2mm" },
      isLowStock: false,
      lastRestocked: new Date(),
    },
    {
      id: "5",
      code: "RKM-STB-005",
      name: "Bobbin Holders",
      category: "STAUBLI",
      price: 75,
      stock: 200,
      description: "Standard bobbin holders for Staubli looms",
      compatibility: ["Staubli ALPHA 500", "Staubli ALPHA 400"],
      tags: ["bobbin", "holders", "accessories"],
      specifications: { material: "plastic", color: "white", capacity: "standard" },
      isLowStock: false,
      lastRestocked: new Date(),
    },
    {
      id: "6",
      code: "RKM-ITE-006", 
      name: "Heald Wires",
      category: "ITEMA",
      price: 25,
      stock: 500,
      description: "Premium heald wires for Itema looms",
      compatibility: ["Itema A9500", "Itema R9500"],
      tags: ["heald", "wires", "weaving"],
      specifications: { material: "high carbon steel", length: "25cm", gauge: "0.8mm" },
      isLowStock: false,
      lastRestocked: new Date(),
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("chat");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isImportDataOpen, setIsImportDataOpen] = useState(false);
  const [isImageRecognitionOpen, setIsImageRecognitionOpen] = useState(false);
  const [isEstimationOpen, setIsEstimationOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [enquiryCart, setEnquiryCart] = useState<EnquiryItem[]>([]);
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [recognitionImage, setRecognitionImage] = useState<string>("");
  const [recognitionResult, setRecognitionResult] = useState<Product[]>([]);
  const [realTimeStockEnabled, setRealTimeStockEnabled] = useState(true);
  const [restockNotifications, setRestockNotifications] = useState(true);
  const [estimationForm, setEstimationForm] = useState({
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
    specifications: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const imageRecognitionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time stock monitoring
  useEffect(() => {
    if (realTimeStockEnabled) {
      const interval = setInterval(() => {
        checkStockLevels();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [realTimeStockEnabled, products]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkStockLevels = () => {
    const newAlerts: StockAlert[] = [];
    
    products.forEach(product => {
      if (product.stock === 0) {
        newAlerts.push({
          id: Date.now().toString() + product.id,
          productId: product.id,
          productName: product.name,
          type: "out_of_stock",
          timestamp: new Date(),
          read: false,
        });
      } else if (product.stock <= 20 && !product.isLowStock) {
        newAlerts.push({
          id: Date.now().toString() + product.id,
          productId: product.id,
          productName: product.name,
          type: "low_stock",
          timestamp: new Date(),
          read: false,
        });
        // Update product low stock status
        setProducts(prev => prev.map(p => 
          p.id === product.id ? { ...p, isLowStock: true } : p
        ));
      }
    });

    if (newAlerts.length > 0) {
      setStockAlerts(prev => [...prev, ...newAlerts]);
      
      if (restockNotifications) {
        // Show browser notification
        if (Notification.permission === "granted") {
          new Notification("Stock Alert", {
            body: `${newAlerts.length} products need attention`,
            icon: "/favicon.ico"
          });
        }
      }
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      language: currentLanguage,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");

    // Process chat-based shopping commands
    const shoppingResult = processShoppingCommands(currentInput);
    if (shoppingResult.itemsAdded > 0) {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: shoppingResult.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      return;
    }

    // Simulate bot response with enhanced AI
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

  const processShoppingCommands = (input: string): { itemsAdded: number; response: string } => {
    const lowerInput = input.toLowerCase();
    let itemsAdded = 0;
    let response = "";

    // Parse commands like "add 10 bobbin holders and 5 heald wires"
    const addMatches = lowerInput.match(/(?:add|சேர்)\s+(\d+)\s+([^,\s]+(?:\s+[^,\s]+)*)/g);
    
    if (addMatches) {
      const addedItems: string[] = [];
      
      addMatches.forEach(match => {
        const parts = match.match(/(?:add|சேர்)\s+(\d+)\s+(.+)/);
        if (parts) {
          const quantity = parseInt(parts[1]);
          const productName = parts[2].trim();
          
          // Find matching product
          const matchingProduct = products.find(p => 
            p.name.toLowerCase().includes(productName) ||
            p.tags?.some(tag => tag.toLowerCase().includes(productName))
          );
          
          if (matchingProduct) {
            addToEnquiryCart(matchingProduct.id, quantity);
            addedItems.push(`${quantity}x ${matchingProduct.name}`);
            itemsAdded += quantity;
          }
        }
      });
      
      if (addedItems.length > 0) {
        response = `Added to your enquiry cart: ${addedItems.join(", ")}. Total items: ${itemsAdded}. Would you like to generate an estimation?`;
      }
    }

    // Handle stock check commands
    if (lowerInput.includes("stock") || lowerInput.includes("available") || lowerInput.includes("ஸ்டாக்")) {
      const productName = lowerInput.replace(/(check|stock|available|ஸ்டாக்|சரிபார்)/g, "").trim();
      if (productName) {
        const matchingProduct = products.find(p => 
          p.name.toLowerCase().includes(productName)
        );
        if (matchingProduct) {
          response = `${matchingProduct.name} (${matchingProduct.code}): ${matchingProduct.stock} units in stock. Price: ₹${matchingProduct.price.toLocaleString()}`;
          return { itemsAdded: 0, response };
        }
      }
    }

    // Handle compatibility checks
    if (lowerInput.includes("compatible") || lowerInput.includes("compatibility") || lowerInput.includes("பொருத்தம்")) {
      response = handleCompatibilityCheck(input);
      return { itemsAdded: 0, response };
    }

    return { itemsAdded, response };
  };

  const handleCompatibilityCheck = (input: string): string => {
    // Extract loom model from input
    const modelMatches = input.match(/(G\d+|JAT\d+|ZAX|ZW|OMNIplus|TERRAplus|ALPHA\s+\d+|A\d+|R\d+)/i);
    
    if (modelMatches) {
      const model = modelMatches[0];
      const compatibleProducts = products.filter(p => 
        p.compatibility?.some(compat => compat.toLowerCase().includes(model.toLowerCase()))
      );
      
      if (compatibleProducts.length > 0) {
        const productList = compatibleProducts.map(p => `${p.name} (${p.code})`).join(", ");
        return `Compatible parts for ${model}: ${productList}. Would you like details on any specific part?`;
      } else {
        return `No direct matches found for ${model}. Let me check our catalog for similar models or contact our technical team for assistance.`;
      }
    }
    
    return "Please specify the loom model (e.g., Toyota G810, Tsudakoma ZAX) to check compatibility.";
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

    // Handle comparison requests
    if (input.includes("compare") || input.includes("difference") || input.includes("vs")) {
      return {
        content: "I can help you compare products! Use the Product Comparison feature or tell me which specific products you'd like to compare (e.g., 'Compare Toyota reed vs Tsudakoma reed')."
      };
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

    if (input.includes("staubli")) {
      const recommendations = products.filter(p => p.category === "STAUBLI");
      return {
        content: "Here are Staubli loom spare parts:",
        recommendations
      };
    }

    if (input.includes("itema")) {
      const recommendations = products.filter(p => p.category === "ITEMA");
      return {
        content: "Here are Itema loom spare parts:",
        recommendations
      };
    }

    if (input.includes("price") || input.includes("cost")) {
      return {
        content: "Our loom spare prices vary by manufacturer. Toyota parts start from ₹450, Tsudakoma from ₹150, and Picanol from ₹3,200. Would you like specific pricing?"
      };
    }

    if (input.includes("stock") || input.includes("available")) {
      const lowStockProducts = products.filter(p => p.isLowStock || p.stock <= 20);
      if (lowStockProducts.length > 0) {
        return {
          content: `Current stock levels: We have good inventory for most parts. However, ${lowStockProducts.length} items are running low: ${lowStockProducts.map(p => p.name).join(", ")}. Would you like real-time stock alerts?`
        };
      }
      return {
        content: "We maintain good stock levels across all manufacturers. All products are currently well-stocked. I can enable real-time stock monitoring for you."
      };
    }

    if (input.includes("estimation") || input.includes("estimate") || input.includes("quote")) {
      return {
        content: "I can help you generate a professional estimation! Add products to your enquiry cart and I'll create a detailed estimate with pricing and validity period."
      };
    }

    if (input.includes("identify") || input.includes("unknown part")) {
      return {
        content: "Use our AI-powered image recognition feature! Upload a photo of your spare part and I'll help identify it and check compatibility."
      };
    }

    return {
      content: "I can help you with Toyota, Tsudakoma, Picanol, Staubli, and Itema loom spares. Try commands like 'Add 10 bobbin holders', 'Check stock for reed', 'Is this compatible with Toyota G810?', or use our product comparison feature!"
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
      recognitionRef.current.lang = currentLanguage === "ta" ? "ta-IN" : "en-US";

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

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const importedProducts: Product[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 6) {
            const product: Product = {
              id: Date.now().toString() + i,
              code: values[0]?.trim() || `RKM-IMP-${i}`,
              name: values[1]?.trim() || `Imported Product ${i}`,
              category: (values[2]?.trim() as Product["category"]) || "TOYOTA",
              price: parseFloat(values[3]?.trim()) || 0,
              stock: parseInt(values[4]?.trim()) || 0,
              description: values[5]?.trim() || "Imported from CSV",
              compatibility: values[6] ? values[6].split(';').map(s => s.trim()) : undefined,
              tags: values[7] ? values[7].split(';').map(s => s.trim()) : ["imported"],
              isLowStock: parseInt(values[4]?.trim()) <= 20,
              lastRestocked: new Date(),
            };
            importedProducts.push(product);
          }
        }
        
        if (importedProducts.length > 0) {
          setProducts(prev => [...prev, ...importedProducts]);
          
          // Simulate Supabase sync
          setTimeout(() => {
            const botMessage: Message = {
              id: Date.now().toString(),
              type: "bot",
              content: `✅ Successfully imported ${importedProducts.length} products to database. All data has been automatically synced to Supabase for real-time access.`,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
          }, 1000);
        }
        
        setIsImportDataOpen(false);
      } catch (error) {
        console.error("Import error:", error);
      }
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
      specifications: "",
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

    const specifications = productFormData.specifications 
      ? Object.fromEntries(
          productFormData.specifications.split(',').map(spec => {
            const [key, value] = spec.split(':');
            return [key?.trim(), value?.trim()];
          }).filter(([key, value]) => key && value)
        )
      : {};

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
      specifications,
      isLowStock: parseInt(productFormData.stock) <= 20,
      lastRestocked: new Date(),
    };

    setProducts((prev) => [...prev, newProduct]);
    resetProductForm();
    setIsAddProductOpen(false);

    // Simulate Supabase sync
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: `✅ Product "${newProduct.name}" added successfully and synced to Supabase database.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
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
      specifications: product.specifications ? Object.entries(product.specifications).map(([k, v]) => `${k}:${v}`).join(", ") : "",
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

    const specifications = productFormData.specifications 
      ? Object.fromEntries(
          productFormData.specifications.split(',').map(spec => {
            const [key, value] = spec.split(':');
            return [key?.trim(), value?.trim()];
          }).filter(([key, value]) => key && value)
        )
      : {};

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
      specifications,
      isLowStock: parseInt(productFormData.stock) <= 20,
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

  const generateEstimation = () => {
    if (enquiryCart.length === 0 || !estimationForm.customerName) return;

    const estimationItems = enquiryCart.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      return { ...item, product };
    });

    const totalAmount = estimationItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days

    const newEstimation: Estimation = {
      id: Date.now().toString(),
      date: new Date(),
      customerName: estimationForm.customerName,
      customerEmail: estimationForm.customerEmail,
      customerPhone: estimationForm.customerPhone,
      items: estimationItems,
      totalAmount,
      status: "draft",
      validUntil,
    };

    setEstimations(prev => [...prev, newEstimation]);
    setEnquiryCart([]);
    setEstimationForm({ customerName: "", customerEmail: "", customerPhone: "" });
    setIsEstimationOpen(false);
  };

  const generatePDF = (estimation: Estimation) => {
    // Create PDF content
    const pdfContent = `
RKM LOOM SPARES - ESTIMATION

Customer: ${estimation.customerName}
Email: ${estimation.customerEmail}
Phone: ${estimation.customerPhone}
Date: ${estimation.date.toLocaleDateString()}
Valid Until: ${estimation.validUntil.toLocaleDateString()}

ITEMS:
${estimation.items.map(item => 
  `${item.product.name} (${item.product.code})
  Quantity: ${item.quantity}
  Unit Price: ₹${item.product.price.toLocaleString()}
  Total: ₹${(item.product.price * item.quantity).toLocaleString()}
  `).join('\n')}

TOTAL AMOUNT: ₹${estimation.totalAmount.toLocaleString()}

Terms & Conditions:
- This estimation is valid for 30 days
- Prices subject to change without notice
- All products come with 1-year warranty
- Delivery charges may apply

RKM LOOM SPARES
Contact: info@rkmlooms.com | +91-XXXXXXXXXX
    `;

    // Create and download PDF
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RKM_Estimation_${estimation.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const sendEstimationViaWhatsApp = (estimation: Estimation) => {
    const message = `🔧 RKM Loom Spares Estimation

📋 Customer: ${estimation.customerName}
📅 Date: ${estimation.date.toLocaleDateString()}
⏰ Valid Until: ${estimation.validUntil.toLocaleDateString()}

📦 Items:
${estimation.items.map(item => `• ${item.product.name} (${item.product.code}) - Qty: ${item.quantity} - ₹${(item.product.price * item.quantity).toLocaleString()}`).join('\n')}

💰 Total: ₹${estimation.totalAmount.toLocaleString()}

🛡️ All parts come with 1-year warranty
🚚 Fast delivery across India

Contact us to place your order!
📧 info@rkmlooms.com`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const addToComparison = (product: Product) => {
    if (comparisonProducts.length < 3 && !comparisonProducts.find(p => p.id === product.id)) {
      setComparisonProducts(prev => [...prev, product]);
    }
  };

  const removeFromComparison = (productId: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId));
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
  const unreadAlerts = stockAlerts.filter(alert => !alert.read).length;

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

            {/* Header Controls */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4" />
                <Switch
                  checked={currentLanguage === "ta"}
                  onCheckedChange={(checked) => setCurrentLanguage(checked ? "ta" : "en")}
                />
                <span className="text-sm">{currentLanguage === "ta" ? "தமிழ்" : "EN"}</span>
              </div>

              {/* Real-time Stock Toggle */}
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <Switch
                  checked={realTimeStockEnabled}
                  onCheckedChange={setRealTimeStockEnabled}
                />
                <span className="text-sm">Live Stock</span>
              </div>

              {/* Stock Alerts */}
              <Button variant="outline" className="relative">
                <Bell className="h-4 w-4" />
                {unreadAlerts > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {unreadAlerts}
                  </Badge>
                )}
              </Button>

              {/* Enquiry Cart Badge */}
              <Button
                variant="outline"
                className="relative"
                onClick={() => setSelectedTab("estimations")}
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
                variant={selectedTab === "estimations" ? "default" : "ghost"}
                onClick={() => setSelectedTab("estimations")}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Estimations</span>
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
                  variant={selectedTab === "estimations" ? "default" : "ghost"}
                  onClick={() => {
                    setSelectedTab("estimations");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-start space-x-2 w-full relative"
                >
                  <FileText className="h-4 w-4" />
                  <span>Estimations</span>
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
                    <Badge variant="secondary">
                      {currentLanguage === "ta" ? "தமிழ் & English" : "Voice + Chat Enabled"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <ScrollArea className="flex-1 px-6">
                    <div className="space-y-4 overflow-hidden">
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
                              className={`rounded-lg px-4 py-2 max-w-md break-words overflow-hidden ${
                                message.type === "user"
                                  ? "bg-primary text-primary-foreground ml-auto"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm break-words">{message.content}</p>
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
                                  <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border max-w-full overflow-hidden">
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                      {product.image && (
                                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded flex-shrink-0" />
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm truncate">{product.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{product.code}</p>
                                        <p className="text-sm font-semibold">₹{product.price.toLocaleString()}</p>
                                        {product.stock <= 20 && (
                                          <Badge variant="destructive" className="text-xs mt-1">
                                            Low Stock: {product.stock}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex space-x-1">
                                      <Button 
                                        size="sm" 
                                        onClick={() => addToEnquiryCart(product.id)}
                                        className="flex items-center space-x-1"
                                      >
                                        <Plus className="h-3 w-3" />
                                        <span>Add</span>
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => addToComparison(product)}
                                      >
                                        <GitCompare className="h-3 w-3" />
                                      </Button>
                                    </div>
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
                        placeholder={
                          currentLanguage === "ta" 
                            ? "Tamil/English में बोलें या type करें - 'Add 10 bobbin holders', 'Check stock', etc."
                            : "Ask about parts, compatibility, or say 'Add 10 bobbin holders and 5 heald wires'..."
                        }
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
                        {currentLanguage === "ta" ? "கேட்கிறேன்... பேசுங்கள்" : "Listening... Speak now"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Quick Actions Sidebar */}
              <Card className="w-80 h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Smart Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setIsImageRecognitionOpen(true)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    AI Part Recognition
                  </Button>

                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setIsComparisonOpen(true)}
                  >
                    <GitCompare className="h-4 w-4 mr-2" />
                    Compare Products ({comparisonProducts.length}/3)
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Smart Commands</h4>
                    <div className="space-y-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => setInputMessage("Add 10 bobbin holders and 5 heald wires")}
                      >
                        🛒 Add 10 bobbin holders & 5 heald wires
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => setInputMessage("Check stock for piston rings")}
                      >
                        📦 Check stock for piston rings
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => setInputMessage("Is this compatible with Toyota G810?")}
                      >
                        🔧 Is this compatible with Toyota G810?
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => setInputMessage("Compare Toyota reed vs Tsudakoma reed")}
                      >
                        ⚖️ Compare Toyota vs Tsudakoma reed
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Real-time Stock Status */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Live Stock Status</h4>
                    {realTimeStockEnabled ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            Real-time monitoring
                          </span>
                          <Badge variant="outline" className="text-xs">LIVE</Badge>
                        </div>
                        {products.filter(p => p.isLowStock).length > 0 && (
                          <div className="text-xs text-orange-600">
                            ⚠️ {products.filter(p => p.isLowStock).length} items low stock
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Enable live monitoring above</p>
                    )}
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
                        <Button size="sm" className="w-full" onClick={() => setSelectedTab("estimations")}>
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
                      <Database className="h-4 w-4 mr-2" />
                      Import CSV
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Product Data</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Upload CSV with columns: code, name, category, price, stock, description, compatibility (semicolon-separated), tags (semicolon-separated)
                      </p>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">🔗 Supabase Integration Ready</p>
                        <p className="text-xs text-blue-700">
                          All imported data will be automatically synced to Supabase for real-time access across devices.
                          Connect to Supabase via MCP for seamless database management.
                        </p>
                      </div>
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
                      AI Recognition
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>AI Part Recognition</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Upload a photo of your spare part and our AI will help identify it and check compatibility
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
                              <h4 className="font-medium">AI Identified Matches:</h4>
                              {recognitionResult.map(product => (
                                <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.code}</p>
                                    <p className="text-sm font-semibold">₹{product.price.toLocaleString()}</p>
                                    {product.compatibility && (
                                      <p className="text-xs text-blue-600">Compatible: {product.compatibility.join(", ")}</p>
                                    )}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm"
                                      onClick={() => {
                                        addToEnquiryCart(product.id);
                                        setIsImageRecognitionOpen(false);
                                      }}
                                    >
                                      Add to Cart
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => addToComparison(product)}
                                    >
                                      Compare
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              <span className="ml-2">AI analyzing image...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Product Comparison Button */}
                <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <GitCompare className="h-4 w-4 mr-2" />
                      Compare ({comparisonProducts.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Product Comparison</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {comparisonProducts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No products selected for comparison. Add products from the catalog below.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Feature</TableHead>
                                {comparisonProducts.map(product => (
                                  <TableHead key={product.id} className="text-center">
                                    <div className="space-y-2">
                                      <p className="font-medium">{product.name}</p>
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => removeFromComparison(product.id)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Code</TableCell>
                                {comparisonProducts.map(product => (
                                  <TableCell key={product.id} className="text-center">{product.code}</TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Category</TableCell>
                                {comparisonProducts.map(product => (
                                  <TableCell key={product.id} className="text-center">{product.category}</TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Price</TableCell>
                                {comparisonProducts.map(product => (
                                  <TableCell key={product.id} className="text-center">₹{product.price.toLocaleString()}</TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Stock</TableCell>
                                {comparisonProducts.map(product => (
                                  <TableCell key={product.id} className="text-center">
                                    <Badge variant={product.stock > 20 ? "default" : "destructive"}>
                                      {product.stock} units
                                    </Badge>
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Compatibility</TableCell>
                                {comparisonProducts.map(product => (
                                  <TableCell key={product.id} className="text-center text-sm">
                                    {product.compatibility?.join(", ") || "N/A"}
                                  </TableCell>
                                ))}
                              </TableRow>
                              {comparisonProducts.some(p => p.specifications) && (
                                Object.keys(comparisonProducts.find(p => p.specifications)?.specifications || {}).map(specKey => (
                                  <TableRow key={specKey}>
                                    <TableCell className="font-medium capitalize">{specKey}</TableCell>
                                    {comparisonProducts.map(product => (
                                      <TableCell key={product.id} className="text-center">
                                        {product.specifications?.[specKey] || "N/A"}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
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
                        {realTimeStockEnabled && product.isLowStock && (
                          <div className="flex items-center mt-2 text-orange-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Low Stock Alert</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => addToComparison(product)}
                          disabled={comparisonProducts.length >= 3}
                        >
                          <GitCompare className="h-4 w-4" />
                        </Button>
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
                    {product.specifications && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Specifications:</p>
                        <div className="text-xs text-muted-foreground">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-lg font-semibold">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-muted-foreground">
                            Stock: {product.stock} units
                          </p>
                          {realTimeStockEnabled && (
                            <RefreshCw className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={product.stock > 20 ? "default" : "destructive"}
                      >
                        {product.stock > 20 ? "In Stock" : "Low Stock"}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={() => addToEnquiryCart(product.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Enquiry
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => addToComparison(product)}
                        disabled={comparisonProducts.length >= 3}
                      >
                        <GitCompare className="h-3 w-3" />
                      </Button>
                    </div>
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

          {/* Estimations & Order Management */}
          <TabsContent value="estimations" className="space-y-4">
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
                      <p className="text-sm text-muted-foreground mt-1">
                        Add products from catalog or use AI commands like "Add 10 bobbin holders"
                      </p>
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
                              {item.product.isLowStock && (
                                <Badge variant="destructive" className="text-xs mt-1">
                                  Low Stock: {item.product.stock} units
                                </Badge>
                              )}
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
                        onClick={() => setIsEstimationOpen(true)}
                        disabled={enquiryCart.length === 0}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Estimation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Previous Estimations */}
              <Card>
                <CardHeader>
                  <CardTitle>Previous Estimations</CardTitle>
                </CardHeader>
                <CardContent>
                  {estimations.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No estimations generated yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {estimations.slice(0, 5).map(estimation => (
                        <div key={estimation.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{estimation.customerName}</p>
                              <p className="text-sm text-muted-foreground">{estimation.date.toLocaleDateString()}</p>
                              <p className="text-xs text-muted-foreground">Valid until: {estimation.validUntil.toLocaleDateString()}</p>
                            </div>
                            <Badge variant={estimation.status === "sent" ? "default" : "secondary"}>
                              {estimation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {estimation.items.length} items • ₹{estimation.totalAmount.toLocaleString()}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => sendEstimationViaWhatsApp(estimation)}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              WhatsApp
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => generatePDF(estimation)}
                            >
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

            {/* Generate Estimation Dialog */}
            <Dialog open={isEstimationOpen} onOpenChange={setIsEstimationOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Generate Estimation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={estimationForm.customerName}
                      onChange={(e) => setEstimationForm(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={estimationForm.customerEmail}
                      onChange={(e) => setEstimationForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="customer@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone</Label>
                    <Input
                      id="customerPhone"
                      value={estimationForm.customerPhone}
                      onChange={(e) => setEstimationForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      📄 Estimation will be valid for 30 days and include warranty terms.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEstimationOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={generateEstimation} disabled={!estimationForm.customerName}>
                    Generate Estimation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Enhanced Analytics Dashboard */}
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
                    Active Estimations
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estimations.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total estimations sent
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Stock Alerts
                  </CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {products.filter(p => p.isLowStock).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Items need restocking
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Stock Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time Stock Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className={`h-4 w-4 ${realTimeStockEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                      <span>Real-time monitoring</span>
                    </div>
                    <Switch
                      checked={realTimeStockEnabled}
                      onCheckedChange={setRealTimeStockEnabled}
                    />
                  </div>
                  
                  {products.filter(p => p.isLowStock).length > 0 && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">⚠️ Low Stock Alerts</h4>
                      <div className="space-y-1">
                        {products.filter(p => p.isLowStock).map(product => (
                          <div key={product.id} className="flex justify-between items-center text-sm">
                            <span>{product.name}</span>
                            <Badge variant="destructive">{product.stock} units</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
                    const lowStockCount = categoryProducts.filter(p => p.isLowStock).length;

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
                            {lowStockCount > 0 && (
                              <span className="text-orange-600"> • {lowStockCount} low stock</span>
                            )}
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
