const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// ========================================
// OpenAI 연결
// ========================================

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ========================================
// 스타일 참고 이미지
// ========================================

const referenceImagePath = path.join(
  __dirname,
  "style-reference.png"
);


// ========================================
// 이미지 생성
// ========================================

app.post("/api/generate-image", async (req, res) => {

  try {

    const { question, answer } = req.body;


    // ------------------------------------
    // 입력값 확인
    // ------------------------------------

    if (!answer || !answer.trim()) {

      return res.status(400).json({
        error: "상상 내용을 입력해주세요.",
      });

    }


    // ------------------------------------
    // 참고 이미지 존재 확인
    // ------------------------------------

    if (!fs.existsSync(referenceImagePath)) {

      return res.status(500).json({
        error:
          "스타일 참고 이미지가 없습니다. " +
          "server.js와 같은 폴더에 style-reference.png를 넣어주세요.",
      });

    }


    console.log("");
    console.log("=================================");
    console.log("MAN YAK IMAGE GENERATION");
    console.log("=================================");

    console.log("Question:");
    console.log(question);

    console.log("Answer:");
    console.log(answer);

    console.log("Reference:");
    console.log(referenceImagePath);

    console.log("=================================");


    // ========================================
    // 사용자의 상상을 시각화하는 프롬프트
    // ========================================

    const prompt = `

Create ONE adorable 3D character illustration
based on the user's imagination.

The provided reference image is a STYLE REFERENCE.

IMPORTANT:
Use the reference image primarily for:

- overall 3D character aesthetic
- cute toy-like appearance
- rounded proportions
- soft plastic / soft material feeling
- large expressive eyes
- simplified facial features
- polished 3D rendering
- warm soft lighting
- charming character design
- playful visual atmosphere

Do NOT copy the exact character from the reference.

Create a NEW ORIGINAL CHARACTER
that represents the user's imagination.

----------------------------------------
USER QUESTION
----------------------------------------

${question}

----------------------------------------
USER ANSWER
----------------------------------------

${answer}

----------------------------------------
VISUAL INTERPRETATION
----------------------------------------

Understand the user's answer
and turn the important parts into
ONE clear visual scene.

For example:

If the user says:

"I became a stray cat and went to find my mother."

Then create:

- an adorable stray cat character
- the cat approaching its mother
- warm emotional interaction
- clear storytelling

If the user says:

"I will walk on two legs and show my mother a cute trick."

Then:

- the cat should stand on TWO LEGS
- the cat should perform a cute playful gesture
- the mother should react to the cat
- the action should be visually obvious

Do NOT simply illustrate the words literally.

Interpret the user's imagination
as a cute cinematic character scene.

----------------------------------------
CHARACTER DESIGN
----------------------------------------

The character should feel like:

- collectible designer toy
- premium 3D animation character
- cute children's animation
- soft rounded body
- oversized expressive eyes
- small cute mouth
- simple readable silhouette
- polished smooth 3D surface
- subtle realistic material
- adorable proportions

Avoid:

- photorealistic humans
- realistic photography
- anime 2D style
- flat illustration
- generic stock 3D
- horror
- overly detailed realism

----------------------------------------
COMPOSITION
----------------------------------------

Create ONE main scene.

The main character must be
the visual focus.

Use a simple uncluttered background.

Make the action immediately understandable.

Full-body character whenever possible.

Use soft cinematic lighting.

Use a warm whimsical atmosphere.

----------------------------------------
VERY IMPORTANT
----------------------------------------

The user's imagination is the source
of the STORY.

The reference image is only the source
of the VISUAL STYLE.

Do not reproduce text from the reference image.

Do not create captions.

Do not create UI.

Do not create a collage.

Do not create multiple unrelated scenes.

Do not add random characters or objects.

Create one coherent 3D character scene.

`;


    // ========================================
    // 참고 이미지 읽기
    // ========================================

    const referenceImage =
      fs.createReadStream(referenceImagePath);


    // ========================================
    // GPT Image 생성
    // ========================================

    const result = await client.images.edit({

      model: "gpt-image-2",

      image: referenceImage,

      prompt: prompt,

      size: "1024x1024",

      quality: "low",

    });


    // ========================================
    // 결과 확인
    // ========================================

    if (
      !result ||
      !result.data ||
      !result.data[0]
    ) {

      throw new Error(
        "이미지 생성 결과를 받지 못했습니다."
      );

    }


    const imageBase64 =
      result.data[0].b64_json;


    if (!imageBase64) {

      throw new Error(
        "이미지 데이터가 존재하지 않습니다."
      );

    }


    const image =
      `data:image/png;base64,${imageBase64}`;


    console.log("");
    console.log("IMAGE GENERATION SUCCESS");
    console.log("=================================");
    console.log("");


    // ========================================
    // React로 이미지 전달
    // ========================================

    res.json({
      image: image,
    });


  } catch (error) {

    console.error("");
    console.error("=================================");
    console.error("IMAGE GENERATION ERROR");
    console.error("=================================");

    console.error(error.message);

    if (error.response) {
      console.error(error.response);
    }

    console.error("=================================");
    console.error("");


    res.status(500).json({

      error:
        error.message ||
        "이미지를 생성하는 중 문제가 발생했습니다.",

    });

  }

});


// ========================================
// 서버 실행
// ========================================

app.listen(5000, () => {

  console.log("");
  console.log("=================================");
  console.log("MAN YAK SERVER");
  console.log("=================================");
  console.log(
    "Server running on http://localhost:5000"
  );
  console.log("=================================");
  console.log("");

});