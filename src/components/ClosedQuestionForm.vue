<script setup lang="ts">
import { IClosedQuestion } from "@/types/questions";
import { defineEmits, defineExpose, defineProps, reactive, ref } from "vue";

let blankData = {
  desc: "",
  canBeNull: false,
  isMulti: false,
  answers: [] as { desc: string }[],
};

const isCollapsed = ref(false);
const props = defineProps<{ predefined?: Partial<typeof blankData> }>();

if (props.predefined) {
  blankData = { ...blankData, ...props.predefined };
}

const data = reactive(blankData);

function getJSONData(): IClosedQuestion {
  const { desc, canBeNull } = data;

  return {
    canBeNull,
    desc,
    answers: data.answers.map((ans) => ans.desc),
    type: data.isMulti ? "MULTI" : "CLOSED",
  };
}
defineExpose({ getJSONData });
defineEmits<{
  (event: "removeQuestion"): void;
}>();
</script>

<template>
  <div>
    <h3 class="text-xl mb-2 font-bold">
      Closed question
      {{ data.desc ? ": " + data.desc : "" }}
    </h3>

    <div v-if="!isCollapsed">
      <div>
        <div class="pl-4">
          <div>
            <input type="text" class="question-field" v-model="data.desc" />
          </div>
          <div>
            <input
              type="checkbox"
              class="question-checkbox"
              v-model="data.canBeNull"
            />
            <label> Can have empty responses? </label>
          </div>
          <div>
            <input
              type="checkbox"
              class="question-checkbox"
              v-model="data.isMulti"
            />
            <label> Is a multi-choice question? </label>
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-lg font-bold text-blue-800">Answers:</h4>
        <div class="pl-4">
          <div v-for="(answer, index) in data.answers" :key="index">
            <div class="py-1">
              <lable class="pr-3">Answer {{ index + 1 }}:</lable>
              <input
                type="text"
                class="answer-field"
                v-model="answer.desc"
                :disabled="!!predefined"
              />
              <button
                @click="data.answers.splice(index, 1)"
                class="text-red-600 text-sm pl-2"
              >
                <i class="fas fa-trash"></i>
                Remove
              </button>
            </div>
          </div>
          <button
            @click="data.answers.push({ desc: '' })"
            class="btn bg-blue-600 border-0 text-white hover:bg-blue-400"
          >
            <i class="fas fa-plus"></i> Add answer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
