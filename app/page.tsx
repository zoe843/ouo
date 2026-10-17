import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getRecentEssays } from "@/lib/essays";
import { getAllPhotos, getRecentPhotos } from "@/lib/photos";
import { getRecentMurmurs } from "@/lib/murmurs";
import EssayCard from "@/components/EssayCard";
import styles from "./home.module.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

function displayDate(date: string) {
  return date.slice(0, 10).replaceAll("-", ".");
}

export default function HomePage() {
  const recentEssays = getRecentEssays(3);
  const recentPhotos = getRecentPhotos(3);
  const latestMurmur = getRecentMurmurs(1)[0];
  const windowPhoto = getAllPhotos().find((photo) => photo.url.endsWith("/night-flight-xiamen.webp"));

  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.greeting}>
          <p className={styles.verse}>相寻梦里路，飞雨落花中</p>
          <h1 id="home-title" className={styles.title}>雨落花庭</h1>
          <p className={styles.subtitle}>听雨，记事，偶尔看花。</p>
          <p className={styles.intro}>一些随笔，一些照片，<br />还有日子里零零碎碎的念头。</p>
          <div className={styles.heroLinks}>
            <Link prefetch={false} className={styles.primaryLink} href="/essays">看看随笔</Link>
            <Link prefetch={false} className={styles.secondaryLink} href="/photos">翻翻相册 <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        {windowPhoto && (
          <Link prefetch={false} className={styles.windowLink} href="/photos" aria-label={`翻开相册：${windowPhoto.title}`}>
            <figure className={styles.window}>
              <div className={styles.windowImage}>
                <Image src="/images/night-flight-xiamen-enhanced.webp" alt={`${windowPhoto.title}（清晰增强版）`} width={1200} height={900} loading="eager" fetchPriority="high" />
              </div>
              <figcaption>
                <span>{windowPhoto.title}</span>
                <time dateTime={windowPhoto.date}>{displayDate(windowPhoto.date)}</time>
              </figcaption>
            </figure>
            <span className={styles.windowNote}>从相册里，拾起一盏灯火。</span>
          </Link>
        )}
      </section>

      {latestMurmur && (
        <section className={styles.currentNote} aria-labelledby="current-note-title">
          <div className={styles.noteHeading}>
            <h2 id="current-note-title"><span className={styles.noteDot} aria-hidden="true" />掌柜近况</h2>
            <time dateTime={latestMurmur.datetime.replace(" ", "T")}>{displayDate(latestMurmur.datetime)}</time>
          </div>
          <div className={styles.noteBody}>
            {latestMurmur.title && <h3>{latestMurmur.title}</h3>}
            <p>{latestMurmur.body}</p>
          </div>
          <Link prefetch={false} className={styles.noteLink} href="/murmurs">更多碎碎念 <span aria-hidden="true">↗</span></Link>
        </section>
      )}

      {recentEssays.length > 0 && (
        <section className={styles.section} aria-labelledby="recent-essays-title">
          <div className={styles.sectionHeading}>
            <div>
              <h2 id="recent-essays-title">落在纸上的日子</h2>
              <p>最近随笔 · 把想说的话，慢慢写下来</p>
            </div>
            <Link prefetch={false} href="/essays">全部随笔 <span aria-hidden="true">↗</span></Link>
          </div>
          <div className={styles.essays}>
            {recentEssays.map((essay) => <EssayCard key={essay.slug} essay={essay} />)}
          </div>
        </section>
      )}

      {recentPhotos.length > 0 && (
        <section className={styles.section} aria-labelledby="recent-photos-title">
          <div className={styles.sectionHeading}>
            <div>
              <h2 id="recent-photos-title">在某一刻，按下快门</h2>
              <p>最近照片 · 路过的风景，留下的光</p>
            </div>
            <Link prefetch={false} href="/photos">翻开相册 <span aria-hidden="true">↗</span></Link>
          </div>
          <div className={styles.photos}>
            {recentPhotos.map((photo) => (
              <Link prefetch={false} key={photo.url} href="/photos" className={styles.photoLink}>
                <figure>
                  <div className={styles.photoImage}>
                    <Image src={photo.thumb ?? photo.url} alt={photo.title} width={540} height={720} loading="lazy" />
                  </div>
                  <figcaption>
                    <time dateTime={photo.date}>{displayDate(photo.date)}</time>
                    <h3>{photo.title}</h3>
                  </figcaption>
                </figure>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className={styles.farewell}>
        <span aria-hidden="true">❀</span>
        <p>谢谢你，来这座小庭院坐坐。</p>
        <Link prefetch={false} href="/about">认识一下掌柜</Link>
      </div>
    </div>
  );
}
