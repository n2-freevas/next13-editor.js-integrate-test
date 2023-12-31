"use client";
import './page.scss'
import dynamic from "next/dynamic";
import Image from 'next/image'
import {OutputData} from '@editorjs/editorjs'

const ArticleEditor = dynamic(
    () => import("@/components/editor"),
    { ssr: false }
);

let data: OutputData = {
    blocks: []
}

export default function Editor() {
    return (
        <main>
            <div className='thumbnail'>
                ここに画像をD&Dして<br></br>サムネを入れる機能入ると思います。
            </div>
            <div className="date">
                {new Date().toLocaleDateString(
                    "ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .split("/")
                      .join(".")}更新
            </div>
            <h1><input placeholder='記事タイトルを入力'></input></h1>
            <div className="icon-box">
                <Image src="/icon/Twitter_black.svg" alt ="T"/>
                <Image src="/icon/LINE_black.svg" alt="L"/>
                <Image src="/icon/Facebook_black.svg" alt="F"/>
            </div>
            <ArticleEditor
                defaultValue={data}
                onChange={(api, event) => console.log("[onChange]")}
                onReady={() => console.log("[onReady]")}
                onSave={() => {console.log("[check]")}}
            />
        </main>
    )
}