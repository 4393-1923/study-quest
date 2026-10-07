import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { turso } from "./lib/turso"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import confetti from "canvas-confetti";
import StatsView from "./StatsView";

const translations = {
  tr: {
    roomTab: "ODA",
    statsTab: "İSTATİSTİKLER",
    currentLocation: "ŞU AN: Main Library",
    welcome: "Hoş geldin",
    ataturkQuote: "“Umutsuz durumlar yoktur, umutsuz insanlar vardır. Ben hiçbir zaman umudumu yitirmedim.”",
    ataturkAuthor: "Gazi Mustafa Kemal Atatürk",
    studyingStatus: "Çalışılıyor",
    emptyRoomStatus: "Boş Oda",
    streak: "Seri",
    today: "Bugün",
    communityHall: "📚 TOPLULUK SALONU",
    focusMode: "▶ ODAK MODU",
    studyingCount: "KİŞİ ÇALIŞIYOR",
    sit: "OTUR",
    onBreak: "MOLADAYIM",
    pomodoroTimer: "⏱ POMODORO SAYACI",
    studyBtn: "📖 ÇALIŞMA",
    breakBtn: "☕ MOLA",
    whatStudying: "NE ÇALIŞIYORSUN?",
    studyingPlaceholder: "Örn: Matematik 4. Bölüm...",
    studyMin: "ÇALIŞMA (DK)",
    breakMin: "MOLA (DK)",
    start: "▶ BAŞLA",
    pause: "⏸ DURDUR",
    resume: "▶ DEVAM",
    finish: "💾 BİTİR",
    reset: "↺ SIFIRLA",
    roomChat: "💬 ODA SOHBETİ",
    noMessages: "Henüz mesaj yok. İlk mesajı sen yaz!",
    focusChatWarning: "Odaklanma modundasın...",
    chatPlaceholder: "Mesaj yaz (maks 30)...",
    send: "GÖNDER",
    myStats: "📊 İSTATİSTİKLERİM",
    sessionsCount: "Seans",
    focusMinutes: "Odak Dk",
    streakDays: "Seri",
    weeklyChart: "📈 HAFTALIK GRAFİK",
    history: "📋 GEÇMİŞ",
    noSessions: "Henüz kayıtlı seansın yok — çalışmaya başla!",
    logout: "ÇIKIŞ",
    joinRoom: "Odaya Katıl",
    loginDesc: "E-posta ve şifreni gir.\nİlk girişinde hesabın otomatik oluşturulur.",
    loginBtn: "GİRİŞ YAP",
    loggingIn: "GİRİŞ YAPILIYOR...",
    playerReport: "OYUNCU RAPORU",
    focusJourney: "Odak yolculuğun",
    journeySub: "Küçük adımlar, büyük bir serüvene dönüşür.",
    thisWeek: "BU HAFTA",
    focusStreakCard: "ODAK SERİSİ",
    completedCard: "TAMAMLANAN",
    bestDayCard: "EN İYİ GÜN",
    weeklyFocus: "HAFTALIK ODAK",
    totalMinutes: "Toplam dakika",
    currentWeekLabel: "BU HAFTA",
    recentSessionsTitle: "SON SEANSLAR",
    recentSessionsSub: "Odak geçmişin",
    allBtn: "TÜMÜ",
    sessionText: "seans",
    minText: "dk",
    activeDays: "Aktif çalışma günü",
    registeredSessions: "Kayıtlı oturum",
    noData: "Veri yok",
    changeSeatWarn: "Çalışma sırasında koltuk değiştiremezsin!",
    seatOccupied: "Bu koltuk dolu!",
    selectSeatWarn: "Lütfen çalışmaya başlamak için masalardan boş bir sandalyeye tıkla!",
    chatFocusWarn: "Odak modundasın! Mola zamanında yazabilirsin.",
    earlyFinishUnder1Min: "Henüz 1 dakika dolmadı, seans kaydedilmeden sıfırlansın mı?",
    earlyFinishConfirm: "dakikalık çalışmanı kaydedip bitirmek istiyor musun?",
    daysShort: ["PZT", "SAL", "ÇAR", "PER", "CUM", "CTS", "PAZ"]
  },
  en: {
    roomTab: "ROOM",
    statsTab: "STATS",
    currentLocation: "NOW: Main Library",
    welcome: "Welcome",
    ataturkQuote: "“There are no hopeless situations, only hopeless people. I have never lost my hope.”",
    ataturkAuthor: "Mustafa Kemal Ataturk",
    studyingStatus: "Studying",
    emptyRoomStatus: "Empty Room",
    streak: "Streak",
    today: "Today",
    communityHall: "📚 COMMUNITY HALL",
    focusMode: "▶ FOCUS MODE",
    studyingCount: "STUDYING",
    sit: "SIT",
    onBreak: "ON BREAK",
    pomodoroTimer: "⏱ POMODORO TIMER",
    studyBtn: "📖 STUDY",
    breakBtn: "☕ BREAK",
    whatStudying: "WHAT ARE YOU STUDYING?",
    studyingPlaceholder: "e.g. Calculus Chapter 4...",
    studyMin: "STUDY (MIN)",
    breakMin: "BREAK (MIN)",
    start: "▶ START",
    pause: "⏸ PAUSE",
    resume: "▶ RESUME",
    finish: "💾 FINISH",
    reset: "↺ RESET",
    roomChat: "💬 ROOM CHAT",
    noMessages: "No messages yet. Send the first one!",
    focusChatWarning: "You are in focus mode...",
    chatPlaceholder: "Write a message (max 30)...",
    send: "SEND",
    myStats: "📊 MY STATS",
    sessionsCount: "Sessions",
    focusMinutes: "Focus Min",
    streakDays: "Streak",
    weeklyChart: "📈 WEEKLY CHART",
    history: "📋 HISTORY",
    noSessions: "No saved sessions yet — start studying!",
    logout: "LOGOUT",
    joinRoom: "Join Room",
    loginDesc: "Enter your email and password.\nYour account will be auto-created on first login.",
    loginBtn: "LOG IN",
    loggingIn: "LOGGING IN...",
    playerReport: "PLAYER REPORT",
    focusJourney: "Focus Journey",
    journeySub: "Small steps turn into a great adventure.",
    thisWeek: "THIS WEEK",
    focusStreakCard: "FOCUS STREAK",
    completedCard: "COMPLETED",
    bestDayCard: "BEST DAY",
    weeklyFocus: "WEEKLY FOCUS",
    totalMinutes: "Total minutes",
    currentWeekLabel: "THIS WEEK",
    recentSessionsTitle: "RECENT SESSIONS",
    recentSessionsSub: "Your focus log",
    allBtn: "ALL",
    sessionText: "sessions",
    minText: "min",
    activeDays: "Active study days",
    registeredSessions: "Recorded sessions",
    noData: "No data",
    changeSeatWarn: "You cannot change seats during a session!",
    seatOccupied: "This seat is already occupied!",
    selectSeatWarn: "Please click on an empty chair to begin studying!",
    chatFocusWarn: "You are in focus mode! You can chat during breaks.",
    earlyFinishUnder1Min: "Less than 1 minute worked. Reset without saving?",
    earlyFinishConfirm: "minutes of study will be saved. Do you want to finish?",
    daysShort: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
  }
};

const CustomBarLabel = ({ x, y, width, value, unit = "dk" }) => {
  if (!value || value <= 0) return null;

  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#4A3728"
      textAnchor="middle"
      fontSize={6.5}
      fontFamily="'Press Start 2P', monospace"
    >
      {`${value}${unit}`}
    </text>
  );
};

function EmptySeat({ cx, cy, onClick, disabled, label }) {
  const ts = cy - 18;
  return (
    <g 
      onClick={!disabled ? onClick : undefined} 
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      className={!disabled ? "hover-seat" : ""}
    >
      <rect x={cx - 15} y={ts - 15} width={30} height={30} fill="transparent" />
      <rect x={cx - 6} y={ts - 8} width={12} height={8} fill="#A87848" rx="1" className="seat-part" />
      <rect x={cx - 7} y={ts} width={14} height={4} fill="#8B6340" rx="1" className="seat-part" />
      <text x={cx} y={ts - 12} textAnchor="middle" fontSize="7" fill="#4A3728" className="seat-label" style={{ opacity: 0, transition: "0.2s", pointerEvents: "none", fontFamily: "'Press Start 2P'" }}>
        {label}
      </text>
    </g>
  )
}

function Student({
  cx,
  cy,
  hair,
  skin,
  shirt,
  item,
  bookColor = "#E57373",
  username,
  timerText,
  isMe,
  showBubble,
  isBreak = false,
  breakText = "MOLADAYIM"
}) {
  const ts = cy - 18

  return (
    <g className={isMe ? "animate-sit" : ""} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      {item === "laptop" && (
        <>
          <rect x={cx - 10} y={ts} width={20} height={2} fill="#2A2A2A" />
          <rect x={cx - 9} y={ts - 13} width={18} height={13} fill="#1A2822" />
          <rect x={cx - 8} y={ts - 12} width={16} height={11} fill="#2A5A40" />
          <rect x={cx - 7} y={ts - 11} width={14} height={9} fill="#7EC8A4" opacity="0.72" />
        </>
      )}

      {item === "book" && (
        <>
          <rect x={cx - 9} y={ts - 1} width={18} height={11} fill={bookColor} />
          <rect x={cx - 9} y={ts - 1} width={3} height={11} fill="#00000030" />
          <rect x={cx - 5} y={ts + 1} width={10} height={1} fill="#ffffff28" />
        </>
      )}

      {item === "write" && (
        <>
          <rect x={cx - 8} y={ts - 1} width={16} height={10} fill="#F5F0E8" />
          <rect x={cx - 6} y={ts + 1} width={9} height={1} fill="#C4B8A8" />
          <rect x={cx + 5} y={ts - 6} width={2} height={10} fill="#FFD770" />
        </>
      )}

      {item === "phone" && (
        <>
          <rect x={cx - 4} y={ts - 2} width={8} height={11} fill="#1A2822" />
          <rect x={cx - 3} y={ts - 1} width={6} height={9} fill="#7EC8A4" />
        </>
      )}

      <rect x={cx - 12} y={ts - 5} width={7} height={4} fill={skin} rx="1" />
      <rect x={cx + 5} y={ts - 5} width={7} height={4} fill={skin} rx="1" />
      <rect x={cx - 7} y={ts - 16} width={14} height={11} fill={shirt} />
      <rect x={cx - 5} y={ts - 27} width={10} height={11} fill={skin} />
      <rect x={cx - 5} y={ts - 27} width={10} height={5} fill={hair} />
      <rect x={cx - 3} y={ts - 21} width={2} height={2} fill="#333" />
      <rect x={cx + 1} y={ts - 21} width={2} height={2} fill="#333" />

      {showBubble && (
        <g className={isMe ? "float" : ""}>
          <rect
            x={cx - 32}
            y={ts - 52}
            width={64}
            height={22}
            fill={isBreak ? "#FFF9E6" : "#FFFFFF"}
            rx="2"
            style={{ stroke: isBreak ? "#B45309" : "#333", strokeWidth: 1 }}
          />
          <polygon
            points={`${cx-3},${ts-30} ${cx+3},${ts-30} ${cx},${ts-27}`}
            fill={isBreak ? "#FFF9E6" : "#FFFFFF"}
            style={{ stroke: isBreak ? "#B45309" : "#333", strokeWidth: 1 }}
          />
          <text
            x={cx}
            y={ts - 43}
            textAnchor="middle"
            fontSize="5.5"
            fill={isBreak ? "#B45309" : "#333"}
            style={{ fontFamily: "'Press Start 2P'", userSelect: "none", fontWeight: "bold" }}
          >
            {isBreak ? breakText : username}
          </text>
          <text
            x={cx}
            y={ts - 34}
            textAnchor="middle"
            fontSize="6"
            fill={isBreak ? "#D97706" : "#666"}
            style={{ fontFamily: "'Press Start 2P'", userSelect: "none" }}
          >
            {timerText}
          </text>
        </g>
      )}
    </g>
  )
}

const ALL_SEATS = [
  { cx: 52, cy: 165, hair: "#1A1008", skin: "#F4D2A8", shirt: "#7EB8D4", item: "laptop" },
  { cx: 94, cy: 165, hair: "#6B3A1F", skin: "#C68642", shirt: "#E57373", item: "book", bookColor: "#81C784" },
  { cx: 136, cy: 165, hair: "#8B7355", skin: "#F0D5B0", shirt: "#BA68C8", item: "write" },
  { cx: 178, cy: 165, hair: "#2D1B0E", skin: "#8D5524", shirt: "#FF8A65", item: "laptop" },
  { cx: 220, cy: 165, hair: "#C4956A", skin: "#FDDBB4", shirt: "#81C784", item: "book", bookColor: "#64B5F6" },
  { cx: 368, cy: 165, hair: "#4A3728", skin: "#EBB887", shirt: "#F06292", item: "laptop" },
  { cx: 410, cy: 165, hair: "#1C1208", skin: "#A0522D", shirt: "#64B5F6", item: "book", bookColor: "#FFD54F" },
  { cx: 452, cy: 165, hair: "#8B6B42", skin: "#F5CBA7", shirt: "#4DB6AC", item: "write" },
  { cx: 494, cy: 165, hair: "#3D2B1F", skin: "#D2956A", shirt: "#AED581", item: "laptop" },
  { cx: 536, cy: 165, hair: "#9B8575", skin: "#FFE0BD", shirt: "#CE93D8", item: "book", bookColor: "#FF8A65" },
  { cx: 52, cy: 208, hair: "#1F1508", skin: "#B5651D", shirt: "#FFB74D", item: "laptop" },
  { cx: 94, cy: 208, hair: "#C8A870", skin: "#FDDBB4", shirt: "#E57373", item: "write" },
  { cx: 136, cy: 208, hair: "#3D2B1F", skin: "#8D5524", shirt: "#7986CB", item: "laptop" },
  { cx: 178, cy: 208, hair: "#2A1F0E", skin: "#F4D2A8", shirt: "#4CAF50", item: "book", bookColor: "#E53935" },
  { cx: 220, cy: 208, hair: "#8B4513", skin: "#EBB887", shirt: "#FF6B6B", item: "phone" },
  { cx: 368, cy: 208, hair: "#6B4226", skin: "#C68642", shirt: "#80DEEA", item: "book", bookColor: "#9C27B0" },
  { cx: 410, cy: 208, hair: "#1A1008", skin: "#FDDBB4", shirt: "#FFCC02", item: "write" },
  { cx: 452, cy: 208, hair: "#4A3728", skin: "#F0D5B0", shirt: "#EF9A9A", item: "laptop" },
  { cx: 494, cy: 208, hair: "#2D1B0E", skin: "#A0522D", shirt: "#A5D6A7", item: "book", bookColor: "#FF7043" },
  { cx: 536, cy: 208, hair: "#8B7355", skin: "#F5CBA7", shirt: "#B39DDB", item: "laptop" },
  { cx: 57, cy: 250, hair: "#3D2B1F", skin: "#F4D2A8", shirt: "#26C6DA", item: "laptop" },
  { cx: 105, cy: 250, hair: "#8B6B42", skin: "#D2956A", shirt: "#DCE775", item: "write" },
  { cx: 153, cy: 250, hair: "#1A1008", skin: "#EBB887", shirt: "#F48FB1", item: "book", bookColor: "#42A5F5" },
  { cx: 435, cy: 250, hair: "#C4956A", skin: "#FDDBB4", shirt: "#80CBC4", item: "laptop" },
  { cx: 483, cy: 250, hair: "#2D1B0E", skin: "#8D5524", shirt: "#FFAB40", item: "write" },
]

function StudyHall({ isActive, userName, mySeatId, onSeatClick, minutes, secs, timerMode, occupiedSeats, timerState, t }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const now = Date.now();

  const renderSeat = (seat, index) => {
    const isMe = mySeatId === index;
    const occupiedBy = occupiedSeats[index];

    if (isMe) {
      const myTimeStr = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      const showMyBubble = timerState === "running";
      const isBreak = timerMode === "break";

      return (
        <Student
          key={index}
          {...seat}
          username={userName}
          timerText={myTimeStr}
          isMe={true}
          showBubble={showMyBubble}
          isBreak={isBreak}
          breakText={t.onBreak}
        />
      );
    } else if (occupiedBy) {
      let remainingSecs = 0;
      if (occupiedBy.timer_running && occupiedBy.target_end_time) {
        remainingSecs = Math.max(0, Math.floor((new Date(occupiedBy.target_end_time).getTime() - now) / 1000));
      } else {
        remainingSecs = occupiedBy.timer_seconds || 0;
      }

      const otherMins = Math.floor(remainingSecs / 60);
      const otherSecs = remainingSecs % 60;
      const otherTimeStr = `${String(otherMins).padStart(2, "0")}:${String(otherSecs).padStart(2, "0")}`;
      const showOtherBubble = occupiedBy.timer_running && remainingSecs > 0;
      const isOtherBreak = occupiedBy.timer_mode === "break";

      return (
        <Student
          key={index}
          {...seat}
          username={occupiedBy.username}
          timerText={otherTimeStr}
          isMe={false}
          showBubble={showOtherBubble}
          isBreak={isOtherBreak}
          breakText={t.onBreak}
        />
      );
    } else {
      return (
        <EmptySeat
          key={index}
          cx={seat.cx}
          cy={seat.cy}
          onClick={() => onSeatClick(index)}
          disabled={false}
          label={t.sit}
        />
      );
    }
  };

  return (
    <div className="relative w-full aspect-[600/338] overflow-hidden select-none" style={{ imageRendering: "pixelated" }}>
      <svg viewBox="0 0 600 338" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ imageRendering: "pixelated", display: "block" }} xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="338" fill="#EDE5D5" />
        {Array.from({ length: 36 }).map((_, i) => (
          <rect key={i} x={0} y={i * 9} width="600" height="1" fill="#E3D8C8" opacity="0.55" />
        ))}
        <rect x="0" y="0" width="600" height="18" fill="#D8CEB8" />
        <rect x="0" y="17" width="600" height="3" fill="#C4B8A0" />

        {[90, 210, 300, 390, 510].map((lx, i) => (
          <g key={i}>
            <rect x={lx - 1} y="0" width="2" height="28" fill="#A09080" />
            <rect x={lx - 9} y="26" width="18" height="10" fill="#C4956A" />
            <rect x={lx - 7} y="28" width="14" height="6" fill="#F0C060" />
            {isActive && <ellipse cx={lx} cy="50" rx="28" ry="20" fill="#FFF8CC" opacity="0.22" />}
          </g>
        ))}

        <rect x="0" y="18" width="78" height="165" fill="#8B6340" />
        <rect x="4" y="22" width="70" height="157" fill="#9D7450" />
        {[22, 64, 106, 146].map((sy, ri) => {
          const bookColors = [
            ["#E57373", "#81C784", "#64B5F6", "#FFB74D", "#BA68C8"],
            ["#4DB6AC", "#F06292", "#AED581", "#FFD54F", "#7986CB"],
            ["#FF8A65", "#90A4AE", "#A5D6A7", "#CE93D8", "#FFE082"],
            ["#80DEEA", "#EF9A9A", "#FFCC02", "#B39DDB", "#A5D6A7"],
          ][ri] ?? []
          return (
            <g key={ri}>
              {ri > 0 && <rect x="0" y={sy} width="78" height="4" fill="#7A5530" />}
              {bookColors.map((bc, bi) => (
                <rect key={bi} x={6 + bi * 13} y={sy + 5} width={10} height={35} fill={bc} />
              ))}
            </g>
          )
        })}
        <rect x="0" y="18" width="4" height="165" fill="#7A5530" />
        <rect x="74" y="18" width="4" height="165" fill="#6B4A28" />

        <rect x="522" y="18" width="78" height="165" fill="#8B6340" />
        <rect x="526" y="22" width="70" height="157" fill="#9D7450" />
        {[22, 64, 106, 146].map((sy, ri) => {
          const bookColors = [
            ["#CE93D8", "#4DB6AC", "#FFD54F", "#F06292", "#AED581"],
            ["#64B5F6", "#E57373", "#81C784", "#BA68C8", "#FFB74D"],
            ["#90A4AE", "#FF8A65", "#80DEEA", "#FFE082", "#EF9A9A"],
            ["#7986CB", "#A5D6A7", "#FFCC02", "#B39DDB", "#F48FB1"],
          ][ri] ?? []
          return (
            <g key={ri}>
              {ri > 0 && <rect x="522" y={sy} width="78" height="4" fill="#7A5530" />}
              {bookColors.map((bc, bi) => (
                <rect key={bi} x={528 + bi * 13} y={sy + 5} width={10} height={35} fill={bc} />
              ))}
            </g>
          )
        })}
        <rect x="522" y="18" width="4" height="165" fill="#7A5530" />
        <rect x="596" y="18" width="4" height="165" fill="#6B4A28" />

        <rect x="88" y="24" width="110" height="100" fill="#8B6340" />
        <rect x="92" y="28" width="102" height="92" fill="#B8D4E8" />
        <rect x="92" y="28" width="102" height="46" fill="#C5E3F7" />
        <rect x="96" y="36" width="34" height="8" fill="#fff" opacity="0.82" />
        <rect x="100" y="32" width="26" height="8" fill="#fff" opacity="0.82" />
        <rect x="156" y="40" width="24" height="6" fill="#fff" opacity="0.7" />
        <rect x="174" y="30" width="14" height="14" fill="#FFD770" opacity="0.9" />
        <rect x="92" y="72" width="102" height="4" fill="#8B6340" />
        <rect x="142" y="28" width="4" height="92" fill="#8B6340" />
        {isActive && <polygon points="95,72 193,72 210,200 78,200" fill="#FFF8CC" opacity="0.07" />}
        <rect x="78" y="18" width="18" height="110" fill="#D4A5A5" />
        <rect x="198" y="18" width="18" height="110" fill="#D4A5A5" />

        <rect x="402" y="24" width="110" height="100" fill="#8B6340" />
        <rect x="406" y="28" width="102" height="92" fill="#B8D4E8" />
        <rect x="406" y="28" width="102" height="46" fill="#C5E3F7" />
        <rect x="410" y="36" width="30" height="7" fill="#fff" opacity="0.78" />
        <rect x="414" y="32" width="22" height="7" fill="#fff" opacity="0.78" />
        <rect x="460" y="38" width="26" height="6" fill="#fff" opacity="0.68" />
        <rect x="488" y="32" width="12" height="12" fill="#FFD770" opacity="0.85" />
        <rect x="406" y="72" width="102" height="4" fill="#8B6340" />
        <rect x="456" y="28" width="4" height="92" fill="#8B6340" />
        {isActive && <polygon points="409,72 507,72 524,200 392,200" fill="#FFF8CC" opacity="0.07" />}
        <rect x="392" y="18" width="18" height="110" fill="#D4A5A5" />
        <rect x="506" y="18" width="18" height="110" fill="#D4A5A5" />

        <rect x="228" y="30" width="144" height="90" fill="#C4956A" />
        <rect x="232" y="34" width="136" height="82" fill="#EDE0C4" />
        {[238, 280, 322, 358].map((px) => <rect key={px} x={px} y="36" width="4" height="4" fill="#E57373" />)}
        <rect x="236" y="42" width="52" height="30" fill="#FFFDE7" />
        <rect x="238" y="45" width="40" height="2" fill="#C4B8A8" />
        <rect x="238" y="49" width="36" height="2" fill="#C4B8A8" />
        <rect x="238" y="53" width="38" height="2" fill="#C4B8A8" />
        <rect x="238" y="57" width="30" height="2" fill="#C4B8A8" />

        <rect x="296" y="42" width="42" height="28" fill="#E8F5E9" />
        <rect x="298" y="45" width="34" height="2" fill="#C8E6C9" />
        <rect x="298" y="49" width="28" height="2" fill="#C8E6C9" />
        <rect x="298" y="53" width="30" height="2" fill="#C8E6C9" />

        <rect x="346" y="42" width="18" height="18" fill="#FFF9C4" />
        <text x="355" y="54" textAnchor="middle" fontSize="10">⭐</text>

        <rect x="236" y="76" width="72" height="34" fill="#F3E5F5" />
        <rect x="238" y="79" width="60" height="2" fill="#D1C4E9" />
        <rect x="238" y="83" width="50" height="2" fill="#D1C4E9" />
        <rect x="238" y="87" width="55" height="2" fill="#D1C4E9" />
        <rect x="238" y="91" width="45" height="2" fill="#D1C4E9" />

        <rect x="318" y="76" width="50" height="30" fill="#F5F0E8" />
        <rect x="322" y="80" width="42" height="22" fill="#FDF8F0" />
        <text 
          x="343" 
          y="95" 
          textAnchor="middle" 
          fontSize="11" 
          fill={timerMode === "study" ? "#2A5A40" : "#2A4A6A"} 
          fontFamily="monospace"
        >
          {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </text>

        <rect x="0" y="193" width="600" height="145" fill="#C9965C" />
        {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540].map((fx, i) => (
          <rect key={i} x={fx} y="193" width="60" height="145" fill={i % 2 === 0 ? "#C9965C" : "#C08B52"} />
        ))}
        <rect x="0" y="193" width="600" height="4" fill="#A07040" opacity="0.7" />
        {[193, 233, 273, 313].map((fy) => <rect key={fy} x="0" y={fy} width="600" height="1" fill="#A07040" opacity="0.3" />)}

        <rect x="258" y="145" width="84" height="150" fill="#B8A882" opacity="0.35" />
        <rect x="260" y="145" width="80" height="150" fill="#C8B892" opacity="0.15" />

        <rect x="22" y="147" width="238" height="8" fill="#A87848" />
        <rect x="22" y="147" width="238" height="3" fill="#C09060" />
        <rect x="22" y="155" width="238" height="12" fill="#8B6340" />
        <rect x="22" y="167" width="10" height="16" fill="#7A5530" />
        <rect x="250" y="167" width="10" height="16" fill="#6B4520" />
        <rect x="340" y="147" width="238" height="8" fill="#A87848" />
        <rect x="340" y="147" width="238" height="3" fill="#C09060" />
        <rect x="340" y="155" width="238" height="12" fill="#8B6340" />
        <rect x="340" y="167" width="10" height="16" fill="#7A5530" />
        <rect x="568" y="167" width="10" height="16" fill="#6B4520" />
        {ALL_SEATS.slice(0, 10).map((s, i) => renderSeat(s, i))}

        <rect x="22" y="190" width="238" height="8" fill="#A87848" />
        <rect x="22" y="190" width="238" height="3" fill="#C09060" />
        <rect x="22" y="198" width="238" height="12" fill="#8B6340" />
        <rect x="22" y="210" width="10" height="16" fill="#7A5530" />
        <rect x="250" y="210" width="10" height="16" fill="#6B4520" />
        <rect x="340" y="190" width="238" height="8" fill="#A87848" />
        <rect x="340" y="190" width="238" height="3" fill="#C09060" />
        <rect x="340" y="198" width="238" height="12" fill="#8B6340" />
        <rect x="340" y="210" width="10" height="16" fill="#7A5530" />
        <rect x="568" y="210" width="10" height="16" fill="#6B4520" />
        {ALL_SEATS.slice(10, 20).map((s, i) => renderSeat(s, i + 10))}

        <rect x="22" y="232" width="174" height="8" fill="#A87848" />
        <rect x="22" y="232" width="174" height="3" fill="#C09060" />
        <rect x="22" y="240" width="174" height="12" fill="#8B6340" />
        <rect x="22" y="252" width="10" height="16" fill="#7A5530" />
        <rect x="186" y="252" width="10" height="16" fill="#6B4520" />
        <rect x="404" y="232" width="174" height="8" fill="#A87848" />
        <rect x="404" y="232" width="174" height="3" fill="#C09060" />
        <rect x="404" y="240" width="174" height="12" fill="#8B6340" />
        <rect x="404" y="252" width="10" height="16" fill="#7A5530" />
        <rect x="568" y="252" width="10" height="16" fill="#6B4520" />
        {ALL_SEATS.slice(20, 25).map((s, i) => renderSeat(s, i + 20))}

        <rect x="224" y="260" width="152" height="10" fill="#A87848" />
        <rect x="224" y="260" width="152" height="3" fill="#C09060" />
        <rect x="224" y="270" width="152" height="18" fill="#8B6340" />
        <rect x="352" y="250" width="16" height="10" fill="#C4956A" />
        <rect x="356" y="244" width="3" height="8" fill="#A07040" />
        <rect x="348" y="240" width="18" height="6" fill="#F0C060" />
        {isActive && <ellipse cx="357" cy="256" rx="14" ry="7" fill="#FFF5CC" opacity="0.3" />}
        <rect x="276" y="236" width="10" height="5" fill="#8B7355" />
        <rect x="276" y="241" width="10" height="10" fill="#9D7450" />
        <rect x="275" y="251" width="12" height="9" fill="#6B8F6B" />
        <rect x="273" y="256" width="5" height="3" fill="#F0D5B0" />
        <rect x="283" y="256" width="5" height="3" fill="#F0D5B0" />

        <rect x="0" y="272" width="22" height="24" fill="#C9965C" />
        <rect x="4" y="252" width="3" height="22" fill="#5D8A4E" />
        <rect x="0" y="244" width="16" height="12" fill="#6DAA5A" />
        <rect x="6" y="236" width="12" height="10" fill="#7ABD65" />
        <rect x="10" y="228" width="8" height="10" fill="#8AC870" />
        <rect x="14" y="240" width="10" height="8" fill="#6DAA5A" />
        <rect x="578" y="272" width="22" height="24" fill="#C9965C" />
        <rect x="595" y="252" width="3" height="22" fill="#5D8A4E" />
        <rect x="584" y="244" width="16" height="12" fill="#6DAA5A" />
        <rect x="582" y="236" width="12" height="10" fill="#7ABD65" />
        <rect x="580" y="228" width="8" height="10" fill="#8AC870" />
        <rect x="576" y="240" width="10" height="8" fill="#6DAA5A" />

        <rect x="236" y="137" width="128" height="9" fill="#4A3728" opacity="0.85" rx="2" />
        <text x="300" y="144" textAnchor="middle" fontSize="6" fill="#F5E6C8" fontFamily="'Press Start 2P', monospace">
          {(mySeatId !== null ? 1 : 0)}/25 {t.studyingCount}
        </text>

        {isActive && <rect width="600" height="338" fill="url(#warmGlow)" opacity="0.06" />}
        <defs>
          <radialGradient id="warmGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF5CC" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

function SessionCard({ session, index }) {
  const palette = [
    { bg: "#E8F5E9", bd: "#81C784", dot: "#4CAF50" },
    { bg: "#E3F2FD", bd: "#64B5F6", dot: "#2196F3" },
    { bg: "#FFF3E0", bd: "#FFB74D", dot: "#FF9800" },
    { bg: "#F3E5F5", bd: "#CE93D8", dot: "#9C27B0" },
    { bg: "#E0F7FA", bd: "#4DD0E1", dot: "#00BCD4" },
  ]
  const c = palette[index % palette.length]
  const time = new Date(session.completed_at || session.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-transform hover:scale-[1.01]" style={{ backgroundColor: c.bg, border: `2px solid ${c.bd}` }}>
      <div className="w-2.5 h-2.5 shrink-0 rounded-sm" style={{ backgroundColor: c.dot }} />
      <div className="flex-1 min-w-0">
        <div className="text-xs sm:text-sm font-bold text-stone-700 truncate">{session.subject}</div>
        <div className="text-[10px] sm:text-xs text-stone-500 font-semibold">{session.duration} min</div>
      </div>
      <div className="text-[10px] sm:text-xs text-stone-400 font-semibold shrink-0">{time}</div>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("app_lang") || "tr");
  const t = translations[lang] || translations.tr;

  const toggleLanguage = () => {
    const nextLang = lang === "tr" ? "en" : "tr";
    setLang(nextLang);
    localStorage.setItem("app_lang", nextLang);
  };

  const [activeTab, setActiveTab] = useState("room");

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [mySeatId, setMySeatId] = useState(null)

  const [timerState, setTimerState] = useState("idle")
  const [timerMode, setTimerMode] = useState("study")
  const [studyDuration, setStudyDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [targetEndTime, setTargetEndTime] = useState(null)
  const [subject, setSubject] = useState("")
  const [sessions, setSessions] = useState([])
  
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [streak] = useState(1)

  useEffect(() => {
    const savedUser = localStorage.getItem("study_username");
    if (savedUser) {
      setUserName(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!userName) return;

    const leaveRoom = async () => {
      try {
        await turso.execute({
          sql: "DELETE FROM online_users WHERE username = ?",
          args: [String(userName)]
        });
      } catch (err) {
        console.error("Çıkış temizleme hatası:", err);
      }
    };

    window.addEventListener("pagehide", leaveRoom);
    return () => {
      window.removeEventListener("beforeunload", leaveRoom);
      leaveRoom();
    };
  }, [userName]);

  const [occupiedSeats, setOccupiedSeats] = useState({});

  useEffect(() => {
    let timer = null;
    if (timerState === "running" && targetEndTime) {
      timer = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((targetEndTime - now) / 1000));
        setSecondsLeft(diff);

        if (diff <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerState, targetEndTime]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && timerState === "running" && targetEndTime) {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((targetEndTime - now) / 1000));
        setSecondsLeft(diff);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [timerState, targetEndTime]);

  useEffect(() => {
    if (!isLoggedIn || !userName) return;

    const fetchOccupied = async () => {
      try {
        const res = await turso.execute({
          sql: "SELECT username, seat_id, timer_seconds, timer_running, timer_mode, target_end_time FROM online_users",
          args: []
        });
        const data = res.rows || [];

        const seatsMap = {};
        data.forEach((user) => {
          if (user.username !== userName) {
            seatsMap[user.seat_id] = user;
          }
        });

        const myCurrentSeat = data.find((user) => user.username === userName);
        if (myCurrentSeat) {
          if (mySeatId === null) {
            setMySeatId(myCurrentSeat.seat_id);
            if (myCurrentSeat.target_end_time && myCurrentSeat.timer_running) {
              const endMs = new Date(myCurrentSeat.target_end_time).getTime();
              if (endMs > Date.now()) {
                setTargetEndTime(endMs);
                setSecondsLeft(Math.max(0, Math.floor((endMs - Date.now()) / 1000)));
                setTimerState("running");
              }
            }
            if (myCurrentSeat.timer_mode) {
              setTimerMode(myCurrentSeat.timer_mode);
            }
          }

          if (mySeatId !== null) {
            seatsMap[mySeatId] = {
              username: userName,
              timer_running: timerState === "running",
              timer_seconds: secondsLeft,
              timer_mode: timerMode,
              target_end_time: targetEndTime ? new Date(targetEndTime).toISOString() : null
            };
          }
        }

        setOccupiedSeats(seatsMap);
      } catch (err) {
        console.error("Online kullanıcıları çekme hatası:", err);
      }
    };

    fetchOccupied();
    const pollInterval = setInterval(fetchOccupied, 3000);
    return () => clearInterval(pollInterval);
  }, [isLoggedIn, userName, mySeatId, timerState, secondsLeft, targetEndTime, timerMode]);

  useEffect(() => {
    if (!userName || mySeatId === null) return;

    const updateMyTimer = async () => {
      try {
        const endIso = targetEndTime ? new Date(targetEndTime).toISOString() : "";
        await turso.execute({
          sql: `UPDATE online_users 
                SET timer_seconds = ?, timer_running = ?, timer_mode = ?, target_end_time = ?, updated_at = CURRENT_TIMESTAMP
                WHERE username = ?`,
          args: [
            Number(secondsLeft) || 0,
            timerState === "running" ? 1 : 0,
            String(timerMode || "study"),
            endIso,
            String(userName)
          ]
        });
      } catch (err) {
        console.error("Timer güncelleme hatası:", err);
      }
    };

    updateMyTimer();
  }, [secondsLeft, timerState, timerMode, targetEndTime, userName, mySeatId]);

  const fetchSessions = async (name) => {
    if (!name) return;
    try {
      const res = await turso.execute({
        sql: "SELECT * FROM study_sessions WHERE username = ? ORDER BY created_at DESC",
        args: [name]
      });
      setSessions(res.rows || []);
    } catch (err) {
      console.error("Seansları çekme hatası:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await turso.execute({
        sql: "SELECT * FROM study_messages ORDER BY created_at DESC LIMIT 20",
        args: []
      });
      setMessages([...(res.rows || [])].reverse());
    } catch (err) {
      console.error("Mesajları çekme hatası:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userName) {
      fetchSessions(userName);
      fetchMessages();
      const msgInterval = setInterval(fetchMessages, 3000);
      return () => clearInterval(msgInterval);
    }
  }, [isLoggedIn, userName]);

  const studySessions = sessions.filter(s => s.type === 'study' || !s.type);

  const totalMinToday = studySessions
    .filter((s) => new Date(s.created_at || s.completed_at) > new Date(Date.now() - 86400000))
    .reduce((acc, s) => acc + (Number(s.duration) || 0), 0);

  const chartData = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    return t.daysShort.map((dayLabel, i) => {
      const targetDayStart = new Date(monday);
      targetDayStart.setDate(monday.getDate() + i);
      targetDayStart.setHours(0, 0, 0, 0);

      const targetDayEnd = new Date(targetDayStart);
      targetDayEnd.setHours(23, 59, 59, 999);

      const start = targetDayStart.getTime();
      const end = targetDayEnd.getTime();

      const daySessions = studySessions.filter((s) => {
        const rawDate = s.completed_at || s.created_at;
        if (!rawDate) return false;
        const timeMs = new Date(rawDate).getTime();
        return timeMs >= start && timeMs <= end;
      });

      return {
        day: dayLabel,
        minutes: daySessions.reduce((acc, s) => acc + (Number(s.duration) || 0), 0)
      };
    });
  }, [studySessions, t.daysShort]);

  const completedSessions = studySessions.length;
  const pad = (n) => String(n).padStart(2, "0");
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const isCompletingRef = useRef(false);

  const handleComplete = useCallback(async () => {
    if (timerState !== "running" || isCompletingRef.current) return;
    isCompletingRef.current = true;

    setTimerState("idle");
    setTargetEndTime(null);

    const isStudyMode = timerMode === "study";

    if (isStudyMode) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const dur = Number(studyDuration) || 1;
      const sub = subject.trim() || (lang === "tr" ? "Odak Seansı" : "Focus session");
      const nowIso = new Date().toISOString();
      const todayDate = nowIso.split("T")[0];

      try {
        await turso.execute({
          sql: `INSERT INTO study_sessions (username, subject, duration, type, seat_id, completed_at, status) 
                VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
          args: [userName, sub, dur, "study", mySeatId, nowIso]
        });

        await turso.execute({
          sql: `INSERT INTO daily_study_stats (username, study_date, total_duration)
                VALUES (?, ?, ?)
                ON CONFLICT(username, study_date) DO UPDATE SET
                  total_duration = total_duration + excluded.total_duration,
                  updated_at = CURRENT_TIMESTAMP`,
          args: [userName, todayDate, dur]
        });

        setSessions((prev) => [{
          username: userName,
          subject: sub,
          duration: dur,
          type: "study",
          seat_id: mySeatId,
          completed_at: nowIso,
          created_at: nowIso
        }, ...prev]);
      } catch (err) {
        console.error("Seans kaydetme hatası:", err);
      }

      setTimerMode("break");
      setSecondsLeft((Number(breakDuration) || 5) * 60);
    } else {
      setTimerMode("study");
      setSecondsLeft((Number(studyDuration) || 25) * 60);
    }

    setTimeout(() => {
      isCompletingRef.current = false;
    }, 2000);
  }, [timerMode, studyDuration, breakDuration, subject, userName, mySeatId, timerState, lang]);

  useEffect(() => {
    if (secondsLeft <= 0 && timerState === "running" && !isCompletingRef.current) {
      handleComplete();
    }
  }, [secondsLeft, timerState, handleComplete]);

  useEffect(() => {
    if (timerState === "idle") {
      const activeDuration = timerMode === "study" 
        ? (Number(studyDuration) || 1) 
        : (Number(breakDuration) || 1);
      setSecondsLeft(activeDuration * 60);
      setTargetEndTime(null);
    }
  }, [studyDuration, breakDuration, timerMode, timerState]);

  const handleSeatClick = async (index) => {
    if (timerState === "running") {
      alert(t.changeSeatWarn);
      return;
    }

    if (mySeatId === index) return;

    try {
      // 1. Koltukta şu an başkası var mı kontrol et
      const checkSeat = await turso.execute({
        sql: "SELECT username FROM online_users WHERE seat_id = ? AND username != ? LIMIT 1",
        args: [Number(index), String(userName)]
      });

      if (checkSeat.rows && checkSeat.rows.length > 0) {
        alert(t.seatOccupied);
        return;
      }

      // 2. Kullanıcının eski koltuk kaydını temizle
      await turso.execute({
        sql: "DELETE FROM online_users WHERE username = ?",
        args: [String(userName)]
      });

      // 3. ID olarak doğrudan kullanıcı adını kullan (Böylece kullanıcı başına tek kayıt garantilenir)
      const uniqueId = `user_${String(userName)}`;
      const nowIso = new Date().toISOString();
      const endIso = targetEndTime ? new Date(targetEndTime).toISOString() : "";

      // 4. INSERT OR REPLACE kullanarak UNIQUE hatasını tamamen engelle
      await turso.execute({
        sql: `INSERT OR REPLACE INTO online_users (
                id, username, seat_id, timer_seconds, timer_running, 
                timer_mode, target_end_time, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          uniqueId,
          String(userName),
          Number(index),
          Number(secondsLeft) || 0,
          timerState === "running" ? 1 : 0,
          String(timerMode || "study"),
          endIso,
          nowIso
        ]
      });

      setMySeatId(index);
    } catch (err) {
      console.error("Koltuk seçilemedi:", err);
      alert("Koltuk seçilemedi: " + (err.message || ""));
    }
  };

  const handleStart = () => {
    if (mySeatId === null) {
      alert(t.selectSeatWarn);
      return;
    }

    if (studyDuration === "" || Number(studyDuration) < 1) setStudyDuration(1);
    if (breakDuration === "" || Number(breakDuration) < 1) setBreakDuration(1);

    if (timerState === "idle" || timerState === "paused") {
      const endTime = Date.now() + secondsLeft * 1000;
      setTargetEndTime(endTime);
      setTimerState("running");
    } else {
      setTimerState("paused");
      setTargetEndTime(null);
    }
  };
  
  const handleReset = () => {
    setTimerState("idle");
    setTimerMode("study");
    setSecondsLeft((Number(studyDuration) || 25) * 60);
    setTargetEndTime(null);
  };

  const handleEarlyFinish = async () => {
    if (timerMode !== "study") {
      handleReset();
      return;
    }

    const totalSeconds = (Number(studyDuration) || 25) * 60;
    const elapsedSeconds = totalSeconds - secondsLeft;
    const workedMinutes = Math.floor(elapsedSeconds / 60);

    if (workedMinutes < 1) {
      if (confirm(t.earlyFinishUnder1Min)) {
        handleReset();
      }
      return;
    }

    if (confirm(`${workedMinutes} ${t.earlyFinishConfirm}`)) {
      const sub = subject.trim() || (lang === "tr" ? "Odak Seansı" : "Focus session");
      const nowIso = new Date().toISOString();
      const todayDate = nowIso.split("T")[0];

      try {
        await turso.execute({
          sql: `INSERT INTO study_sessions (username, subject, duration, type, seat_id, completed_at, status) 
                VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
          args: [userName, sub, workedMinutes, "study", mySeatId, nowIso]
        });

        await turso.execute({
          sql: `INSERT INTO daily_study_stats (username, study_date, total_duration)
                VALUES (?, ?, ?)
                ON CONFLICT(username, study_date) DO UPDATE SET
                  total_duration = total_duration + excluded.total_duration,
                  updated_at = CURRENT_TIMESTAMP`,
          args: [userName, todayDate, workedMinutes]
        });

        setSessions((prev) => [{
          username: userName,
          subject: sub,
          duration: workedMinutes,
          type: "study",
          seat_id: mySeatId,
          completed_at: nowIso,
          created_at: nowIso
        }, ...prev]);

        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch (err) {
        console.error("Erken bitirme hatası:", err);
      }

      handleReset();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      const userShortName = email.split("@")[0];
      setUserName(userShortName);
      setIsLoggedIn(true);
      localStorage.setItem("study_username", userShortName);
    } catch (err) {
      alert("Giriş hatası: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (userName) {
      try {
        await turso.execute({
          sql: "DELETE FROM online_users WHERE username = ?",
          args: [String(userName)]
        });
      } catch (err) {
        console.error(err);
      }
    }

    localStorage.removeItem("study_username");
    setMySeatId(null);
    setUserName("");
    setIsLoggedIn(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isActive) {
      alert(t.chatFocusWarn);
      return;
    }
    if (!chatInput.trim()) return;

    const msgText = chatInput.trim().slice(0, 30); 

    try {
      await turso.execute({
        sql: "INSERT INTO study_messages (username, message) VALUES (?, ?)",
        args: [userName, msgText]
      });
      setChatInput("");
      fetchMessages();
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    }
  };

  const isActive = timerState === "running"
  const modeColor = timerMode === "study" ? "#6B9E78" : "#7EA8C4"
  const totalOccupancy = Object.keys(occupiedSeats).length;
  const occupancyLabel = totalOccupancy > 0 ? t.studyingStatus : t.emptyRoomStatus;
  const occupancyColor = totalOccupancy > 0 ? "#81C784" : "#64B5F6"

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center scanline px-4" style={{ background: "#F2EDE3" }}>
        <form onSubmit={handleLogin} className="pixel-border bg-[#FDFAF5] p-6 sm:p-8 max-w-sm w-full flex flex-col items-center gap-5 sm:gap-6" style={{ border: "4px solid #4A3728", boxShadow: "6px 6px 0 #2a1f14" }}>
          <h1 className="text-lg sm:text-xl text-center" style={{ fontFamily: 'var(--font-pixel)', color: "#4A3728" }}>
            {t.joinRoom}
          </h1>
          <p className="text-center text-xs sm:text-sm font-semibold whitespace-pre-line" style={{ color: "#7A6A58" }}>
            {t.loginDesc}
          </p>
          <input 
            type="email" 
            placeholder="ornek@email.com" 
            className="w-full p-2.5 sm:p-3 bg-[#F5F0E8] outline-none focus:bg-white text-center font-bold text-sm"
            style={{ border: "2px solid #C4B8A8" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password" 
            placeholder="******" 
            className="w-full p-2.5 sm:p-3 bg-[#F5F0E8] outline-none focus:bg-white text-center font-bold text-sm"
            style={{ border: "2px solid #C4B8A8" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="pixel-btn w-full text-white py-3 font-bold" 
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', background: "#6B9E78", borderTop: "3px solid #8BB898", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? t.loggingIn : t.loginBtn}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: "#F2EDE3", fontFamily: "'Nunito', sans-serif" }}>
      {/* ─── EN ÜST SEKME MENÜSÜ VE DİL DEĞİŞTİRİCİ ───────────────────────────── */}
      <div className="w-full bg-[#EDE5D5] border-b-2 border-[#D8CEB8] px-3 sm:px-5 flex items-center justify-between">
        <div className="flex gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab("room")}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 font-bold transition-all ${
              activeTab === "room"
                ? "bg-[#FDFAF5] text-[#2A5A40] border-t-4 border-[#2A5A40]"
                : "text-stone-600 hover:text-stone-900"
            }`}
            style={{ fontFamily: "'Press Start 2P'", fontSize: "7px" }}
          >
            {t.roomTab}
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 font-bold transition-all ${
              activeTab === "stats"
                ? "bg-[#FDFAF5] text-[#2A5A40] border-t-4 border-[#2A5A40]"
                : "text-stone-600 hover:text-stone-900"
            }`}
            style={{ fontFamily: "'Press Start 2P'", fontSize: "7px" }}
          >
            {t.statsTab}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 py-2">
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 text-[7px] font-bold rounded bg-[#FDFAF5] border-2 border-[#4A3728] text-[#4A3728] hover:bg-[#F2EDE3] transition-all"
            style={{ fontFamily: "'Press Start 2P'" }}
            title="Dili Değiştir / Change Language"
          >
            🌐 {lang.toUpperCase()}
          </button>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#81C784]"></span>
            <span className="text-[7px] font-bold text-stone-600 truncate max-w-[100px] sm:max-w-none" style={{ fontFamily: "'Press Start 2P'" }}>
              {t.currentLocation}
            </span>
          </div>
        </div>
      </div>

      {/* HEADER BİLGİ ŞERİDİ */}
      <header className="w-full border-b-4 border-stone-800" style={{ background: "#FDFAF5" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10" style={{ imageRendering: "pixelated" }}>
              <svg viewBox="0 0 32 32" width="100%" height="100%">
                <rect width="32" height="32" fill="#8BAD6E" />
                <rect x="8" y="10" width="16" height="12" fill="#FDFAF5" />
                <rect x="8" y="10" width="2" height="12" fill="#C4956A" />
                <rect x="10" y="12" width="12" height="2" fill="#C8D8C0" />
                <rect x="10" y="16" width="10" height="2" fill="#C8D8C0" />
                <rect x="10" y="20" width="8" height="2" fill="#C8D8C0" />
                <rect x="22" y="6" width="4" height="4" fill="#FFD770" />
                <rect x="20" y="8" width="8" height="2" fill="#FFD770" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: 11, color: "#3D3028", lineHeight: 1 }}>StudyQuest</h1>
              <p className="text-stone-500 text-[11px] font-semibold mt-1">{t.welcome}, {userName}!</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg hidden lg:block text-center px-4">
            <p className="text-xs font-semibold text-stone-700 italic">
              {t.ataturkQuote}
            </p>
            <p className="text-[10px] font-bold text-amber-800 mt-0.5">
              {t.ataturkAuthor}
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2" style={{ background: "#F0FBF4", borderColor: occupancyColor }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: occupancyColor, boxShadow: `0 0 5px ${occupancyColor}` }} />
              <div>
                <div className="text-[10px] font-bold leading-none" style={{ color: occupancyColor }}>{occupancyLabel}</div>
                <div className="text-[10px] text-stone-500 font-semibold">{totalOccupancy}/25</div>
              </div>
            </div>
            <div className="text-center px-2.5 py-1 rounded-lg bg-amber-50 border-2 border-amber-300">
              <div className="text-[10px] text-amber-600 font-bold">🔥 {t.streak}</div>
              <div className="text-sm sm:text-base font-extrabold text-amber-700 leading-none">{streak}</div>
            </div>
            <div className="text-center px-2.5 py-1 rounded-lg border-2 border-green-300" style={{ backgroundColor: "#EEF5E8" }}>
              <div className="text-[10px] text-green-700 font-bold">{t.today}</div>
              <div className="text-sm sm:text-base font-extrabold text-green-800 leading-none">{totalMinToday}m</div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── ANA ALAN: ODA VEYA İSTATİSTİKLER ───────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {activeTab === "room" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 sm:gap-5">
            <div className="flex flex-col gap-4 sm:gap-5 min-w-0">
              {/* ODA GÖRSELİ */}
              <div className="rounded-lg overflow-hidden" style={{ border: "4px solid #4A3728", boxShadow: "4px 4px 0 #2a1f14" }}>
                <div className="px-3 py-2 flex items-center justify-between" style={{ background: "#4A3728" }}>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: "#F5E6C8" }}>{t.communityHall}</span>
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span style={{ fontFamily: "'Press Start 2P'", fontSize: 6.5, color: "#7EC8A4", animation: "float 2s ease-in-out infinite" }}>{t.focusMode}</span>
                    )}
                    <div className="flex gap-1">
                      {["#FF6B6B", "#FFD93D", "#6BCB77"].map((c) => (
                        <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </div>
                <StudyHall 
                  isActive={isActive} 
                  userName={userName} 
                  mySeatId={mySeatId} 
                  minutes={minutes} 
                  secs={secs} 
                  timerMode={timerMode}
                  occupiedSeats={occupiedSeats}
                  onSeatClick={handleSeatClick}
                  timerState={timerState}
                  t={t}
                />
              </div>

              {/* POMODORO SAYACI */}
              <div className="rounded-lg overflow-hidden" style={{ border: "4px solid #4A3728", boxShadow: "4px 4px 0 #2a1f14", background: "#FDFAF5" }}>
                <div className="px-3.5 py-2" style={{ background: "#4A3728" }}>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7.5, color: "#F5E6C8" }}>{t.pomodoroTimer}</span>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex gap-2 mb-4">
                    {(["study", "break"]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          if (timerState === "idle") {
                            setTimerMode(mode)
                            setSecondsLeft((mode === "study" ? Number(studyDuration) || 25 : Number(breakDuration) || 5) * 60)
                          }
                        }}
                        className="flex-1 py-2 sm:py-2.5 rounded transition-all font-bold"
                        style={{
                          fontFamily: "'Press Start 2P'", fontSize: 7,
                          background: timerMode === mode ? (mode === "study" ? "#6B9E78" : "#7EA8C4") : "#E8E0D4",
                          color: timerMode === mode ? "#fff" : "#7A6A58",
                          border: `3px solid ${timerMode === mode ? "#4A6E54" : "#C4B8A8"}`,
                          cursor: timerState !== "idle" ? "not-allowed" : "pointer",
                          opacity: timerState !== "idle" && timerMode !== mode ? 0.45 : 1,
                        }}
                      >
                        {mode === "study" ? t.studyBtn : t.breakBtn}
                      </button>
                    ))}
                  </div>

                  {/* SAYAÇ GÖSTERGESİ */}
                  <div className="relative flex items-center justify-center py-5 sm:py-7 mb-4 rounded-lg scanline overflow-hidden" style={{ background: "#1A2822", border: "4px solid #0E1A14", boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)" }}>
                    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${timerMode === "study" ? "rgba(107,158,120,0.15)" : "rgba(126,168,196,0.15)"} 0%, transparent 70%)` }} />
                    <div className="relative z-10 tabular-nums text-6xl sm:text-8xl tracking-wider" style={{ fontFamily: "'VT323'", lineHeight: 1, color: timerMode === "study" ? "#7EC8A4" : "#7EB8D4", textShadow: `0 0 20px ${timerMode === "study" ? "rgba(126,200,164,0.6)" : "rgba(126,184,212,0.6)"}` }}>
                      {pad(minutes)}<span className={isActive ? "blink" : ""}>:</span>{pad(secs)}
                    </div>
                  </div>

                  <div className="mb-3.5">
                    <label className="block mb-1 text-stone-600" style={{ fontFamily: "'Press Start 2P'", fontSize: 6.5 }}>{t.whatStudying}</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={t.studyingPlaceholder}
                      className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-stone-700 rounded outline-none transition-all"
                      style={{ background: "#F5F0E8", border: "2px solid #C4B8A8" }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {[
                      { label: t.studyMin, value: studyDuration, setter: setStudyDuration, min: 1, max: 1440 },
                      { label: t.breakMin, value: breakDuration, setter: setBreakDuration, min: 1, max: 1440 },
                    ].map(({ label, value, setter, min, max }) => (
                      <div key={label}>
                        <label className="block mb-1 text-stone-500 truncate" style={{ fontFamily: "'Press Start 2P'", fontSize: 6 }}>{label}</label>
                        <div className="flex items-center overflow-hidden" style={{ border: "2px solid #C4B8A8", borderRadius: 6, background: "#F5F0E8" }}>
                          <button 
                            onClick={() => {
                              const cur = Number(value) || min;
                              setter(Math.max(min, cur - 1));
                            }} 
                            disabled={timerState !== "idle"} 
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-lg font-bold text-stone-600 hover:bg-stone-200 transition-colors shrink-0"
                          >
                            −
                          </button>
                          <input 
                            type="number" 
                            value={value} 
                            min={min} 
                            max={max} 
                            onChange={(e) => {
                              const valStr = e.target.value;
                              if (valStr === "") {
                                setter("");
                                return;
                              }
                              const num = parseInt(valStr, 10);
                              if (!isNaN(num)) {
                                setter(Math.min(max, Math.max(0, num)));
                              }
                            }} 
                            onBlur={() => {
                              if (value === "" || Number(value) < min) {
                                setter(min);
                              }
                            }}
                            disabled={timerState !== "idle"} 
                            className="flex-1 text-center font-bold text-stone-800 bg-transparent outline-none w-0" 
                            style={{ fontFamily: "'VT323'", fontSize: 24 }} 
                          />
                          <button 
                            onClick={() => {
                              const cur = Number(value) || 0;
                              setter(Math.min(max, cur + 1));
                            }} 
                            disabled={timerState !== "idle"} 
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-lg font-bold text-stone-600 hover:bg-stone-200 transition-colors shrink-0"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleStart}
                      className="flex-1 py-2.5 sm:py-3 rounded font-bold text-white pixel-btn"
                      style={{
                        fontFamily: "'Press Start 2P'",
                        fontSize: 7.5,
                        background: timerState === "running" ? "#E07050" : modeColor,
                        borderTop: `3px solid ${timerState === "running" ? "#F08070" : timerMode === "study" ? "#8BB898" : "#9EC4D8"}`
                      }}
                    >
                      {timerState === "running" ? t.pause : timerState === "paused" ? t.resume : t.start}
                    </button>

                    <button
                      onClick={handleEarlyFinish}
                      disabled={timerState === "idle"}
                      className="px-2.5 sm:px-3 py-2.5 sm:py-3 rounded font-bold text-stone-800 pixel-btn"
                      style={{
                        fontFamily: "'Press Start 2P'",
                        fontSize: 7.5,
                        background: timerState === "idle" ? "#E8E0D4" : "#F5D0A9",
                        borderTop: `3px solid ${timerState === "idle" ? "#D8CEB8" : "#FFE0C0"}`,
                        cursor: timerState === "idle" ? "not-allowed" : "pointer",
                        opacity: timerState === "idle" ? 0.45 : 1
                      }}
                      title="Çalışılan süreyi kaydet ve bitir"
                    >
                      {t.finish}
                    </button>

                    <button
                      onClick={handleReset}
                      className="px-2.5 sm:px-3 py-2.5 sm:py-3 rounded font-bold text-stone-700 pixel-btn"
                      style={{ fontFamily: "'Press Start 2P'", fontSize: 7.5, background: "#E8DFD0", borderTop: "3px solid #F5ECE0" }}
                    >
                      {t.reset}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ PANEL / MOBİLDE ALT PANEL */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* ODA SOHBETİ */}
              <div className="rounded-lg overflow-hidden flex flex-col" style={{ border: "4px solid #4A3728", boxShadow: "4px 4px 0 #2a1f14", background: "#FDFAF5", height: "260px" }}>
                <div className="px-3.5 py-2" style={{ background: "#4A3728" }}>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7.5, color: "#F5E6C8" }}>{t.roomChat}</span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-2 text-xs">
                  {messages.length === 0 ? (
                    <div className="text-center text-stone-400 my-auto text-[11px]">{t.noMessages}</div>
                  ) : (
                    messages.map((m, i) => (
                      <div key={m.id || i} className="p-1.5 sm:p-2 rounded bg-[#F5F0E8]" style={{ border: "1px solid #C4B8A8" }}>
                        <span className="font-bold text-amber-800 text-[11px]">{m.username}: </span>
                        <span className="text-stone-700 text-[11px]">{m.message}</span>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendMessage} className="p-2 border-t-2 border-[#C4B8A8] flex gap-2 bg-[#F2EDE3]">
                  <input 
                    type="text"
                    placeholder={isActive ? t.focusChatWarning : t.chatPlaceholder}
                    maxLength={30}
                    value={chatInput}
                    disabled={isActive}
                    onChange={(e) => setChatInput(e.target.value)}
                    className={`flex-1 px-2 py-1 text-xs bg-white outline-none rounded ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ border: "1px solid #C4B8A8" }}
                  />
                  <button 
                    type="submit" 
                    disabled={isActive}
                    className={`px-2.5 py-1 text-white text-xs font-bold rounded ${isActive ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#6B9E78]'}`} 
                    style={{ fontFamily: "'Press Start 2P'", fontSize: "6.5px" }}
                  >
                    {t.send}
                  </button>
                </form>
              </div>

              {/* İSTATİSTİK KARTLARI */}
              <div className="rounded-lg overflow-hidden" style={{ border: "4px solid #4A3728", boxShadow: "4px 4px 0 #2a1f14", background: "#FDFAF5" }}>
                <div className="px-3.5 py-2" style={{ background: "#4A3728" }}>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7.5, color: "#F5E6C8" }}>{t.myStats}</span>
                </div>
                <div className="p-3 sm:p-4 grid grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { label: t.sessionsCount, value: completedSessions, icon: "📚", bg: "#E8F5EC", bd: "#81C784", tx: "#3D7A50" },
                    { label: t.focusMinutes, value: totalMinToday, icon: "⏰", bg: "#FFF8E8", bd: "#FFD080", tx: "#7A6020" },
                    { label: t.streakDays, value: `${streak}d`, icon: "🔥", bg: "#FFF3EC", bd: "#FFB080", tx: "#804030" },
                    { label: "Developed by Emine Bolat",  icon: "⭐", bg: "#F5F0FF", bd: "#C0A0E0", tx: "#604888" },
                  ].map(({ label, value, icon, bg, bd, tx }) => (
                    <div key={label} className="rounded-lg p-2.5 sm:p-3 text-center" style={{ background: bg, border: `2px solid ${bd}` }}>
                      <div className="text-lg sm:text-xl mb-0.5">{icon}</div>
                      <div className="text-lg sm:text-xl font-extrabold leading-none" style={{ color: tx }}>{value}</div>
                      <div className="text-[9.5px] font-semibold mt-0.5 truncate" style={{ color: tx, opacity: 0.75 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HAFTALIK GRAFİK */}
              <div className="rounded-lg overflow-hidden" style={{ border: "4px solid #4A3728", boxShadow: "4px 4px 0 #2a1f14", background: "#FDFAF5" }}>
                <div className="px-3.5 py-2" style={{ background: "#4A3728" }}>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7.5, color: "#F5E6C8" }}>{t.weeklyChart}</span>
                </div>
                <div className="p-3 sm:p-4 h-44 sm:h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 16, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3D8C8" />
                      <XAxis dataKey="day" fontSize={8} tickLine={false} axisLine={{ stroke: '#C4B8A8' }} tick={{ fill: '#4A3728', fontFamily: "'Press Start 2P'" }} />
                      <Tooltip contentStyle={{ background: '#FDFAF5', border: '2px solid #4A3728', borderRadius: '4px', fontSize: '11px' }} />
                      <Bar dataKey="minutes" fill="#6B9E78" radius={[2, 2, 0, 0]} label={<CustomBarLabel unit={t.minText} />} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* GEÇMİŞ LİSTESİ */}
              <div className="rounded-lg overflow-hidden" style={{ border: "4px solid #4A3728", boxShadow: "4px 4px 0 #2a1f14", background: "#FDFAF5" }}>
                <div className="px-3.5 py-2 flex items-center justify-between" style={{ background: "#4A3728" }}>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7.5, color: "#F5E6C8" }}>{t.history}</span>
                  <span className="text-[11px] font-bold text-amber-300">{studySessions.length}</span>
                </div>
                <div className="p-2.5 sm:p-3 flex flex-col gap-2 max-h-52 sm:max-h-60 overflow-y-auto">
                  {studySessions.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="text-xl mb-1">📭</div>
                      <div className="text-[11px] text-stone-400 font-semibold">{t.noSessions}</div>
                    </div>
                  ) : (
                    studySessions.map((s, i) => <SessionCard key={s.id || i} session={s} index={i} />)
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <StatsView studySessions={studySessions} t={t} lang={lang} />
        )}
      </main>

      {/* MOBİL VE MASAÜSTÜ UYUMLU ÇIKIŞ BUTONU */}
      <button
        onClick={handleLogout}
        className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 px-3 py-2 sm:px-4 sm:py-3 rounded"
        style={{
          fontFamily: "'Press Start 2P'",
          fontSize: 7,
          background: "#E57373",
          color: "#fff",
          border: "2px solid #B54A4A",
          boxShadow: "3px 3px 0 #7A3030",
          zIndex: 50
        }}
      >
        {t.logout}
      </button>

      <style>{`
        .hover-seat:hover .seat-part {
          fill: #C09060 !important;
        }
        .hover-seat:hover .seat-label {
          opacity: 1 !important;
          transform: translateY(-2px);
        }
        @keyframes sitDown {
          0% { transform: translateY(-20px) scale(1.1); opacity: 0; }
          60% { transform: translateY(2.5px) scale(0.95); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-sit {
          animation: sitDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  )
}