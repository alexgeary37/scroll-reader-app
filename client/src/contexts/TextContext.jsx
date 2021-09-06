// // https://scotch.io/courses/10-react-challenges-beginner/use-context-to-pass-data

// import { useState, createContext, useEffect } from "react";

// export const TextContext = createContext();

// export const TextProvider = ({ children }) => {
//   const [text, setText] = useState(localStorage.getItem("text"));
//   const [fileName, setFileName] = useState(localStorage.getItem("fileName"));
//   const removeText = () => {
//     setText("");
//     setFileName("");
//   };

//   // If this is the first time the page has been loaded, set the initial values
//   // of 'text' and 'fileName' to "". This will then cause the other effects to
//   // run and initialise the variables in localStorage.
//   useEffect(() => {
//     if (localStorage.getItem("text") === null) {
//       setText("");
//       setFileName("");
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("text", text);
//   }, [text]);

//   useEffect(() => {
//     localStorage.setItem("fileName", fileName);
//   }, [fileName]);

//   return (
//     <TextContext.Provider
//       value={{
//         text,
//         setText,
//         fileName,
//         setFileName,
//         removeText,
//       }}
//     >
//       {children}
//     </TextContext.Provider>
//   );
// };
