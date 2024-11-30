import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Folder, Play } from "lucide-react";

const Index = () => {
  const [sourcePath, setSourcePath] = useState<string>("");
  const [outputPath, setOutputPath] = useState<string>("");
  const { toast } = useToast();

  const selectFolder = async (type: "source" | "output") => {
    try {
      // Use the existing paths for now since we can't modify electron configuration
      const path = type === "source" ? "C:\\Projects\\MyApp" : "C:\\Output";
      if (type === "source") {
        setSourcePath(path);
      } else {
        setOutputPath(path);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  const handleRun = () => {
    if (!sourcePath || !outputPath) {
      toast({
        title: "Error",
        description: "Please select both source and output folders.",
      });
      return;
    }
    // Additional logic for running the process can be implemented here
    console.log("Running with Source Path: ", sourcePath, "and Output Path: ", outputPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="p-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Electron App</h1>
        <div className="mb-4">
          <Button onClick={() => selectFolder("source")}>
            <Folder className="mr-2" /> Select Source Folder
          </Button>
          <Button onClick={() => selectFolder("output")}>
            <Folder className="mr-2" /> Select Output Folder
          </Button>
        </div>
        <div className="mb-4">
          <Button onClick={handleRun}>
            <Play className="mr-2" /> Run
          </Button>
        </div>
        <p className="text-xl text-gray-600">Source Path: {sourcePath}</p>
        <p className="text-xl text-gray-600">Output Path: {outputPath}</p>
      </Card>
    </div>
  );
};

export default Index;
