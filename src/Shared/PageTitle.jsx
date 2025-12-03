import { useEffect } from "react";

const PageTitle = ({ title }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | NC-Group`;
    } else {
      document.title = "NC-Group: Where Quality Meets Precision";
    }
  }, [title]);

  return null; 
};

export default PageTitle;
