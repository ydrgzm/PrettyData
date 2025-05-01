import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { MoonIcon, SunIcon, Download, Copy, Check, Sparkle } from "lucide-react";
import Editor from "@/components/Editor";
import { formatJSON, formatXML, formatYAML, minifyJSON, minifyXML, minifyYAML, detectFormat } from "@/lib/formatters";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"json" | "yaml" | "xml">("json");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPrettyPrint, setIsPrettyPrint] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const isMobile = useIsMobile();

  // Pre-validate input based on selected format
  const validateInput = (input: string, format: "json" | "yaml" | "xml"): boolean => {
    if (!input.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Input",
        description: "Please enter some content to format."
      });
      return false;
    }
    
    try {
      // Basic validation based on format
      switch(format) {
        case "json":
          // Just checking if it's parsable
          JSON.parse(input);
          break;
        case "yaml":
          // YAML validation is complex, will be handled in the formatter
          break;
        case "xml":
          // XML validation is complex, will be handled in the formatter
          break;
      }
      return true;
    } catch (err) {
      // Show a more user-friendly message about invalid format
      toast({
        variant: "destructive",
        title: `Invalid ${format.toUpperCase()}`,
        description: `${(err as Error).message}`
      });
      return false;
    }
  };

  // Auto-detect format when input changes
  const handleInputChange = (value: string) => {
    setInput(value);
    setOutput("");
    if (value.trim()) {
      const detectedFormat = detectFormat(value);
      if (detectedFormat) {
        setActiveTab(detectedFormat);
      }
    }
    // Clear error when user starts typing again
    if (error) {
      setError(null);
    }
  };

  const handleFormat = () => {
    setError(null);
    
    if (!input.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Input",
        description: "Please enter some content to format."
      });
      setOutput("");
      return;
    }

    // Skip validation for XML and YAML as they're more complex
    // JSON is easily pre-validated
    if (activeTab === "json") {
      if (!validateInput(input, activeTab)) {
        return;
      }
    }

    try {
      let formattedOutput = "";
      if (isPrettyPrint) {
        switch (activeTab) {
          case "json":
            formattedOutput = formatJSON(input);
            break;
          case "yaml":
            formattedOutput = formatYAML(input);
            break;
          case "xml":
            formattedOutput = formatXML(input);
            break;
        }
      } else {
        switch (activeTab) {
          case "json":
            formattedOutput = minifyJSON(input);
            break;
          case "yaml":
            formattedOutput = minifyYAML(input);
            break;
          case "xml":
            formattedOutput = minifyXML(input);
            break;
        }
      }
      setOutput(formattedOutput);
      setError(null);
      toast({
        title: "Success",
        description: "Content formatted successfully!",
      });
    } catch (err) {
      console.error(err);
      const errorMsg = `${(err as Error).message}`;
      setError(errorMsg);
      setOutput("");
      
      // Show only toast for errors
      toast({
        variant: "destructive",
        title: `Error formatting ${activeTab.toUpperCase()}`,
        description: errorMsg.length > 100 ? errorMsg.substring(0, 100) + "..." : errorMsg
      });
    }
  };

  const handleCopyToClipboard = () => {
    if (!output) {
      toast({
        variant: "destructive",
        title: "Nothing to copy",
        description: "Please format some content first.",
      });
      return;
    }
    
    navigator.clipboard.writeText(output)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "Copied!",
          description: "Output copied to clipboard",
        });
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Could not copy to clipboard",
        });
      });
  };

  const handleDownload = () => {
    if (!output) {
      toast({
        variant: "destructive", 
        title: "Nothing to download", 
        description: "Please format some content first."
      });
      return;
    }

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formatted.${activeTab}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `File saved as formatted.${activeTab}`,
    });
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-3 py-4 md:p-6 lg:p-8 max-w-7xl">
        <header className="mb-4 md:mb-8 flex justify-between items-center">
          <div className="flex items-center gap-1 md:gap-2">
            <Sparkle className="h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text text-transparent pb-1">
              PrettyData
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "icon"} 
              onClick={toggleDarkMode}
              className="rounded-full transition-all hover:bg-muted"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <SunIcon className="h-4 w-4 md:h-5 md:w-5" /> : <MoonIcon className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center justify-between gap-2 md:gap-4">
              <ToggleGroup 
                type="single" 
                value={activeTab} 
                onValueChange={(value) => value && setActiveTab(value as "json" | "yaml" | "xml")}
                className="justify-start"
              >
                <ToggleGroupItem value="json" aria-label="Format JSON" className="text-xs md:text-sm">JSON</ToggleGroupItem>
                <ToggleGroupItem value="yaml" aria-label="Format YAML" className="text-xs md:text-sm">YAML</ToggleGroupItem>
                <ToggleGroupItem value="xml" aria-label="Format XML" className="text-xs md:text-sm">XML</ToggleGroupItem>
              </ToggleGroup>
              <Button 
                variant="ghost" 
                onClick={handleClear}
                className="hover:bg-destructive/10 hover:text-destructive text-xs md:text-sm"
                size={isMobile ? "sm" : "default"}
              >
                Clear
              </Button>
            </div>
            <Card className="border rounded-lg overflow-hidden h-[300px] md:h-[400px] lg:h-[500px] relative shadow-sm transition-all hover:shadow-md">
              <Editor 
                value={input} 
                onChange={handleInputChange} 
                language={activeTab}
                isDarkMode={isDarkMode}
              />
            </Card>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center justify-between gap-2 md:gap-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="pretty-print" 
                    checked={isPrettyPrint}
                    onCheckedChange={setIsPrettyPrint}
                    size={isMobile ? "sm" : "default"}
                  />
                  <Label htmlFor="pretty-print" className="cursor-pointer text-xs md:text-sm">Pretty Print</Label>
                </div>
                <Button 
                  variant="default" 
                  onClick={handleFormat}
                  size={isMobile ? "sm" : "default"}
                  className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white transition-all hover:shadow-md text-xs md:text-sm"
                >
                  Format
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "icon"} 
                  onClick={handleCopyToClipboard} 
                  disabled={!output}
                  className="rounded-full transition-all hover:bg-muted"
                  aria-label="Copy to clipboard"
                >
                  {isCopied ? <Check className="h-3 w-3 md:h-4 md:w-4 text-green-500" /> : <Copy className="h-3 w-3 md:h-4 md:w-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "icon"} 
                  onClick={handleDownload} 
                  disabled={!output}
                  className="rounded-full transition-all hover:bg-muted"
                  aria-label="Download"
                >
                  <Download className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
            
            <Card className="border rounded-lg overflow-hidden h-[300px] md:h-[400px] lg:h-[500px] shadow-sm transition-all hover:shadow-md">
              <Editor 
                value={output} 
                onChange={() => {}} 
                language={activeTab}
                isDarkMode={isDarkMode}
                readOnly={true}
              />
            </Card>
          </div>
        </div>

        <footer className="mt-6 md:mt-12 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400 pb-4">
          <p className="opacity-80 hover:opacity-100 transition-opacity">
            Open Source ❤️ Created by Zeshan Ayub - Proudly hosted on GitHub Pages
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
