const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

/* =========================================================
   환경변수 설정
   ---------------------------------------------------------
   .env 위치:
   C:\react\if\man-yak\.env
========================================================= */

require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const OpenAI = require("openai");

/* =========================================================
   OpenAI 설정
========================================================= */

if (!process.env.OPENAI_API_KEY) {
  console.error(
    "❌ OPENAI_API_KEY를 찾을 수 없습니다."
  );
  console.error(
    "확인할 위치: C:\\react\\if\\man-yak\\.env"
  );
} else {
  console.log(
    "✅ OPENAI_API_KEY 확인 완료"
  );
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================================================
   기본 설정
========================================================= */

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* =========================================================
   Supabase 연결
========================================================= */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "⚠️ SUPABASE_URL 또는 SUPABASE_KEY가 .env에 설정되지 않았습니다."
  );
}

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

/* =========================================================
   1. 서버 + Supabase 연결 테스트
========================================================= */

app.get("/api/test", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    res.json({
      success: true,
      message: "Supabase 연결 성공!",
      total_questions: count,
    });
  } catch (error) {
    console.error("Supabase 연결 오류:", error);
    res.status(500).json({
      success: false,
      message: "Supabase 연결 실패: " + error.message,
    });
  }
});

/* =========================================================
   2. 질문 전체 가져오기
========================================================= */

app.get("/api/questions", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("questions")
      .select(
        "question_id, question, question_type, imagination_factor, creativity_factor, created_at"
      )
      .order("question_id", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("질문 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "질문을 불러오지 못했습니다.",
    });
  }
});

/* =========================================================
   3. 특정 질문 하나 가져오기
========================================================= */

app.get("/api/questions/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    const { data, error } = await supabase
      .from("questions")
      .select(
        "question_id, question, question_type, imagination_factor, creativity_factor, created_at"
      )
      .eq("question_id", questionId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "해당 질문을 찾을 수 없습니다.",
      });
    }

    res.json(data);
  } catch (error) {
    console.error("질문 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "질문을 불러오지 못했습니다.",
    });
  }
});

/* =========================================================
   닉네임 → 고유 숫자 ID(bigint 안전 범위) 변환 함수
========================================================= */
function nicknameToUserId(nickname) {
  if (!nickname || typeof nickname !== "string") return 1;
  const clean = nickname.trim();
  if (!clean) return 1;
  // 53비트 JS 안전 정수 범위 내의 FNV-1a 기반 해시
  let hash = 2166136261;
  for (let i = 0; i < clean.length; i++) {
    hash ^= clean.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash % 2000000000) + 1;
}

/* =========================================================
   4. 답변 저장
========================================================= */

app.post("/api/answers", async (req, res) => {
  try {
    const { user_id, nickname, question_id, answer, image_url } = req.body;

    /* -----------------------------
       필수값 확인
    ----------------------------- */

    if (!question_id || !answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "question_id, answer가 필요합니다.",
      });
    }

    const resolvedNickname = (nickname || "").trim() || "꼬마상상가";
    const resolvedUserId = user_id ? Number(user_id) : nicknameToUserId(resolvedNickname);

    /* -----------------------------
       답변 저장 (nickname 및 image_url 포함 시도, 컬럼 미존재 시 유연한 fallback)
    ----------------------------- */

    const insertPayload = {
      user_id: resolvedUserId,
      question_id: String(question_id),
      answer: answer.trim(),
    };

    if (image_url) {
      insertPayload.image_url = image_url;
    }
    if (resolvedNickname) {
      insertPayload.nickname = resolvedNickname;
    }

    let insertResult = await supabase
      .from("answers")
      .insert([insertPayload])
      .select();

    // 1차 fallback: answers 테이블에 nickname 컬럼이 없는 경우
    if (insertResult.error && insertResult.error.message && insertResult.error.message.includes("nickname")) {
      delete insertPayload.nickname;
      insertResult = await supabase
        .from("answers")
        .insert([insertPayload])
        .select();
    }

    // 2차 fallback: answers 테이블에 image_url 컬럼이 아직 없는 경우
    if (insertResult.error && insertResult.error.message && insertResult.error.message.includes("image_url")) {
      console.warn("⚠️ image_url 컬럼이 없어 기본 텍스트만 저장합니다.");
      delete insertPayload.image_url;
      insertResult = await supabase
        .from("answers")
        .insert([insertPayload])
        .select();
    }

    if (insertResult.error) throw insertResult.error;

    /* -----------------------------
       저장 성공
    ----------------------------- */

    res.json({
      success: true,
      message: "상상이 저장되었습니다!",
      answer_id: insertResult.data?.[0]?.answer_id,
      user_id: resolvedUserId,
      nickname: resolvedNickname,
    });
  } catch (error) {
    console.error("답변 저장 오류:", error);
    res.status(500).json({
      success: false,
      message: "답변 저장에 실패했습니다.",
      error: error.message,
    });
  }
});

/* =========================================================
   4-1. 답변 이미지 URL 업데이트
========================================================= */

app.patch("/api/answers/:answerId", async (req, res) => {
  try {
    const { answerId } = req.params;
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({
        success: false,
        message: "image_url이 필요합니다.",
      });
    }

    const { data, error } = await supabase
      .from("answers")
      .update({ image_url })
      .eq("answer_id", answerId)
      .select();

    if (error) {
      if (error.message && error.message.includes("image_url")) {
        console.warn("⚠️ Supabase answers 테이블에 image_url 컬럼이 없습니다.");
        return res.status(200).json({
          success: false,
          warning: "image_url 컬럼이 생성되지 않았습니다.",
          message: "DB 컬럼이 아직 없어 브라우저에만 저장되었습니다.",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "상상 이미지가 DB에 저장되었습니다!",
      data: data?.[0],
    });
  } catch (error) {
    console.error("이미지 URL 업데이트 오류:", error);
    res.status(500).json({
      success: false,
      message: "이미지 URL 업데이트 실패: " + error.message,
    });
  }
});

/* =========================================================
   5. 답변 전체 가져오기 (닉네임별 필터링 지원)
========================================================= */

app.get("/api/answers", async (req, res) => {
  try {
    const { user_id, nickname } = req.query;
    const resolvedNickname = (nickname || "").trim();
    const resolvedUserId = user_id 
      ? Number(user_id) 
      : (resolvedNickname ? nicknameToUserId(resolvedNickname) : 1);

    // image_url 컬럼을 포함하여 조회를 시도하고, 없으면 fallback 조회
    let { data, error } = await supabase
      .from("answers")
      .select(`
        answer_id,
        user_id,
        question_id,
        answer,
        image_url,
        created_at,
        questions (
          question,
          question_type,
          imagination_factor
        )
      `)
      .eq("user_id", resolvedUserId)
      .order("created_at", { ascending: false });

    if (error && error.message && error.message.includes("image_url")) {
      const fallback = await supabase
        .from("answers")
        .select(`
          answer_id,
          user_id,
          question_id,
          answer,
          created_at,
          questions (
            question,
            question_type,
            imagination_factor
          )
        `)
        .eq("user_id", resolvedUserId)
        .order("created_at", { ascending: false });

      if (fallback.error) throw fallback.error;
      data = fallback.data;
      error = null;
    } else if (error) {
      throw error;
    }

    // React 프론트엔드와 호환되도록 평탄화
    const formattedRows = (data || []).map((a) => ({
      answer_id: a.answer_id,
      user_id: a.user_id,
      nickname: resolvedNickname || `상상가 #${a.user_id}`,
      question_id: a.question_id,
      question: a.questions?.question,
      question_type: a.questions?.question_type,
      imagination_factor: a.questions?.imagination_factor,
      answer: a.answer,
      image_url: a.image_url || null,
      created_at: a.created_at,
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error("답변 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "답변을 불러오지 못했습니다.",
    });
  }
});

/* =========================================================
   API 소진 방지용 감성 크레파스 Mock 이미지 모음 (비용 0원 테스트)
========================================================= */
const MOCK_DIARY_IMAGES = [
  // 1. 별밤 바다 위 작은 이동식 집
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' result='n'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='n' scale='3'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='600' height='600' fill='%23192a56'/%3E%3Cg filter='url(%23f)'%3E%3Ccircle cx='120' cy='120' r='50' fill='%23fbc531'/%3E%3Cpath d='M0 450 Q150 420 300 450 T600 450 L600 600 L0 600 Z' fill='%230097e6'/%3E%3Crect x='220' y='320' width='160' height='130' fill='%23e17055' rx='10'/%3E%3Cpolygon points='190,320 300,210 410,320' fill='%23d63031'/%3E%3Crect x='260' y='360' width='50' height='50' fill='%23ffeaa7' rx='5' stroke='%232d3436' stroke-width='4'/%3E%3Ccircle cx='285' cy='385' r='14' fill='%23fdcb6e'/%3E%3Cpolygon points='80,80 85,95 100,95 88,105 92,120 80,110 68,120 72,105 60,95 75,95' fill='%23f1c40f'/%3E%3Cpolygon points='480,100 484,112 496,112 486,120 490,132 480,124 470,132 474,120 464,112 476,112' fill='%23f1c40f'/%3E%3Cpolygon points='380,70 383,78 392,78 385,84 388,92 380,87 372,92 375,84 368,78 377,78' fill='%23f1c40f'/%3E%3C/g%3E%3C/svg%3E`,
  // 2. 꼬마 공룡과 무지개
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' result='n'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='n' scale='3'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='600' height='600' fill='%23e8f5e9'/%3E%3Cg filter='url(%23f)'%3E%3Cpath d='M80 500 A220 220 0 0 1 520 500' fill='none' stroke='%23ff7675' stroke-width='16'/%3E%3Cpath d='M100 500 A200 200 0 0 1 500 500' fill='none' stroke='%23fdcb6e' stroke-width='16'/%3E%3Cpath d='M120 500 A180 180 0 0 1 480 500' fill='none' stroke='%2355efc4' stroke-width='16'/%3E%3Cpath d='M140 500 A160 160 0 0 1 460 500' fill='none' stroke='%2374b9ff' stroke-width='16'/%3E%3Cpath d='M0 480 Q300 450 600 480 L600 600 L0 600 Z' fill='%23a8e6cf'/%3E%3Cellipse cx='300' cy='390' rx='80' ry='70' fill='%234cd137'/%3E%3Ccircle cx='340' cy='320' r='45' fill='%234cd137'/%3E%3Ccircle cx='355' cy='310' r='8' fill='%23222'/%3E%3Cpath d='M335 340 Q355 355 375 340' fill='none' stroke='%23222' stroke-width='4' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E`,
  // 3. 우주선과 은하수
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' result='n'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='n' scale='3'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='600' height='600' fill='%232c3e50'/%3E%3Cg filter='url(%23f)'%3E%3Cellipse cx='300' cy='320' rx='140' ry='45' fill='%23e67e22'/%3E%3Cellipse cx='300' cy='310' rx='130' ry='38' fill='%23f39c12'/%3E%3Cpath d='M220 300 C220 220 380 220 380 300 Z' fill='%2374b9ff' opacity='0.85'/%3E%3Ccircle cx='300' cy='260' r='24' fill='%23fdcb6e'/%3E%3Ccircle cx='295' cy='255' r='4' fill='%23222'/%3E%3Ccircle cx='305' cy='255' r='4' fill='%23222'/%3E%3Ccircle cx='100' cy='150' r='35' fill='%23e84393'/%3E%3Ccircle cx='500' cy='420' r='45' fill='%2300cec9'/%3E%3C/g%3E%3C/svg%3E`
];

/* =========================================================
   6. AI 이미지 생성
========================================================= */

app.post(
  "/api/generate-image",
  async (req, res) => {

    try {

      const {
        question,
        answer,
        mock,
      } = req.body;

      /* -----------------------------
         🧪 API 소진 방지 Mock 모드 검사
      ----------------------------- */
      const isMockMode = mock === true || process.env.MOCK_IMAGE_GEN === "true";

      if (isMockMode) {
        console.log("--------------------------------");
        console.log("🧪 [API 소진 방지 모드 작동]");
        console.log("OpenAI API 호출을 차단하고 Mock 일러스트를 반환합니다. (비용 0원)");
        console.log("질문:", question);
        console.log("답변:", answer);
        console.log("--------------------------------");

        // 부드러운 로딩 연출 (600ms)
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Mock 모드용 지능형 고품질 일기 문장 생성
        let cleanQ = (question || "").trim().replace(/\?$/, "").replace(/^만약\s*/, "");
        cleanQ = cleanQ.replace(/\s*(그\s*사람에게|그곳에서|어떤\s*사람에게)?\s*(어떤\s*말을|무슨\s*말을|어떤\s*질문을|어디로|어떻게|누구와|무엇이|무엇을|무슨\s*생각을).*?(전하고\s*싶은가|적고\s*싶은가|묻고\s*싶은가|하고\s*싶은가|가고\s*싶은가|만들고\s*싶은가|될까|있을까|할까|생각하는가|남기고\s*싶은가|바라는가|하고\s*싶나)$/, "").trim();
        const cleanA = (answer || "").trim().replace(/^["'“”]/, "").replace(/["'“”]$/, "");
        
        let mockStory = "";
        if (cleanQ.includes("통화")) {
          mockStory = `나는 오늘 ${cleanQ.replace(/통화할\s*수\s*있다면|통화한다면/, "").trim()} 통화를 했다. 나는 물었다. "${cleanA}"`;
        } else if (cleanQ.includes("사람이 있다면") || cleanQ.includes("맡아주는")) {
          mockStory = `나는 오늘 내 슬픔을 다른 사람이 대신 맡아주는 상상을 했다. 나는 말했다. "${cleanA}"`;
        } else {
          mockStory = `나는 오늘 ${cleanQ} 상상을 했다. 나는 마음속으로 말했다. "${cleanA}"`;
        }

        const randomIndex = Math.floor(Math.random() * MOCK_DIARY_IMAGES.length);
        return res.json({
          success: true,
          imageUrl: MOCK_DIARY_IMAGES[randomIndex],
          diaryStory: mockStory,
          isMock: true,
        });
      }

      /* -----------------------------
         API 키 확인
      ----------------------------- */

      if (!process.env.OPENAI_API_KEY) {

        return res.status(500).json({
          success: false,
          message:
            "OpenAI API 키가 설정되지 않았습니다.",
        });
      }

      /* -----------------------------
         필수값 확인
      ----------------------------- */

      if (
        !question ||
        !answer ||
        !answer.trim()
      ) {

        return res.status(400).json({
          success: false,
          message:
            "question과 answer가 필요합니다.",
        });
      }

      console.log(
        "--------------------------------"
      );

      console.log(
        "🖼️ 이미지 및 AI 일기 문장 생성 요청"
      );

      console.log(
        "질문:",
        question
      );

      console.log(
        "답변:",
        answer
      );

      /* -----------------------------
         이미지 생성 프롬프트
      /* -----------------------------
         1단계: GPT-4o-mini로 일기 문장 + DALL-E 3 고화질 시각 묘사 프롬프트 원샷 생성
         (추가 호출 0회, 추가 비용 0원으로 퀄리티 극대화)
      ----------------------------- */

      console.log("OpenAI 고화질 생성 요청 시작...");

      let aiDiaryStory = "";
      let enhancedImagePrompt = "";

      try {
        const gptResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `당신은 어린이 동화책 전문 일러스트레이터이자 따뜻한 그림일기 작가입니다. 
주어진 '질문'과 '아이의 상상 답변'을 분석하여 JSON 형식으로 두 가지를 작성하세요:
{
  "diaryStory": "초등학생 그림일기 느낌의 순수하고 매끄러운 1~2문장의 일기체 (약 50~80자, '나는 오늘 ~를 했다.' 형태 서술, 큰따옴표 지양)",
  "imagePrompt": "DALL-E 3가 따뜻하고 포근한 명작 동화책 삽화를 그릴 수 있도록 아이의 상상 장면을 아름답고 구체적으로 시각 묘사한 영문 프롬프트. 반드시 포함할 스타일: Whimsical children's book illustration, gentle soft pastel and colored crayon strokes, warm textured paper grain, cozy lighting, charming fairy-tale aesthetic, clean artistic composition, absolutely no text, no words, no letters"
}`
            },
            {
              role: "user",
              content: `질문: ${question}\n아이의 상상 답변: ${answer}`
            }
          ],
          max_tokens: 350,
          temperature: 0.7,
        });

        const parsed = JSON.parse(gptResponse.choices?.[0]?.message?.content || "{}");
        aiDiaryStory = parsed.diaryStory || "";
        enhancedImagePrompt = parsed.imagePrompt || "";
      } catch (gptErr) {
        console.warn("⚠️ GPT 프롬프트 최적화 실패, 기본 프롬프트로 폴백:", gptErr.message);
      }

      /* -----------------------------
         2단계: DALL-E 3 고품질 손그림 동화책 스타일 이미지 생성
      ----------------------------- */

      const finalPrompt = enhancedImagePrompt || `Whimsical children's book illustration of ${answer} in the context of ${question}. Soft crayon and pastel strokes, warm textured paper, cute and heartwarming fairytale atmosphere, clean composition, no text, no typography.`;

      console.log("🖼️ AI 손그림 이미지 생성 중 (gpt-image-1)...");
      console.log("📝 적용 프롬프트:", finalPrompt.slice(0, 120) + "...");

      let imageResponse;
      try {
        imageResponse = await openai.images.generate({
          model: "gpt-image-1",
          prompt: finalPrompt,
          size: "1024x1024",
        });
      } catch (genErr) {
        console.warn("⚠️ gpt-image-1 생성 실패, chatgpt-image-latest로 재시도:", genErr.message);
        imageResponse = await openai.images.generate({
          model: "chatgpt-image-latest",
          prompt: finalPrompt,
        });
      }

      const imageData = imageResponse.data?.[0];

      if (!imageData || (!imageData.b64_json && !imageData.url)) {
        throw new Error("생성된 이미지 데이터를 받지 못했습니다.");
      }

      let imageUrl = "";
      if (imageData.b64_json) {
        imageUrl = `data:image/png;base64,${imageData.b64_json}`;
      } else if (imageData.url) {
        try {
          // OpenAI 임시 URL을 영구 저장이 가능한 Base64 데이터 URI로 변환
          const imgFetch = await fetch(imageData.url);
          const arrayBuffer = await imgFetch.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          imageUrl = `data:image/png;base64,${base64}`;
        } catch (fetchErr) {
          console.warn("⚠️ Base64 변환 실패, 원본 URL 사용:", fetchErr.message);
          imageUrl = imageData.url;
        }
      }

      console.log("✅ 이미지 및 일기 문장 생성 완료");
      if (aiDiaryStory) {
        console.log("📝 AI 일기 문장:", aiDiaryStory);
      }
      console.log("--------------------------------");

      /* -----------------------------
         React로 이미지 및 AI 일기 문장 전달
      ----------------------------- */

      res.json({
        success: true,
        imageUrl: imageUrl,
        diaryStory: aiDiaryStory,
      });

    } catch (error) {

      console.error(
        "❌ 이미지 생성 오류:"
      );

      console.error(
        error
      );

      res.status(500).json({
        success: false,
        message:
          "AI 이미지 생성에 실패했습니다.",
        error:
          error.message,
      });
    }
  }
);

/* =========================================================
   6. 작은 상상 우체통 (모든 사용자 공용 엽서 공유 API)
========================================================= */

const POSTBOX_FILE_PATH = path.join(__dirname, "postbox_letters.json");

const DEFAULT_POSTBOX_LETTERS = [
  {
    id: "letter-1",
    sender: "민우",
    content: "만약에 동물들과 대화할 수 있는 안경이 있다면 무엇을 먼저 물어보고 싶으신가요?",
    createdAt: "2026. 10. 22.",
  },
  {
    id: "letter-2",
    sender: "지호",
    content: "만약에 내 그림자가 말을 걸어온다면 어떤 비밀 이야기를 가장 먼저 털어놓을까요?",
    createdAt: "2026. 10. 21.",
  },
  {
    id: "letter-3",
    sender: "소현",
    content: "만약 침대가 구름처럼 변해 방 안을 둥둥 떠다닌다면 하루 종일 침대에서 안 내려올래요!",
    createdAt: "2026. 10. 20.",
  },
];

// 우체통 파일 불러오기 헬퍼
function loadPostboxLetters() {
  try {
    if (!fs.existsSync(POSTBOX_FILE_PATH)) {
      fs.writeFileSync(POSTBOX_FILE_PATH, JSON.stringify(DEFAULT_POSTBOX_LETTERS, null, 2), "utf8");
      return DEFAULT_POSTBOX_LETTERS;
    }
    const data = fs.readFileSync(POSTBOX_FILE_PATH, "utf8");
    return JSON.parse(data) || DEFAULT_POSTBOX_LETTERS;
  } catch (err) {
    console.error("우체통 파일 읽기 오류:", err);
    return DEFAULT_POSTBOX_LETTERS;
  }
}

// 우체통 엽서 전체 조회 (모든 사용자가 작성한 것 공유)
app.get("/api/postbox/letters", (req, res) => {
  try {
    const letters = loadPostboxLetters();
    res.json({ success: true, letters });
  } catch (err) {
    console.error("우체통 조회 실패:", err);
    res.status(500).json({ success: false, message: "우체통 엽서를 불러오지 못했습니다." });
  }
});

// 우체통 새 엽서 저장 (모든 사용자에게 공유)
app.post("/api/postbox/letters", (req, res) => {
  try {
    const { sender, content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "엽서 내용을 입력해주세요." });
    }

    const currentLetters = loadPostboxLetters();
    const newLetter = {
      id: `letter-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sender: (sender || "익명의 상상가").trim(),
      content: content.trim(),
      createdAt: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }),
    };

    const updated = [newLetter, ...currentLetters];
    fs.writeFileSync(POSTBOX_FILE_PATH, JSON.stringify(updated, null, 2), "utf8");

    res.json({ success: true, letter: newLetter, letters: updated });
  } catch (err) {
    console.error("우체통 엽서 저장 실패:", err);
    res.status(500).json({ success: false, message: "엽서를 우체통에 넣지 못했습니다." });
  }
});

/* =========================================================
   6-2. 상상 월드컵 토너먼트 출품(제출) 파일 저장소 & API
========================================================= */

const TOURNAMENT_SUBMISSIONS_PATH = path.join(__dirname, "tournament_submissions.json");

function loadTournamentSubmissions() {
  try {
    if (!fs.existsSync(TOURNAMENT_SUBMISSIONS_PATH)) {
      fs.writeFileSync(TOURNAMENT_SUBMISSIONS_PATH, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const raw = fs.readFileSync(TOURNAMENT_SUBMISSIONS_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("토너먼트 출품 데이터 로드 오류:", err);
    return [];
  }
}

// 닉네임당 1개씩 선착순 8개 후보 추출 헬퍼 함수
function getTop8UniqueCandidates(submissions) {
  const seenAuthors = new Set();
  const candidates = [];
  for (const item of submissions) {
    const authorKey = (item.author || "익명의 상상가").trim().toLowerCase();
    if (!seenAuthors.has(authorKey)) {
      seenAuthors.add(authorKey);
      candidates.push({
        id: item.id,
        author: item.author,
        question: item.question,
        answer: item.answer,
        imageUrl: item.imageUrl || "",
        votes: item.votes || 0,
      });
      if (candidates.length >= 8) break;
    }
  }
  return candidates;
}

// 8강 토너먼트 본선 후보 8개 조회 (닉네임당 1개 선착순)
app.get("/api/tournament/candidates", (req, res) => {
  try {
    const list = loadTournamentSubmissions();
    const top8 = getTop8UniqueCandidates(list);
    res.json({ success: true, candidates: top8 });
  } catch (err) {
    console.error("토너먼트 후보 조회 실패:", err);
    res.status(500).json({ success: false, message: "토너먼트 후보를 불러오지 못했습니다." });
  }
});

// 토너먼트 전체 출품작 목록 조회
app.get("/api/tournament/submissions", (req, res) => {
  try {
    const list = loadTournamentSubmissions();
    res.json({ success: true, submissions: list });
  } catch (err) {
    res.status(500).json({ success: false, message: "출품작 목록을 불러오지 못했습니다." });
  }
});

// 토너먼트 카드 출품 등록 (닉네임당 1개 유지 및 선착순 반영)
app.post("/api/tournament/submit", (req, res) => {
  try {
    const { author, question, answer, imageUrl } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "질문과 답변 내용이 필요합니다." });
    }

    const trimmedAuthor = (author || "익명의 상상가").trim();
    const currentSubmissions = loadTournamentSubmissions();

    const newSubmission = {
      id: `submission-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      author: trimmedAuthor,
      question: question.trim(),
      answer: answer.trim(),
      imageUrl: imageUrl || "",
      submittedAt: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }),
      status: "pending",
      votes: 0,
    };

    // 닉네임당 1개: 동일 닉네임이 이미 출품한 경우 기존 것은 제거하고 최신 출품작으로 갱신
    const filtered = currentSubmissions.filter(
      (sub) => (sub.author || "").trim().toLowerCase() !== trimmedAuthor.toLowerCase()
    );

    // 선착순 리스트 맨 앞(가장 최신) 또는 순서대로 추가
    const updated = [newSubmission, ...filtered];
    fs.writeFileSync(TOURNAMENT_SUBMISSIONS_PATH, JSON.stringify(updated, null, 2), "utf8");

    const top8 = getTop8UniqueCandidates(updated);
    res.json({
      success: true,
      submission: newSubmission,
      candidates: top8,
      message: "상상 월드컵 후보로 소중히 접수되었습니다!",
    });
  } catch (err) {
    console.error("토너먼트 출품 등록 실패:", err);
    res.status(500).json({ success: false, message: "토너먼트 출품에 실패했습니다." });
  }
});

/* =========================================================
   7. React 정적 빌드 서빙 (Render 프로덕션 배포용)
========================================================= */

const buildPath = path.join(__dirname, "..", "build");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  // API 경로 이외의 모든 요청은 React index.html로 반환 (SPA 새로고침 지원)
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

/* =========================================================
   8. 서버 실행
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("================================");
  console.log(`🚀 서버 실행: http://localhost:${PORT}`);
  console.log("🗄️ Database: Supabase");
  console.log("🖼️ 이미지 API: http://localhost:5000/api/generate-image");
  console.log("================================");
});