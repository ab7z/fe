import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({subsets: ["latin"]});

export default function Home() {
  return (
    <>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>hello world</h1>
      </main>
    </>
  );
}
