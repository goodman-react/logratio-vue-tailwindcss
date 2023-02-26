<script setup lang="ts">
import { inject, ref } from "vue";
import QuestionForm from "@/components/QuestionForm.vue";
import { APIResp } from "./types/api-response";
import { Axios } from "axios";

const questions = ref(["CLOSED", "CLOSED", "CLOSED", "CLOSED", "CLOSED"] as (
  | "CLOSED"
  | "OPEN"
)[]);
const questionEls = ref<InstanceType<typeof QuestionForm>[]>([]);
const responsesAmt = ref(100);

const messageLog = ref([] as string[]);

const ax = inject("ax") as Axios;

function convertAnswers(answers: string[]): { desc: string }[] {
  return answers.map((answer) => {
    return { desc: answer };
  });
}

const predefinedQuestions = [
  {
    desc: "Age",
    answers: convertAnswers([
      "Up to 19",
      "20 to 29",
      "30 to 44",
      "60 to 74",
      "75 and over",
    ]),
  },
  {
    desc: "Gender",
    answers: convertAnswers(["Male", "Female"]),
  },
  {
    desc: "Income HH",
    answers: convertAnswers([
      "Less than $10,000",
      "$10,000 to $24,999",
      "$25,000 to $49,999",
      "$50,000 to $99,999",
      "$100,000 to $200,000",
      "$200,000 or more",
    ]),
  },
  {
    desc: "Language",
    isMulti: true,
    answers: convertAnswers([
      "English",
      "Spanish",
      "Other Indo-European languages",
      "Asian and Pacific Islander languages",
      "Other language",
    ]),
  },
  {
    desc: "Education",
    answers: convertAnswers([
      "Less than 9th grade",
      "9th to 12th grade, no diploma",
      "High school graduate",
      "Some college, no degree",
      "Associate's degree",
      "Bachelor's degree",
      "Graduate or professional degree",
    ]),
  },
];

async function produceDataset() {
  const reqData = {
    cmd: "GENERATE_DATASET",
    responsesAmt: responsesAmt.value,
    questions: questionEls.value.map((el) => el.getJSONData()),
  };

  ax.post<APIResp>(`${window.location}`, reqData).then(
    async (resp) => {
      const {
        data: { status, data },
      } = resp;

      if (status === "ERROR") {
        messageLog.value.push(data);
      } else if (status == "SUCCESS") {
        const href = await fetch(`data:application/octet-stream;base64,${data}`)
          .then((res) => res.blob())
          .then((res) => URL.createObjectURL(res));

        const link = document.createElement("a");
        link.download = "generated_dataset.xlsx";
        link.href = href;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    },
    (err) => {
      console.error("Error during POST request", err);
    }
  );
}
</script>

<template>
  <div>
    <!-- undefined if not predefined -->
    <QuestionForm
      v-for="(kind, index) in questions"
      :key="index"
      :kind="kind"
      :question-num="index + 1"
      :predefined="predefinedQuestions[index]"
      ref="questionEls"
      @reject="questions.splice(index, 1)"
    />
    <div class="flex p-4 gap-4 justify-around bg-gray-400">
      <div>
        <h3 class="text-xl mb-2 font-bold">Actions:</h3>
        <div class="flex flex-col w-[250px]">
          <div class="py-1">
            <button
              @click="questions.push('CLOSED')"
              class="btn bg-blue-600 border-0 text-white hover:bg-blue-400 w-full"
            >
              <i class="fas fa-plus"></i> Add closed question
            </button>
          </div>
          <div class="py-1">
            <button
              @click="questions.push('OPEN')"
              class="btn bg-blue-600 border-0 text-white hover:bg-blue-400 w-full"
            >
              <i class="fas fa-plus"></i> Add open question
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-xl mb-2 font-bold">Generation:</h3>
        <div class="flex flex-col w-[250px]">
          <div class="py-1">
            <label> Response size: </label>
            <input type="number" v-model="responsesAmt" class="w-[100px]" />
          </div>
          <div class="py-1">
            <button
              @click="produceDataset()"
              class="btn bg-blue-600 border-0 text-white hover:bg-blue-400 w-full"
            >
              Generate dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
