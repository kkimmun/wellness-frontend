import { top10ImageCredits } from "../../utils/enhancedPlaceImages";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiHeart, FiMap, FiMapPin, FiPause, FiPlay } from "react-icons/fi";
import { PlaceAPI } from "../../api/place";
import { CourseAPI } from "../../api/course";
import PlaceImage from "../../components/PlaceImage";
import { isDefaultPlaceImage } from "../../utils/placeImage";
import "./WelcomeContent.css";

const asList = (value) => Array.isArray(value) ? value : Array.isArray(value?.content) ? value.content : [];
const photo = (place) => place?.imageUrl || place?.imgUrl;

function RouteArt() {
  return <div className="welcome-route-art" aria-hidden="true">
    <svg viewBox="0 0 300 360" fill="none"><path d="M155 -20C50 80 260 130 175 210S200 320 265 390" stroke="#b8e1f7" strokeWidth="48"/><path d="M60 45C270 55 205 160 95 165S45 260 205 300" stroke="#7180aa" strokeWidth="2" strokeDasharray="5 7"/>{[[45,70],[250,90],[55,235],[245,275],[170,35],[120,310]].map(([x,y])=><g key={`${x}-${y}`}><path d={`M${x} ${y+12}v22`} stroke="#aca281" strokeWidth="3"/><ellipse cx={x} cy={y} rx="12" ry="19" fill="#b7cda8"/><ellipse cx={x+10} cy={y+10} rx="10" ry="14" fill="#d1dfbd"/></g>)}</svg>
    <span className="route-stop stop-one"><FiMapPin/>출발지</span><span className="route-stop stop-two"><FiMapPin/>들르고 싶은 곳</span><span className="route-stop stop-three"><FiMapPin/>도착지</span>
  </div>;
}

export default function WelcomeContent({ onModeClick }) {
  const [data, setData] = useState({ top: [], places: [], courses: [] });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [retry, setRetry] = useState(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const thumbRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const results = await Promise.allSettled([
        PlaceAPI.getGimpoTop10().then((res) => asList(res?.data)),
        PlaceAPI.getPinsByType("주요관광지").then(asList),
        CourseAPI.getFixedCourses(1).then(async (res) => {
          const courses = asList(res?.data);
          return Promise.all(courses.map(async (course) => {
            try {
              const place = await PlaceAPI.getPlaceDetail(course.endPlace.placeNo);
              return { ...course, imageUrl: photo(place) };
            } catch { return course; }
          }));
        }),
      ]);
      if (cancelled) return;
      const next = {}, failures = {};
      ["top", "places", "courses"].forEach((key, index) => {
        next[key] = results[index].status === "fulfilled" ? results[index].value : [];
        failures[key] = results[index].status === "rejected";
      });
      setData(next); setErrors(failures); setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [retry]);

  const current = data.top[active % (data.top.length || 1)];
  useEffect(() => {
    if (paused || hovered || focused || reducedMotion || data.top.length < 2) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % data.top.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reducedMotion, data.top.length]);

  useEffect(() => {
    const container = thumbRef.current;
    const thumb = container?.children[active];
    if (thumb) container.scrollTo({ left: thumb.offsetLeft - container.offsetLeft - container.clientWidth / 2 + thumb.clientWidth / 2, behavior: reducedMotion ? "instant" : "smooth" });
  }, [active, reducedMotion]);

  const gallery = [...new Map([...data.top, ...data.places].map((item) => [item.placeNo, item])).values()].filter((item) => photo(item) && !isDefaultPlaceImage(photo(item)));
  const retryLoad = () => { setLoading(true); setRetry((value) => value + 1); };
  const status = (failed, noun) => <div className="welcome-status" role="status">{loading ? `${noun} 불러오는 중…` : failed ? `${noun} 정보를 불러오지 못했어요.` : `등록된 ${noun} 정보가 없습니다.`}{!loading && failed && <button onClick={retryLoad}>다시 불러오기</button>}</div>;

  return <main className="welcome-main">
    <section className="welcome-hero" aria-label="김포 TOP10 사진 슬라이드" aria-roledescription="캐러셀" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      {current && <PlaceImage key={current.placeNo} className="hero-image" src={photo(current)} place={current} alt={current.placeName} fetchPriority="high"/>}
      <div className="hero-shade"/>
      <div className="hero-heading"><span>GIMPO WELLNESS</span><h1>김포 TOP10</h1>{current && <Link to={`/gimpoTop10/${current.placeNo}`}><FiMapPin/>{current.placeName}<FiArrowRight/></Link>}</div>
      {!current && status(errors.top, "김포 TOP10")}
      {data.top.length > 1 && <><button className="hero-arrow prev" aria-label="이전 관광지" onClick={() => setActive((active + data.top.length - 1) % data.top.length)}><FiChevronLeft/></button><button className="hero-arrow next" aria-label="다음 관광지" onClick={() => setActive((active + 1) % data.top.length)}><FiChevronRight/></button></>}
      {current && <div className="hero-bottom"><div className="hero-thumbnails" ref={thumbRef}>{data.top.map((place, index) => <button key={place.placeNo} onClick={() => setActive(index)} aria-label={`${place.placeName} 사진 보기`} aria-pressed={active === index}><PlaceImage src={photo(place)} place={place} alt="" loading="lazy"/></button>)}</div><div className="hero-counter"><span>{String(active + 1).padStart(2, "0")} <i>/ {data.top.length}</i></span><button aria-label={paused || reducedMotion ? "사진 자동재생" : "사진 자동재생 정지"} aria-pressed={paused || reducedMotion} disabled={reducedMotion} onClick={() => setPaused(!paused)}>{paused || reducedMotion ? <FiPlay/> : <FiPause/>}</button></div></div>}
    </section>

    <section className="welcome-catchphrase" aria-label="김포 여행 10선"><div className="catch-line"/><h2>검색은 여기까지. <span>김포 여행 10선</span></h2><p>가까운 곳에도, 이렇게 좋은 여행이 있습니다.</p></section>

    <section className="welcome-section" aria-labelledby="mode-heading"><span className="welcome-eyebrow">TRAVEL YOUR WAY</span><h2 id="mode-heading">김포 여행, 나에게 맞는 방식으로</h2><p className="section-description">김포의 명소를 둘러보고, 나만의 여행을 시작하세요.</p>
      <div className="welcome-modes"><article className="mode-card plan"><div className="mode-copy"><span className="mode-icon"><FiMap/></span><h3>계획모드</h3><h4>계획적인 여행</h4><p>출발지와 도착지를 정하고,<br/>들를 곳을 골라 코스를 완성해요.</p><div className="mode-steps">출발·도착 설정 → 경유지 선택 → 코스 저장</div><button onClick={() => onModeClick("j")}>계획하기 <FiArrowRight/></button></div><RouteArt/></article>
      <article className="mode-card recommend"><div className="mode-copy"><span className="mode-icon"><FiHeart/></span><h3>추천모드</h3><h4>유연한 여행</h4><p>주변 장소를 추천받으며,<br/>다음 목적지를 자유롭게 이어가요.</p><div className="mode-steps">출발지 선택 → 주변 추천 → 다음 장소 선택</div><button onClick={() => onModeClick("p")}>추천받기 <FiArrowRight/></button></div><div className="recommend-art" aria-hidden="true">{data.top.slice(0,3).map((place,index) => <div className={`polaroid photo-${index}`} key={place.placeNo}><PlaceImage src={photo(place)} place={place} alt="" loading="lazy"/><span>{place.placeName}</span></div>)}</div></article></div>
    </section>

    <section className="welcome-section pilgrimage" aria-labelledby="pilgrim-heading"><div className="section-top"><div><span className="welcome-eyebrow">PILGRIMAGE TRAIL</span><h2 id="pilgrim-heading">순례길 목록</h2><p className="section-description">김포의 역사와 자연을 따라 걷는 길</p></div><Link className="welcome-more" to="/pilgrim/fixed">전체 보기 <FiArrowRight/></Link></div>
      {data.courses.length ? <div className="welcome-courses">{data.courses.slice(0,3).map((course) => <Link className="welcome-course" key={course.courseNo} to={`/pilgrim/fixed/${course.courseNo}`}><div className="course-photo"><PlaceImage src={course.imageUrl || course.endPlaceImg} place={course.endPlace} alt={course.endPlace?.placeName || course.courseName} loading="lazy"/><div><h3>{course.courseName}</h3><span className="circle-arrow"><FiChevronRight/></span></div></div><p>{course.description}</p></Link>)}</div> : status(errors.courses, "순례길")}
    </section>

    <section className="welcome-gallery" aria-labelledby="gallery-heading"><div className="section-top welcome-section"><div><span className="welcome-eyebrow">PHOTO GALLERY</span><h2 id="gallery-heading">사진으로 만나는 김포</h2></div><button className="gallery-control" onClick={() => setGalleryPaused(!galleryPaused)} aria-label={galleryPaused ? "관광지 사진 자동재생" : "관광지 사진 자동재생 정지"} aria-pressed={galleryPaused}>{galleryPaused ? <FiPlay/> : <FiPause/>}</button></div>
      {errors.places && status(true, "주요 관광지")}
      {gallery.length ? <div className={`gallery-window ${galleryPaused ? "is-paused" : ""}`} style={{ "--gallery-duration": `${Math.max(60, gallery.length * 5)}s` }}><div className="gallery-track">{[0,1].map((copy) => <div className="gallery-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{gallery.map((place) => <Link key={place.placeNo} to={`/place/${place.placeNo}`} tabIndex={copy ? -1 : undefined}><PlaceImage src={photo(place)} place={place} alt={place.placeName} loading="lazy"/><span>{place.placeName}</span></Link>)}</div>)}</div></div> : !errors.places && status(false, "관광지 사진")}
    </section>
    <details style={{maxWidth:1180,width:"calc(100% - 40px)",margin:"0 auto 32px",fontSize:12,color:"#66717e",lineHeight:1.8}}>
      <summary style={{cursor:"pointer"}}>TOP10 사진 출처 및 보정 안내</summary>
      <p>애기봉·장릉은 고해상도 원본을 사용합니다. 나머지 8장은 원본 사진을 AI로 업스케일링했으며, 세부 표현은 원본과 차이가 있을 수 있습니다.</p>
      <ul>{top10ImageCredits.map((item) => <li key={item.id}>
        {item.name} · <a href={item.license.sourcePageUrl} target="_blank" rel="noreferrer">{item.license.sourceName}</a>
        {item.license.authorName && ` · ${item.license.authorName}`} · {item.license.licenseCode}
        {item.enhanced && " · AI 업스케일링"}
      </li>)}</ul>
    </details>
  </main>;
}

