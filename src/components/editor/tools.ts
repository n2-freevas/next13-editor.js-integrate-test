// import CheckList from "@editorjs/checklist";
// import Delimiter from "@editorjs/delimiter";
//@ts-ignore
import Embed from "./editorJsExtensitons/EmbedEx/index"
import Header from "@editorjs/header";
// import Bullet from  './editorJsExtensitons/bullet'
// import ImageTool from "@editorjs/image";
// import List from '@editorjs/list'
//@ts-ignore
import ListEx from './editorJsExtensitons/Bullet/index';
// import Marker from "@editorjs/marker";
// import Quote from "@editorjs/quote";
// import Table from "@editorjs/table";
// import { container } from "tsyringe";

// import { fetchRoutes } from "@repositories/EditorRepository";
// import { UploadFileForm } from "@schemas/validations/Editor/uploadFileForm";
// import { UploadUrlForm } from "@schemas/validations/Editor/uploadUrlForm";
// // import EditorService from "@services/EditorService/EditorService";

// // const editorService = container.resolve(EditorService);
export const EditorTools = {
  headerL: {
    class: Header,
    config: {
      levels: [2,3],
      defaultLevel: 2,
    },
  },
  bullet: {
    class: ListEx,
    inlineToolbar: true,
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        twitter: true,
        instagram: true
      },
    },
  },
//   quote: {
//     class: Quote,
//     inlineToolbar: true,
//     shortcut: "CMD+SHIFT+O",
//     config: {
//       quotePlaceholder: "テキストを入力",
//       captionPlaceholder: "キャプションを入力",
//     },
//   },
//   delimiter: Delimiter,
//   table: {
//     class: Table,
//     inlineToolbar: true,
//     config: {
//       rows: 2,
//       cols: 3,
//     },
//   },
//   marker: {
//     class: Marker,
//     shortcut: "CMD+SHIFT+M",
//   },
// };

// export const i18n = {
//   messages: {
//     ui: {
//       blockTunes: {
//         toggler: {
//           "Click to tune": "クリックして調整",
//           "or drag to move": "ドラッグして移動",
//         },
//       },
//       inlineToolbar: {
//         converter: {
//           "Convert to": "変換",
//         },
//       },
//       toolbar: {
//         toolbox: {
//           Add: "追加",
//         },
//       },
//     },
//     toolNames: {
//       Text: "テキスト",
//       Heading: "タイトル",
//       List: "リスト",
//       Checklist: "チェックリスト",
//       Quote: "引用",
//       Delimiter: "直線",
//       Table: "表",
//       Link: "リンク",
//       Bold: "太字",
//       Italic: "斜体",
//       Image: "画像",
//       Marker: "マーカー",
//     },
//     blockTunes: {
//       deleteTune: {
//         Delete: "削除",
//       },
//       moveUpTune: {
//         "Move up": "上に移動",
//       },
//       moveDownTune: {
//         "Move down": "下に移動",
//       },
//     },
//   },
};