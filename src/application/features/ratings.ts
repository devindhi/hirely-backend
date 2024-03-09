// @ts-nocheck
import OpenAI from "openai";
import JobApplication from "../../persistance/entities/JobApplication";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateRating(jobApplicationId) {

    const jobApplication = await JobApplication.findById(jobApplicationId).populate("job");
    const content = `Role: ${jobApplication.job.title}, User Drescription: ${jobApplication.answers.join(" ")}`

    const completion  = await openai.chat.completions.create({
        messages: [{ role: "user", content }],
        model: "ft:gpt-3.5-turbo-0125:stemlink:hirely:90U7Zr3x",
    });

    const response = JSON.parse(completion.choices[0].message.content);
    console.log(response);
    if (!response.rate) {
        return;
    }
    await JobApplication.findOneAndUpdate({ _id: jobApplicationId }, { rating: response.rate })

}