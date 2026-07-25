export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { text } = req.body;
        const apiKey = (process.env.GEMINI_API_KEY || '').trim();

        if (!apiKey) {
            return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
        }

        // 💡 수정된 부분: v1beta 버전과 가장 범용적인 gemini-pro 모델의 완벽한 조합
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        const prompt = `
        당신은 아토피 피부염 환자를 위한 다정하고 전문적인 식단 분석가입니다. 
        다음 사용자의 식단 텍스트를 분석하여 카테고리 ["밀가루", "단 음식", "기름진 음식", "매운 음식"] 중 포함된 것이 있는지 확인하세요.
        
        결과는 반드시 아래의 JSON 형식으로만 반환해야 하며, 다른 설명은 절대 쓰지 마세요.
        {
            "detected": ["감지된카테고리1", "감지된카테고리2"], 
            "title": "메시지 제목",
            "message": "사용자에게 건네는 따뜻하고 희망적인 피드백 메시지 (3~4문장 이내)"
        }
        
        주의 성분이 없다면 detected는 빈 배열 []로 두고, 소화가 편안한 천연 식재료 위주의 훌륭한 식단이라며 폭풍 칭찬해주세요.
        주의 성분이 있다면 혼내지 말고, 음식 이름을 언급하며 다정하게 조언해주세요.

        사용자 식단: ${text}
        `;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (!response.ok || !data.candidates || data.candidates.length === 0) {
            console.error('Gemini API 응답 에러 상세:', JSON.stringify(data));
            return res.status(500).json({ error: 'AI 서버 응답 오류' });
        }

        let aiText = data.candidates[0].content.parts[0].text;
        aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const resultJson = JSON.parse(aiText);
        return res.status(200).json(resultJson);

    } catch (error) {
        console.error('API 호출/파싱 에러:', error);
        return res.status(500).json({ error: '식단 분석 중 오류가 발생했습니다.' });
    }
}
