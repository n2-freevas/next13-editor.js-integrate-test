/** @type {import('next').NextConfig} */

function consoleLog(msg){
	console.log("[Custom next.config log > ]  " +  msg)
}

const switchConfig = (appMode) => {
	switch (appMode) {
		case "ADMIN":
			consoleLog("Adminstrator Mode Launch !")
			return {
				distDir: ".kurashiru-hikaku-admin",
				redirects: async () => ([
					{
						source: "/",
						destination: "/adminstrator",
						permanent: false,
					},
					// {
					// 	source: "/:path((?!adminstrator$).*)",
					// 	destination: "/adminstrator",
					// 	permanent: false,
					// }
				])
			}
		default:
			consoleLog("Hikaku Web Site Mode Launch !")
			return {
				distDir: ".kurashiru-hikaku-site",
				redirects: async () => ([
					{
						source: "/adminstrator/:path*",
						destination: "/site",
						permanent: false,
					},
				]),
				rewrites: async() => ([
					{
						source: '/site',
						destination: '/',
					}
				]),
			}
	}
}

// 共通のconfig
const commonConfig = {
	pageExtensions: ["tsx","ts", "page.tsx", "page.ts"]
}

module.exports = () => {
	// コマンドラインで指定した引数に応じ、実行モードを切り替える
	const appMode = process.env.APP_MODE ?? ""
	// 実行モードに応じたnextConfigを取得し、実行開始。
	const siteOrAdminConfig = switchConfig(appMode)
	return {
		...commonConfig,
		...siteOrAdminConfig
	}
}
