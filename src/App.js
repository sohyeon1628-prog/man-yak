import React, { useEffect, useMemo, useState, useRef } from "react";
import "./App.css";
import { loadQuestions } from "./questionData";

const API_BASE_URL =
  process.env.REACT_APP_API_URL !== undefined
    ? process.env.REACT_APP_API_URL
    : (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

/* =========================================================
   SVG CRAYON DEFINITIONS
========================================================= */

function CrayonDefs() {
  return (
    <defs>
      <pattern
        id="crayonGreen"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
      >
        <rect width="8" height="8" fill="#9BCB78" />
        <path
          d="M0 2 L8 1 M-2 5 L6 4 M2 8 L10 7"
          stroke="#6FA653"
          strokeWidth="1"
          opacity="0.45"
        />
        <path
          d="M0 6 L8 5"
          stroke="#D6E8C4"
          strokeWidth="1"
          opacity="0.6"
        />
      </pattern>

      <pattern
        id="crayonYellow"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
      >
        <rect width="8" height="8" fill="#FFD966" />
        <path
          d="M0 2 L8 1 M-2 5 L6 4 M2 8 L10 7"
          stroke="#E9B93F"
          strokeWidth="1"
          opacity="0.45"
        />
        <path
          d="M0 6 L8 5"
          stroke="#FFF1A8"
          strokeWidth="1"
          opacity="0.7"
        />
      </pattern>

      <pattern
        id="crayonOrange"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
      >
        <rect width="8" height="8" fill="#F5A65B" />
        <path
          d="M0 2 L8 1 M-2 5 L6 4 M2 8 L10 7"
          stroke="#D77B34"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M0 6 L8 5"
          stroke="#FFD1A6"
          strokeWidth="1"
          opacity="0.6"
        />
      </pattern>

      <pattern
        id="crayonBlue"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
      >
        <rect width="8" height="8" fill="#83C5E8" />
        <path
          d="M0 2 L8 1 M-2 5 L6 4 M2 8 L10 7"
          stroke="#4E9FC5"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M0 6 L8 5"
          stroke="#C8EAF7"
          strokeWidth="1"
          opacity="0.65"
        />
      </pattern>

      <pattern
        id="crayonPurple"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
      >
        <rect width="8" height="8" fill="#B184D8" />
        <path
          d="M0 2 L8 1 M-2 5 L6 4 M2 8 L10 7"
          stroke="#8A51BD"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M0 6 L8 5"
          stroke="#E0CEF5"
          strokeWidth="1"
          opacity="0.65"
        />
      </pattern>

      <pattern
        id="crayonRed"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
      >
        <rect width="8" height="8" fill="#F07167" />
        <path
          d="M0 2 L8 1 M-2 5 L6 4 M2 8 L10 7"
          stroke="#C53F3F"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M0 6 L8 5"
          stroke="#FFB4A2"
          strokeWidth="1"
          opacity="0.65"
        />
      </pattern>

      {/* 진짜 스케치북에 크레파스로 꾹꾹 눌러 그린 듯한 손낙서 거칠기 필터 */}
      <filter id="crayonRoughness" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  );
}

/* =========================================================
   STAR
========================================================= */

function Star({ x, y, size = 18 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`
          M0 -${size}
          L${size * 0.25} -${size * 0.25}
          L${size} 0
          L${size * 0.25} ${size * 0.25}
          L0 ${size}
          L-${size * 0.25} ${size * 0.25}
          L-${size} 0
          L-${size * 0.25} -${size * 0.25}
          Z
        `}
        fill="url(#crayonYellow)"
        stroke="#51483F"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </g>
  );
}

/* =========================================================
   MAIN DINOSAUR
========================================================= */

function MainDinosaur() {
  return (
    <svg
      viewBox="0 0 360 360"
      className="main-character-svg"
      aria-label="크레파스로 그린 공룡"
    >
      <CrayonDefs />

      <g filter="url(#crayonRoughness)">
        <path
          d="M90 215 Q35 235 55 180 Q70 150 95 165"
          fill="none"
          stroke="#51483F"
          strokeWidth="14"
          strokeLinecap="round"
        />

        <path
          d="
            M80 205
            Q55 160 80 112
            Q108 67 168 82
            Q218 92 238 132
            L274 112
            L258 145
            L288 160
            L245 174
            Q235 220 194 242
            Q128 260 80 205
            Z
          "
          fill="url(#crayonGreen)"
          stroke="#51483F"
          strokeWidth="8"
          strokeLinejoin="round"
        />

        <path
          d="
            M100 107
            L112 75
            L130 103
            L149 66
            L164 101
            L184 70
            L195 110
          "
          fill="url(#crayonOrange)"
          stroke="#51483F"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        <circle
          cx="205"
          cy="135"
          r="18"
          fill="#FFFDF5"
          stroke="#51483F"
          strokeWidth="5"
        />

        <circle cx="208" cy="135" r="7" fill="#51483F" />

        <circle
          cx="230"
          cy="168"
          r="10"
          fill="#F3A48D"
          opacity="0.8"
        />

        <path
          d="M225 177 Q245 183 258 173"
          fill="none"
          stroke="#51483F"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M105 225 L101 285"
          stroke="#51483F"
          strokeWidth="13"
          strokeLinecap="round"
        />

        <path
          d="M190 232 L195 285"
          stroke="#51483F"
          strokeWidth="13"
          strokeLinecap="round"
        />

        <path
          d="M88 286 Q101 292 116 286"
          fill="none"
          stroke="#51483F"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M183 286 Q198 292 211 286"
          fill="none"
          stroke="#51483F"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <Star x={50} y={105} size={15} />
        <Star x={300} y={95} size={13} />
        <Star x={300} y={245} size={9} />
      </g>
    </svg>
  );
}

/* =========================================================
   ALIEN
========================================================= */

function Alien() {
  return (
    <svg viewBox="0 0 300 300" className="character-svg">
      <CrayonDefs />

      <path
        d="M125 70 Q105 35 80 42"
        fill="none"
        stroke="#51483F"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <circle
        cx="78"
        cy="41"
        r="9"
        fill="url(#crayonOrange)"
        stroke="#51483F"
        strokeWidth="4"
      />

      <path
        d="M175 70 Q195 35 220 42"
        fill="none"
        stroke="#51483F"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <circle
        cx="222"
        cy="41"
        r="9"
        fill="url(#crayonOrange)"
        stroke="#51483F"
        strokeWidth="4"
      />

      <path
        d="
          M150 50
          C95 48 65 82 68 135
          C70 185 104 213 150 213
          C196 213 230 185 232 135
          C235 82 205 48 150 50
          Z
        "
        fill="url(#crayonGreen)"
        stroke="#51483F"
        strokeWidth="7"
      />

      <ellipse
        cx="116"
        cy="125"
        rx="22"
        ry="31"
        fill="#292724"
        stroke="#51483F"
        strokeWidth="4"
      />

      <ellipse
        cx="184"
        cy="125"
        rx="22"
        ry="31"
        fill="#292724"
        stroke="#51483F"
        strokeWidth="4"
      />

      <circle cx="111" cy="115" r="6" fill="white" />
      <circle cx="179" cy="115" r="6" fill="white" />

      <path
        d="M123 168 Q150 190 177 168"
        fill="none"
        stroke="#51483F"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M105 202 Q150 185 195 202 L215 267 Q150 290 85 267 Z"
        fill="url(#crayonBlue)"
        stroke="#51483F"
        strokeWidth="7"
      />

      <path
        d="M95 218 Q55 225 48 257"
        fill="none"
        stroke="#51483F"
        strokeWidth="9"
        strokeLinecap="round"
      />

      <path
        d="M205 218 Q245 225 252 257"
        fill="none"
        stroke="#51483F"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   CAT
========================================================= */

function Cat() {
  return (
    <svg viewBox="0 0 300 300" className="character-svg">
      <CrayonDefs />

      <path
        d="M210 220 Q275 205 245 155 Q230 132 205 153"
        fill="none"
        stroke="#51483F"
        strokeWidth="14"
        strokeLinecap="round"
      />

      <ellipse
        cx="150"
        cy="210"
        rx="72"
        ry="62"
        fill="url(#crayonOrange)"
        stroke="#51483F"
        strokeWidth="7"
      />

      <path
        d="
          M82 112
          L82 57
          L122 79
          Q150 65 178 79
          L218 57
          L218 112
          Q218 174 150 183
          Q82 174 82 112
          Z
        "
        fill="url(#crayonYellow)"
        stroke="#51483F"
        strokeWidth="7"
      />

      <path
        d="M93 73 L102 101 L119 87 Z"
        fill="#F08B78"
        stroke="#51483F"
        strokeWidth="4"
      />

      <path
        d="M207 73 L198 101 L181 87 Z"
        fill="#F08B78"
        stroke="#51483F"
        strokeWidth="4"
      />

      <circle cx="120" cy="120" r="9" fill="#51483F" />
      <circle cx="180" cy="120" r="9" fill="#51483F" />

      <path
        d="M143 137 L150 143 L157 137 Z"
        fill="#E87979"
        stroke="#51483F"
        strokeWidth="3"
      />

      <path
        d="M150 143 Q142 153 134 149"
        fill="none"
        stroke="#51483F"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M150 143 Q158 153 166 149"
        fill="none"
        stroke="#51483F"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path d="M105 137 L60 128" stroke="#51483F" strokeWidth="4" />
      <path d="M105 148 L57 150" stroke="#51483F" strokeWidth="4" />
      <path d="M195 137 L240 128" stroke="#51483F" strokeWidth="4" />
      <path d="M195 148 L243 150" stroke="#51483F" strokeWidth="4" />
    </svg>
  );
}

/* =========================================================
   PLANET
========================================================= */

function Planet() {
  return (
    <svg viewBox="0 0 300 300" className="character-svg">
      <CrayonDefs />

      <ellipse
        cx="150"
        cy="165"
        rx="105"
        ry="38"
        fill="none"
        stroke="#51483F"
        strokeWidth="9"
        transform="rotate(-15 150 165)"
      />

      <circle
        cx="150"
        cy="150"
        r="70"
        fill="url(#crayonBlue)"
        stroke="#51483F"
        strokeWidth="7"
      />

      <path
        d="M108 125 Q130 110 150 125"
        fill="none"
        stroke="#6FA653"
        strokeWidth="13"
        strokeLinecap="round"
      />

      <path
        d="M165 170 Q190 155 202 175"
        fill="none"
        stroke="#6FA653"
        strokeWidth="13"
        strokeLinecap="round"
      />

      <circle cx="128" cy="145" r="7" fill="#51483F" />
      <circle cx="172" cy="145" r="7" fill="#51483F" />

      <path
        d="M135 170 Q150 183 165 170"
        fill="none"
        stroke="#51483F"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   RABBIT LION
========================================================= */

/* =========================================================
   RABBIT LION (토끼 귀 달린 사자 - 크레파스 손낙서 덩어리감)
========================================================= */
function RabbitLion() {
  return (
    <svg
      viewBox="0 0 360 360"
      className="main-character-svg"
      aria-label="크레파스로 그린 토끼귀 사자"
    >
      <CrayonDefs />

      <g filter="url(#crayonRoughness)">
        {/* 머리 위로 삐뚤빼뚤 솟은 굵직한 토끼 귀 (노란 크레파스 덩어리) */}
        {/* 왼쪽 토끼 귀 */}
        <path
          d="
            M105 130
            Q80 40 115 18
            Q148 10 142 105
            Z
          "
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        {/* 왼쪽 귀 안쪽 분홍 크레용 덧칠 */}
        <path
          d="M108 98 Q96 46 116 34 Q132 30 130 82"
          fill="#FF8A80"
          stroke="#51483F"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* 오른쪽 토끼 귀 (장난기 넘치게 살짝 꺾인 각도) */}
        <path
          d="
            M215 105
            Q212 10 245 18
            Q280 40 255 130
            Z
          "
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        {/* 오른쪽 귀 안쪽 분홍 크레용 덧칠 */}
        <path
          d="M230 82 Q228 30 244 34 Q264 46 252 98"
          fill="#FF8A80"
          stroke="#51483F"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* 사방으로 삐죽빼죽 뻗은 풍성한 주황색 크레파스 사자 갈기 덩어리 */}
        <path
          d="
            M180 55
            L212 35 L228 68 L262 55 L268 92 L302 98 L290 135
            L322 155 L296 188 L320 220 L285 240 L292 275 L255 278
            L240 310 L202 292 L180 316 L158 292 L120 310 L105 278
            L68 275 L75 240 L40 220 L64 188 L38 155 L70 135
            L58 98 L92 92 L98 55 L132 68 L148 35
            Z
          "
          fill="url(#crayonOrange)"
          stroke="#51483F"
          strokeWidth="9"
          strokeLinejoin="round"
        />

        {/* 큼직하고 둥글넙적한 사자 얼굴 덩어리 (노란 크레용 채색) */}
        <path
          d="
            M110 135
            Q180 108 250 135
            Q278 198 242 250
            Q180 278 118 250
            Q82 198 110 135
            Z
          "
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="8"
          strokeLinejoin="round"
        />

        {/* 꼬마 공룡 스타일의 큼직하고 엉뚱한 타원 눈 */}
        {/* 왼쪽 눈 */}
        <circle cx="145" cy="172" r="17" fill="#FFFDF5" stroke="#51483F" strokeWidth="5" />
        <circle cx="148" cy="172" r="7" fill="#51483F" />

        {/* 오른쪽 눈 */}
        <circle cx="215" cy="172" r="17" fill="#FFFDF5" stroke="#51483F" strokeWidth="5" />
        <circle cx="212" cy="172" r="7" fill="#51483F" />

        {/* 발그레하게 번진 핑크 크레파스 볼터치 덩어리 */}
        <circle cx="125" cy="204" r="13" fill="#FF8A80" opacity="0.85" />
        <circle cx="235" cy="204" r="13" fill="#FF8A80" opacity="0.85" />

        {/* 빨간 크레파스 세모 코 */}
        <path
          d="M170 190 L190 190 L180 202 Z"
          fill="#FF5E57"
          stroke="#51483F"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* 귀여운 W자 사자 입술 & 입벌림 */}
        <path
          d="M180 202 L180 214 M162 215 Q171 226 180 215 Q189 226 198 215"
          fill="none"
          stroke="#51483F"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 굵은 크레파스 콧수염 낙서 */}
        <path d="M125 218 L88 212" stroke="#51483F" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M122 228 L86 232" stroke="#51483F" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M235 218 L272 212" stroke="#51483F" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M238 228 L274 232" stroke="#51483F" strokeWidth="5.5" strokeLinecap="round" />

        {/* 바닥을 딛고 있는 사자 앞발 2개 */}
        <path
          d="M135 285 L135 328 Q150 338 165 328 L165 292"
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path
          d="M195 292 L195 328 Q210 338 225 328 L225 285"
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="8"
          strokeLinejoin="round"
        />

        {/* 스케치북 주변 꼬마 낙서 */}
        <Star x={48} y={115} size={15} />
        <Star x={312} y={105} size={13} />
      </g>
    </svg>
  );
}

/* =========================================================
   HEAD WALKER (머리로 걸어다니는 사람 - 크레파스 손낙서 덩어리감)
========================================================= */
function HeadWalker() {
  return (
    <svg
      viewBox="0 0 360 360"
      className="main-character-svg"
      aria-label="크레파스로 그린 머리로 걷는 사람"
    >
      <CrayonDefs />

      <g filter="url(#crayonRoughness)">
        {/* 허공으로 뻗은 굵직한 다리 2개 (두툼한 크레파스 살구색 채색) */}
        {/* 왼쪽 다리 & 신발 */}
        <path
          d="
            M145 160
            L128 75
            Q120 40 98 38
            L78 36
            Q62 48 76 65
            L95 65
            L112 160
            Z
          "
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        {/* 왼쪽 빨간 신발 덩어리 */}
        <ellipse cx="80" cy="46" rx="18" ry="14" fill="url(#crayonRed)" stroke="#51483F" strokeWidth="6" />

        {/* 오른쪽 다리 & 신발 */}
        <path
          d="
            M215 160
            L232 75
            Q240 40 262 38
            L282 36
            Q298 48 284 65
            L265 65
            L248 160
            Z
          "
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        {/* 오른쪽 주황 신발 덩어리 */}
        <ellipse cx="280" cy="46" rx="18" ry="14" fill="url(#crayonOrange)" stroke="#51483F" strokeWidth="6" />

        {/* 거꾸로 입은 두툼한 파란색 멜빵바지 몸통 덩어리 */}
        <path
          d="
            M120 150
            L240 150
            Q235 220 220 226
            L140 226
            Q125 220 120 150
            Z
          "
          fill="url(#crayonBlue)"
          stroke="#51483F"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        {/* 노란색 굵직한 멜빵끈 덧칠 */}
        <path d="M150 150 L148 226" stroke="#FFDC00" strokeWidth="9" strokeLinecap="round" />
        <path d="M210 150 L212 226" stroke="#FFDC00" strokeWidth="9" strokeLinecap="round" />

        {/* 옆으로 균형 잡으려고 파닥거리는 두 팔 덩어리 */}
        <path
          d="M125 178 Q90 190 74 165 Q62 180 82 195 L125 195 Z"
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <circle cx="70" cy="165" r="10" fill="#FFE8B0" stroke="#51483F" strokeWidth="4.5" />

        <path
          d="M235 178 Q270 190 286 165 Q298 180 278 195 L235 195 Z"
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <circle cx="290" cy="165" r="10" fill="#FFE8B0" stroke="#51483F" strokeWidth="4.5" />

        {/* 거꾸로 바닥 쪽에 자리한 큼직하고 둥근 살구색 얼굴 덩어리 */}
        <ellipse
          cx="180"
          cy="255"
          rx="48"
          ry="38"
          fill="#FFE8B0"
          stroke="#51483F"
          strokeWidth="8"
        />

        {/* 큼직한 꼬마 공룡 스타일 타원 눈 2개 */}
        <circle cx="162" cy="250" r="12" fill="#FFFDF5" stroke="#51483F" strokeWidth="4.5" />
        <circle cx="163" cy="250" r="5" fill="#51483F" />

        <circle cx="198" cy="250" r="12" fill="#FFFDF5" stroke="#51483F" strokeWidth="4.5" />
        <circle cx="197" cy="250" r="5" fill="#51483F" />

        {/* 발그레 볼터치 */}
        <circle cx="145" cy="262" r="9" fill="#FF8A80" opacity="0.85" />
        <circle cx="215" cy="262" r="9" fill="#FF8A80" opacity="0.85" />

        {/* 거꾸로 활짝 웃는 크레파스 입 */}
        <path
          d="M166 270 Q180 282 194 270 Z"
          fill="#FF5E57"
          stroke="#51483F"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* 바닥을 딛고 있는 노란 비니 털모자 덩어리 (스케치북 바닥 지지대) */}
        <path
          d="
            M145 285
            Q180 295 215 285
            L208 312
            Q180 320 152 312
            Z
          "
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        {/* 큼직한 빨간 털방울 덩어리 (바닥 쿵쿵 접촉점) */}
        <circle cx="180" cy="328" r="15" fill="url(#crayonRed)" stroke="#51483F" strokeWidth="6" />

        {/* 바닥 뽈뽈 발자국 파티클 */}
        <Star x={52} y={118} size={14} />
        <Star x={308} y={115} size={14} />
      </g>
    </svg>
  );
}

/* =========================================================
   DREAM SPACESHIP (하늘 나는 우주선 - 크레파스 손낙서 덩어리감)
========================================================= */
function DreamSpaceship() {
  return (
    <svg
      viewBox="0 0 360 360"
      className="main-character-svg"
      aria-label="크레파스로 그린 하늘 나는 우주선"
    >
      <CrayonDefs />

      <g filter="url(#crayonRoughness)">
        {/* 우주선 꼬리에서 뿜어져 나오는 뭉게뭉게 크레파스 배기 연기 덩어리 */}
        <path
          d="
            M140 240
            Q100 260 125 295
            Q180 330 235 295
            Q260 260 220 240
            Z
          "
          fill="url(#crayonOrange)"
          stroke="#51483F"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        {/* 안쪽 노란 연기 덧칠 덩어리 */}
        <circle cx="180" cy="285" r="24" fill="url(#crayonYellow)" stroke="#51483F" strokeWidth="5" />

        {/* 뿜어져 나오는 알록달록 별사탕 덩어리들 */}
        <circle cx="145" cy="285" r="9" fill="url(#crayonRed)" stroke="#51483F" strokeWidth="3.5" />
        <circle cx="215" cy="285" r="9" fill="url(#crayonBlue)" stroke="#51483F" strokeWidth="3.5" />
        <circle cx="180" cy="308" r="8" fill="url(#crayonGreen)" stroke="#51483F" strokeWidth="3.5" />

        {/* 두툼하고 둥글넙적한 보라색 크레파스 비행접시 본체 덩어리 */}
        <ellipse
          cx="180"
          cy="195"
          rx="118"
          ry="48"
          fill="url(#crayonPurple)"
          stroke="#51483F"
          strokeWidth="9"
        />

        {/* 우주선 중앙을 가로지르는 굵은 노란색 크레용 범퍼 띠지 덩어리 */}
        <ellipse
          cx="180"
          cy="202"
          rx="102"
          ry="24"
          fill="url(#crayonYellow)"
          stroke="#51483F"
          strokeWidth="6"
        />

        {/* 우주선 둘레에 크레파스로 콕콕 박아놓은 무지개 전구들 */}
        <circle cx="100" cy="202" r="8" fill="url(#crayonRed)" stroke="#51483F" strokeWidth="3.5" />
        <circle cx="138" cy="210" r="8" fill="url(#crayonGreen)" stroke="#51483F" strokeWidth="3.5" />
        <circle cx="180" cy="214" r="9" fill="url(#crayonOrange)" stroke="#51483F" strokeWidth="4" />
        <circle cx="222" cy="210" r="8" fill="url(#crayonBlue)" stroke="#51483F" strokeWidth="3.5" />
        <circle cx="260" cy="202" r="8" fill="url(#crayonRed)" stroke="#51483F" strokeWidth="3.5" />

        {/* 삐뚤빼뚤 두툼한 투명 돔 유리창 덩어리 (하늘색 채색) */}
        <path
          d="
            M115 170
            C120 85 240 85 245 170
            Z
          "
          fill="url(#crayonBlue)"
          stroke="#51483F"
          strokeWidth="9"
          strokeLinejoin="round"
        />
        {/* 돔 유리창 하얀 크레용 광택 */}
        <path
          d="M142 125 Q160 110 185 112"
          fill="none"
          stroke="#FFFDF5"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* 돔 안에서 신나게 손을 흔드는 초록색 크레파스 외계인 덩어리 */}
        <circle
          cx="180"
          cy="145"
          r="26"
          fill="url(#crayonGreen)"
          stroke="#51483F"
          strokeWidth="6"
        />
        {/* 머리 위로 삐죽 솟은 별사탕 안테나 */}
        <path d="M180 120 L180 98" stroke="#51483F" strokeWidth="6" strokeLinecap="round" />
        <Star x={180} y={92} size={12} />

        {/* 꼬마 공룡 스타일의 동글동글 눈 2개 */}
        <circle cx="172" cy="142" r="4.5" fill="#51483F" />
        <circle cx="188" cy="142" r="4.5" fill="#51483F" />
        {/* 활짝 웃는 입 */}
        <path d="M174 153 Q180 159 186 153" fill="none" stroke="#51483F" strokeWidth="3.5" strokeLinecap="round" />
        {/* 신나게 파닥거리는 외계인 손 */}
        <path d="M202 142 Q215 130 212 118" fill="none" stroke="#51483F" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="212" cy="118" r="5.5" fill="url(#crayonGreen)" stroke="#51483F" strokeWidth="3" />

        {/* 우주를 날아다니는 반짝이 별들 */}
        <Star x={48} y={120} size={16} />
        <Star x={312} y={135} size={14} />
      </g>
    </svg>
  );
}

/* =========================================================
   손그림 대형 우체통 일러스트레이션 SVG
========================================================= */
function HandDrawnPostbox() {
  return (
    <svg viewBox="0 0 260 340" width="100%" height="100%" className="hand-drawn-postbox-svg" fill="none">
      <defs>
        {/* 따뜻한 클래식 레드 그라데이션 */}
        <linearGradient id="postboxRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="40%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        {/* 슬롯 깊이감 그라데이션 */}
        <linearGradient id="postboxSlotInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1c1917" />
          <stop offset="100%" stopColor="#292524" />
        </linearGradient>
      </defs>

      {/* 바닥 그림자 */}
      <ellipse cx="130" cy="326" rx="85" ry="12" fill="rgba(60, 44, 30, 0.12)" />

      {/* 우체통 스탠드 다리 2개 */}
      <rect x="92" y="255" width="16" height="60" rx="8" fill="#57534e" stroke="#3b2d20" strokeWidth="3.5" />
      <rect x="152" y="255" width="16" height="60" rx="8" fill="#57534e" stroke="#3b2d20" strokeWidth="3.5" />
      {/* 바닥 연결 발 */}
      <ellipse cx="100" cy="316" rx="20" ry="6" fill="#44403c" stroke="#3b2d20" strokeWidth="3" />
      <ellipse cx="160" cy="316" rx="20" ry="6" fill="#44403c" stroke="#3b2d20" strokeWidth="3" />

      {/* 우체통 메인 몸체 (하단 라운드 박스) */}
      <rect
        x="42"
        y="105"
        width="176"
        height="155"
        rx="22"
        fill="url(#postboxRedGrad)"
        stroke="#3b2d20"
        strokeWidth="4"
      />

      {/* 상단 둥근 돔 지붕 */}
      <path
        d="M 38 112 C 38 48, 222 48, 222 112 Z"
        fill="url(#postboxRedGrad)"
        stroke="#3b2d20"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* 지붕 차양 테두리 라인 */}
      <path
        d="M 32 112 Q 130 118 228 112"
        stroke="#3b2d20"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* 우체통 편지 투입구 (Mail Slot) */}
      <g className="postbox-mail-slot-group">
        {/* 투입구 테두리 프레임 */}
        <rect
          x="62"
          y="126"
          width="136"
          height="32"
          rx="16"
          fill="#fee2e2"
          stroke="#3b2d20"
          strokeWidth="3.5"
        />
        {/* 투입구 깊은 입구 */}
        <rect
          x="72"
          y="134"
          width="116"
          height="16"
          rx="8"
          fill="url(#postboxSlotInner)"
        />
        {/* 투입구 덮개 날개 */}
        <path
          d="M 70 134 Q 130 142 190 134"
          stroke="#ef4444"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* 몸체 중앙 '상상 우체통' 명판 */}
      <rect
        x="75"
        y="176"
        width="110"
        height="44"
        rx="10"
        fill="#fef3c7"
        stroke="#3b2d20"
        strokeWidth="3"
      />
      <text
        x="130"
        y="196"
        textAnchor="middle"
        fontFamily="DaeHan, sans-serif"
        fontSize="12.5"
        fontWeight="bold"
        fill="#78350f"
      >
        상상 우체통
      </text>
      <text
        x="130"
        y="211"
        textAnchor="middle"
        fontFamily="Pretendard, sans-serif"
        fontSize="9.5"
        fontWeight="600"
        letterSpacing="1"
        fill="#b45309"
      >
        POST BOX
      </text>

      {/* 열쇠 구멍 디테일 */}
      <circle cx="130" cy="236" r="3.5" fill="#3b2d20" />
      <path d="M 128.5 236 L 127 245 L 133 245 L 131.5 236 Z" fill="#3b2d20" />

      {/* 귀여운 손그림 반짝이 하이라이트 */}
      <path
        d="M 58 75 Q 85 62 120 60"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="206" cy="78" r="3" fill="#ffffff" opacity="0.8" />
      <circle cx="215" cy="92" r="2" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

/* =========================================================
   상상 속 캐릭터 라인업
========================================================= */
const IMAGINATION_CHARACTERS = [
  {
    id: "dino",
    name: "꼬마 공룡",
    subtitle: "오늘은 하늘을 날고 싶은 꼬마 공룡!",
    motionClass: "motion-dino",
    Component: MainDinosaur,
  },
  {
    id: "rabbit-lion",
    name: "토끼귀 사자",
    subtitle: "토끼 귀가 쫑긋 자라난 수줍은 사자",
    motionClass: "motion-rabbit-lion",
    Component: RabbitLion,
  },
  {
    id: "head-walker",
    name: "머리로 걷는 사람",
    subtitle: "머리로 세상을 거꾸로 걷는 유쾌한 여행자",
    motionClass: "motion-head-walker",
    Component: HeadWalker,
  },
  {
    id: "dream-spaceship",
    name: "하늘 나는 우주선",
    subtitle: "별사탕 연료로 하늘을 나는 우주선",
    motionClass: "motion-spaceship",
    Component: DreamSpaceship,
  },
];

/* =========================================================
   MENU
========================================================= */

const menuItems = [
  "홈",
  "상상하기",
  "만약에 카드",
  "나의 상상",
  "ABOUT",
];

/* =========================================================
   이미지 스타일
   매번 다른 분위기를 서버에 전달
========================================================= */

const imageStyles = [
  "따뜻한 크레파스 그림책 느낌",
  "조금 더 자유로운 어린이 낙서 그림 느낌",
  "색연필과 크레파스를 섞은 동화책 느낌",
  "종이에 직접 그린 듯한 손그림 느낌",
  "밝고 장난스러운 상상 그림 느낌",
  "조금 몽환적인 어린이 그림책 느낌",
  "거친 크레파스 질감이 살아있는 그림",
  "부드러운 색연필과 수채화가 섞인 느낌",
];

/* =========================================================
   위로 문구 판단
========================================================= */

const comfortKeywords = [
  "실패",
  "못",
  "안돼",
  "안 되",
  "싫",
  "힘들",
  "힘든",
  "슬프",
  "슬퍼",
  "울",
  "무서",
  "두려",
  "외로",
  "포기",
  "망했",
  "좌절",
  "후회",
  "걱정",
  "불안",
  "아프",
  "괴롭",
  "답답",
];

function getComfortMessage(answer = "") {
  const hasNegativeTone = comfortKeywords.some((keyword) =>
    answer.includes(keyword)
  );

  if (!hasNegativeTone) {
    return null;
  }

  const messages = [
    "괜찮아. 이런 상상도 너만의 멋진 이야기야.",
    "조금 힘든 마음도 상상 속에서는 잠시 쉬어가도 괜찮아.",
    "완벽하지 않아도 괜찮아. 네가 떠올린 이야기는 충분히 소중해.",
    "오늘의 상상도 잘 간직해둘게. 다음에는 조금 더 가벼운 상상을 해볼까?",
  ];

  return messages[
    Math.floor(Math.random() * messages.length)
  ];
}

/* =========================================================
   그림일기 손그림 날씨 SVG 아이콘 (도안 스타일)
========================================================= */
function WeatherSunIcon() {
  return (
    <svg viewBox="0 0 32 32" className="diary-weather-svg" fill="none">
      {/* 둥근 해 중심 */}
      <circle cx="16" cy="16" r="6.5" fill="#222222" />
      {/* 삐뚤빼뚤한 손그림 햇살선 */}
      <path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l3 3M22.2 22.2l3 3M6.8 25.2l3-3M22.2 9.8l3-3" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WeatherCloudSunIcon() {
  return (
    <svg viewBox="0 0 32 32" className="diary-weather-svg" fill="none">
      {/* 뒤쪽 해 */}
      <circle cx="21" cy="12" r="4.5" fill="#222222" />
      <path d="M21 4.5v2.5M26.5 9.5l-2 1M27.5 15h-2" stroke="#222222" strokeWidth="1.8" strokeLinecap="round" />
      {/* 앞쪽 손그림 뭉게구름 */}
      <path
        d="M7 23h16a5 5 0 0 0 1-9.9 6 6 0 0 0-11.2-1.8A5 5 0 0 0 7 23z"
        fill="#ffffff"
        stroke="#222222"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WeatherRainIcon() {
  return (
    <svg viewBox="0 0 32 32" className="diary-weather-svg" fill="none">
      {/* 뭉게구름 */}
      <path
        d="M6 17h19a4.5 4.5 0 0 0 .5-8.9 5.5 5.5 0 0 0-10.2-1.7A4.5 4.5 0 0 0 6 17z"
        fill="#ffffff"
        stroke="#222222"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 뚝뚝 떨어지는 빗줄기 */}
      <path d="M10 21l-2 5M15 21l-2 5M20 21l-2 5M25 21l-2 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WeatherUmbrellaIcon() {
  return (
    <svg viewBox="0 0 32 32" className="diary-weather-svg" fill="none">
      {/* 우산 꼭지 */}
      <path d="M16 4.5v3" stroke="#222222" strokeWidth="2.2" strokeLinecap="round" />
      {/* 우산 돔 형태 */}
      <path
        d="M5 19c0-6 4.9-11.5 11-11.5s11 5.5 11 11.5c-2.2-1.5-5.2-1.5-7.3 0-2.2-1.5-5.2-1.5-7.4 0-2.2-1.5-5.1-1.5-7.3 0z"
        fill="#ffffff"
        stroke="#222222"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 우산 살 세로선 */}
      <path d="M16 7.5v11.5M11.5 9.5c1 3 1.5 6 1.3 9M20.5 9.5c-1 3-1.5 6-1.3 9" stroke="#222222" strokeWidth="1.2" strokeLinecap="round" />
      {/* 우산 손잡이 대와 U자 걸이 */}
      <path d="M16 19v7a2.5 2.5 0 0 1-5 0" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WeatherSnowmanIcon() {
  return (
    <svg viewBox="0 0 32 32" className="diary-weather-svg" fill="none">
      {/* 눈사람 머리 */}
      <circle cx="16" cy="13" r="5" fill="#ffffff" stroke="#222222" strokeWidth="2" />
      {/* 눈사람 몸통 */}
      <circle cx="16" cy="22" r="7" fill="#ffffff" stroke="#222222" strokeWidth="2" />
      {/* 삐딱한 털모자 */}
      <path d="M12.5 9.5l7-2.5 1.5 4-7 2.5z" fill="#222222" stroke="#222222" strokeWidth="1" />
      <circle cx="21.5" cy="6.2" r="1.5" fill="#222222" />
      {/* 눈 2개 */}
      <circle cx="14.5" cy="12.5" r="0.9" fill="#222222" />
      <circle cx="17.5" cy="12" r="0.9" fill="#222222" />
      {/* 단추 2개 */}
      <circle cx="16" cy="19.5" r="0.9" fill="#222222" />
      <circle cx="16" cy="23" r="0.9" fill="#222222" />
      {/* 나뭇가지 팔 */}
      <path d="M10 20l-4-2M22 20l4-2" stroke="#222222" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================
   월간 다이어리 1~12월 목록
========================================================= */
const MONTH_LIST = [
  { key: "JAN", monthNum: 1, label: "1월", eng: "JAN" },
  { key: "FEB", monthNum: 2, label: "2월", eng: "FEB" },
  { key: "MAR", monthNum: 3, label: "3월", eng: "MAR" },
  { key: "APR", monthNum: 4, label: "4월", eng: "APR" },
  { key: "MAY", monthNum: 5, label: "5월", eng: "MAY" },
  { key: "JUN", monthNum: 6, label: "6월", eng: "JUN" },
  { key: "JUL", monthNum: 7, label: "7월", eng: "JUL" },
  { key: "AUG", monthNum: 8, label: "8월", eng: "AUG" },
  { key: "SEP", monthNum: 9, label: "9월", eng: "SEP" },
  { key: "OCT", monthNum: 10, label: "10월", eng: "OCT" },
  { key: "NOV", monthNum: 11, label: "11월", eng: "NOV" },
  { key: "DEC", monthNum: 12, label: "12월", eng: "DEC" },
];

/* =========================================================
   APP
========================================================= */


/* =========================================================
   DIARY STORY FORMATTER (질문-답변을 일기체 문장으로 자연스럽게 변환)
========================================================= */
function formatToDiaryStory(question, answer, customStory = null) {
  if (customStory && typeof customStory === "string" && customStory.trim()) {
    return customStory.trim();
  }
  if (!question && !answer) return "";
  if (!question) return answer;
  if (!answer) return question;

  const rawAns = answer.trim();
  // 따옴표 중복 방지 및 텍스트 정돈
  const cleanAns = rawAns.replace(/^["'“”]/, "").replace(/["'“”]$/, "").trim();

  // 1. 질문 정리 (물음표 및 선두 '만약' 제거)
  let q = question.trim().replace(/\?$/, "").replace(/^만약\s*/, "");

  // 질문 유형 판별 (질문형 / 편지글쓰기형 / 일반 상상형)
  const isAsk = /질문|물어|묻고|물어보고|말을|통화/.test(q) || cleanAns.includes("?");
  const isWrite = /적고|쓰고|남기고|편지|엽서|문장/.test(q);

  // 2. 꼬리말 의문문 정제 (복합 수식어 및 서술형 꼬리말 완벽 정제)
  q = q.replace(/\s*(그\s*사람에게|그곳에서|어떤\s*사람에게|그\s*대상에게)?\s*(어떤\s*말을|무슨\s*말을|어떤\s*질문을|어디로|어떻게|누구와|무엇이|무엇을|무슨\s*생각을).*?(전하고\s*싶은가|적고\s*싶은가|묻고\s*싶은가|하고\s*싶은가|가고\s*싶은가|만들고\s*싶은가|될까|있을까|할까|생각하는가|남기고\s*싶은가|바라는가|하고\s*싶나)$/, "");
  q = q.trim();

  // 3. 첫 번째 문장: 상황/가정 서술 ("나는 오늘 ~를 했다.")
  let sentence1 = "";
  if (q.includes("통화할 수 있다면") || q.includes("통화한다면")) {
    const target = q.replace(/통화할\s*수\s*있다면|통화한다면/, "").trim();
    sentence1 = `나는 오늘 ${target} 통화를 했다.`;
  } else if (q.includes("편지를 보낼 수 있다면") || q.includes("편지를 쓴다면")) {
    const target = q.replace(/편지를\s*보낼\s*수\s*있다면|편지를\s*쓴다면/, "").trim();
    sentence1 = `나는 오늘 ${target} 편지를 보냈다.`;
  } else if (q.endsWith("갈 수 있다면") || q.endsWith("떠날 수 있다면")) {
    const target = q.replace(/(갈|떠날)\s*수\s*있다면$/, "").trim();
    sentence1 = `나는 오늘 ${target} 여행을 떠났다.`;
  } else if (q.endsWith("사람이 있다면") || q.endsWith("사람이 나타난다면")) {
    sentence1 = `나는 오늘 ${q.replace(/사람이\s*(있다면|나타난다면)$/, "사람이 있는")} 상상을 했다.`;
  } else if (q.endsWith("수 있다면")) {
    const base = q.replace(/수\s*있다면$/, "").trim();
    sentence1 = `나는 오늘 ${base} 보았다.`;
  } else if (q.endsWith("된다면")) {
    const base = q.replace(/된다면$/, "").trim();
    sentence1 = `나는 오늘 ${base} 되었다.`;
  } else if (q.endsWith("라면")) {
    const base = q.replace(/라면$/, "").trim();
    sentence1 = `나는 오늘 ${base} 상상을 했다.`;
  } else if (q.endsWith("있다면")) {
    const base = q.replace(/있다면$/, "").trim();
    sentence1 = `나는 오늘 ${base} 있는 상상을 했다.`;
  } else {
    sentence1 = `나는 오늘 ${q} 상상을 했다.`;
  }

  // 4. 두 번째 문장: 행동/말 서술 ("나는 적었다." / "나는 물었다." / "나는 말했다." / "나는 생각했다.")
  let sentence2 = "나는 말했다.";
  if (isWrite) {
    sentence2 = "나는 적었다.";
  } else if (isAsk) {
    sentence2 = /물어|묻고|질문/.test(question) ? "나는 물었다." : "나는 말했다.";
  } else {
    sentence2 = "나는 생각했다.";
  }

  // 5. 최종 일기 문장 결합
  return `${sentence1} ${sentence2} "${cleanAns}"`;
}

/* 선(Line) 형태의 감성 벡터 아이콘 4종 */
function LineDownloadIcon({ size = 25, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function LineShareIcon({ size = 25, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function LineRefreshIcon({ size = 25, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
    </svg>
  );
}

function LineBookIcon({ size = 25, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}


/* 손으로 직접 그린 듯한 감성 크레파스 SVG 아이콘 */
function HandDrawnCrayonIcon({ size = 22, color = "#ff7700" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hand-drawn-crayon-svg"
    >
      {/* 뾰족한 크레파스 심 */}
      <path
        d="M18.8 4.2L16 2.4C15.6 2.1 15 2.3 14.7 2.7L13.8 4.2L18.3 7.2L19.2 5.7C19.5 5.2 19.3 4.6 18.8 4.2Z"
        fill={color}
        stroke="#4a3e35"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* 크레파스 원통 몸체 */}
      <path
        d="M13.8 4.2L5.8 16.5C5.6 16.8 5.7 17.2 6 17.4L9.5 19.7C9.8 19.9 10.2 19.8 10.4 19.5L18.3 7.2L13.8 4.2Z"
        fill={color}
        stroke="#4a3e35"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* 손으로 감싼 띠지 라벨 (화이트 종이 래퍼) */}
      <path
        d="M11.6 8.5L7.2 15.3L9.2 16.6L13.6 9.8L11.6 8.5Z"
        fill="#ffffff"
        stroke="#4a3e35"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 13.8L10.5 12.5"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   닉네임 → 고유 숫자 ID(bigint) 변환 함수 (백엔드와 1:1 일치)
========================================================= */
function nicknameToUserId(nickname) {
  if (!nickname || typeof nickname !== "string") return 1;
  const clean = nickname.trim();
  if (!clean) return 1;
  let hash = 2166136261;
  for (let i = 0; i < clean.length; i++) {
    hash ^= clean.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash % 2000000000) + 1;
}

function App() {
  const [page, setPage] = useState("home");
  const [prevPage, setPrevPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [cursorPos, setCursorPos] = useState(0);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  /* -------------------------------------------------------
     API 절약 테스트 모드 (기본 true: 크레딧 0원 무제한 테스트)
  ------------------------------------------------------- */
  const [isApiSaveMode, setIsApiSaveMode] = useState(() => {
    try {
      const saved = localStorage.getItem("manyak_api_save_mode");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("manyak_api_save_mode", JSON.stringify(isApiSaveMode));
    } catch (e) {
      // ignore
    }
  }, [isApiSaveMode]);

  /* -------------------------------------------------------
     닉네임 상태 (localStorage 유지)
  ------------------------------------------------------- */
  const [currentNickname, setCurrentNickname] = useState(() => {
    try {
      const saved = localStorage.getItem("manyak_user_nickname");
      return saved ? saved.trim() : "";
    } catch {
      return "";
    }
  });
  const [isNicknameRegistered, setIsNicknameRegistered] = useState(() => {
    try {
      return !!localStorage.getItem("manyak_user_nickname");
    } catch {
      return false;
    }
  });
  const [homeNicknameInput, setHomeNicknameInput] = useState("");
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
  const [tempNickname, setTempNickname] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionLoading, setQuestionLoading] = useState(false);

  const [myAnswers, setMyAnswers] = useState([]);
  const [answersLoading, setAnswersLoading] = useState(false);

  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [resultAnswer, setResultAnswer] = useState(null);

  /* =======================================================
     다이어리 꾸미기(다꾸) 스티커 상태 및 핸들러
  ======================================================= */
  /* 아이폰 이모지 팔레트 */
  const STICKER_PALETTE = [
    { type: "heart", emoji: "❤️", label: "하트" },
    { type: "pleading", emoji: "🥺", label: "눈망울" },
    { type: "fire", emoji: "🔥", label: "불꽃" },
    { type: "sparkle", emoji: "✨", label: "반짝이" },
    { type: "bubble", emoji: "🫧", label: "비눗방울" },
    { type: "ribbon", emoji: "🎀", label: "리본" },
    { type: "bear", emoji: "🧸", label: "곰인형" },
    { type: "cloud", emoji: "☁️", label: "구름" },
    { type: "flower", emoji: "🌸", label: "벚꽃" },
    { type: "clover", emoji: "🍀", label: "네잎클로버" },
    { type: "strawberry", emoji: "🍓", label: "딸기" },
    { type: "mail", emoji: "💌", label: "러브레터" },
    { type: "cat", emoji: "🐱", label: "고양이" },
    { type: "coffee", emoji: "☕", label: "커피" },
    { type: "headphones", emoji: "🎧", label: "헤드폰" },
    { type: "butterfly", emoji: "🦋", label: "나비" },
    { type: "cake", emoji: "🧁", label: "컵케이크" },
    { type: "avocado", emoji: "🥑", label: "아보카도" },
  ];

  const [plannerStickers, setPlannerStickers] = useState(() => {
    try {
      const saved = localStorage.getItem("manyak_planner_stickers");
      return saved
        ? JSON.parse(saved)
        : [
            { id: "s-init-1", emoji: "🫧", label: "비눗방울", x: 38, y: 12, rotate: -6 },
            { id: "s-init-2", emoji: "🎂", label: "딸기 케이크", x: 28, y: 38, rotate: 5 },
            { id: "s-init-3", emoji: "🏷️", label: "마스킹 테이프", x: 42, y: 22, rotate: -3 },
            { id: "s-init-4", emoji: "☕", label: "라떼 커피", x: 70, y: 65, rotate: 2 },
          ];
    } catch {
      return [];
    }
  });

  const [stickerBarOpen, setStickerBarOpen] = useState(true);
  const [activePlannerMonth, setActivePlannerMonth] = useState(() => {
    const now = new Date();
    const mIndex = now.getMonth();
    return MONTH_LIST[mIndex]?.key || "OCT";
  });
  const [draggingStickerId, setDraggingStickerId] = useState(null);

  /* 아이폰 스티커 & 크레파스 그리기 상태 */
  
  /* 메인 화면 캐릭터 스케치북 전용 크레파스 드로잉 상태 */
  const [homeDrawingOpen, setHomeDrawingOpen] = useState(false);
  const [homeCrayonColor, setHomeCrayonColor] = useState("#f1c40f");
  const homeCanvasRef = useRef(null);
  const isHomePaintingRef = useRef(false);

  /* 메인 화면 상상 캐릭터 전환 상태 (공룡, 토끼귀 사자, 머리로 걷는 사람, 우주선 등) */
  const [homeCharIndex, setHomeCharIndex] = useState(0);
  const [isHomeCharSwitching, setIsHomeCharSwitching] = useState(false);

  const handleNextHomeCharacter = () => {
    setIsHomeCharSwitching(true);
    setHomeCharIndex((prev) => (prev + 1) % IMAGINATION_CHARACTERS.length);
    setTimeout(() => {
      setIsHomeCharSwitching(false);
    }, 450);
  };

  const startHomeCrayonDraw = (e) => {
    if (!homeDrawingOpen) return;
    const canvas = homeCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    isHomePaintingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const drawHomeCrayon = (e) => {
    if (!homeDrawingOpen || !isHomePaintingRef.current) return;
    const canvas = homeCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = homeCrayonColor;
    ctx.globalAlpha = 0.88;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopHomeCrayonDraw = () => {
    isHomePaintingRef.current = false;
  };

  const [dockTab, setDockTab] = useState("stickers"); // "stickers" | "crayon"
  const [customBubbleText, setCustomBubbleText] = useState("");
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [crayonColor, setCrayonColor] = useState("#f1c40f");
  const [crayonWidth, setCrayonWidth] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const drawingCanvasRef = useRef(null);
  const isPaintingRef = useRef(false);

  // 크레파스 8가지 색상
  const CRAYON_PALETTE = [
    { name: "빨강", color: "#e74c3c" },
    { name: "주황", color: "#ff851b" },
    { name: "노랑", color: "#ffdc00" },
    { name: "초록", color: "#2ecc40" },
    { name: "파랑", color: "#0074d9" },
    { name: "보라", color: "#b10dc9" },
    { name: "갈색", color: "#795548" },
    { name: "검정", color: "#111111" },
  ];

  // 기본 5가지 색상 및 최근 사용 색상 히스토리
  const DEFAULT_CRAYON_COLORS = [
    "#e74c3c", "#ff851b", "#ffdc00", "#2ecc40", "#0074d9"
  ];

  const [recentCrayonColors, setRecentCrayonColors] = useState(() => {
    try {
      const saved = localStorage.getItem("manyak_recent_crayon_colors");
      return saved ? JSON.parse(saved).slice(0, 5) : DEFAULT_CRAYON_COLORS;
    } catch {
      return DEFAULT_CRAYON_COLORS;
    }
  });

  const colorInputRef = useRef(null);
  const colorCommitTimeoutRef = useRef(null);

  // 1. 기존 컬러칩 클릭 시 (목록 변경 없이 색상만 선택)
  const handleSelectColorChip = (color) => {
    if (!color) return;
    setCrayonColor(color);
    setIsEraser(false);
    setIsDrawingMode(true);
  };

  // 2. 무지개 컬러 피커로 새로운 색상 선택 확정 시 (목록 맨 앞에 1개만 누적 추가, 최대 5개 유지)
  const handleCommitNewColor = (color) => {
    if (!color) return;
    setCrayonColor(color);
    setIsEraser(false);
    setIsDrawingMode(true);
    setRecentCrayonColors((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== color.toLowerCase());
      const next = [color, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("manyak_recent_crayon_colors", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // 3. 컬러 피커 조절 시 디바운스 확정 (조작 완료 시 1개만 누적)
  const handleColorInputChange = (e) => {
    const val = e.target.value;
    setCrayonColor(val);
    setIsEraser(false);
    setIsDrawingMode(true);
    if (colorCommitTimeoutRef.current) {
      clearTimeout(colorCommitTimeoutRef.current);
    }
    colorCommitTimeoutRef.current = setTimeout(() => {
      handleCommitNewColor(val);
    }, 300);
  };

  // 아이폰 말풍선 / 알림 스티커 생성
  const handleAddIphoneBubble = (style = "blue", textToUse = null) => {
    const text = (textToUse || customBubbleText || "").trim();
    if (!text) {
      showToast("말풍선에 넣을 글자를 입력해줘! 💬");
      return;
    }
    const newSticker = {
      id: `iphone-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      stickerType: style === "alert" ? "ios-alert" : style === "music" ? "ios-music" : "imessage",
      bubbleStyle: style,
      text,
      label: style === "alert" ? "알림 배너" : "아이폰 말풍선",
      x: 35 + (Math.random() * 20 - 10),
      y: 35 + (Math.random() * 20 - 10),
      rotate: Math.floor(Math.random() * 8 - 4),
    };
    setPlannerStickers((prev) => [...prev, newSticker]);
    setCustomBubbleText("");
    showToast("아이폰 말풍선 스티커를 다이어리에 붙였어! 💬");
  };

  // 크레파스 드로잉 로직
  const startCrayonDraw = (e) => {
    if (!isDrawingMode) return;
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    isPaintingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const drawCrayon = (e) => {
    if (!isDrawingMode || !isPaintingRef.current) return;
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = crayonWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = crayonColor;
      ctx.globalAlpha = 0.88;
    }

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopCrayonDraw = () => {
    isPaintingRef.current = false;
  };

  const handleClearDrawing = () => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showToast("그린 그림을 깨끗이 지웠어! 🧹");
  };
  const plannerSheetRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("manyak_planner_stickers", JSON.stringify(plannerStickers));
    } catch (e) {
      console.error(e);
    }
  }, [plannerStickers]);

  const handleAddSticker = (sticker) => {
    const newSticker = {
      id: `sticker-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      emoji: sticker.emoji,
      label: sticker.label,
      x: 35 + (Math.random() * 25 - 12),
      y: 35 + (Math.random() * 25 - 12),
      rotate: Math.floor(Math.random() * 24 - 12),
    };
    setPlannerStickers((prev) => [...prev, newSticker]);
    showToast(`${sticker.label} 스티커를 붙였어! 드래그해서 원하는 곳으로 옮겨봐 ✦`);
  };

  const handleRemoveSticker = (id, e) => {
    if (e) e.stopPropagation();
    setPlannerStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetStickers = () => {
    if (window.confirm("다이어리에 붙인 스티커를 모두 지울까?")) {
      setPlannerStickers([]);
      showToast("스티커를 모두 정리했어.");
    }
  };

  const handleStickerPointerDown = (e, id) => {
    e.stopPropagation();
    setDraggingStickerId(id);
  };

  const handlePlannerPointerMove = (e) => {
    if (!draggingStickerId || !plannerSheetRef.current) return;
    const rect = plannerSheetRef.current.getBoundingClientRect();
    const x = Math.max(3, Math.min(94, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(3, Math.min(94, ((e.clientY - rect.top) / rect.height) * 100));

    setPlannerStickers((prev) =>
      prev.map((s) => (s.id === draggingStickerId ? { ...s, x, y } : s))
    );
  };

  const handlePlannerPointerUp = () => {
    if (draggingStickerId) {
      setDraggingStickerId(null);
    }
  };

  /* =======================================================
  /* 현재 브라우저에 임시 저장되는 상상 */
  const [localImaginations, setLocalImaginations] = useState(() => {
    try {
      const saved = localStorage.getItem("manyakImaginations");

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  /* =======================================================
     월 및 주차별 다이어리 상태 및 계산
  ======================================================= */
  const MONTH_NAMES = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];
  const MONTH_ENG = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const [activeMonthIdx, setActiveMonthIdx] = useState(() => new Date().getMonth());

  // 현재 월의 주차별 날짜 배열 계산 (7일씩 분할)
  const weeksOfMonth = useMemo(() => {
    const year = 2026;
    const month = activeMonthIdx;
    const startDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [activeMonthIdx]);

  // 오늘 날짜가 속한 주차를 기본값으로 선택
  const [activeWeekIdx, setActiveWeekIdx] = useState(() => {
    const today = new Date().getDate();
    const year = 2026;
    const month = new Date().getMonth();
    const startDay = new Date(year, month, 1).getDay();
    const dayIndexInGrid = startDay + today - 1;
    return Math.max(0, Math.floor(dayIndexInGrid / 7));
  });

  // 다이어리 속지 크기에 맞춰 크레파스 캔버스 해상도 자동 동기화
  
  // 메인 화면 캐릭터 스케치북 캔버스 크기 동기화
  useEffect(() => {
    const canvas = homeCanvasRef.current;
    if (canvas && canvas.parentElement) {
      const rect = canvas.parentElement.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    }
  }, [page, homeDrawingOpen]);

  useEffect(() => {
    const updateCanvasSize = () => {
      const sheet = plannerSheetRef.current;
      const canvas = drawingCanvasRef.current;
      if (sheet && canvas) {
        const rect = sheet.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext("2d");
          if (canvas.width > 0 && canvas.height > 0) {
            tempCtx.drawImage(canvas, 0, 0);
          }

          canvas.width = rect.width;
          canvas.height = rect.height;

          const ctx = canvas.getContext("2d");
          if (tempCanvas.width > 0 && tempCanvas.height > 0) {
            ctx.drawImage(tempCanvas, 0, 0);
          }
        }
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [page, activeWeekIdx, activeMonthIdx]);

  const handlePrevMonth = () => {
    setActiveMonthIdx((prev) => (prev === 0 ? 11 : prev - 1));
    setActiveWeekIdx(0);
    showToast(`${activeMonthIdx === 0 ? "12월" : `${activeMonthIdx}월`} 플래너로 넘겼어! 📖`);
  };

  const handleNextMonth = () => {
    setActiveMonthIdx((prev) => (prev === 11 ? 0 : prev + 1));
    setActiveWeekIdx(0);
    showToast(`${activeMonthIdx === 11 ? "1월" : `${activeMonthIdx + 2}월`} 플래너로 넘겼어! 📖`);
  };

  /* =======================================================
     월간 다이어리 설정 (1~12월 정보 및 2026년 시작 요일/일수)
  ======================================================= */

  const MONTH_CONFIG = useMemo(() => {
    const config = {};
    const year = 2026;
    MONTH_LIST.forEach((m) => {
      const monthIdx = m.monthNum - 1;
      const startDay = new Date(year, monthIdx, 1).getDay(); // 0(SUN) ~ 6(SAT)
      const days = new Date(year, monthIdx + 1, 0).getDate(); // 28, 30, 31
      config[m.key] = {
        key: m.key,
        num: m.monthNum,
        name: m.eng,
        label: m.label,
        year,
        days,
        startDay,
      };
    });
    return config;
  }, []);

  /* =======================================================
     로컬 상상 + 서버 상상 지능적 병합 (이미지 우선 배치)
  ======================================================= */
  const allCombinedAnswers = useMemo(() => {
    const list = [];
    const seen = new Set();

    // 1. 방금 생성된 최신 상상 (현재 세션)
    if (generatedImage && resultAnswer) {
      list.push({
        id: "current-session",
        question: resultAnswer.question,
        answer: resultAnswer.answer,
        image_url: generatedImage,
        question_type: resultAnswer.question_type || "오늘의 상상",
        created_at: new Date().toISOString(),
      });
      seen.add(resultAnswer.question);
    }

    // 2. 브라우저 로컬 저장소 상상 (localImaginations)
    (localImaginations || []).forEach((item) => {
      if (item && item.question && !seen.has(item.question)) {
        list.push({
          id: item.id || `local-${Math.random()}`,
          question: item.question,
          answer: item.answer,
          image_url: item.image_url || item.imageUrl,
          question_type: item.question_type || item.questionType || "로컬 상상",
          created_at: item.created_at || item.createdAt || new Date().toISOString(),
        });
        seen.add(item.question);
      }
    });

    // 3. 서버 DB 상상 (myAnswers)
    (myAnswers || []).forEach((item) => {
      if (item && item.question) {
        if (!seen.has(item.question)) {
          list.push({
            ...item,
            id: item.answer_id || item.id,
          });
          seen.add(item.question);
        } else {
          const target = list.find((x) => x.question === item.question);
          if (target && !target.image_url && item.image_url) {
            target.image_url = item.image_url;
          }
        }
      }
    });

    // 이미지가 있는 상상이 항상 앞쪽에 오도록 정렬 (날짜별 칸에 우선 노출!)
    return list.sort((a, b) => {
      const aHasImg = a.image_url ? 1 : 0;
      const bHasImg = b.image_url ? 1 : 0;
      if (aHasImg !== bHasImg) return bHasImg - aHasImg;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  }, [generatedImage, resultAnswer, localImaginations, myAnswers]);

  /* 대시보드에서 선택한 상상 */
  const [selectedMemory, setSelectedMemory] = useState(null);

  /* 토스트 알림 상태 */
  const [toastMessage, setToastMessage] = useState("");

  /* =========================================================
     ABOUT 페이지: 작은 상상 우체통 엽서 상태
  ========================================================= */
  const DEFAULT_POSTBOX_LETTERS = [
    {
      id: "letter-1",
      sender: "소현",
      content: "만약에 비가 오는 날 하늘에서 달콤한 팝콘이 톡톡 터지며 내린다면 우산 대신 큰 바구니를 들고 나갈 거야! 🍿",
      createdAt: "2026. 10. 20",
    },
    {
      id: "letter-2",
      sender: "동심가 민우",
      content: "만약에 고양이와 딱 하루만 말이 통한다면, 매일 창밖을 보며 무슨 생각을 하는지 제일 먼저 물어보고 싶어요. 🐾",
      createdAt: "2026. 10. 21",
    },
    {
      id: "letter-3",
      sender: "익명의 상상가",
      content: "어른이 되어서도 이런 엉뚱한 상상을 할 수 있는 공간이 있어서 오늘 하루가 참 따뜻해졌어요. 고마워요 만약에! ✨",
      createdAt: "2026. 10. 22",
    },
  ];

  // 만약에 카드 메인 서브 탭 ('worldcup' | 'postbox')
  const [cardSubTab, setCardSubTab] = useState("worldcup");

  const [postboxLetters, setPostboxLetters] = useState(() => {
    try {
      const saved = localStorage.getItem("manyak_postbox_letters");
      return saved ? JSON.parse(saved) : DEFAULT_POSTBOX_LETTERS;
    } catch {
      return DEFAULT_POSTBOX_LETTERS;
    }
  });

  const [postboxContent, setPostboxContent] = useState("");
  const [postboxSender, setPostboxSender] = useState("");
  const [isFlyingPostcard, setIsFlyingPostcard] = useState(false);
  const [flyingPostcardPhase, setFlyingPostcardPhase] = useState(""); // "folding" -> "flying" -> "into-slot"
  const [flyingPostcardData, setFlyingPostcardData] = useState(null);
  const [postboxBounce, setPostboxBounce] = useState(false);
  const [slotGlow, setSlotGlow] = useState(false);
  const [postboxSuccessMsg, setPostboxSuccessMsg] = useState("");
  const [selectedPostboxLetter, setSelectedPostboxLetter] = useState(null);

  // 파스텔 톤 테마 색상 배열 (참고 이미지 스타일의 감성 메모/엽서)
  const PASTEL_THEMES = [
    { bg: "#e0f2fe", border: "#bae6fd", stamp: "#0284c7", rotate: "-1.8deg" },
    { bg: "#fef9c3", border: "#fef08a", stamp: "#ca8a04", rotate: "2.2deg" },
    { bg: "#ffe4e6", border: "#fecdd3", stamp: "#e11d48", rotate: "-2.4deg" },
    { bg: "#f0fdf4", border: "#bbf7d0", stamp: "#16a34a", rotate: "1.6deg" },
    { bg: "#faeedd", border: "#ead5be", stamp: "#b45309", rotate: "-1.2deg" },
    { bg: "#f3e8ff", border: "#e9d5ff", stamp: "#9333ea", rotate: "2.0deg" },
  ];

  // 무한 롤링 마퀴를 위한 복제 배열 (끊김 없는 Seamless Loop)
  const marqueeLetters = useMemo(() => {
    if (!postboxLetters || postboxLetters.length === 0) return [];
    let base = [...postboxLetters];
    while (base.length < 8) {
      base = [...base, ...postboxLetters];
    }
    return [...base, ...base];
  }, [postboxLetters]);

  const postboxSlotRef = useRef(null);
  const postcardSheetRef = useRef(null);
  const [flyOffsets, setFlyOffsets] = useState({ x: -380, y: 0 });

  // 서버로부터 모든 사용자의 공용 엽서 목록 동기화
  useEffect(() => {
    const fetchSharedLetters = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/postbox/letters`);
        const data = await res.json();
        if (data && data.success && Array.isArray(data.letters)) {
          setPostboxLetters(data.letters);
          try {
            localStorage.setItem("manyak_postbox_letters", JSON.stringify(data.letters));
          } catch (e) {}
        }
      } catch (err) {
        console.warn("우체통 서버 동기화 실패(로컬 캐시 사용):", err);
      }
    };
    fetchSharedLetters();
  }, [cardSubTab]);

  const handleSendPostboxLetter = (e) => {
    e.preventDefault();
    if (isFlyingPostcard) return; // 전송 중 중복 클릭 방지
    const content = postboxContent.trim();
    if (!content) {
      alert("우체통에 넣을 상상 이야기나 질문을 적어주세요!");
      return;
    }
    const sender = (postboxSender || currentNickname || "익명의 상상가").trim();
    const letterData = {
      id: `letter-${Date.now()}`,
      sender,
      content,
      createdAt: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }),
    };

    // 정밀 좌표 측정: 우체통 투입구와 엽서 시트의 중심점 거리 계산
    if (postboxSlotRef.current && postcardSheetRef.current) {
      const slotRect = postboxSlotRef.current.getBoundingClientRect();
      const sheetRect = postcardSheetRef.current.getBoundingClientRect();
      const targetX = (slotRect.left + slotRect.width / 2) - (sheetRect.left + sheetRect.width / 2);
      const targetY = (slotRect.top + slotRect.height / 2) - (sheetRect.top + sheetRect.height / 2);
      setFlyOffsets({ x: targetX, y: targetY });
    }

    // 1단계: 비행 준비 & 종이 접기 시작
    setFlyingPostcardData(letterData);
    setIsFlyingPostcard(true);
    setFlyingPostcardPhase("folding");
    setPostboxSuccessMsg("");

    // 2단계: 0.35초 후 - 접힌 엽서가 왼쪽 우체통 투입구로 포물선 비행
    setTimeout(() => {
      // 렌더링된 시트 기준으로 좌표 재확인
      if (postboxSlotRef.current && postcardSheetRef.current) {
        const slotRect = postboxSlotRef.current.getBoundingClientRect();
        const sheetRect = postcardSheetRef.current.getBoundingClientRect();
        const targetX = (slotRect.left + slotRect.width / 2) - (sheetRect.left + sheetRect.width / 2);
        const targetY = (slotRect.top + slotRect.height / 2) - (sheetRect.top + sheetRect.height / 2);
        setFlyOffsets({ x: targetX, y: targetY });
      }
      setFlyingPostcardPhase("flying");
    }, 350);

    // 3단계: 1.1초 후 - 우체통 투입구 안으로 쏙 흡수 & 투입구 골드 글로우
    setTimeout(() => {
      setFlyingPostcardPhase("into-slot");
      setSlotGlow(true);
    }, 1100);

    // 4단계: 1.4초 후 - 우체통 통통 튀고, 서버에 저장하여 모든 사용자와 실시간 공유
    setTimeout(async () => {
      setPostboxBounce(true);
      setSlotGlow(false);
      setPostboxContent("");
      setPostboxSuccessMsg("성공적으로 엽서를 보냈어요!");

      // 1) 즉각적인 화면 반영 (낙관적 업데이트)
      setPostboxLetters((prev) => [letterData, ...prev]);

      // 2) 백엔드 서버에 저장하여 모든 닉네임 사용자와 실시간 공유
      try {
        const res = await fetch(`${API_BASE_URL}/api/postbox/letters`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender, content }),
        });
        const result = await res.json();
        if (result && result.success && Array.isArray(result.letters)) {
          setPostboxLetters(result.letters);
          try {
            localStorage.setItem("manyak_postbox_letters", JSON.stringify(result.letters));
          } catch (e) {}
        }
      } catch (err) {
        console.error("서버 엽서 저장 실패:", err);
      }
    }, 1400);

    // 5단계: 2.1초 후 - 비행 애니메이션 초기화
    setTimeout(() => {
      setPostboxBounce(false);
      setIsFlyingPostcard(false);
      setFlyingPostcardData(null);
      setFlyingPostcardPhase("");
    }, 2100);

    // 6단계: 성공 메시지 5초 후 자동 숨김
    setTimeout(() => {
      setPostboxSuccessMsg("");
    }, 5000);
  };

  /* =========================================================
     만약에 카드: 주간 상상 월드컵 (토너먼트) 시스템
  ========================================================= */
  const DEFAULT_TOURNAMENT_CANDIDATES = [
    {
      id: "c-1",
      author: "소현",
      question: "만약 침대가 구름처럼 변해 방 안을 둥둥 떠다닌다면?",
      answer: "텔레비전 바로 앞에 멈춰두고 하루 종일 누워서 만화영화 볼 거야!",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23eef6fc'/%3E%3Cellipse cx='200' cy='230' rx='130' ry='70' fill='%23a0d8ef'/%3E%3Ccircle cx='140' cy='200' r='55' fill='%23ffffff'/%3E%3Ccircle cx='260' cy='200' r='55' fill='%23ffffff'/%3E%3Ccircle cx='200' cy='170' r='65' fill='%23ffffff'/%3E%3Crect x='130' y='180' width='140' height='70' rx='12' fill='%23ffb07c'/%3E%3Ccircle cx='160' cy='160' r='20' fill='%23ffeaa7'/%3E%3C/svg%3E",
      votes: 184,
    },
    {
      id: "c-2",
      author: "동심가 민우",
      question: "만약 우주 먼 곳으로 날아가는 탐사선에 탄다면?",
      answer: "지구를 향해 '엄마, 오늘 저녁 밥은 먹고 다니니?' 하고 마지막 무전을 보낼래.",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%231f2937'/%3E%3Ccircle cx='310' cy='90' r='40' fill='%23fef08a'/%3E%3Cpolygon points='160,250 200,140 240,250' fill='%23f87171'/%3E%3Ccircle cx='200' cy='180' r='18' fill='%2367e8f9'/%3E%3Cpath d='M170,250 Q200,310 230,250' fill='%23fbbf24'/%3E%3C/svg%3E",
      votes: 167,
    },
    {
      id: "c-3",
      author: "따뜻한 지호",
      question: "만약 과거의 실수했던 나에게 딱 한 마디만 해줄 수 있다면?",
      answer: "괜찮아, 모든 인생이 행복할 수만은 없잖아? 그 덕분에 지금의 내가 있어.",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23fef3c7'/%3E%3Ccircle cx='150' cy='200' r='50' fill='%23fbbf24'/%3E%3Ccircle cx='250' cy='200' r='50' fill='%23f472b6'/%3E%3Cpath d='M180,240 Q200,260 220,240' stroke='%234b5563' stroke-width='6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
      votes: 215,
    },
    {
      id: "c-4",
      author: "하은",
      question: "만약 음악을 틀면 그 음악의 색깔대로 방이 물든다면?",
      answer: "타닥타닥 모닥불 피아노곡을 틀어서 온 방을 포근한 귤빛 주황색으로 가득 채울래.",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23ffedd5'/%3E%3Ccircle cx='200' cy='200' r='120' fill='%23fdba74' opacity='0.7'/%3E%3Ccircle cx='200' cy='200' r='70' fill='%23fb923c'/%3E%3Cpath d='M185,150 L185,220 A15,15 0 0,1 160,230' stroke='%23431407' stroke-width='8' fill='none'/%3E%3C/svg%3E",
      votes: 142,
    },
    {
      id: "c-5",
      author: "엉뚱한 서준",
      question: "만약 내 그림자가 나와 다른 행동을 시작한다면?",
      answer: "나 대신 회사에 출근시키고 나는 집에서 하루 종일 낮잠 자라고 할 거야!",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ccircle cx='150' cy='160' r='40' fill='%23fbbf24'/%3E%3Crect x='125' y='200' width='50' height='80' rx='10' fill='%2360a5fa'/%3E%3Ccircle cx='250' cy='160' r='40' fill='%236b7280'/%3E%3Crect x='225' y='200' width='50' height='80' rx='10' fill='%23374151'/%3E%3C/svg%3E",
      votes: 198,
    },
    {
      id: "c-6",
      author: "유나",
      question: "만약 시간이 딱 한 시간 동안 멈춘다면?",
      answer: "거리의 바쁘게 뛰어가는 모든 사람 손에 몰래 예쁜 노란 프리지아 꽃을 쥐여줄래.",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23ecfdf5'/%3E%3Ccircle cx='200' cy='200' r='110' fill='%23a7f3d0'/%3E%3Ccircle cx='200' cy='200' r='90' fill='%23ffffff'/%3E%3Cline x1='200' y1='200' x2='200' y2='140' stroke='%23059669' stroke-width='8' stroke-linecap='round'/%3E%3Cline x1='200' y1='200' x2='240' y2='200' stroke='%23059669' stroke-width='8' stroke-linecap='round'/%3E%3C/svg%3E",
      votes: 176,
    },
    {
      id: "c-7",
      author: "도윤",
      question: "만약 어떤 기억이든 딱 하나 지울 수 있는 지우개가 있다면?",
      answer: "어젯밤 이불킥하며 잠 못 들었던 어설픈 실수 기억을 쓱싹 지우고 푹 잘래.",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23fdf2f8'/%3E%3Cpolygon points='120,240 240,120 280,160 160,280' fill='%23f472b6'/%3E%3Cpolygon points='120,240 160,280 130,290 100,260' fill='%23fbbf24'/%3E%3C/svg%3E",
      votes: 139,
    },
    {
      id: "c-8",
      author: "채원",
      question: "만약 바닷속 깊은 곳에 숨겨진 도시가 있다면?",
      answer: "사람들이 큰 고래 버스를 타고 바다숲 학교로 등교하며 물고기들과 하이파이브할 것 같아.",
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23e0f2fe'/%3E%3Cellipse cx='200' cy='210' rx='130' ry='70' fill='%2338bdf8'/%3E%3Ccircle cx='140' cy='190' r='8' fill='%230f172a'/%3E%3Ccircle cx='270' cy='150' r='14' fill='%23bae6fd'/%3E%3Ccircle cx='300' cy='120' r='10' fill='%23bae6fd'/%3E%3C/svg%3E",
      votes: 189,
    },
  ];

  // 사용자 주간 투표 저장 상태
  const [tournamentVotes, setTournamentVotes] = useState(() => {
    try {
      const saved = localStorage.getItem("manyak_tournament_votes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 모아보기 화면에서의 토너먼트 출품 선택 모드 및 선택된 카드
  const [tournamentSelectMode, setTournamentSelectMode] = useState(false);
  const [selectedTournamentCard, setSelectedTournamentCard] = useState(null);

  // 실시간 토너먼트 출품작 후보 목록 (닉네임당 1개 선착순 최대 8개)
  const [tournamentCandidates, setTournamentCandidates] = useState([]);

  const fetchTournamentCandidates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tournament/candidates`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.candidates)) {
        setTournamentCandidates(data.candidates);
      }
    } catch (err) {
      console.warn("토너먼트 후보 동기화 실패(기본 데이터 사용):", err);
    }
  };

  useEffect(() => {
    fetchTournamentCandidates();
    // Render 무료 플랜 절전모드 방지: 첫 접속 시 서버 웜업 핑
    fetch(`${API_BASE_URL}/api/health`).catch(() => {});
  }, []);

  // 토너먼트 탭 선택 (8강 기본)
  const [activeTournamentTab, setActiveTournamentTab] = useState("round8");
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);

  // 투표 핸들러
  const handleVoteTournamentCard = (matchKey, candidateId) => {
    if (tournamentVotes[matchKey]) {
      setToastMessage("이미 이 대결에 소중한 한 표를 행사하셨어요! ✦");
      setTimeout(() => setToastMessage(""), 2200);
      return;
    }
    const nextVotes = { ...tournamentVotes, [matchKey]: candidateId };
    setTournamentVotes(nextVotes);
    try {
      localStorage.setItem("manyak_tournament_votes", JSON.stringify(nextVotes));
    } catch (e) {}

    setToastMessage("투표 완료! 내일 다음 라운드 진출 결과를 확인하러 오세요 📮");
    setTimeout(() => setToastMessage(""), 2800);
  };

  // 특정 매치 투표 취소 및 다시 투표하기 핸들러
  const handleCancelTournamentVote = (matchKey) => {
    const nextVotes = { ...tournamentVotes };
    delete nextVotes[matchKey];
    setTournamentVotes(nextVotes);
    try {
      localStorage.setItem("manyak_tournament_votes", JSON.stringify(nextVotes));
    } catch (e) {}
    setToastMessage("투표가 취소되었습니다. 다시 마음에 드는 상상에 투표해 보세요!");
    setTimeout(() => setToastMessage(""), 2200);
  };

  // 전체 매치 투표 초기화
  const handleResetAllTournamentVotes = () => {
    setTournamentVotes({});
    try {
      localStorage.removeItem("manyak_tournament_votes");
    } catch (e) {}
    setToastMessage("모든 매치의 투표 내역이 초기화되었습니다. 다시 투표하실 수 있습니다! ✦");
    setTimeout(() => setToastMessage(""), 2400);
  };

  // 상상 카드 토너먼트(월드컵) 출품 핸들러
  const handleTournamentSubmit = async (cardData) => {
    try {
      const author = (cardData.author || currentNickname || "익명의 상상가").trim();
      const question = cardData.question;
      const answer = cardData.answer;
      const imageUrl = cardData.imageUrl || cardData.image_url || generatedImage || "";

      if (!question || !answer) {
        setToastMessage("출품할 상상 카드의 내용이 부족해요.");
        setTimeout(() => setToastMessage(""), 2200);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/tournament/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, question, answer, imageUrl }),
      });
      const data = await res.json();
      if (data && data.success) {
        setToastMessage("🏆 '나의 상상'이 이번 주 상상 월드컵 후보로 소중히 접수되었습니다!");
        fetchTournamentCandidates(); // 선착순 8강 대진표 즉시 갱신
      } else {
        setToastMessage(data.message || "토너먼트 출품 접수에 실패했습니다.");
      }
    } catch (err) {
      console.error("토너먼트 출품 오류:", err);
      setToastMessage("서버 연결에 실패하여 출품하지 못했습니다.");
    }
    setTimeout(() => setToastMessage(""), 3000);
  };

  /* 그림일기 날씨 상태 (기본: 해/맑음) */
  const [diaryWeather, setDiaryWeather] = useState("sunny");

  /* 그림일기 오늘 날짜 정보 */
  const diaryDate = useMemo(() => {
    const now = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      date: now.getDate(),
      day: days[now.getDay()],
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  /* =======================================================
     이미지 다운로드
  ======================================================= */
  const handleDownloadImage = async (imageUrl, prefix = "manyak-imagination") => {
    if (!imageUrl) {
      alert("다운로드할 이미지가 없습니다.");
      return;
    }

    try {
      if (imageUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `${prefix}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("그림이 저장되었어! 🎨");
        return;
      }

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${prefix}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      showToast("그림이 저장되었어! 🎨");
    } catch (error) {
      console.error("이미지 다운로드 오류:", error);
      alert("이미지를 다운로드하는 중 오류가 발생했습니다.");
    }
  };

  /* =======================================================
     상상 카드 공유
  ======================================================= */
  const handleShareImagination = async (questionText, answerText) => {
    const q = questionText || "만약에...";
    const a = answerText || "";
    const shareContent = `[만약에 · MAN-YAK]\n\nQ. ${q}\nA. ${a}\n\n✨ 상상하러 가기: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "만약에 - 나의 상상",
          text: shareContent,
          url: window.location.origin,
        });
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Web Share 미지원 또는 취소:", err);
        } else {
          return;
        }
      }
    }

    // 클립보드 복사 폴백
    try {
      await navigator.clipboard.writeText(shareContent);
      showToast("상상 내용이 클립보드에 복사되었어! ✦");
    } catch (clipErr) {
      console.error("클립보드 복사 오류:", clipErr);
      alert("공유하기를 실행할 수 없습니다.");
    }
  };

  /* =======================================================
     그림일기 깍두기 공책(원고지) 렌더러
  ======================================================= */
  const renderDiaryGrid = (text = "") => {
    const COLS = 10;
    const cleanText = (text || "").replace(/\r/g, "");
    const chars = Array.from(cleanText);

    // 최소 6행(60칸), 글자 수에 따라 동적으로 행 확장
    const minRows = 6;
    const neededRows = Math.max(minRows, Math.ceil(Math.max(chars.length, 1) / COLS));
    const totalCells = COLS * neededRows;

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
      cells.push(chars[i] !== undefined ? chars[i] : "");
    }

    return (
      <div className="diary-grid-notebook" role="table" aria-label="그림일기 깍두기 글씨 칸">
        {Array.from({ length: neededRows }).map((_, rowIndex) => (
          <div className="diary-grid-row" key={`diary-row-${rowIndex}`}>
            {Array.from({ length: COLS }).map((_, colIndex) => {
              const char = cells[rowIndex * COLS + colIndex];
              const isSpace = char === " ";
              return (
                <div
                  className={`diary-grid-cell ${char && !isSpace ? "has-char" : ""}`}
                  key={`diary-cell-${rowIndex}-${colIndex}`}
                >
                  <span className="diary-cell-crosshair" aria-hidden="true" />
                  <span className="diary-char-text">
                    {isSpace ? "" : char}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  /* =======================================================
     질문 가져오기
  ======================================================= */

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setQuestionLoading(true);

        const data = await loadQuestions();

        setQuestions(data);

        if (data.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * data.length
          );

          setCurrentQuestion(data[randomIndex]);
        }
      } catch (error) {
        console.error("질문 불러오기 오류:", error);
      } finally {
        setQuestionLoading(false);
      }
    };

    fetchQuestions();
    fetchMyAnswers(currentNickname);
  }, []);

  /* =======================================================
     나의 상상 가져오기 (닉네임별 분리 조회)
  ======================================================= */

  const fetchMyAnswers = async (overrideNickname = null) => {
    try {
      setAnswersLoading(true);
      const nick = (overrideNickname !== null ? overrideNickname : currentNickname).trim() || "꼬마상상가";
      const uid = nicknameToUserId(nick);

      const response = await fetch(
        `${API_BASE_URL}/api/answers?nickname=${encodeURIComponent(nick)}&user_id=${uid}`
      );

      if (!response.ok) {
        throw new Error(
          "나의 상상을 불러오지 못했습니다."
        );
      }

      const data = await response.json();

      setMyAnswers(data);
    } catch (error) {
      console.error(
        "나의 상상 불러오기 오류:",
        error
      );
    } finally {
      setAnswersLoading(false);
    }
  };

  /* =======================================================
     닉네임 저장 및 갱신
  ======================================================= */

  const handleSaveNickname = (newNick) => {
    const trimmed = (newNick || "").trim();
    if (!trimmed) {
      alert("닉네임을 한 글자 이상 입력해줘!");
      return;
    }
    setCurrentNickname(trimmed);
    setIsNicknameRegistered(true);
    try {
      localStorage.setItem("manyak_user_nickname", trimmed);
    } catch (e) {
      console.warn("닉네임 로컬 저장 실패:", e);
    }
    setNicknameModalOpen(false);
    fetchMyAnswers(trimmed);
  };

  /* 메인 화면 닉네임 입력 완료 핸들러 */
  const handleHomeNicknameSubmit = () => {
    const trimmed = homeNicknameInput.trim();
    if (!trimmed) {
      alert("상상가 닉네임을 한 글자 이상 입력해줘!");
      return;
    }
    setCurrentNickname(trimmed);
    setIsNicknameRegistered(true);
    try {
      localStorage.setItem("manyak_user_nickname", trimmed);
    } catch (e) {
      console.warn("닉네임 로컬 저장 실패:", e);
    }
    fetchMyAnswers(trimmed);
  };

  /* 닉네임 없이 바로 시작하기 핸들러 */
  const handleStartWithoutNickname = () => {
    setCurrentNickname("");
    setIsNicknameRegistered(false);
    goImagine();
  };

  /* =======================================================
     랜덤 질문
  ======================================================= */

  const selectRandomQuestion = () => {
    if (questions.length === 0) {
      return;
    }

    if (questions.length === 1) {
      setCurrentQuestion(questions[0]);
      setInput("");
      return;
    }

    let randomIndex;

    do {
      randomIndex = Math.floor(
        Math.random() * questions.length
      );
    } while (
      currentQuestion &&
      questions[randomIndex].question_id ===
      currentQuestion.question_id
    );

    setCurrentQuestion(
      questions[randomIndex]
    );

    setInput("");
  };

  /* =======================================================
     홈
  ======================================================= */

  const goHome = () => {
    setPage("home");
    setMenuOpen(false);
  };

  /* =======================================================
     상상하기
  ======================================================= */

  const goImagine = () => {
    setPage("imagine");
    setMenuOpen(false);

    if (questions.length > 0) {
      selectRandomQuestion();
    }
  };

  /* =======================================================
     나의 상상
  ======================================================= */

  const goMyImagination = () => {
    setPrevPage(page);
    setPage("my-imagination");
    setMenuOpen(false);

    fetchMyAnswers();
  };

  /* =======================================================
     ABOUT 페이지 이동
  ======================================================= */
  const goAbout = () => {
    setPrevPage(page);
    setPage("about");
    setMenuOpen(false);
  };

  /* =======================================================
     만약에 카드 (주간 상상 월드컵 토너먼트) 이동
  ======================================================= */
  const goCardWorldcup = () => {
    setPrevPage(page);
    setPage("card-worldcup");
    setMenuOpen(false);
  };

  /* =======================================================
     답변 입력 (글자를 따라가는 연필 캐럿 위치 추적)
  ======================================================= */

  const updateCursorPosition = (e) => {
    if (!e || !e.target) return;
    const pos = e.target.selectionStart !== undefined ? e.target.selectionStart : (e.target.value || "").length;
    setCursorPos(pos);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    updateCursorPosition(e);
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 450);
  };

  /* =======================================================
     이미지 스타일 선택
  ======================================================= */

  const getRandomImageStyle = () => {
    return imageStyles[
      Math.floor(
        Math.random() * imageStyles.length
      )
    ];
  };

  /* =======================================================
     상상 저장
  ======================================================= */

  const saveLocalImagination = ({
    question,
    answer,
    imageUrl,
    questionType,
    diaryStory,
  }) => {
    const item = {
      id:
        Date.now() +
        Math.random()
          .toString(36)
          .slice(2),

      question,
      answer,
      image_url: imageUrl,
      diaryStory: diaryStory || null,

      question_type:
        questionType || "오늘의 질문",

      created_at:
        new Date().toISOString(),
    };

    setLocalImaginations((prev) => {
      const next = [
        item,
        ...prev,
      ].slice(0, 20);

      try {
        localStorage.setItem(
          "manyakImaginations",
          JSON.stringify(next)
        );
      } catch (error) {
        console.warn(
          "상상 저장 실패:",
          error
        );
      }

      return next;
    });
  };

  /* =======================================================
     답변 저장 + 이미지 생성
  ======================================================= */

  const handleImagineSubmit = async () => {
    if (!input.trim()) {
      alert("상상을 먼저 적어줘!");
      return;
    }

    if (!currentQuestion) {
      alert("질문을 불러오지 못했어.");
      return;
    }

    const answerText = input.trim();

    try {
      /* -----------------------------------------
         답변 저장
      ----------------------------------------- */

      const response = await fetch(
        `${API_BASE_URL}/api/answers`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: nicknameToUserId(currentNickname),
            nickname: currentNickname,
            question_id:
              currentQuestion.question_id,
            answer: answerText,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "답변 저장에 실패했습니다."
        );
      }

      /* -----------------------------------------
         결과 데이터
      ----------------------------------------- */

      setResultAnswer({
        question:
          currentQuestion.question,

        answer:
          answerText,

        question_type:
          currentQuestion.question_type,

        comfortMessage:
          getComfortMessage(
            answerText
          ),
      });

      setImageLoading(true);
      setGeneratedImage(null);
      setInput("");

      /* 결과 페이지로 이동 */
      setPage("result");

      /* -----------------------------------------
         매번 다른 이미지 스타일
      ----------------------------------------- */

      const styleHint =
        getRandomImageStyle();

      /* -----------------------------------------
         이미지 생성
      ----------------------------------------- */

      const imageResponse =
        await fetch(
          `${API_BASE_URL}/api/generate-image`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              question:
                currentQuestion.question,

              answer:
                answerText,

              styleHint,

              questionType:
                currentQuestion.question_type ||
                "오늘의 질문",

              imaginationFactor:
                currentQuestion.imagination_factor ||
                "",

              mock: isApiSaveMode,
            }),
          }
        );

      const imageData =
        await imageResponse.json();

      if (!imageResponse.ok) {
        throw new Error(
          imageData.message ||
          "이미지 생성에 실패했습니다."
        );
      }

      const imageUrl =
        imageData.imageUrl ||
        imageData.url ||
        imageData.image;

      if (!imageUrl) {
        throw new Error(
          "이미지 주소를 받지 못했습니다."
        );
      }

      setGeneratedImage(imageUrl);

      // AI가 생성한 감성 일기 문장이 있으면 결과에 반영
      if (imageData.diaryStory) {
        setResultAnswer((prev) => ({
          ...prev,
          diaryStory: imageData.diaryStory,
        }));
      }

      /* -----------------------------------------
         Supabase DB에 이미지 URL 영구 저장
      ----------------------------------------- */
      const savedAnswerId = data?.answer_id;
      if (savedAnswerId) {
        try {
          await fetch(`${API_BASE_URL}/api/answers/${savedAnswerId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image_url: imageUrl,
            }),
          });
        } catch (dbError) {
          console.warn("DB 이미지 URL 저장 실패:", dbError);
        }
      }

      /* -----------------------------------------
         현재 상상 브라우저 저장
      ----------------------------------------- */

      saveLocalImagination({
        question:
          currentQuestion.question,

        answer:
          answerText,

        imageUrl,

        questionType:
          currentQuestion.question_type,

        diaryStory:
          imageData.diaryStory,
      });
    } catch (error) {
      console.error(
        "상상 처리 오류:",
        error
      );

      alert(
        "상상을 처리하지 못했어.\n\n" +
        error.message
      );
    } finally {
      setImageLoading(false);
    }
  };

  /* =======================================================
     날짜
  ======================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    return d.toLocaleDateString(
      "ko-KR",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  /* =======================================================
     대시보드 데이터
  ======================================================= */

  const imaginationBoard = useMemo(() => {
    const serverItems =
      Array.isArray(myAnswers)
        ? myAnswers.filter(
          (item) =>
            item &&
            item.image_url
        )
        : [];

    const localItems =
      Array.isArray(localImaginations)
        ? localImaginations
        : [];

    const merged = [
      ...localItems,
      ...serverItems,
    ];

    const seen = new Set();

    return merged.filter((item) => {
      const key =
        item.answer_id ||
        item.id ||
        `${item.question}-${item.answer}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    });
  }, [
    myAnswers,
    localImaginations,
  ]);

  /* =======================================================
     이전 상상 클릭
  ======================================================= */

  const handleMemoryClick = (item) => {
    setSelectedMemory(item);
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="app">

      <div className="paper-texture" />

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="header">

        <button
          className="logo"
          onClick={goHome}
        >
          <span className="logo-star">
            ✦
          </span>

          <span>
            만약에
          </span>
        </button>

        <div className="header-actions">
          <button
            type="button"
            className={`api-save-badge ${isApiSaveMode ? "active" : ""}`}
            onClick={() => setIsApiSaveMode((prev) => !prev)}
            title="클릭하여 실제 AI 생성과 무료 테스트 모드를 전환합니다."
          >
            <span className="api-save-indicator-dot">●</span>
            <span className="api-save-text">
              {isApiSaveMode ? "🧪 API 절약 모드 ON" : "✨ 실제 AI 생성 ON"}
            </span>
          </button>

          <button
            type="button"
            className="header-nickname-text-btn"
            onClick={() => {
              setTempNickname(currentNickname);
              setNicknameModalOpen(true);
            }}
            title="상상가 닉네임 변경하기"
          >
            <span className="header-nickname-title">
              {currentNickname ? `${currentNickname}의 상상의 공간` : "상상의 공간"}
            </span>
          </button>

          <button
            className={`menu-button ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="menu-icon">
              {menuOpen ? "×" : "☰"}
            </span>
            <span>
              메뉴
            </span>
          </button>
        </div>

        {/* 닉네임 변경 모달 */}
        {nicknameModalOpen && (
          <div className="nickname-modal-backdrop" onClick={() => setNicknameModalOpen(false)}>
            <div className="nickname-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="nickname-modal-header">
                <span className="nickname-modal-icon">🏷️</span>
                <h3>상상가 닉네임 설정</h3>
              </div>
              <p className="nickname-modal-desc">
                각각의 닉네임마다 나만의 상상 기록과 그림일기가 안전하게 보관돼요!
              </p>
              <div className="nickname-modal-input-row">
                <input
                  type="text"
                  className="nickname-modal-input"
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  placeholder="새 닉네임 입력 (예: 꼬마상상가, 소현)"
                  maxLength={15}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveNickname(tempNickname);
                  }}
                />
              </div>
              <div className="nickname-modal-buttons">
                <button
                  type="button"
                  className="nickname-modal-cancel"
                  onClick={() => setNicknameModalOpen(false)}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="nickname-modal-confirm"
                  onClick={() => handleSaveNickname(tempNickname)}
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="menu-panel">

            <div className="menu-title">
              MENU
            </div>

            {menuItems.map((item) => (
              <button
                key={item}
                className="menu-item"
                onClick={() => {

                  if (item === "홈") {
                    goHome();
                  }

                  if (
                    item === "상상하기"
                  ) {
                    goImagine();
                  }

                  if (
                    item === "나의 상상"
                  ) {
                    goMyImagination();
                  }

                  if (
                    item ===
                    "만약에 카드"
                  ) {
                    goCardWorldcup();
                  }

                  if (item === "ABOUT") {
                    goAbout();
                  }
                }}
              >
                {item}

                <span>
                  →
                </span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ===================================================
          HOME
          기존 메인 화면 유지
      =================================================== */}

      {page === "home" && (
        <main className="home-page">

          <section className="home-copy">

            

            <h1 className="main-title">
              만약에
            </h1>

            <p className="main-description">
              상상은 뭐든 될 수 있어.
              <br />
              오늘은 어떤 내가 되어볼까?
            </p>

            {/* 닉네임 등록 전: 닉네임 입력창 + 닉네임 없이 바로 시작하기 */}
            {!isNicknameRegistered ? (
              <div className="home-nickname-gate-box">
                <div className="home-nickname-input-wrap underline-style">
                  <input
                    type="text"
                    className="home-nickname-input"
                    placeholder="이곳에 상상가 이름을 적어줘"
                    value={homeNicknameInput}
                    onChange={(e) => setHomeNicknameInput(e.target.value)}
                    maxLength={15}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleHomeNicknameSubmit();
                    }}
                  />
                  <button
                    type="button"
                    className="home-nickname-confirm-btn"
                    onClick={handleHomeNicknameSubmit}
                    title="입력 완료"
                  >
                    입력 완료 →
                  </button>
                </div>

                <div className="home-guest-choice-wrap">
                  <button
                    type="button"
                    className="home-guest-start-link"
                    onClick={handleStartWithoutNickname}
                  >
                    닉네임 입력하지 않고 바로 시작하기 →
                  </button>
                  <p className="home-guest-warning-note">
                    <span className="home-guest-warning-highlight">
                      닉네임을 입력하지 않고 시작하시면 나만의 상상 기록과 일기가 저장되지 않아요.
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              /* 닉네임 등록 후: 상상 시작하기 버튼 활성화 */
              <div className="home-ready-start-box">
                <button
                  className="start-button"
                  onClick={goImagine}
                >
                  <span>
                    ✎
                  </span>
                  {currentNickname ? `${currentNickname}의 상상 시작하기` : "상상 시작하기"}
                  <strong>
                    →
                  </strong>
                </button>

                <button
                  type="button"
                  className="home-switch-nick-btn"
                  onClick={() => {
                    setHomeNicknameInput(currentNickname);
                    setIsNicknameRegistered(false);
                  }}
                >
                  다른 닉네임으로 바꾸기
                </button>
              </div>
            )}

            <p className="little-note">
              정답은 없어.
              <br />
              네가 상상하는 대로 그려봐.
            </p>

          </section>

          <section className="home-character">

            <div className="character-spark spark-one">
              ✦
            </div>

            <div className="character-spark spark-two">
              ✦
            </div>

            <div className="character-spark spark-three">
              ✿
            </div>

            {(() => {
              const activeChar = IMAGINATION_CHARACTERS[homeCharIndex] || IMAGINATION_CHARACTERS[0];
              const ActiveCharComp = activeChar.Component;
              return (
                <div className="character-paper">

                  {/* 상단 컨트롤: 캐릭터 전환 버튼(심플 라인 아이콘) + 크레파스 그리기 버튼 */}
                  <div className="home-paper-top-controls">
                    <button
                      className={`home-char-switch-btn ${isHomeCharSwitching ? "spinning" : ""}`}
                      onClick={handleNextHomeCharacter}
                      title="다른 상상 친구로 돌리기"
                      aria-label="다른 상상 캐릭터로 돌리기"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-1.19" />
                      </svg>
                    </button>

                    <button
                      className={`home-crayon-toggle-btn ${homeDrawingOpen ? "active" : ""}`}
                      onClick={() => setHomeDrawingOpen(!homeDrawingOpen)}
                      title={homeDrawingOpen ? "그리기 닫기" : "캐릭터 위에 크레파스로 낙서하기"}
                      aria-label="캐릭터 위에 크레파스로 그리기"
                    >
                      <HandDrawnCrayonIcon size={20} color="#ff7700" />
                    </button>
                  </div>

                  {/* 크레파스 모드 활성화 시 나타나는 미니 도구 바 */}
                  {homeDrawingOpen && (
                    <div className="home-crayon-mini-dock">
                      {DEFAULT_CRAYON_COLORS.map((color, cIdx) => (
                        <button
                          key={`home-cp-${cIdx}`}
                          className={`home-color-chip ${homeCrayonColor === color ? "selected" : ""}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setHomeCrayonColor(color)}
                          title={color}
                        />
                      ))}
                      <button
                        className="home-clear-btn"
                        onClick={() => {
                          const canvas = homeCanvasRef.current;
                          if (canvas) {
                            const ctx = canvas.getContext("2d");
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                          }
                        }}
                        title="낙서 모두 지우기"
                      >
                        🧹
                      </button>
                      <button
                        className="home-close-btn"
                        onClick={() => setHomeDrawingOpen(false)}
                        title="그리기 모드 닫기"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* 캐릭터 위 손그림 캔버스 */}
                  <canvas
                    ref={homeCanvasRef}
                    className={`home-drawing-canvas ${homeDrawingOpen ? "drawing-active" : ""}`}
                    onMouseDown={startHomeCrayonDraw}
                    onMouseMove={drawHomeCrayon}
                    onMouseUp={stopHomeCrayonDraw}
                    onMouseLeave={stopHomeCrayonDraw}
                  />

                  <div className="paper-label">
                    MY IMAGINATION
                  </div>

                  <div className={`fixed-character ${isHomeCharSwitching ? "character-pop" : ""} ${activeChar.motionClass}`}>
                    <ActiveCharComp />
                  </div>

                  <div className={`character-handwriting ${isHomeCharSwitching ? "text-fade" : ""}`}>
                    {activeChar.subtitle}
                  </div>

                </div>
              );
            })()}

          </section>

        </main>
      )}

      {/* ===================================================
          IMAGINE PAGE
          기존 질문 화면 유지
      =================================================== */}

      {page === "imagine" && (
        <main className="imagine-page">

          <section className="imagine-header">

            <button
              className="back-button"
              onClick={goHome}
            >
              ← 처음으로
            </button>

            <div className="imagine-top-badges" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div className="imagine-label">
                TODAY'S IMAGINATION
              </div>

              {currentQuestion && (
                <div className="question-type-label" style={{ marginTop: "4px" }}>
                  {currentQuestion.question_type || "오늘의 질문"}
                </div>
              )}
            </div>

            {questionLoading ? (
              <h2>
                질문을 불러오는 중...
              </h2>
            ) : currentQuestion ? (
              <h2 className="db-question">
                {currentQuestion.question}
              </h2>
            ) : (
              <h2>
                아직 질문이 없어.
              </h2>
            )}

          </section>

          <section className="imagine-card">

            <div className="pencil-typing-area-container">
              {/* 글자가 써지는 캐럿(마지막 글자/커서) 위치를 따라가는 연필 미러 레이어 */}
              <div className="pencil-typing-mirror" aria-hidden="true">
                <span className="mirror-text-before">
                  {input.slice(0, cursorPos)}
                </span>
                {isTextareaFocused && (
                  <span className={`pencil-caret ${isTyping ? "writing" : "blinking"}`}>
                    <svg
                      className="pencil-caret-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* 뾰족한 연필심 끝이 좌하단(1, 23)에 정확히 닿음 */}
                      <path d="M1 23L7 21L3 17L1 23Z" fill="#2c3e50" />
                      <path d="M1 23L3 22L2 21L1 23Z" fill="#111111" />
                      <path d="M3 17L7 21L18 10L14 6L3 17Z" fill="#f8c291" />
                      <path d="M6 14L15 5L19 9L10 18L6 14Z" fill="#ff9900" stroke="#333" strokeWidth="0.8" />
                      <path d="M8 12L16 4L17.5 5.5L9.5 13.5L8 12Z" fill="#ffcc00" />
                      <path d="M15 5L19 9L21 7L17 3L15 5Z" fill="#dcdde1" stroke="#333" strokeWidth="0.8" />
                      <path d="M17 3L21 7L23 5C24 4 24 2.5 23 1.5C22 0.5 20.5 0.5 19.5 1.5L17 3Z" fill="#ff7675" stroke="#333" strokeWidth="0.8" />
                    </svg>
                  </span>
                )}
                <span className="mirror-text-after">
                  {input.slice(cursorPos)}
                </span>
              </div>

              <textarea
                value={input}
                onChange={handleInputChange}
                onSelect={updateCursorPosition}
                onKeyUp={updateCursorPosition}
                onClick={updateCursorPosition}
                onFocus={(e) => {
                  setIsTextareaFocused(true);
                  updateCursorPosition(e);
                }}
                onBlur={() => setIsTextareaFocused(false)}
                placeholder="지금 떠오르는 것을 자유롭게 적어봐."
              />
            </div>

          </section>

          {/* 답변 박스 외부 버튼 영역 */}
          <div className="imagine-buttons outside">

            <button
              className="another-question-button"
              onClick={
                selectRandomQuestion
              }
            >
              다른 질문
            </button>

            <button
              className="imagine-submit"
              onClick={
                handleImagineSubmit
              }
            >
              상상해보기

              <span>
                →
              </span>
            </button>

          </div>

          

        </main>
      )}

      {/* ===================================================
          RESULT PAGE
          ★ 이번에 새롭게 수정된 부분
      =================================================== */}

      {page === "result" && (
        <main className="diary-result-page">

          {/* -----------------------------------------------
              결과 상단
          ----------------------------------------------- */}

          {/* 상단 네비게이션 (이전으로 / 모아보기) */}
          <section className="diary-top-nav">
            <button
              className="diary-back-button"
              onClick={goImagine}
            >
              ← 다시 상상하기
            </button>

            <button
              className="diary-my-button"
              onClick={() => {
                fetchMyAnswers();
                setPrevPage("result");
                setPage("my-imagination");
              }}
            >
              나의 상상 보기 →
            </button>
          </section>

          {/* ===============================================
              그림일기장 노트 본체 (첨부된 일기장 양식)
          =============================================== */}
          {/* ===============================================
              그림일기장 노트 본체 (책 형태로 펼쳐진 양면 구조)
          =============================================== */}
          <article className="diary-notebook-sheet diary-book-spread">

            {/* 좌측 페이지: 그림 도화지 (그림이 한눈에 큼직하게) */}
            <div className="diary-book-page diary-book-left-page">
              <section className="diary-drawing-box">
                {imageLoading ? (
                  <div className="diary-drawing-loading">
                    <div className="crayon-pencil-icon">✏️</div>
                    <h3>그림일기에 상상을 쓱싹쓱싹 그리는 중...</h3>
                    <p>동화책 크레파스로 예쁘게 칠하고 있어!</p>
                    <div className="diary-loading-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="diary-drawing-canvas">
                    <img
                      src={generatedImage}
                      alt="내가 상상한 그림"
                      className="diary-picture-img"
                    />
                  </div>
                ) : (
                  <div className="diary-drawing-empty">
                    <div className="empty-symbol">🎨</div>
                    <h3>그림을 아직 만들지 못했어</h3>
                    <p>그래도 네 소중한 상상은 일기장에 잘 적어두었어!</p>
                  </div>
                )}
              </section>
            </div>

            {/* 중앙 책등 및 접힘 음영 */}
            <div className="diary-book-spine" aria-hidden="true" />

            {/* 우측 페이지: 날짜/날씨 헤더 + 깍두기 원고지 일기 글 */}
            <div className="diary-book-page diary-book-right-page">
              {/* 1. 우측 상단 날짜 및 날씨 헤더 */}
              <header className="diary-sheet-header">
                <div className="diary-date-row">
                  <span className="date-box date-year">{diaryDate.year}</span>
                  <span className="date-unit">년</span>
                  <span className="date-box date-month">{diaryDate.month}</span>
                  <span className="date-unit">월</span>
                  <span className="date-box date-day">{diaryDate.date}</span>
                  <span className="date-unit">일</span>
                  <span className="date-box date-week">{diaryDate.day}</span>
                  <span className="date-unit">요일</span>
                </div>

                <div className="diary-weather-row" role="group" aria-label="오늘의 날씨 선택">
                  {[
                    { id: "sunny", label: "맑음", icon: <WeatherSunIcon /> },
                    { id: "cloudy", label: "구름조금", icon: <WeatherCloudSunIcon /> },
                    { id: "rainy", label: "비", icon: <WeatherRainIcon /> },
                    { id: "umbrella", label: "우산", icon: <WeatherUmbrellaIcon /> },
                    { id: "snowy", label: "눈", icon: <WeatherSnowmanIcon /> },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      className={`diary-weather-icon-btn ${diaryWeather === w.id ? "selected" : ""}`}
                      onClick={() => setDiaryWeather(w.id)}
                      title={w.label}
                    >
                      <span className="weather-symbol">{w.icon}</span>
                      {diaryWeather === w.id && (
                        <span className="weather-crayon-circle" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </header>

              {/* 2. 깍두기 원고지 공책 글씨 영역 (질문과 답변이 결합된 자연스러운 일기체) */}
              <section className="diary-grid-box clean-grid-box">
                {renderDiaryGrid(
                  formatToDiaryStory(
                    resultAnswer?.question || currentQuestion?.question,
                    resultAnswer?.answer || "",
                    resultAnswer?.diaryStory
                  )
                )}
              </section>
            </div>

          </article>

          {/* ===============================================
              하단 액션 버튼 바 (도형 없는 선(Line) 형태의 미니멀 아이콘 버튼)
          =============================================== */}
          <section className="diary-action-bar line-action-bar">
            {generatedImage && (
              <button
                type="button"
                className="diary-line-icon-btn download-line-btn"
                onClick={() =>
                  handleDownloadImage(
                    generatedImage,
                    `manyak-diary-${resultAnswer?.id || "art"}`
                  )
                }
                title="일기 그림 저장하기"
                aria-label="일기 그림 저장하기"
              >
                <LineDownloadIcon />
              </button>
            )}

            <button
              type="button"
              className="diary-line-icon-btn share-line-btn"
              onClick={() =>
                handleShareImagination(
                  resultAnswer?.question,
                  resultAnswer?.answer
                )
              }
              title="상상 공유하기"
              aria-label="상상 공유하기"
            >
              <LineShareIcon />
            </button>

            <button
              type="button"
              className="diary-line-icon-btn retry-line-btn"
              onClick={goImagine}
              title="다른 상상하기"
              aria-label="다른 상상하기"
            >
              <LineRefreshIcon />
            </button>

            <button
              type="button"
              className="diary-line-icon-btn my-line-btn"
              onClick={() => {
                fetchMyAnswers();
                setPrevPage("result");
                setPage("my-imagination");
              }}
              title="나의 상상 모음 보기"
              aria-label="나의 상상 모음 보기"
            >
              <LineBookIcon />
            </button>

            {/* 상상 월드컵 토너먼트 출품 버튼 (심플 텍스트 스타일) */}
            <button
              type="button"
              className="diary-line-icon-btn tournament-submit-btn"
              onClick={() =>
                handleTournamentSubmit({
                  author: currentNickname,
                  question: resultAnswer?.question || currentQuestion?.question,
                  answer: resultAnswer?.answer,
                  imageUrl: generatedImage,
                })
              }
              title="이번 주 상상 월드컵 토너먼트에 이 일기 출품하기"
              aria-label="상상 월드컵 토너먼트 출품하기"
            >
              <span className="tournament-btn-label">월드컵 출품</span>
            </button>
          </section>

        </main>
      )}

      {/* ===================================================
          MY IMAGINATION PAGE
      =================================================== */}

      {/* ===================================================
          MY IMAGINATION PAGE (감성 다이어리 플래너 & 다꾸)
      =================================================== */}

      {/* ===================================================
          MY IMAGINATION PAGE (한 달 전체 월간 다이어리 플래너)
      =================================================== */}

      {/* ===================================================
          MY IMAGINATION PAGE (주차별 탭 & 상단 < 00월 > 네비게이터)
      =================================================== */}

      {/* ===================================================
          MY IMAGINATION PAGE (미니멀 주간 플래너 & 하단 스티커 도크)
      =================================================== */}

      {page === "my-imagination" && (() => {
        const currentMonthNum = activeMonthIdx + 1;
        const currentMonthName = MONTH_NAMES[activeMonthIdx];
        const currentMonthEng = MONTH_ENG[activeMonthIdx];

        const currentWeekDays = weeksOfMonth[activeWeekIdx] || weeksOfMonth[0] || [null, null, null, null, null, null, null];
        const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const WEEK_DAYS_KOR = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

        const now = new Date();

        return (
          <main
            className="my-planner-page weekly-clean"
            onPointerMove={handlePlannerPointerMove}
            onPointerUp={handlePlannerPointerUp}
            onPointerLeave={handlePlannerPointerUp}
          >
            

            {/* 상단 툴바: 첨부 이미지 구도 (좌측 돌아가기 + 달 넘김, 우측 끝 년도/월/1week) */}
            <header className="planner-top-toolbar clean-toolbar header-image-layout">
              <div className="planner-top-left-group">
                {/* 왼쪽 상단 달 넘김: 원형 도형 제거하고 우측 날짜 표기 스타일과 일치 */}
                <div className="planner-month-navigator minimal-text-nav">
                  <button
                    className="month-nav-arrow-minimal"
                    onClick={handlePrevMonth}
                    title="이전 달로 넘기기"
                  >
                    ‹
                  </button>
                  <span className="month-nav-month-kor">{currentMonthName}</span>
                  <span className="month-nav-month-eng">{currentMonthEng}</span>
                  <button
                    className="month-nav-arrow-minimal"
                    onClick={handleNextMonth}
                    title="다음 달로 넘기기"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* 오른쪽 끝: 년도, 월, 1week 표시 */}
              <div className="planner-top-right-info">
                <span className="planner-info-year-month">2026 {currentMonthEng}</span>
                <span className="planner-info-divider">|</span>
                <span className="planner-info-week">{activeWeekIdx + 1} Week</span>
              </div>
            </header>

            {/* 좌측 주차별 탭 + 중앙 다이어리 본체 */}
            <div className="planner-layout-with-left-tabs">
              
              {/* 좌측 주차 인덱스 견출지 탭 (참고 이미지 스타일) */}
              <aside className="planner-left-week-nav realistic-index-tabs" aria-label="주차별 인덱스 탭">
                {weeksOfMonth.map((_, wIdx) => (
                  <button
                    key={`left-week-tab-${wIdx}`}
                    className={`left-week-tab-btn index-tab-pill ${activeWeekIdx === wIdx ? "active" : ""}`}
                    onClick={() => {
                      setActiveWeekIdx(wIdx);
                      showToast(`${currentMonthName} ${wIdx + 1}주차 ✦`);
                    }}
                    title={`${currentMonthName} ${wIdx + 1}주차`}
                  >
                    <span className="index-tab-text">{`WEEK ${wIdx + 1}`}</span>
                  </button>
                ))}
              </aside>

              {/* 중앙 주간 다이어리 속지 (그림이 큼직한 레이아웃) */}
              <div className="planner-paper-sheet weekly-sheet clean-sheet minimal-grid-sheet" ref={plannerSheetRef}>

                {/* 참고 이미지 스타일: 선형태 격자 및 각 칸 중앙 상단 날짜/요일 헤더 */}
                <div className="planner-weekly-large-grid minimal-lines-grid">
                  {WEEK_DAYS.map((wName, colIdx) => {
                    const dayNum = currentWeekDays[colIdx];
                    const isSun = colIdx === 0;
                    const isSat = colIdx === 6;

                    // 현재 실제 오늘 날짜 여부
                    const isToday =
                      dayNum !== null &&
                      currentMonthNum === (now.getMonth() + 1) &&
                      dayNum === now.getDate();

                    // 해당 날짜에 실제로 작성된 상상 찾기
                    const itemsOnThisDay = dayNum === null ? [] : allCombinedAnswers.filter((ans) => {
                      if (!ans.created_at) return false;
                      const d = new Date(ans.created_at);
                      if (isNaN(d.getTime())) return false;
                      return (
                        d.getFullYear() === 2026 &&
                        d.getMonth() + 1 === currentMonthNum &&
                        d.getDate() === dayNum
                      );
                    });

                    // 이미지가 있는 상상 우선
                    let item = null;
                    if (itemsOnThisDay.length > 0) {
                      item = itemsOnThisDay.find((x) => x.image_url) || itemsOnThisDay[0];
                    }

                    // 오늘인데 방금 생성된 상상이 있으면 오늘 칸에 배치
                    if (!item && isToday && generatedImage && resultAnswer) {
                      item = allCombinedAnswers.find((x) => x.id === "current-session") || null;
                    }

                    const isSelectedForTournament = selectedTournamentCard && item && (selectedTournamentCard.id === item.id);

                    return (
                      <div
                        key={`week-col-${colIdx}`}
                        className={`minimal-day-cell ${dayNum === null ? "blank-slot" : ""} ${item ? "has-memory" : "empty"} ${isToday ? "is-today" : ""} ${tournamentSelectMode && item ? "selectable-for-tournament" : ""} ${isSelectedForTournament ? "selected-for-tournament" : ""}`}
                        onClick={() => {
                          if (tournamentSelectMode && item) {
                            if (selectedTournamentCard?.id === item.id) {
                              setSelectedTournamentCard(null);
                            } else {
                              setSelectedTournamentCard(item);
                            }
                          }
                        }}
                      >
                        {/* 출품 선택 모드일 때 선택 표시 뱃지 */}
                        {isSelectedForTournament && (
                          <div className="card-selected-badge">선택됨 ✓</div>
                        )}
                        {/* 중앙 상단 날짜 및 요일 헤더 (참고 이미지 디자인) */}
                        {dayNum !== null && (
                          <div className="minimal-day-header">
                            <span className={`minimal-day-num ${isSun ? "sun" : isSat ? "sat" : ""}`}>
                              {dayNum}
                            </span>
                            <div className="minimal-day-line" />
                            <span className={`minimal-day-eng ${isSun ? "sun" : isSat ? "sat" : ""}`}>
                              {wName}
                            </span>
                            {isToday && <span className="minimal-today-pill">TODAY</span>}
                          </div>
                        )}

                        {/* 상상 내용부: 사진(있을 때만) + 한 편의 일기체 텍스트 */}
                        {dayNum !== null && (
                          item ? (
                            <div className="minimal-memory-content">
                              {/* 미니멀 사진 프레임 (사진이 있는 경우에만 표시, 클릭 시 다운로드) */}
                              {item.image_url && (
                                <div
                                  className="minimal-photo-frame"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadImage(
                                      item.image_url,
                                      `manyak-diary-${item.id || item.created_at || "art"}`
                                    );
                                  }}
                                  title="클릭하여 그림일기 이미지 다운로드"
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      handleDownloadImage(
                                        item.image_url,
                                        `manyak-diary-${item.id || item.created_at || "art"}`
                                      );
                                    }
                                  }}
                                >
                                  <img
                                    src={item.image_url}
                                    alt={item.question || "나의 상상"}
                                    className="minimal-photo-img"
                                  />
                                  <div className="minimal-photo-overlay" aria-hidden="true">
                                    <div className="photo-download-btn">
                                      <LineDownloadIcon size={22} color="#ffffff" />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* 한 편의 감성적인 일기 텍스트 (질문-답변 대신 일기체 기록) */}
                              <div className="minimal-diary-entry">
                                <p className="minimal-diary-text">
                                  {formatToDiaryStory(item.question, item.answer, item.diaryStory)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="minimal-empty-slot">
                              <button
                                className="minimal-add-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  goImagine();
                                }}
                                title="이 날에 상상 기록하기"
                              >
                                <span className="add-plus">+</span>
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 크레파스 손그림 드로잉 캔버스 레이어 */}
                <canvas
                  ref={drawingCanvasRef}
                  className={`planner-drawing-canvas ${isDrawingMode ? "drawing-active" : ""}`}
                  onMouseDown={startCrayonDraw}
                  onMouseMove={drawCrayon}
                  onMouseUp={stopCrayonDraw}
                  onMouseLeave={stopCrayonDraw}
                />

                
              </div>
            </div>

            {/* ===================================================
                우측 하단 플로팅 컨트롤 (처음으로, 새로운 상상하기, 손그림 크레파스 도구)
            =================================================== */}
            <div className="planner-bottom-right-floating-controls">
              <button
                type="button"
                className="planner-back-btn floating-action-btn"
                onClick={() => setPage(prevPage || (resultAnswer ? "result" : "home"))}
                title="이전 화면으로 돌아가기"
              >
                ← 이전으로
              </button>
              <button
                type="button"
                className="planner-back-btn floating-action-btn"
                onClick={goHome}
                title="처음으로 돌아가기"
              >
                처음으로
              </button>
              <button
                className="planner-tool-btn new-btn floating-action-btn"
                onClick={goImagine}
                title="새로운 상상 기록하기"
              >
                <span>✦</span> 새로운 상상하기
              </button>

              {/* 월드컵 출품 고르기 플로팅 버튼 */}
              {!tournamentSelectMode && (
                <button
                  type="button"
                  className="planner-tool-btn tournament-pick-btn floating-action-btn"
                  onClick={() => {
                    setTournamentSelectMode(true);
                    setSelectedTournamentCard(null);
                    setToastMessage("출품하고 싶은 상상 작품을 클릭해 주세요!");
                    setTimeout(() => setToastMessage(""), 2500);
                  }}
                  title="상상 월드컵에 출품할 작품 선택하기"
                >
                  월드컵 출품 고르기
                </button>
              )}

              {/* 손으로 그린 크레파스 SVG 아이콘 버튼 (텍스트 제거) */}
              {!stickerBarOpen && (
                <button
                  className="dock-open-floating-crayon-btn"
                  onClick={() => {
                    setStickerBarOpen(true);
                    setIsDrawingMode(true);
                  }}
                  title="손그림 그리기 도구 열기"
                  aria-label="그리기 도구 열기"
                >
                  <HandDrawnCrayonIcon size={22} color="#ff7700" />
                </button>
              )}
            </div>

            {/* 월드컵 출품 선택 모드 하단 가이드 및 응모하기 바 */}
            {tournamentSelectMode && (
              <div className="tournament-select-bottom-bar" role="region" aria-label="월드컵 출품 선택">
                <div className="select-guide-text">
                  {selectedTournamentCard ? (
                    <span>선택된 작품: <strong>"{selectedTournamentCard.question}"</strong></span>
                  ) : (
                    <span>출품할 상상 작품 카드를 클릭해 주세요.</span>
                  )}
                </div>
                <div className="select-btn-group">
                  <button
                    type="button"
                    className="select-cancel-btn"
                    onClick={() => {
                      setTournamentSelectMode(false);
                      setSelectedTournamentCard(null);
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className={`select-submit-btn ${selectedTournamentCard ? "ready" : "disabled"}`}
                    disabled={!selectedTournamentCard}
                    onClick={() => {
                      if (selectedTournamentCard) {
                        handleTournamentSubmit({
                          author: currentNickname,
                          question: selectedTournamentCard.question,
                          answer: selectedTournamentCard.answer,
                          imageUrl: selectedTournamentCard.image_url,
                        });
                        setTournamentSelectMode(false);
                        setSelectedTournamentCard(null);
                      }
                    }}
                  >
                    응모하기
                  </button>
                </div>
              </div>
            )}

            {/* 크레파스 도크 바 (우측 사이드/하단에 슬림하게 배치) */}
            {stickerBarOpen && (
              <div className="planner-bottom-crayon-dock side-right-dock" role="toolbar" aria-label="손그림 도구">
                <span className="crayon-dock-icon-badge" title="손그림 그리기 모드">
                  <HandDrawnCrayonIcon size={20} color={isEraser ? "#888888" : crayonColor} />
                </span>

                {/* 컬러 세밀 조정 피커 (무지개 그라데이션) */}
                <div className="dock-color-picker-wrapper" title="컬러 세밀 조정">
                  <button
                    className="crayon-color-picker-btn"
                    onClick={() => colorInputRef.current && colorInputRef.current.click()}
                    title="컬러 세밀 조정"
                    aria-label="컬러 세밀 조정"
                  >
                    <span className="rainbow-wheel" />
                  </button>
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={crayonColor}
                    onChange={handleColorInputChange}
                    onBlur={(e) => {
                      if (colorCommitTimeoutRef.current) {
                        clearTimeout(colorCommitTimeoutRef.current);
                      }
                      handleCommitNewColor(e.target.value);
                    }}
                    className="hidden-color-input"
                    aria-label="컬러 선택기"
                  />
                </div>

                {/* 사용한 컬러가 차곡차곡 쌓이는 팔레트 슬롯 (최대 5색) */}
                <div className="dock-crayon-colors">
                  {recentCrayonColors.slice(0, 5).map((col, idx) => (
                    <button
                      key={`${col}-${idx}`}
                      className={`crayon-color-chip ${crayonColor.toLowerCase() === col.toLowerCase() && !isEraser ? "selected" : ""}`}
                      style={{ backgroundColor: col }}
                      onClick={() => handleSelectColorChip(col)}
                      title={col}
                      aria-label={`색상 ${col}`}
                    />
                  ))}
                </div>

                {/* 도구: 굵기(라인 아이콘+슬라이더), 지우개(라인 아이콘), 전체 지우기(라인 아이콘) - 텍스트 없음 */}
                <div className="dock-crayon-tools">
                  <div className="crayon-size-control" title="선 굵기 조절">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#665f56" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <line x1="4" y1="6" x2="20" y2="6" strokeWidth="1.5" />
                      <line x1="4" y1="12" x2="20" y2="12" strokeWidth="3" />
                      <line x1="4" y1="18" x2="20" y2="18" strokeWidth="5" />
                    </svg>
                    <input
                      type="range"
                      min="2"
                      max="24"
                      value={crayonWidth}
                      onChange={(e) => setCrayonWidth(Number(e.target.value))}
                      className="crayon-slider"
                      aria-label="선 굵기"
                    />
                  </div>

                  {/* 지우개 (심플 라인 SVG 아이콘, 텍스트 배제) */}
                  <button
                    className={`crayon-tool-icon-btn ${isEraser ? "active" : ""}`}
                    onClick={() => setIsEraser(!isEraser)}
                    title="지우개"
                    aria-label="지우개"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13l-5.5 5.5a2.121 2.121 0 0 1-3 0L3 12a2.121 2.121 0 0 1 0-3l7-7a2.121 2.121 0 0 1 3 0l6.5 6.5a2.121 2.121 0 0 1 0 3z" />
                      <line x1="14.5" y1="9.5" x2="8.5" y2="15.5" />
                      <line x1="6.5" y1="17.5" x2="16.5" y2="17.5" />
                    </svg>
                  </button>

                  {/* 전체 지우기 (심플 라인 휴지통 SVG 아이콘, 텍스트 배제) */}
                  <button
                    className="crayon-tool-icon-btn clear"
                    onClick={handleClearDrawing}
                    title="전체 지우기"
                    aria-label="전체 지우기"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>

                {/* ✕ 닫기 클릭 시 그리기 모드를 끄고 마우스 커서 복원 */}
                <button
                  className="dock-close-btn"
                  onClick={() => {
                    setStickerBarOpen(false);
                    setIsDrawingMode(false);
                  }}
                  title="닫기"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>
            )}
          </main>
        );
      })()}

      {/* ===================================================
          ABOUT PAGE (따뜻한 브랜드 스토리 + 작은 상상 우체통)
      =================================================== */}
      {page === "about" && (
        <main className="about-page">
          <div className="about-sheet-wrap">
            {/* 상단 네비게이션 바 */}
            <header className="about-header-bar">
              <button
                type="button"
                className="about-nav-btn"
                onClick={() => setPage(prevPage || "home")}
                title="이전 화면으로 돌아가기"
              >
                ← 이전으로
              </button>
              <div className="about-header-center">
                <span className="about-header-star">✦</span>
                <span className="about-header-badge">ABOUT MAN-YAK</span>
              </div>
              <button
                type="button"
                className="about-nav-btn home"
                onClick={goHome}
                title="처음으로 가기"
              >
                처음으로
              </button>
            </header>

            {/* 1. 브랜드 스토리 섹션 */}
            <article className="about-story-section">
              <span className="about-sub-label">OUR STORY</span>
              <h2 className="about-story-title">
                우리는 언제부터<br />
                <span className="about-title-highlight">"만약에"</span>라는 말을 잊었을까요?
              </h2>

              <div className="about-story-body">
                <p>
                  어릴 적 우리는 누구나 도화지 한 장과 크레파스 몇 자루만 있으면 온 우주를 날아다녔습니다.
                  구름 위를 뛰어다니고, 과거의 나와 비밀 통화를 나누며 매일 매 순간 새로운 세계를 창조했지요.
                </p>
                <p>
                  하지만 어른이 되면서 언제부턴가 우리는 늘 정답과 효율만을 이야기하느라, 
                  가장 눈부시고 설레는 마법의 주문이었던 <strong>'만약에'</strong>를 잊고 살아갑니다.
                </p>
                <div className="about-quote-box">
                  <span className="about-quote-spark">✦</span>
                  <p className="about-quote-text">
                    "정답은 없어. 네가 상상하는 모든 것이 곧 답이야."
                  </p>
                </div>
                <p className="about-highlight-paragraph">
                  <mark className="about-crayon-highlighter">
                    <strong>'만약에'</strong>는 반복되는 일상에 지친 당신을 위한 작은 동화 속 쉼터입니다.
                    어떤 엉뚱한 생각도, 비현실적인 꿈도 이곳에서는 가장 소중한 예술 작품이 됩니다.
                    잠시 바쁜 걸음을 멈추고, 당신만의 크레파스로 세상을 물들여 보세요.
                  </mark>
                </p>
              </div>

              {/* 서비스 이용 5단계 미니멀 안내 */}
              <div className="about-guide-cards">
                <div className="about-guide-card">
                  <h4 className="guide-card-title">1. 질문에 답하기</h4>
                  <p className="guide-card-desc">매일 찾아오는 기발한 만약에 질문에 마음껏 자유롭게 상상해 보세요.</p>
                </div>
                <div className="about-guide-card">
                  <h4 className="guide-card-title">2. 크레파스 그림일기</h4>
                  <p className="guide-card-desc">당신의 상상이 AI를 만나 따뜻한 손그림 삽화와 한 편의 그림일기로 탄생합니다.</p>
                </div>
                <div className="about-guide-card">
                  <h4 className="guide-card-title">3. 다이어리에 모으기</h4>
                  <p className="guide-card-desc">나의 상상 모음에서 스티커와 크레파스로 꾸미고 나만의 일기장을 완성하세요.</p>
                </div>
                <div className="about-guide-card">
                  <h4 className="guide-card-title">4. 상상 월드컵 출품</h4>
                  <p className="guide-card-desc">나만의 특별한 그림일기를 주간 월드컵에 출품하고 토너먼트 대결을 즐겨보세요.</p>
                </div>
                <div className="about-guide-card">
                  <h4 className="guide-card-title">5. 작은 상상 우체통</h4>
                  <p className="guide-card-desc">나만의 엉뚱한 이야기나 기발한 만약에 질문을 엽서에 적어 우체통에 부쳐보세요.</p>
                </div>
              </div>
            </article>
          </div>
        </main>
      )}

      {/* ===================================================
          WEEKLY IMAGINATION TOURNAMENT (주간 만약에 상상 월드컵)
      =================================================== */}
      {page === "card-worldcup" && (() => {
        // 실제 출품작만 사용 (더미데이터 제거)
        const activeCandidates = [...tournamentCandidates];

        // 8강 매치 구성: 출품작 2개씩 짝지어 매칭 (최대 4개 매치)
        const matches8 = [];
        for (let i = 0; i < activeCandidates.length - 1; i += 2) {
          matches8.push({
            key: `m8-${Math.floor(i / 2) + 1}`,
            cardA: activeCandidates[i],
            cardB: activeCandidates[i + 1],
          });
        }

        const safeMatchIdx = matches8.length > 0 ? Math.min(activeMatchIdx, matches8.length - 1) : 0;
        const currentMatch = matches8[safeMatchIdx] || null;
        const userChoice = currentMatch ? tournamentVotes[currentMatch.key] : null;

        // 득표율 계산 (실제 표 수 기준)
        const votesA = currentMatch ? ((currentMatch.cardA.votes || 0) + (userChoice === currentMatch.cardA.id ? 1 : 0)) : 0;
        const votesB = currentMatch ? ((currentMatch.cardB.votes || 0) + (userChoice === currentMatch.cardB.id ? 1 : 0)) : 0;
        const totalVotes = votesA + votesB;
        const percentA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
        const percentB = totalVotes > 0 ? 100 - percentA : 50;

        return (
          <main className="worldcup-page">
            <div className="worldcup-container">
              
              {/* 상단 툴바 */}
              <header className="worldcup-top-bar">
                <button
                  type="button"
                  className="worldcup-nav-btn"
                  onClick={() => setPage(prevPage || "home")}
                  title="이전 화면으로 돌아가기"
                >
                  ← 이전으로
                </button>
                <div className="worldcup-header-badge-group">
                  {cardSubTab === "worldcup" && (
                    <span className="worldcup-title-badge">2026년 10월 4주차 리그</span>
                  )}
                </div>
                <button
                  type="button"
                  className="worldcup-nav-btn home"
                  onClick={goHome}
                  title="처음으로 가기"
                >
                  처음으로
                </button>
              </header>

              {/* 화면 전환 탭 버튼 (주간 만약에 상상 월드컵 vs 작은 상상 우체통) */}
              <div className="card-sub-tab-container">
                <div className="card-sub-tab-pill-box" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={cardSubTab === "worldcup"}
                    className={`card-sub-tab-pill ${cardSubTab === "worldcup" ? "active" : ""}`}
                    onClick={() => setCardSubTab("worldcup")}
                  >
                    주간 만약에 상상 월드컵
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={cardSubTab === "postbox"}
                    className={`card-sub-tab-pill ${cardSubTab === "postbox" ? "active" : ""}`}
                    onClick={() => setCardSubTab("postbox")}
                  >
                    작은 상상 우체통
                  </button>
                </div>
              </div>

              {/* 탭 1: 주간 만약에 상상 월드컵 (8강 대결 + 타임라인) */}
              {cardSubTab === "worldcup" && (
                <>
                  {/* 1. 최상단 메인: 현재 실시간 진행 중인 8강 월드컵 배틀 */}
                  <section className="worldcup-active-match-section">
                    <div className="timeline-header-row">
                      <div className="worldcup-title-group">
                        <h2 className="worldcup-main-title">주간 만약에 상상 월드컵</h2>
                      </div>
                      <div className="worldcup-countdown-box">
                        <span className="live-indicator-pill">8강 본선 LIVE</span>
                        <span className="countdown-text">8강 마감까지 <strong>07시간 42분</strong></span>
                      </div>
                    </div>

                    {matches8.length === 0 ? (
                      /* 출품작이 2개 미만일 때의 빈 상태 (더미데이터 제거 완료) */
                      <div className="worldcup-empty-box">
                        <h3 className="empty-state-title">이번 주 접수된 상상 월드컵 후보가 아직 없습니다</h3>
                        <div className="empty-state-actions">
                          <button
                            type="button"
                            className="empty-cta-btn primary"
                            onClick={() => setCardSubTab("postbox")}
                          >
                            작은 상상 우체통에서 출품하기
                          </button>
                          <button
                            type="button"
                            className="empty-cta-btn secondary"
                            onClick={() => setPage("my-diary")}
                          >
                            나의 일기에서 카드 출품하기
                          </button>
                          {Object.keys(tournamentVotes).length > 0 && (
                            <button
                              type="button"
                              className="empty-cta-btn reset"
                              onClick={handleResetAllTournamentVotes}
                              title="이전 투표 내역을 초기화합니다"
                            >
                              이전 투표 내역 비우기
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="worldcup-match-arena">
                        {/* 매치 선택 인디케이터 (Match 1 ~ Match N) */}
                        <div className="match-selector-header-row">
                          <div className="match-selector-pills">
                            {matches8.map((m, idx) => {
                              const isVoted = !!tournamentVotes[m.key];
                              return (
                                <button
                                  key={m.key}
                                  type="button"
                                  className={`match-pill-btn ${safeMatchIdx === idx ? "active" : ""} ${isVoted ? "voted" : ""}`}
                                  onClick={() => setActiveMatchIdx(idx)}
                                >
                                  <span>{`매치 ${idx + 1}`}</span>
                                  {isVoted && <span className="voted-check">✓</span>}
                                </button>
                              );
                            })}
                          </div>
                          {Object.keys(tournamentVotes).length > 0 && (
                            <button
                              type="button"
                              className="vote-reset-all-btn"
                              onClick={handleResetAllTournamentVotes}
                              title="모든 투표를 리셋하고 다시 투표하기"
                            >
                              투표 전체 초기화
                            </button>
                          )}
                        </div>

                        <p className="arena-instruction">
                          더 마음에 와닿거나 엉뚱하고 기발한 상상에 당신의 표를 던져주세요!
                        </p>

                        {/* 1:1 대결 카드 배틀 박스 */}
                        <div className="match-battle-box">
                          
                          {/* 카드 A */}
                          <div className={`battle-card ${userChoice === currentMatch.cardA.id ? "selected-winner" : ""}`}>
                            <div className="battle-card-header">
                              <span className="card-side-tag">상상 A</span>
                              <span className="card-author-pill">By. {currentMatch.cardA.author}</span>
                            </div>
                            <div className="battle-card-img-wrap">
                              <img src={currentMatch.cardA.imageUrl} alt="상상 A" className="battle-card-img" />
                            </div>
                            <div className="battle-card-content">
                              <h4 className="battle-card-q">{currentMatch.cardA.question}</h4>
                              <p className="battle-card-a">"{currentMatch.cardA.answer}"</p>
                            </div>

                            {/* 투표 버튼 또는 투표 결과 */}
                            <div className="battle-vote-action">
                              {userChoice ? (
                                <div className="vote-result-box">
                                  <div className="result-bar-wrap">
                                    <div className="result-bar-fill" style={{ width: `${percentA}%` }} />
                                  </div>
                                  <span className="result-percent-text">{percentA}% ({votesA}표)</span>
                                  {userChoice === currentMatch.cardA.id && (
                                    <span className="my-vote-badge">내 투표작</span>
                                  )}
                                  <button
                                    type="button"
                                    className="vote-change-text-btn"
                                    onClick={() => handleCancelTournamentVote(currentMatch.key)}
                                    title="투표를 취소하고 다시 투표하기"
                                  >
                                    ↩ 투표 취소 / 다시하기
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="vote-submit-btn"
                                  onClick={() => handleVoteTournamentCard(currentMatch.key, currentMatch.cardA.id)}
                                >
                                  이 상상에 투표하기
                                </button>
                              )}
                            </div>
                          </div>

                          {/* 중앙 VS 엠블럼 */}
                          <div className="battle-vs-badge">
                            <span className="vs-text">VS</span>
                            <span className="vs-sub">8강 {safeMatchIdx + 1}/{matches8.length}</span>
                          </div>

                          {/* 카드 B */}
                          <div className={`battle-card ${userChoice === currentMatch.cardB.id ? "selected-winner" : ""}`}>
                            <div className="battle-card-header">
                              <span className="card-side-tag orange">상상 B</span>
                              <span className="card-author-pill">By. {currentMatch.cardB.author}</span>
                            </div>
                            <div className="battle-card-img-wrap">
                              <img src={currentMatch.cardB.imageUrl} alt="상상 B" className="battle-card-img" />
                            </div>
                            <div className="battle-card-content">
                              <h4 className="battle-card-q">{currentMatch.cardB.question}</h4>
                              <p className="battle-card-a">"{currentMatch.cardB.answer}"</p>
                            </div>

                            {/* 투표 버튼 또는 투표 결과 */}
                            <div className="battle-vote-action">
                              {userChoice ? (
                                <div className="vote-result-box">
                                  <div className="result-bar-wrap">
                                    <div className="result-bar-fill orange" style={{ width: `${percentB}%` }} />
                                  </div>
                                  <span className="result-percent-text">{percentB}% ({votesB}표)</span>
                                  {userChoice === currentMatch.cardB.id && (
                                    <span className="my-vote-badge">내 투표작</span>
                                  )}
                                  <button
                                    type="button"
                                    className="vote-change-text-btn"
                                    onClick={() => handleCancelTournamentVote(currentMatch.key)}
                                    title="투표를 취소하고 다시 투표하기"
                                  >
                                    ↩ 투표 취소 / 다시하기
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="vote-submit-btn orange"
                                  onClick={() => handleVoteTournamentCard(currentMatch.key, currentMatch.cardB.id)}
                                >
                                  이 상상에 투표하기
                                </button>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* 하단 매치 네비게이션 */}
                        {matches8.length > 1 && (
                          <div className="match-footer-nav">
                            <button
                              type="button"
                              className="match-step-btn"
                              disabled={safeMatchIdx === 0}
                              onClick={() => setActiveMatchIdx((prev) => Math.max(0, prev - 1))}
                            >
                              ← 이전 매치
                            </button>
                            <span className="match-step-info">
                              {safeMatchIdx + 1} / {matches8.length} 매치
                            </span>
                            <button
                              type="button"
                              className="match-step-btn"
                              disabled={safeMatchIdx === matches8.length - 1}
                              onClick={() => setActiveMatchIdx((prev) => Math.min(matches8.length - 1, prev + 1))}
                            >
                              다음 매치 →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </section>

                  {/* 2. 하단 영역: 주간 리그 타임라인 및 지난 라운드 / 예정 라운드 / 명예의 전당 */}
                  <section className="worldcup-timeline-section">
                    <div className="timeline-section-header">
                      <h3 className="timeline-section-title">주간 일정 및 라운드 안내</h3>
                      <p className="timeline-section-desc">일주일 동안 단계별로 진행되는 월드컵 일정과 지난/예정 라운드를 확인해보세요.</p>
                    </div>

                    {/* 일주일 7일 주기 스테이지 탭 */}
                    <div className="weekly-stage-tabs" role="tablist">
                      <button
                        type="button"
                        className={`stage-tab-btn ${activeTournamentTab === "round16" ? "active" : ""}`}
                        onClick={() => setActiveTournamentTab("round16")}
                      >
                        <span className="stage-days">월 ~ 화</span>
                        <span className="stage-name">16강 예선</span>
                        <span className="stage-status done">종료 ✓</span>
                      </button>

                      <button
                        type="button"
                        className={`stage-tab-btn ${activeTournamentTab === "round8" ? "active" : ""}`}
                        onClick={() => setActiveTournamentTab("round8")}
                      >
                        <span className="stage-days">수 ~ 목</span>
                        <span className="stage-name">8강 본선</span>
                        <span className="stage-status live">진행 중</span>
                      </button>

                      <button
                        type="button"
                        className={`stage-tab-btn ${activeTournamentTab === "round4" ? "active" : ""}`}
                        onClick={() => setActiveTournamentTab("round4")}
                      >
                        <span className="stage-days">금요일</span>
                        <span className="stage-name">4강 준결승</span>
                        <span className="stage-status upcoming">D-1 예정</span>
                      </button>

                      <button
                        type="button"
                        className={`stage-tab-btn ${activeTournamentTab === "final" ? "active" : ""}`}
                        onClick={() => setActiveTournamentTab("final")}
                      >
                        <span className="stage-days">토요일</span>
                        <span className="stage-name">결승전</span>
                        <span className="stage-status upcoming">D-2 예정</span>
                      </button>

                      <button
                        type="button"
                        className={`stage-tab-btn champion-tab ${activeTournamentTab === "champions" ? "active" : ""}`}
                        onClick={() => setActiveTournamentTab("champions")}
                      >
                        <span className="stage-days">일요일</span>
                        <span className="stage-name">명예의 전당</span>
                        <span className="stage-status">역대 1등작</span>
                      </button>
                    </div>

                    {/* 탭별 하단 상세 패널 */}
                    <div className="stage-detail-container">
                      {activeTournamentTab === "round16" && (
                        <div className="stage-info-card">
                          <div className="stage-info-badge">지난 라운드 결과</div>
                          <h4 className="stage-info-title">16강 예선 투표 종료</h4>
                          <p className="stage-info-desc">
                            10월 20일(월)부터 21일(화)까지 진행된 16강 예선 투표가 종료되었습니다. 상상가 분들의 뜨거운 참여로 총 16개의 후보작 중 상위 8개 작품이 현재 진행 중인 8강 본선에 진출했습니다.
                          </p>
                          <div className="stage-info-box">
                            <strong>8강 진출 성공작:</strong> '침대가 구름처럼 둥둥 떠다닌다면', '과거의 실수했던 나에게 딱 한 마디만?', '달콤한 솜사탕 구름 비가 내린다면' 외 5작품
                          </div>
                        </div>
                      )}

                      {activeTournamentTab === "round8" && (
                        <div className="stage-info-card live">
                          <div className="stage-info-badge live">실시간 진행 중</div>
                          <h4 className="stage-info-title">8강 본선 토너먼트 진행 중</h4>
                          <p className="stage-info-desc">
                            현재 상단 투표창에서 8강 1:1 대결 투표가 실시간으로 펼쳐지고 있습니다. 마음에 닿는 상상에 소중한 한 표를 던져 4강 진출작을 직접 결정해 주세요!
                          </p>
                          <div className="stage-info-box">
                            <strong>투표 마감 안내:</strong> 목요일 23:59까지 집계된 결과로 4강 진출작 4개가 확정됩니다.
                          </div>
                        </div>
                      )}

                      {activeTournamentTab === "round4" && (
                        <div className="stage-info-card">
                          <div className="stage-info-badge">오픈 예정</div>
                          <h4 className="stage-info-title">4강 준결승 (10월 24일 금요일)</h4>
                          <p className="stage-info-desc">
                            8강 4개의 매치에서 승리한 4개의 상상이 결승 진출 티켓을 놓고 격돌합니다. 금요일 단 하루 동안 진행되는 치열한 준결승을 기대해 주세요!
                          </p>
                        </div>
                      )}

                      {activeTournamentTab === "final" && (
                        <div className="stage-info-card">
                          <div className="stage-info-badge">오픈 예정</div>
                          <h4 className="stage-info-title">주간 결승전 (10월 25일 토요일)</h4>
                          <p className="stage-info-desc">
                            일주일간의 대장정을 거쳐 살아남은 최후의 2개 상상이 맞붙는 영예의 결승전입니다. 이번 주 최고의 '만약에' 상상 타이틀을 차지할 주인공은 누구일까요?
                          </p>
                        </div>
                      )}

                      {activeTournamentTab === "champions" && (
                        <div className="worldcup-hall-of-fame">
                          <div className="hof-header">
                            <h3>역대 주간 상상 챔피언</h3>
                            <p>상상가들의 가장 많은 마음을 사로잡았던 영예의 1등 상상들입니다.</p>
                          </div>

                          <div className="hof-cards-grid">
                            <div className="hof-card gold-champ">
                              <div className="champ-ribbon">10월 3주차 우승작</div>
                              <img
                                src={DEFAULT_TOURNAMENT_CANDIDATES[2].imageUrl}
                                alt="10월 3주차 우승"
                                className="champ-img"
                              />
                              <div className="champ-body">
                                <span className="champ-author">상상가 지호의 작품</span>
                                <h4 className="champ-question">"과거의 실수했던 나에게 딱 한 마디만?"</h4>
                                <p className="champ-quote">"괜찮아, 모든 인생이 행복할 수만은 없잖아? 그 덕분에 지금의 내가 있어."</p>
                                <span className="champ-vote-count">총 1,482표 획득 (득표율 68%)</span>
                              </div>
                            </div>

                            <div className="hof-card silver-champ">
                              <div className="champ-ribbon silver">10월 2주차 우승작</div>
                              <img
                                src={DEFAULT_TOURNAMENT_CANDIDATES[0].imageUrl}
                                alt="10월 2주차 우승"
                                className="champ-img"
                              />
                              <div className="champ-body">
                                <span className="champ-author">상상가 소현의 작품</span>
                                <h4 className="champ-question">"침대가 구름처럼 둥둥 떠다닌다면?"</h4>
                                <p className="champ-quote">"텔레비전 바로 앞에 멈춰두고 하루 종일 누워서 만화영화 볼 거야!"</p>
                                <span className="champ-vote-count">총 1,320표 획득 (득표율 59%)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </>
              )}

              {/* 탭 2: 작은 상상 우체통 (다음 주 상상 월드컵 후보 응모) */}
              {cardSubTab === "postbox" && (
                <section className="about-postbox-section standalone">
                  <div className="postbox-header">
                    <div>
                      <h3 className="postbox-title">작은 상상 우체통</h3>
                      <p className="postbox-subtitle">
                        '만약에' 상상 속에서만 일어날 줄 알았던 나만의 진짜 이야기나,<br />
                        머릿속으로 그려본 특별한 '만약에'를 자유롭게 공유해 주세요.
                      </p>
                    </div>
                  </div>

                  {/* 좌우 인터랙티브 스테이지: 왼쪽(대형 손그림 우체통) + 오른쪽(엽서 작성지) */}
                  <div className="postbox-interactive-stage">
                    {/* 왼쪽: 대형 손그림 우체통 */}
                    <div className={`postbox-illustration-col ${postboxBounce ? "bounce-active" : ""}`}>
                      <div className="postbox-svg-box">
                        <HandDrawnPostbox />
                        {/* 정밀 좌표 타겟 마커 및 투입구 골드 글로우 */}
                        <div
                          ref={postboxSlotRef}
                          className={`postbox-slot-target ${slotGlow ? "glow-active" : ""}`}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    {/* 오른쪽: 엽서 작성 폼 & 비행 애니메이션 오버레이 */}
                    <div className="postbox-form-col">
                      <form className="postbox-card-form" onSubmit={handleSendPostboxLetter}>
                        <div className="postcard-top-row">
                          <label className="postcard-sender-label">
                            보내는 상상가:
                            <input
                              type="text"
                              className="postcard-sender-input"
                              value={postboxSender || currentNickname || ""}
                              onChange={(e) => setPostboxSender(e.target.value)}
                              placeholder={currentNickname || "이름 또는 닉네임"}
                              maxLength={15}
                              disabled={isFlyingPostcard}
                            />
                          </label>
                        </div>

                        <div className="postcard-content-area">
                          <textarea
                            className="postcard-textarea"
                            value={postboxContent}
                            onChange={(e) => setPostboxContent(e.target.value)}
                            placeholder="예) 만약에 동물들과 대화할 수 있는 안경이 있다면 무엇을 먼저 물어보고 싶으신가요? 편하게 적어주세요."
                            rows={4}
                            maxLength={200}
                            disabled={isFlyingPostcard}
                          />
                          <div className="postcard-char-count">
                            {postboxContent.length} / 200자
                          </div>
                        </div>

                        <div className="postcard-submit-row">
                          <button
                            type="submit"
                            className="postcard-send-btn"
                            disabled={isFlyingPostcard || !postboxContent.trim()}
                          >
                            {isFlyingPostcard ? "우체통으로 날아가는 중..." : "우체통에 엽서 넣기"}
                          </button>
                        </div>
                      </form>

                      {/* 비행 애니메이션 종이 시트 (동적 타겟 좌표 연동) */}
                      {isFlyingPostcard && flyingPostcardData && (
                        <div
                          ref={postcardSheetRef}
                          className={`flying-postcard-sheet ${flyingPostcardPhase}`}
                          style={{
                            "--fly-target-x": `${flyOffsets.x}px`,
                            "--fly-target-y": `${flyOffsets.y}px`,
                          }}
                        >
                          <div className="flying-postcard-inner">
                            <div className="flying-top">
                              <span className="flying-from">From. {flyingPostcardData.sender}</span>
                            </div>
                            <p className="flying-body">{flyingPostcardData.content}</p>
                            <div className="flying-bottom-stamp">MAN-YAK POST</div>
                          </div>
                        </div>
                      )}

                      {/* 성공적으로 보냈다는 안내 문구 배너 */}
                      {postboxSuccessMsg && (
                        <div className="postbox-success-banner">
                          <div className="success-icon-circle">✓</div>
                          <div className="success-text-box">
                            <strong>{postboxSuccessMsg}</strong>
                            <p>보내주신 소중한 상상 엽서가 우체통에 쏙 들어갔어요! 다음 주 리그 후보로 소중히 보관됩니다.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 부쳐진 엽서 목록: 가로 자동 무한 롤링 갤러리 */}
                  <div className="postbox-letters-gallery">
                    <div className="postbox-gallery-header-row">
                      <h4 className="postbox-gallery-title">
                        우체통에 모인 상상 엽서들 ({postboxLetters.length})
                      </h4>
                    </div>

                    <div className="postbox-marquee-viewport">
                      <div className="postbox-marquee-track">
                        {marqueeLetters.map((letter, idx) => {
                          const theme = PASTEL_THEMES[idx % PASTEL_THEMES.length];
                          return (
                            <div
                              key={`${letter.id}-${idx}`}
                              className="postbox-tape-postcard"
                              style={{
                                backgroundColor: theme.bg,
                                borderColor: theme.border,
                                transform: `rotate(${theme.rotate})`,
                              }}
                              onClick={() => setSelectedPostboxLetter(letter)}
                              role="button"
                              tabIndex={0}
                            >
                              <div className="tape-deco" />
                              <div className="tape-postcard-header">
                                <span className="tape-sender">From. {letter.sender}</span>
                                <span className="tape-date">{letter.createdAt}</span>
                              </div>
                              <p className="tape-content">{letter.content}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 엽서 상세 팝업 모달 */}
                  {selectedPostboxLetter && (
                    <div
                      className="postbox-modal-overlay"
                      onClick={() => setSelectedPostboxLetter(null)}
                      role="dialog"
                      aria-modal="true"
                    >
                      <div
                        className="postbox-modal-card"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="modal-close-icon-btn"
                          onClick={() => setSelectedPostboxLetter(null)}
                          title="닫기"
                        >
                          ✕
                        </button>
                        <div className="modal-postcard-header">
                          <div className="modal-sender-group">
                            <span className="modal-sender-tag">보낸 상상가</span>
                            <h3 className="modal-sender-name">{selectedPostboxLetter.sender}</h3>
                          </div>
                          <div className="modal-stamp-box">
                            <span className="modal-stamp-text">MAN-YAK</span>
                            <span className="modal-stamp-date">{selectedPostboxLetter.createdAt}</span>
                          </div>
                        </div>

                        <div className="modal-postcard-body">
                          <p className="modal-postcard-text">
                            "{selectedPostboxLetter.content}"
                          </p>
                        </div>

                        <div className="modal-postcard-footer">
                          <span className="modal-footer-caption">작은 상상 우체통에 소중히 보관된 엽서입니다.</span>
                          <button
                            type="button"
                            className="modal-confirm-btn"
                            onClick={() => setSelectedPostboxLetter(null)}
                          >
                            닫기
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )}

            </div>
          </main>
        );
      })()}

      

      {/* ===================================================
          토스트 알림
      =================================================== */}
      {toastMessage && (
        <div className="manyak-toast" role="status">
          <span className="toast-star">✦</span>
          <p>{toastMessage}</p>
        </div>
      )}

      <footer>
        © MAN-YAK · Imagine something impossible.
      </footer>

    </div>
  );
}

export default App;
