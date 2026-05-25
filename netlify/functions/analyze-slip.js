exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { image, mediaType } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: image }
            },
            {
              type: 'text',
              text: 'วิเคราะห์สลิปโอนเงินนี้ ตอบกลับเป็น JSON เท่านั้น ไม่มี markdown ไม่มี backtick รูปแบบ: {"amount":<ตัวเลข>,"date":"<วันที่เวลา>","type":"<ประเภท เช่น พร้อมเพย์>","bank":"<ธนาคาร/ผู้รับ>","sender":"<ผู้โอน>","ref":"<เลขอ้างอิง>","note":"<สังเกตอื่น>"}'
            }
          ]
        }]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};