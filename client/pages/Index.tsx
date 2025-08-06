import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! I'm RKM Assistant. How can I help you with loom spares today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Shuttle Loom Reed",
      category: "Reed",
      price: 2500,
      stock: 45,
      description: "High-quality reed for shuttle looms",
    },
    {
      id: "2",
      name: "Heddle Hooks",
      category: "Hooks",
      price: 150,
      stock: 120,
      description: "Durable heddle hooks for textile production",
    },
    {
      id: "3",
      name: "Loom Temple",
      category: "Temple",
      price: 3200,
      stock: 25,
      description: "Adjustable temple for fabric weaving",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("chat");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getBotResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("price") || input.includes("cost")) {
      return "Our loom spare prices vary by product. Reed prices start from ₹2,500, hooks from ₹150, and temples from ₹3,200. Would you like specific pricing for any product?";
    }
    if (input.includes("stock") || input.includes("available")) {
      return "We maintain good stock levels for all our products. Currently, we have 45 shuttle loom reeds, 120 heddle hooks, and 25 loom temples in stock.";
    }
    if (input.includes("delivery") || input.includes("shipping")) {
      return "We offer fast delivery across India. Standard delivery takes 3-5 business days, and express delivery takes 1-2 business days.";
    }
    if (input.includes("quality") || input.includes("warranty")) {
      return "All RKM Loom Spares come with a 1-year warranty. We use premium materials and follow strict quality control processes.";
    }
    return "Thank you for your inquiry! I can help you with product information, pricing, stock levels, and orders. What specific information do you need about our loom spares?";
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-xl font-bold text-primary">RKM LOOM SPARES</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Textile Solutions</p>
              </div>
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
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {/* AI Chat Assistant */}
          <TabsContent value="chat" className="space-y-4">
            <Card className="h-[600px] flex flex-col">
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
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.type === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
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
                      placeholder="Type your message or use voice..."
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                    />
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="icon"
                      onClick={isRecording ? stopVoiceRecognition : startVoiceRecognition}
                      className={isRecording ? "animate-pulse" : ""}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
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
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold">₹{product.price.toLocaleString()}</p>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Dashboard */}
          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-2xl font-bold">Business Analytics</h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
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
                  <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current inventory value
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {products.filter(p => p.stock <= 20).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Require restocking
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
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
                <CardTitle>Product Categories Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(products.map(p => p.category))).map(category => {
                    const categoryProducts = products.filter(p => p.category === category);
                    const categoryStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
                    const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
                    
                    return (
                      <div key={category} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium">{category}</h4>
                          <p className="text-sm text-muted-foreground">
                            {categoryProducts.length} products • {categoryStock} units
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{categoryValue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total Value</p>
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
