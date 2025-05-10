import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface EditableJsonFieldProps {
  value: any;
  onChange: (value: any) => void;
  label?: string;
  height?: string;
}

export function EditableJsonField({ 
  value, 
  onChange, 
  label = "Content JSON", 
  height = "300px" 
}: EditableJsonFieldProps) {
  // Store the JSON as a string for editing
  const [jsonString, setJsonString] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Convert the value object to a JSON string on component mount or value change
  useEffect(() => {
    try {
      const formatted = JSON.stringify(value, null, 2);
      setJsonString(formatted);
      setError(null);
    } catch (err) {
      setJsonString('{}');
      setError('Error parsing JSON');
    }
  }, [value]);

  // Handle manual edits to the JSON
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(e.target.value);
    setError(null);
  };

  // Validate and apply the changes
  const handleApplyChanges = () => {
    try {
      const parsedJson = JSON.parse(jsonString);
      onChange(parsedJson);
      setError(null);
      toast({
        title: "JSON Updated",
        description: "Your changes have been applied",
      });
    } catch (err) {
      setError('Invalid JSON format. Please check your syntax.');
      toast({
        title: "Invalid JSON",
        description: "Please check your syntax and try again",
        variant: "destructive",
      });
    }
  };

  // Format the JSON for better readability
  const handleFormatJson = () => {
    try {
      const parsedJson = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsedJson, null, 2);
      setJsonString(formatted);
      setError(null);
    } catch (err) {
      setError('Invalid JSON format. Cannot format.');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleFormatJson}
            type="button"
          >
            Format
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleApplyChanges}
            type="button"
          >
            Apply Changes
          </Button>
        </div>
      </div>
      
      <Textarea
        value={jsonString}
        onChange={handleJsonChange}
        className={`font-mono text-sm ${error ? 'border-red-500' : ''}`}
        style={{ height }}
      />
      
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
}