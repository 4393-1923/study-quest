import React, { useState, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from "recharts";

// Sütun tepesinde '2dk' / '2min' etiketini dinamik çizer
const CustomBarLabel = ({ x, y, width, value, unit }) => {
  if (!value || value <= 0) return null;

  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="#4A3728"
      textAnchor="middle"
      fontSize={8}
      fontFamily="'Press Start 2P', monospace"
    >
      {`${value}${unit}`}
    </text>
  );
};

export default function StatsView({ studySessions = [], t, lang = "tr" }) {
  const [weekOffset, setWeekOffset] = useState(0); // 0: Bu hafta / This week, -1: Geçen hafta / Last week

  const locale = lang === "tr" ? "tr-TR" : "en-US";
  const unitText = t?.minText || (lang === "tr" ? "dk" : "min");

  // Seçili haftanın Pazartesi (00:00:00) ve Pazar (23:59:59) sınırları
  const weekBounds = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0: Paz, 1: Pzt...
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + (weekOffset * 7));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const label = `${monday.toLocaleDateString(locale, { day: "numeric", month: "short" })} - ${sunday.toLocaleDateString(locale, { day: "numeric", month: "short" })}`;

    return {
      startMs: monday.getTime(),
      endMs: sunday.getTime(),
      mondayDate: monday,
      label
    };
  }, [weekOffset, locale]);

  // Gün etiketlerini dile göre dinamik al (PZT/MON, SAL/TUE ...)
  const labels = useMemo(() => {
    return t?.daysShort || (lang === "tr" 
      ? ["PZT", "SAL", "ÇAR", "PER", "CUM", "CTS", "PAZ"]
      : ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    );
  }, [t, lang]);

  // Seansları seçili haftanın günlerine dağıt
  const chartData = useMemo(() => {
    return labels.map((day, i) => {
      const targetDayStart = new Date(weekBounds.mondayDate);
      targetDayStart.setDate(weekBounds.mondayDate.getDate() + i);
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

      const totalMins = daySessions.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);
      return {
        day,
        minutes: totalMins
      };
    });
  }, [studySessions, weekBounds, labels]);

  const totalMinutes = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.minutes, 0);
  }, [chartData]);

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const maxDay = useMemo(() => {
    return chartData.reduce(
      (max, cur) => (cur.minutes > max.minutes ? cur : max),
      { day: "-", minutes: 0 }
    );
  }, [chartData]);

  return (
    <div className="w-full flex flex-col gap-6 select-none animate-fadeIn">
      {/* BAŞLIK */}
      <div>
        <p className="text-[9px] text-[#4A6E54] font-bold tracking-wider mb-2" style={{ fontFamily: "'Press Start 2P'" }}>
          {t?.playerReport || "OYUNCU RAPORU"}
        </p>
        <h2 className="text-2xl font-bold text-[#3D3028]" style={{ fontFamily: "'Press Start 2P'" }}>
          {t?.focusJourney || "Odak yolculuğun"}
        </h2>
        <p className="text-sm font-semibold text-stone-500 mt-1">
          {t?.journeySub || "Küçük adımlar, büyük bir serüvene dönüşür."}
        </p>
      </div>

      {/* 4 ÖZET KART */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BU HAFTA / SEÇİLİ HAFTA */}
        <div className="bg-[#FDFAF5] p-5 rounded border-2 border-[#4A3728] shadow-[3px_3px_0_#2a1f14]">
          <span className="text-[7px] text-[#4A3728] font-bold block mb-3" style={{ fontFamily: "'Press Start 2P'" }}>
            {weekOffset === 0 ? (t?.thisWeek || "BU HAFTA") : (lang === "tr" ? "SEÇİLİ HAFTA" : "SELECTED WEEK")}
          </span>
          <div className="text-2xl font-bold text-[#2A5A40]" style={{ fontFamily: "'VT323'", fontSize: "38px", lineHeight: "1" }}>
            {hours}h {mins}m
          </div>
          <span className="text-[11px] text-stone-400 font-semibold mt-2 block">
            {weekOffset === 0 ? (t?.currentWeekLabel || "BU HAFTA") : weekBounds.label}
          </span>
        </div>

        {/* ODAK SERİSİ */}
        <div className="bg-[#FDFAF5] p-5 rounded border-2 border-[#4A3728] shadow-[3px_3px_0_#2a1f14]">
          <span className="text-[7px] text-[#4A3728] font-bold block mb-3" style={{ fontFamily: "'Press Start 2P'" }}>
            {t?.focusStreakCard || "ODAK SERİSİ"}
          </span>
          <div className="text-2xl font-bold text-[#3D3028]" style={{ fontFamily: "'VT323'", fontSize: "38px", lineHeight: "1" }}>
            {chartData.filter(d => d.minutes > 0).length} {lang === "tr" ? "gün" : "days"}
          </div>
          <span className="text-[11px] text-stone-400 font-semibold mt-2 block">
            {t?.activeDays || "Aktif çalışma günü"}
          </span>
        </div>

        {/* TAMAMLANAN */}
        <div className="bg-[#FDFAF5] p-5 rounded border-2 border-[#4A3728] shadow-[3px_3px_0_#2a1f14]">
          <span className="text-[7px] text-[#4A3728] font-bold block mb-3" style={{ fontFamily: "'Press Start 2P'" }}>
            {t?.completedCard || "TAMAMLANAN"}
          </span>
          <div className="text-2xl font-bold text-[#3D3028]" style={{ fontFamily: "'VT323'", fontSize: "38px", lineHeight: "1" }}>
            {studySessions.length} {t?.sessionText || (lang === "tr" ? "seans" : "sessions")}
          </div>
          <span className="text-[11px] text-stone-400 font-semibold mt-2 block">
            {t?.registeredSessions || "Kayıtlı oturum"}
          </span>
        </div>

        {/* EN İYİ GÜN */}
        <div className="bg-[#FDFAF5] p-5 rounded border-2 border-[#4A3728] shadow-[3px_3px_0_#2a1f14]">
          <span className="text-[7px] text-[#4A3728] font-bold block mb-3" style={{ fontFamily: "'Press Start 2P'" }}>
            {t?.bestDayCard || "EN İYİ GÜN"}
          </span>
          <div className="text-2xl font-bold text-[#2A5A40]" style={{ fontFamily: "'VT323'", fontSize: "38px", lineHeight: "1" }}>
            {maxDay.minutes > 0 ? `${maxDay.minutes}${unitText}` : "-"}
          </div>
          <span className="text-[11px] text-stone-400 font-semibold mt-2 block">
            {maxDay.minutes > 0 ? maxDay.day : (t?.noData || "Veri yok")}
          </span>
        </div>
      </div>

      {/* HAFTALIK ODAK GRAFİĞİ & SAĞ LİSTE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-[#FDFAF5] p-5 rounded border-2 border-[#4A3728] shadow-[4px_4px_0_#2a1f14]">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200">
            <div>
              <span className="text-[8px] text-[#4A3728] font-bold block" style={{ fontFamily: "'Press Start 2P'" }}>
                {t?.weeklyFocus || "HAFTALIK ODAK"}
              </span>
              <span className="text-xs text-stone-400 font-bold">
                {t?.totalMinutes || "Toplam dakika"}: {totalMinutes} ({weekBounds.label})
              </span>
            </div>

            {/* Apple Sağlık Tarzı Hafta Gezgini */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset(prev => prev - 1)}
                className="px-2.5 py-1 text-xs font-bold bg-[#EDE5D5] hover:bg-[#E3D8C8] text-[#4A3728] rounded border border-[#C4B8A8] transition-all"
                style={{ fontFamily: "'Press Start 2P'", fontSize: "7px" }}
              >
                {t?.prevWeek || "◀ ÖNCEKİ"}
              </button>

              <span className="text-[7px] text-[#4A3728] font-bold min-w-[70px] text-center" style={{ fontFamily: "'Press Start 2P'" }}>
                {weekOffset === 0 ? (t?.currentWeekLabel || "BU HAFTA") : weekBounds.label}
              </span>

              <button
                onClick={() => setWeekOffset(prev => Math.min(0, prev + 1))}
                disabled={weekOffset === 0}
                className={`px-2.5 py-1 text-xs font-bold rounded border transition-all ${
                  weekOffset === 0
                    ? "bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed"
                    : "bg-[#EDE5D5] hover:bg-[#E3D8C8] text-[#4A3728] border-[#C4B8A8]"
                }`}
                style={{ fontFamily: "'Press Start 2P'", fontSize: "7px" }}
              >
                {t?.nextWeek || "SONRAKİ ▶"}
              </button>
            </div>
          </div>

          <div style={{ width: "100%", height: 260, minHeight: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 25, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3D8C8" />
                <XAxis 
                  dataKey="day" 
                  fontSize={8} 
                  tickLine={false}
                  axisLine={{ stroke: '#C4B8A8' }}
                  tick={{ fill: '#4A3728', fontFamily: "'Press Start 2P'" }} 
                />
                <Tooltip
                  formatter={(val) => [`${val} ${unitText}`, t?.focusMinutes || "Süre"]}
                  contentStyle={{
                    background: '#FDFAF5',
                    border: '2px solid #4A3728',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="minutes" 
                  fill="#6B9E78" 
                  radius={[2, 2, 0, 0]} 
                  label={<CustomBarLabel unit={unitText} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SAĞ: SON SEANSLAR LİSTESİ */}
        <div className="bg-[#FDFAF5] p-5 rounded border-2 border-[#4A3728] shadow-[4px_4px_0_#2a1f14] flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
            <div>
              <span className="text-[8px] text-[#4A3728] font-bold block" style={{ fontFamily: "'Press Start 2P'" }}>
                {t?.recentSessionsTitle || "SON SEANSLAR"}
              </span>
              <span className="text-xs text-stone-400 font-semibold">{t?.recentSessionsSub || "Odak geçmişin"}</span>
            </div>
            <button className="text-[7px] text-[#4A3728] font-bold px-2 py-1 bg-[#EDE5D5] border border-[#C4B8A8] rounded" style={{ fontFamily: "'Press Start 2P'" }}>
              {t?.allBtn || "TÜMÜ"}
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[260px]">
            {studySessions.length === 0 ? (
              <div className="text-center text-xs text-stone-400 my-auto py-8">{t?.noSessions || "Henüz seans kaydı yok."}</div>
            ) : (
              studySessions.slice(0, 5).map((s, idx) => (
                <div
                  key={s.id || idx}
                  className="flex items-center justify-between p-2.5 bg-[#F7F2E7] border border-[#DDD3C1] rounded"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-6 h-6 flex items-center justify-center bg-[#EDE5D5] text-[#4A3728] font-bold rounded text-[8px]"
                      style={{ fontFamily: "'Press Start 2P'" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-stone-800 truncate">{s.subject}</div>
                      <div className="text-[10px] text-stone-400">
                        {new Date(s.completed_at || s.created_at).toLocaleDateString(locale, {
                          weekday: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#4A6E54] flex-shrink-0" style={{ fontFamily: "'Press Start 2P'", fontSize: "8px" }}>
                    {s.duration} {unitText.toUpperCase()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}