"use client";
import './page.scss'
import dynamic from "next/dynamic";
import {OutputData} from '@editorjs/editorjs'

const ArticleEditor = dynamic(
    () => import("@/components/editor/editor"),
    { ssr: false }
);

let data: OutputData = {
    blocks: []
}

export default function Editor() {
    return (
        <main>
            <h1>Editor</h1>
            <ArticleEditor
                defaultValue={data}
                onChange={(api, event) => console.log("[onChange]")}
                onReady={() => console.log("[onReady]")}
                onSave={() => {console.log("[check]")}}
            />
        </main>
    )
}