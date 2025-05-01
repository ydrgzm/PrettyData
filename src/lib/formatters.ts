
import * as yaml from 'js-yaml';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

// Type detection
export const detectFormat = (content: string): "json" | "yaml" | "xml" | null => {
  content = content.trim();
  
  // Check if it might be JSON
  if ((content.startsWith('{') && content.endsWith('}')) || 
      (content.startsWith('[') && content.endsWith(']'))) {
    try {
      JSON.parse(content);
      return "json";
    } catch (e) {
      // Not valid JSON
    }
  }
  
  // Check if it might be XML
  if (content.startsWith('<') && content.endsWith('>')) {
    try {
      const parser = new XMLParser({ 
        ignoreAttributes: false,
        preserveOrder: true
      });
      parser.parse(content);
      return "xml";
    } catch (e) {
      // Not valid XML
    }
  }
  
  // Try to parse as YAML
  try {
    yaml.load(content);
    return "yaml";
  } catch (e) {
    // Not valid YAML
  }
  
  // Could not detect format
  return null;
};

// JSON formatters
export const formatJSON = (input: string): string => {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    throw new Error(`Could not parse JSON: ${(e as Error).message}`);
  }
};

export const minifyJSON = (input: string): string => {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (e) {
    throw new Error(`Could not parse JSON: ${(e as Error).message}`);
  }
};

// YAML formatters
export const formatYAML = (input: string): string => {
  try {
    // First, try to parse as YAML
    const parsed = yaml.load(input);
    return yaml.dump(parsed, {
      indent: 2,
      lineWidth: -1, // No line wrapping
      noRefs: true,
      sortKeys: false,
    });
  } catch (e) {
    throw new Error(`Could not parse YAML: ${(e as Error).message}`);
  }
};

export const minifyYAML = (input: string): string => {
  try {
    const parsed = yaml.load(input);
    return yaml.dump(parsed, {
      flowLevel: 0, // Use flow style
      indent: 0,
      lineWidth: -1,
      noRefs: true,
    });
  } catch (e) {
    throw new Error(`Could not parse YAML: ${(e as Error).message}`);
  }
};

// XML formatters
const XML_PARSER_OPTIONS = {
  ignoreAttributes: false,
  format: true,
  indentBy: '  ', // 2 spaces
  suppressEmptyNode: true,
};

export const formatXML = (input: string): string => {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      preserveOrder: true,
    });
    const parsed = parser.parse(input);
    
    const builder = new XMLBuilder({
      ...XML_PARSER_OPTIONS,
      format: true,
    });
    return builder.build(parsed);
  } catch (e) {
    throw new Error(`Could not parse XML: ${(e as Error).message}`);
  }
};

export const minifyXML = (input: string): string => {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      preserveOrder: true,
    });
    const parsed = parser.parse(input);
    
    const builder = new XMLBuilder({
      ...XML_PARSER_OPTIONS,
      format: false,
    });
    return builder.build(parsed);
  } catch (e) {
    throw new Error(`Could not parse XML: ${(e as Error).message}`);
  }
};
