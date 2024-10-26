import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();

// Get URL for image file
export const getUriForFile = (file) => {
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer).content;
};
