export default async function handler(req, res) {
    // POST 요청만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { text } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
        }

        // 💡 수정된 부분: 올바른 최신 모델 이름(gemini-1.5-flash)으로 변경했습니다.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // AI에게 역할과 지시사항 부여 (System Instruction)
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
            contents: [{ parts: [{ text: text }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        // 💡 추가된 부분: API 응답이 실패하거나 결과값이 없을 경우 안전하게 에러를 반환합니다.
        if (!response.ok || !data.candidates || data.candidates.length === 0) {
            console.error('Gemini API 응답 에러:', data);
            return res.status(500).json({ error: 'AI 분석 중 문제가 발생했습니다.' });
        }

        // AI 응답 텍스트 추출 및 JSON 파싱
        const aiText = data.candidates[0].content.parts[0].text;
        const resultJson = JSON.parse(aiText);

        return res.status(200).json(resultJson);

    } catch (error) {
        console.error('API 호출 에러:', error);
        return res.status(500).json({ error: '식단 분석 중 오류가 발생했습니다.' });
    }
}
