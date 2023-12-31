export async function POST(request: Request) {
    const { workspace } = await request.json();

    console.log("processing...");

    let token = process.env.NEXT_PUBLIC_HUGGING_FACE;

    let prompt = `Suggest 3 ideas for the topic: '${workspace.agenda}.'`;
    let genText = ``;

    const requestAPI = async () => {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: prompt + genText,
                    parameters: {
                        return_full_text: false,
                        max_new_tokens: 250,
                    },
                }),
            }
        );

        if (response.ok) return await response.json();
        else return { done: true };
    };

    while (true) {
        const result: any = await requestAPI();

        if (result === undefined)
            return Response.json({ err: "Some error occurred" });
        if (result.done) break;
        if (result[0].generated_text === "") break;

        console.log(result);

        genText += result[0].generated_text;
    }

    console.log(genText);

    return Response.json({ msg: genText });
}
