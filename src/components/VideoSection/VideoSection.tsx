
import styles from"./VideoSection.module.css";

export default function VideoSection({bannerVideo}: {bannerVideo?: string}) {
  return (
    <section className="hero_banner_section">
      <div className="hero_banner">
        <video
          src={bannerVideo} 
          autoPlay
          loop
          muted
          playsInline
          className={styles.videoBanner}
        ></video>
      </div>
    </section>
  );
}


