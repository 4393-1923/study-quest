import { useState, useEffect, useRef, useCallback } from "react"
import { supabase } from "./supabase"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ─── Boş Sandalye Bileşeni ────────────────────────────────────────────────────
function EmptySeat({ cx, cy, onClick, disabled }) {
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
        OTUR
      </text>
    </g>
  )
}

// ─── Pixel Student Sprite ────────────────────────────────────────────────────
function Student({
  cx,
  cy,
  hair,
  skin,
  shirt,
  item,
  bookColor = "#E57373",
  bubble,
  isMe,
  username
}) {

  const ts = cy - 18
  const [showName, setShowName] = useState(false)

  return (
    <g
      className={isMe ? "animate-sit" : ""}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      onMouseEnter={() => setShowName(true)}
      onMouseLeave={() => setShowName(false)}
    >

      {true && (
        <text
          x={cx}
          y={ts - 32}
          textAnchor="middle"
          fontSize="7"
          fill="#4A3728"
          style={{
            fontFamily: "'Press Start 2P'",
            pointerEvents: "none",
            userSelect: "none"
          }}
        >
          {username}
        </text>
      )}


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



      {/* kollar */}
      <rect x={cx - 12} y={ts - 5} width={7} height={4} fill={skin} rx="1" />
      <rect x={cx + 5} y={ts - 5} width={7} height={4} fill={skin} rx="1" />


      {/* gövde */}
      <rect 
        x={cx - 7} 
        y={ts - 16} 
        width={14} 
        height={11} 
        fill={shirt} 
      />


      {/* kafa */}
      <rect 
        x={cx - 5} 
        y={ts - 27} 
        width={10} 
        height={11} 
        fill={skin} 
      />


      {/* saç */}
      <rect 
        x={cx - 5} 
        y={ts - 27} 
        width={10} 
        height={5} 
        fill={hair} 
      />


      {/* gözler */}
      <rect x={cx - 3} y={ts - 21} width={2} height={2} fill="#333" />
      <rect x={cx + 1} y={ts - 21} width={2} height={2} fill="#333" />


      {/* mesaj balonu */}
      {bubble && (
        <g className={isMe ? "float" : ""}>
          <rect
            x={cx - (bubble.length * 3.5) - 4}
            y={ts - 45}
            width={bubble.length * 7 + 8}
            height={16}
            fill="#FFFFFF"
            rx="2"
            style={{
              stroke:"#333",
              strokeWidth:1
            }}
          />

          <polygon
            points={`${cx-3},${ts-30} ${cx+3},${ts-30} ${cx},${ts-27}`}
            fill="#FFFFFF"
            style={{
              stroke:"#333",
              strokeWidth:1
            }}
          />

          <text
            x={cx}
            y={ts - 34}
            textAnchor="middle"
            fontSize="7"
            fill="#333"
            style={{
              fontFamily:"'Press Start 2P'",
              userSelect:"none"
            }}
          >
            {bubble}
          </text>

        </g>
      )}

    </g>
  )
}

// ─── 25 Sandalye Tanımı ───────────────────────────────────────────────────────
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

// ─── Study Hall ───────────────────────────────────────────────────────────────
function StudyHall({ isActive,userName,mySeatId,onSeatClick,currentBubble,minutes,secs,timerMode,occupiedSeats,timerState}){
  const renderSeat = (seat, index) => {
    const isMe = mySeatId === index;
    const occupiedBy = occupiedSeats[index];

    if (isMe) {
      return (
        <Student
          key={index}
          {...seat}
          username={userName}
          bubble={
            timerState === "running"
              ? `${minutes}:${String(secs).padStart(2, "0")}`
              : userName
          }
          isMe={true}
        />
      );

    } else if (occupiedBy) {
      return (
        <Student
          key={index}
          {...seat}
          username={userName}
          bubble={
            occupiedBy.timer_running
              ? `${Math.floor(occupiedBy.timer_seconds / 60)}:${String(occupiedBy.timer_seconds % 60).padStart(2, "0")}`
              : occupiedBy.username
          }
          isMe={false}
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
        />
      );
    }
  };

  return (
    <div className="relative w-full overflow-hidden select-none" style={{ imageRendering: "pixelated", aspectRatio: "16/9", maxHeight: 340 }}>
      <svg viewBox="0 0 600 338" width="100%" height="100%" style={{ imageRendering: "pixelated", display: "block" }} xmlns="http://www.w3.org/2000/svg">
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

        {/* Row A */}
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

        {/* Row B */}
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

        {/* Row C */}
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

        <rect x="246" y="137" width="108" height="9" fill="#4A3728" opacity="0.85" rx="2" />
        <text x="300" y="144" textAnchor="middle" fontSize="6" fill="#F5E6C8" fontFamily="'Press Start 2P', monospace">
          {(mySeatId !== null ? 1 : 0)}/25 STUDYING
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

// ─── XP Bar ───────────────────────────────────────────────────────────────────
function XPBar({ xp, level }) {
  const maxXp = level * 100
  const pct = Math.min(100, ((xp % maxXp) / maxXp) * 100)
  return (
    <div className="flex items-center gap-3">
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: 9, color: "#92400E", whiteSpace: "nowrap" }}>
        LV.{level}
      </div>
      <div className="flex-1 h-3 relative overflow-hidden" style={{ background: "#FEF3C7", border: "2px solid #92400E", imageRendering: "pixelated" }}>
        <div className="h-full transition-all duration-700" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #FBBF24, #FDE68A)" }} />
        <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)" }} />
      </div>
      <div className="text-xs font-600 text-amber-700 whitespace-nowrap" style={{ fontSize: 10 }}>
        {xp % maxXp}/{maxXp} XP
      </div>
    </div>
  )
}

// ─── Session Card ─────────────────────────────────────────────────────────────
function SessionCard({ session, index }) {
  const palette = [
    { bg: "#E8F5E9", bd: "#81C784", dot: "#4CAF50" },
    { bg: "#E3F2FD", bd: "#64B5F6", dot: "#2196F3" },
    { bg: "#FFF3E0", bd: "#FFB74D", dot: "#FF9800" },
    { bg: "#F3E5F5", bd: "#CE93D8", dot: "#9C27B0" },
    { bg: "#E0F7FA", bd: "#4DD0E1", dot: "#00BCD4" },
  ]
  const c = palette[index % palette.length]
  const time = new Date(session.completedAt || session.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-transform hover:scale-[1.01]" style={{ backgroundColor: c.bg, border: `2px solid ${c.bd}` }}>
      <div className="w-3 h-3 flex-shrink-0 rounded-sm" style={{ backgroundColor: c.dot }} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-700 text-stone-700 truncate">{session.subject}</div>
        <div className="text-xs text-stone-500 font-500">{session.duration} min session</div>
      </div>
      <div className="text-xs text-stone-400 font-600 flex-shrink-0">{time}</div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
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
  const [subject, setSubject] = useState("")
  const [sessions, setSessions] = useState([])
  
  // Sohbet ve Mesajlaşma State'leri
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [currentBubble, setCurrentBubble] = useState("")

  const [xp, setXp] = useState(100)
  const [level] = useState(1)
  const [streak] = useState(1)
  const intervalRef = useRef(null)

  //cikis
  useEffect(() => {
    if (!userName) return;

    const leaveRoom = async () => {
      await supabase
        .from("online_users")
        .delete()
        .eq("username", userName);
    };

    window.addEventListener("pagehide", leaveRoom);

    return () => {
      window.removeEventListener("beforeunload", leaveRoom);
      leaveRoom();
    };

  }, [userName]);
  // Oturum (Magic Link Auth) takibi
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true)
        const userMail = session.user.email
        setUserName(userMail.split("@")[0])
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true)
        const userMail = session.user.email
        setUserName(userMail.split("@")[0])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Aktif sandalyeleri tutan yeni bir state
  const [occupiedSeats, setOccupiedSeats] = useState({});
  useEffect(() => {

    const timer = setInterval(() => {

      setOccupiedSeats(prev => {

        const updated = {...prev};

        Object.keys(updated).forEach((seatId) => {

          const user = updated[seatId];

          if(user.timer_running && user.timer_seconds > 0){

            updated[seatId] = {
              ...user,
              timer_seconds: user.timer_seconds - 1
            };

          }

        });

        return updated;

      });

    },1000);


    return () => clearInterval(timer);

  },[]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchOccupied = async () => {
      const { data, error } = await supabase
        .from("online_users")
        .select(`
          username,
          seat_id,
          timer_seconds,
          timer_running,
          timer_mode
          `)

      if (!error && data) {
        const seatsMap = {};

        data.forEach((user) => {
          seatsMap[user.seat_id] = user;
        });

        setOccupiedSeats(seatsMap);
        const mySeat = data.find(
          (user)=> user.username === userName
          );

          if(mySeat){
          setMySeatId(mySeat.seat_id);
          }
      }
    };

    fetchOccupied();

    const channel = supabase
      .channel("online_users_room")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "online_users",
        },
        () => {
          fetchOccupied();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [isLoggedIn]);
  // Supabase'den seansları çekme
  const fetchSessions = async (name) => {
    if (!name) return;
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('username', name)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSessions(data);
      const totalMinutes = data
        .filter(s => s.type === 'study')
        .reduce((acc, s) => acc + s.duration, 0);
      setXp(100 + totalMinutes * 2);
    }
  };

  // Supabase'den mesajları çekme
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('study_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setMessages(data.reverse());
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

  // Sadece 'study' olan seansları filtrele (Break'ler istatistiğe dahil edilmez)
  const studySessions = sessions.filter(s => s.type === 'study');

  const totalMinToday = studySessions
    .filter((s) => new Date(s.created_at || s.completedAt) > new Date(Date.now() - 86400000))
    .reduce((acc, s) => acc + s.duration, 0);

  // Haftalık Grafik Verisi (Pzt - Paz)
  const chartData = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, i) => {
    const daySessions = studySessions.filter(s => {
      const d = new Date(s.created_at || s.completedAt);
      // getDay(): Pazar=0, Pzt=1 ... Pazartesi tabanlı indeksleme
      const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
      return dayIndex === i;
    });
    return {
      day,
      minutes: daySessions.reduce((acc, s) => acc + s.duration, 0)
    };
  });

  const completedSessions = studySessions.length;
  const pad = (n) => String(n).padStart(2, "0");
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const handleComplete = useCallback(async () => {
    // Timer zaten durduruldu, çift tetiklenmeyi engellemek için kontrol
    if (timerState !== "running") return;

    const isStudyMode = timerMode === "study";

    if (isStudyMode) {
      const dur = studyDuration;
      const sub = subject.trim() || "Focus session";
      
      const newSession = {
        username: userName,
        subject: sub,
        duration: dur,
        type: "study",
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('study_sessions')
        .insert([newSession])
        .select();

      if (!error && data) {
        setSessions((prev) => [data[0], ...prev]);
      }

      setXp((prev) => prev + dur * 2);
      setTimerMode("break");
      setSecondsLeft(breakDuration * 60);
    } else {
      setTimerMode("study");
      setSecondsLeft(studyDuration * 60);
    }
    setTimerState("idle");
  }, [timerMode, studyDuration, breakDuration, subject, userName, timerState]);
  
  useEffect(() => {
    if (!userName || mySeatId === null) return;

    const updateMyTimer = async () => {
      await supabase
        .from("online_users")
        .update({
          timer_seconds: secondsLeft,
          timer_running: timerState === "running",
          timer_mode: timerMode
        })
        .eq("username", userName);
    };

    updateMyTimer();

  }, [secondsLeft, timerState, timerMode]);

  // Süre 0 olduğunda tetiklenecek ayrı bir kontrol
  useEffect(() => {
    if (secondsLeft === 0 && timerState === "running") {
      handleComplete();
    }
  }, [secondsLeft, timerState, handleComplete]);

  useEffect(() => {
    if (timerState === "idle")
      setSecondsLeft((timerMode === "study" ? studyDuration : breakDuration) * 60)
  }, [studyDuration, breakDuration, timerMode, timerState])
  // Yeni ekleyeceğimiz koltuk seçme fonksiyonu:
  const handleSeatClick = async (index) => {

    // Çalışıyorsa koltuk değiştirme yok
    if (timerState === "running") {
      alert("Çalışma sırasında koltuk değiştiremezsin!");
      return;
    }


    // Aynı koltuğa basarsa hiçbir şey yapma
    if (mySeatId === index) {
      return;
    }


    // Koltuk dolu mu kontrol
    const { data: existingSeat } = await supabase
      .from("online_users")
      .select("username")
      .eq("seat_id", index)
      .maybeSingle();


    if (existingSeat) {
      alert("Bu koltuk dolu!");
      return;
    }


    // Eski koltuğu sil
    if (mySeatId !== null) {
      await supabase
        .from("online_users")
        .delete()
        .eq("username", userName);
    }


    // Yeni koltuğa geç
    const { error } = await supabase
      .from("online_users")
      .upsert(
        {
          username: userName,
          seat_id: index,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: "username"
        }
      );


    if (!error) {
      setMySeatId(index);
    } else {
      alert(error.message);
    }

  };

  const handleStart = () => {
    if (mySeatId === null) {
      alert("Lütfen çalışmaya başlamak için masalardan boş bir sandalyeye tıkla!");
      return;
    }
    if (timerState === "idle" || timerState === "paused") setTimerState("running")
    else setTimerState("paused")
  }
  
  const handleReset = () => {
    setTimerState("idle")
    setTimerMode("study")
    setSecondsLeft(studyDuration * 60)
  }

  // Magic Link ile giriş isteği gönderme
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);

    // Önce giriş dene
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      setLoading(false);
      return;
    }

    // Kullanıcı bulunamadıysa kayıt oluştur
    if (error.message.toLowerCase().includes("invalid login credentials")) {

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        alert(signUpError.message);
      } else {
        alert("Hesabın oluşturuldu! Şimdi giriş yapabilirsin.");
      }

    } else {
      alert(error.message);
    }

    setLoading(false);
  };
  // cikis yapma
  const handleLogout = async () => {

    // Koltuktan kaldır
    if (userName) {
      await supabase
        .from("online_users")
        .delete()
        .eq("username", userName);
    }

    // Supabase auth çıkışı
    await supabase.auth.signOut();

    // State temizle
    setMySeatId(null);
    setUserName("");
    setIsLoggedIn(false);
  };
  // Mesaj gönderme fonksiyonu (Odak modunda kilitli)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isActive) {
      alert("Odak modundasın! Mola zamanında yazabilirsin.");
      return;
    }
    if (!chatInput.trim()) return;

    const msgText = chatInput.trim().slice(0, 30); 

    const { error } = await supabase
      .from('study_messages')
      .insert([{ username: userName, message: msgText }]);

    if (!error) {
      setChatInput("");
      fetchMessages();
      setCurrentBubble(msgText);
      setTimeout(() => setCurrentBubble(""), 5000);
    }
  };

  const isActive = timerState === "running"
  const modeColor = timerMode === "study" ? "#6B9E78" : "#7EA8C4"
  const totalOccupancy = Object.keys(occupiedSeats).length;
  const occupancyLabel = totalOccupancy > 0 ? "Çalışılıyor" : "Boş Oda"
  const occupancyColor = totalOccupancy > 0 ? "#81C784" : "#64B5F6"

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center scanline px-4" style={{ background: "#F2EDE3" }}>
        <form onSubmit={handleLogin} className="pixel-border bg-[#FDFAF5] p-8 max-w-sm w-full flex flex-col items-center gap-6" style={{ border: "4px solid #4A3728", boxShadow: "6px 6px 0 #2a1f14" }}>
          <h1 className="text-xl text-center" style={{ fontFamily: 'var(--font-pixel)', color: "#4A3728" }}>
            Odaya Katıl
          </h1>
          <p
            className="text-center text-sm font-600"
            style={{ color: "#7A6A58" }}
          >
            E-posta ve şifreni gir.
            <br />
            İlk girişinde hesabın otomatik oluşturulur.
            <br />
            Daha sonra aynı bilgilerle giriş yapabilirsin.
          </p>
          <input 
            type="email" 
            placeholder="ornek@email.com" 
            className="w-full p-3 bg-[#F5F0E8] outline-none focus:bg-white text-center font-bold"
            style={{ border: "2px solid #C4B8A8" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            className="w-full p-3 bg-[#F5F0E8] outline-none focus:bg-white text-center font-bold"
            style={{ border: "2px solid #C4B8A8" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="pixel-btn w-full text-white py-3 font-bold" 
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', background: "#6B9E78", borderTop: "3px solid #8BB898", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F2EDE3", fontFamily: "'Nunito', sans-serif" }}>
      <header className="w-full border-b-4 border-stone-800" style={{ background: "#FDFAF5" }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10" style={{ imageRendering: "pixelated" }}>
              <svg viewBox="0 0 32 32" width="40" height="40">
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
              <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: 13, color: "#3D3028", lineHeight: 1 }}>StudyQuest</h1>
              <p className="text-stone-500 text-xs font-600 mt-1">Hoş geldin, {userName}!</p>
            </div>
          </div>
          <div className="flex-1 max-w-xs hidden md:block">
            <XPBar xp={xp} level={level} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2" style={{ background: "#F0FBF4", borderColor: occupancyColor }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: occupancyColor, boxShadow: `0 0 5px ${occupancyColor}` }} />
              <div>
                <div className="text-xs font-700 leading-none" style={{ color: occupancyColor }}>{occupancyLabel}</div>
                <div className="text-xs text-stone-500 font-600">{totalOccupancy}/25</div>
              </div>
            </div>
            <div className="text-center px-3 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-300">
              <div className="text-xs text-amber-600 font-700">🔥 Streak</div>
              <div className="text-lg font-800 text-amber-700 leading-none">{streak}</div>
            </div>
            <div className="text-center px-3 py-1.5 rounded-lg border-2 border-green-300" style={{ backgroundColor: "#EEF5E8" }}>
              <div className="text-xs text-green-700 font-700">Today</div>
              <div className="text-lg font-800 text-green-800 leading-none">{totalMinToday}m</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid gap-5" style={{ gridTemplateColumns: "minmax(0,1fr) 280px" }}>
        <div className="flex flex-col gap-5 min-w-0">
          <div className="rounded-lg overflow-hidden" style={{ border: "4px solid #4A3728", boxShadow: "6px 6px 0 #2a1f14" }}>
            <div className="px-3 py-2 flex items-center justify-between" style={{ background: "#4A3728" }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: "#F5E6C8" }}>📚 COMMUNITY STUDY HALL</span>
              <div className="flex items-center gap-2">
                {isActive && (
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: "#7EC8A4", animation: "float 2s ease-in-out infinite" }}>▶ FOCUS MODE</span>
                )}
                <div className="flex gap-1">
                  {["#FF6B6B", "#FFD93D", "#6BCB77"].map((c) => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
            <StudyHall 
              isActive={isActive} 
              userName={userName} 
              mySeatId={mySeatId} 
              setMySeatId={handleSeatClick} 
              currentBubble={currentBubble} 
              minutes={minutes} 
              secs={secs} 
              timerMode={timerMode}
              occupiedSeats={occupiedSeats}
              onSeatClick={handleSeatClick}
              timerState={timerState}
            />
          </div>

          <div className="rounded-lg overflow-hidden" style={{ border: "4px solid #4A3728", boxShadow: "6px 6px 0 #2a1f14", background: "#FDFAF5" }}>
            <div className="px-4 py-2" style={{ background: "#4A3728" }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: "#F5E6C8" }}>⏱ POMODORO TIMER</span>
            </div>
            <div className="p-5">
              <div className="flex gap-2 mb-5">
                {(["study", "break"]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      if (timerState === "idle") {
                        setTimerMode(mode)
                        setSecondsLeft((mode === "study" ? studyDuration : breakDuration) * 60)
                      }
                    }}
                    className="flex-1 py-2.5 rounded transition-all font-700"
                    style={{
                      fontFamily: "'Press Start 2P'", fontSize: 8,
                      background: timerMode === mode ? (mode === "study" ? "#6B9E78" : "#7EA8C4") : "#E8E0D4",
                      color: timerMode === mode ? "#fff" : "#7A6A58",
                      border: `3px solid ${timerMode === mode ? "#4A6E54" : "#C4B8A8"}`,
                      cursor: timerState !== "idle" ? "not-allowed" : "pointer",
                      opacity: timerState !== "idle" && timerMode !== mode ? 0.45 : 1,
                    }}
                  >
                    {mode === "study" ? "📖 STUDY" : "☕ BREAK"}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center justify-center py-7 mb-5 rounded-lg scanline overflow-hidden" style={{ background: "#1A2822", border: "4px solid #0E1A14", boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)" }}>
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${timerMode === "study" ? "rgba(107,158,120,0.15)" : "rgba(126,168,196,0.15)"} 0%, transparent 70%)` }} />
                <div className="relative z-10 tabular-nums" style={{ fontFamily: "'VT323'", fontSize: 96, lineHeight: 1, color: timerMode === "study" ? "#7EC8A4" : "#7EB8D4", textShadow: `0 0 20px ${timerMode === "study" ? "rgba(126,200,164,0.6)" : "rgba(126,184,212,0.6)"}`, letterSpacing: "0.04em" }}>
                  {pad(minutes)}<span className={isActive ? "blink" : ""}>:</span>{pad(secs)}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 text-stone-600" style={{ fontFamily: "'Press Start 2P'", fontSize: 7 }}>WHAT ARE YOU STUDYING?</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Calculus Chapter 4..."
                  className="w-full px-3 py-2.5 text-sm font-600 text-stone-700 rounded outline-none transition-all"
                  style={{ background: "#F5F0E8", border: "2px solid #C4B8A8" }}
                  onFocus={(e) => (e.target.style.borderColor = "#8BAD6E")}
                  onBlur={(e) => (e.target.style.borderColor = "#C4B8A8")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "STUDY (MIN)", value: studyDuration, setter: setStudyDuration, min: 1, max: 90 },
                  { label: "BREAK (MIN)", value: breakDuration, setter: setBreakDuration, min: 1, max: 30 },
                ].map(({ label, value, setter, min, max }) => (
                  <div key={label}>
                    <label className="block mb-1 text-stone-500" style={{ fontFamily: "'Press Start 2P'", fontSize: 7 }}>{label}</label>
                    <div className="flex items-center overflow-hidden" style={{ border: "2px solid #C4B8A8", borderRadius: 6, background: "#F5F0E8" }}>
                      <button onClick={() => setter((v) => Math.max(min, v - 1))} disabled={timerState !== "idle"} className="w-9 h-9 flex items-center justify-center text-lg font-800 text-stone-600 hover:bg-stone-200 transition-colors flex-shrink-0">−</button>
                      <input type="number" value={value} min={min} max={max} onChange={(e) => setter(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))} disabled={timerState !== "idle"} className="flex-1 text-center font-800 text-stone-800 bg-transparent outline-none w-0" style={{ fontFamily: "'VT323'", fontSize: 26 }} />
                      <button onClick={() => setter((v) => Math.min(max, v + 1))} disabled={timerState !== "idle"} className="w-9 h-9 flex items-center justify-center text-lg font-800 text-stone-600 hover:bg-stone-200 transition-colors flex-shrink-0">+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleStart}
                  className="flex-1 py-3 rounded font-700 text-white pixel-btn"
                  style={{ fontFamily: "'Press Start 2P'", fontSize: 9, background: timerState === "running" ? "#E07050" : modeColor, borderTop: `3px solid ${timerState === "running" ? "#F08070" : timerMode === "study" ? "#8BB898" : "#9EC4D8"}` }}
                >
                  {timerState === "running" ? "⏸ PAUSE" : timerState === "paused" ? "▶ RESUME" : "▶ START"}
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-3 rounded font-700 text-stone-700 pixel-btn"
                  style={{ fontFamily: "'Press Start 2P'", fontSize: 9, background: "#E8DFD0", borderTop: "3px solid #F5ECE0" }}
                >
                  ↺ RESET
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* ODA SOHBETİ */}
          <div className="rounded-lg overflow-hidden flex flex-col" style={{ border: "4px solid #4A3728", boxShadow: "4px 4px 0 #2a1f14", background: "#FDFAF5", height: "300px" }}>
            <div className="px-4 py-2" style={{ background: "#4A3728" }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: "#F5E6C8" }}>💬 ODA SOHBETİ</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-2 text-xs">
              {messages.length === 0 ? (
                <div className="text-center text-stone-400 my-auto">Henüz mesaj yok. İlk mesajı sen yaz!</div>
              ) : (
                messages.map((m, i) => (
                  <div key={m.id || i} className="p-2 rounded bg-[#F5F0E8]" style={{ border: "1px solid #C4B8A8" }}>
                    <span className="font-bold text-amber-800">{m.username}: </span>
                    <span className="text-stone-700">{m.message}</span>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSendMessage} className="p-2 border-t-2 border-[#C4B8A8] flex gap-2 bg-[#F2EDE3]">
              <input 
                type="text"
                placeholder={isActive ? "Odaklanma modundasın..." : "Mesaj yaz (max 30)..."}
                maxLength={30}
                value={chatInput}
                disabled={isActive}
                onChange={(e) => setChatInput(e.target.value)}
                className={`flex-1 px-2 py-1.5 text-xs bg-white outline-none rounded ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ border: "1px solid #C4B8A8" }}
              />
              <button 
                type="submit" 
                disabled={isActive}
                className={`px-3 py-1 text-white text-xs font-bold rounded ${isActive ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#6B9E78]'}`} 
                style={{ fontFamily: "'Press Start 2P'", fontSize: "7px" }}
              >
                GÖNDER
              </button>
            </form>
          </div>

          <div className="rounded-lg overflow-hidden" style={{ border: "4px solid #4A3728", boxShadow: "4px 4px 0 #2a1f14", background: "#FDFAF5" }}>
            <div className="px-4 py-2" style={{ background: "#4A3728" }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: "#F5E6C8" }}>📊 MY STATS</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: "Sessions", value: completedSessions, icon: "📚", bg: "#E8F5EC", bd: "#81C784", tx: "#3D7A50" },
                { label: "Focus Min", value: totalMinToday, icon: "⏰", bg: "#FFF8E8", bd: "#FFD080", tx: "#7A6020" },
                { label: "Streak", value: `${streak}d`, icon: "🔥", bg: "#FFF3EC", bd: "#FFB080", tx: "#804030" },
                { label: "Developed by Emine Bolat",  icon: "⭐", bg: "#F5F0FF", bd: "#C0A0E0", tx: "#604888" },
              ].map(({ label, value, icon, bg, bd, tx }) => (
                <div key={label} className="rounded-lg p-3 text-center" style={{ background: bg, border: `2px solid ${bd}` }}>
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-xl font-800 leading-none" style={{ color: tx }}>{value}</div>
                  <div className="text-xs font-600 mt-0.5" style={{ color: tx, opacity: 0.7 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* HAFTALIK GRAFİK (BAR CHART) */}
          <div className="rounded-lg overflow-hidden" style={{ border: "4px solid #4A3728", boxShadow: "4px 4px 0 #2a1f14", background: "#FDFAF5" }}>
            <div className="px-4 py-2" style={{ background: "#4A3728" }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: "#F5E6C8" }}>📈 HAFTALIK GRAFİK</span>
            </div>
            <div className="p-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="day" fontSize={10} tick={{ fill: '#4A3728' }} />
                  <Tooltip contentStyle={{ background: '#FDFAF5', border: '2px solid #4A3728', borderRadius: '4px', fontSize: '12px' }} />
                  <Bar dataKey="minutes" fill="#6B9E78" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden" style={{ border: "4px solid #4A3728", boxShadow: "4px 4px 0 #2a1f14", background: "#FDFAF5" }}>
            <div className="px-4 py-2 flex items-center justify-between" style={{ background: "#4A3728" }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: "#F5E6C8" }}>📋 GEÇMİŞ</span>
              <span className="text-xs font-700 text-amber-300">{studySessions.length}</span>
            </div>
            <div className="p-3 flex flex-col gap-2 max-h-60 overflow-y-auto">
              {studySessions.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-2xl mb-2">📭</div>
                  <div className="text-xs text-stone-400 font-600">Henüz kayıtlı seansın yok — çalışmaya başla!</div>
                </div>
              ) : (
                studySessions.map((s, i) => <SessionCard key={s.id || i} session={s} index={i} />)
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 820px) {
          main { grid-template-columns: 1fr !important; }
        }
        .hover-seat:hover .seat-part {
          fill: #C09060 !important;
        }
        .hover-seat:hover .seat-label {
          opacity: 1 !important;
          transform: translateY(-2px);
        }
        @keyframes sitDown {
          0% { transform: translateY(-20px) scale(1.1); opacity: 0; }
          60% { transform: translateY(2px) scale(0.95); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-sit {
          animation: sitDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    <button
      onClick={handleLogout}
      className="fixed bottom-5 right-5 px-4 py-3 rounded"
      style={{
      fontFamily:"'Press Start 2P'",
      fontSize:8,
      background:"#E57373",
      color:"#fff",
      border:"3px solid #B54A4A",
      boxShadow:"4px 4px 0 #7A3030",
      zIndex:50
      }}
      >
      ÇIKIŞ
      </button>
    </div>
  )
}