"use client";

import './editor.scss'
import { useEffect, useRef, useState } from "react";

import EditorJS, { API, OutputData } from "@editorjs/editorjs";
import useId from "@mui/utils/useId";
import { EditorTools } from "./tools";
//@ts-ignore
import Undo from 'editorjs-undo'

type ArticleEditorProps = {
  defaultValue: OutputData;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
  onReady: () => void;
  onSave: (data: OutputData) => void;
  onChange: (api: API, event: CustomEvent) => void;
};

const ArticleEditor = ({
  defaultValue,
  placeholder,
  readOnly,
  minHeight,
  onReady,
  onChange,
  onSave,
}: ArticleEditorProps) => {
  const id = useId();
  const editorJS = useRef<EditorJS | null>(null);
  const [currentArticle, setCurrentArticle] = useState<OutputData | null>(null);
  useEffect(() => {
    if (editorJS.current === null) {
      editorJS.current = new EditorJS({
        placeholder,
        readOnly,
        minHeight,
        holder: id,
        data: defaultValue,
        // i18n,
        //@ts-ignore
        tools: EditorTools,
        onChange(api: API, event: CustomEvent) {
          editorJS.current?.save().then((res) => {
            setCurrentArticle(res);
            onSave(res);
          });
          onChange(api, event);
        },
        onReady() {
          editorJS.current?.save().then((res) => {
            console.log(res)
          })
          onReady();
        },
      });
    }
  }, []);
  useEffect(() => {
    console.log(currentArticle);
  }, [currentArticle]);
  return <div id={id} />;
};

// ArticleEditor.defaultProps = {
//   placeholder: "",
//   readOnly: false,
//   minHeight: 0,
// };

export default ArticleEditor;