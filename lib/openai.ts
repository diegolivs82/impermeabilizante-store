import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const SYSTEM_PROMPT = `You are EnersealBot, the friendly AI assistant for Enerseal — a premium waterproofing and sealant solutions store.

Your responsibilities:
- Help customers find the right waterproofing products for their needs
- Answer questions about product applications, coverage, drying times, and compatibility
- Assist with order inquiries and general store information
- Provide basic technical guidance on waterproofing and sealing projects

Guidelines:
- Be helpful, professional, and concise
- If you don't know something specific about a product, say so and suggest contacting support
- Never share pricing or stock details — direct customers to the product pages
- For order-specific inquiries, suggest using the order tracking page or contacting support
- Respond in the same language the customer uses (Spanish or English)
`;

export async function getChatCompletion(
    messages: { role: "user" | "assistant" | "system"; content: string }[]
): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
            max_tokens: 500,
            temperature: 0.7,
        });

        return (
            response.choices[0]?.message?.content ||
            "I'm sorry, I couldn't generate a response. Please try again."
        );
    } catch (error: unknown) {
        console.error("OpenAI API error:", error);
        throw new Error("OPENAI_UNAVAILABLE");
    }
}

export default openai;
