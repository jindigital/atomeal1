export default async function handler(req, res) {
    // POST 요청만 허용합니다.
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { text } = req.body;
        // Vercel에 설정해둔 환경 변수에서 API 키를 몰래 가져옵니다.
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
        }

        // Gemini 1.5 Flash 모델 호출 주소
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // AI에게 역할과 답변 형식을 지시합니다.
        const systemPrompt = `
        당신은 아토피 피부염 환자를 위한 다정하고 전문적인 식단 분석가입니다. 
        사용자가 입력한 식단 텍스트를 분석하여 다음 4가지 카테고리 중 포함된 것이 있는지 확인하세요: ["밀가루", "단 음식", "기름진 음식", "매운 음식"].
        
        결과는 반드시 JSON 형식으로만 반환해야 합니다.
        형식:
        {
            "detected": ["감지된카테고리1", "감지된카테고리2"], 
            "title": "메시지 제목 (예: ✨ 훌륭해요! 또는 ⚠️ 주의가 필요해요)",
            "message": "사용자에게 건네는 따뜻하고 희망적인 피드백 메시지 (3~4문장 이내)"
        }
        
        주의 성분이 없다면 detected는 빈 배열 []로 두고, 아주 건강한 식단이라며 폭풍 칭찬해주세요.
        주의 성분이 있다면 혼내지 말고, "오늘 떡볶이를 드셨군요! 매운 양념과 밀가루가 피부를 조금 간지럽게 할 수 있으니 시원한 물을 많이 드세요~" 처럼 음식 이름을 언급하며 다정하게 조언해주세요.
        `;

        const payload = {
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: text }] }],
            generationConfig: {
                responseMimeType: "application/json" // 결과를 무조건 JSON으로 받도록 강제합니다.
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        // AI가 대답한 텍스트를 JSON(객체)으로 변환합니다.
        const aiText = data.candidates[0].content.parts[0].text;
        const resultJson = JSON.parse(aiText);

        // 프론트엔드로 분석 결과를 보내줍니다.
        return res.status(200).json(resultJson);

    } catch (error) {
        console.error('API 호출 에러:', error);
        return res.status(500).json({ error: '식단 분석 중 오류가 발생했습니다.' });
    }
}
