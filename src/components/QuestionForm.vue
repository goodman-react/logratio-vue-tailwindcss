<script setup lang="ts">
import { defineProps, defineEmits, defineExpose, ref } from "vue";
import ClosedQuestionForm from "@/components/ClosedQuestionForm.vue";
import OpenQuestionForm from "@/components/OpenQuestionForm.vue";

type QuestionType = InstanceType<
  typeof ClosedQuestionForm | typeof OpenQuestionForm
>;
const target = ref<QuestionType | undefined>(undefined);

defineProps<{
  kind: "CLOSED" | "OPEN";
  questionNum: number;
  predefined?: QuestionType["predefined"];
}>();

const emit = defineEmits<{
  (event: "reject"): void;
}>();

function getJSONData() {
  return (target.value as QuestionType).getJSONData();
}

defineExpose({ getJSONData });
</script>

<template>
  <div class="p-4" v-show="!predefined">
    <div class="border border-gray-400 rounded overflow-hidden shadow-lg">
      <div
        class="border-b border-gray-400 px-4 py-2 bg-blue-800 flex justify-between"
      >
        <h2 class="text-2xl text-white">
          Question #{{ questionNum }} ({{
            kind == "CLOSED" ? "Closed" : "Open"
          }})
        </h2>

        <button
          @click="emit('reject')"
          class="btn bg-red-600 border-0 text-white hover:bg-red-400"
        >
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
      <div class="p-4">
        <ClosedQuestionForm
          v-if="kind == 'CLOSED'"
          ref="target"
          :predefined="predefined"
        />
        <OpenQuestionForm
          v-if="kind == 'OPEN'"
          ref="target"
          :predefined="predefined"
        />
      </div>
    </div>
  </div>
</template>
