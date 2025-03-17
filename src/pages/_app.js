import { Inter } from "next/font/google";
import { GeneralConfigProvider } from "../context/GeneralConfigContext";
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }) {
	return (
		<main className={inter.className}>
			<GeneralConfigProvider>
				<Component {...pageProps} />
			</GeneralConfigProvider>
		</main>
	);
}
