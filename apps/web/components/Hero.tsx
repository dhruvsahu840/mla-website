import Image from "next/image";
import Link from "next/link";

import styles from "@/styles/components/Hero.module.css";
import { homeHero } from "@/lib/home-hero";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}
      <div className={styles.background}>
        <Image
          src={homeHero.backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`${styles.backgroundImage} ${styles.desktopBackground}`}
        />
        <Image
          src={homeHero.mobileBackgroundImage}
          alt=""
          fill
          sizes="100vw"
          className={`${styles.backgroundImage} ${styles.mobileBackground}`}
        />
      </div>

      {/* =====================================================
          DARK / LIGHT OVERLAY
          Remove this div if you don't want an overlay.
      ====================================================== */}
      <div className={styles.overlay} />

      {/* =====================================================
          HERO CONTENT
      ====================================================== */}
      <div className={styles.container}>
        {/* LEFT SIDE */}
        <div className={styles.content}>
         
        </div>

   
        
      </div>
    </section>
  );
}