<script setup lang="ts">
import { defineProps, defineExpose, defineEmits, ref } from "vue";

interface topicInterface {
  topic: string;
  keywords: { desc: string }[];
}
const props = defineProps<{
  topic: topicInterface;
  topicNum: number;
}>();

const keywords = ref(props.topic.keywords as { desc: string }[]);
const newKeyword = ref("");

function addKeyword() {
  if (!newKeyword.value) return;
  keywords.value.push({ desc: newKeyword.value });
  let param = { topic: props.topic.topic, keywords: keywords.value };
  emit("updateTopic", param);
  newKeyword.value = "";
}

const emit = defineEmits<{
  (event: "rejectTopic"): void;
  (event: "updateTopic", param: topicInterface): void;
}>();

defineExpose({ topic: props.topic.topic, keywords: props.topic.keywords });
</script>

<template>
  <div class="py-2">
    <div class="flex justify-between">
      <h4 class="font-bold">{{ props.topic.topic }}</h4>
      <button @click="emit('rejectTopic')" class="text-red-600 text-sm">
        <i class="fas fa-trash"></i> Remove
      </button>
    </div>
    <div
      class="flex flex-wrap mt-1 relative bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline border border-gray-300"
    >
      <div
        v-for="(keyword, index) in props.topic.keywords"
        v-bind:key="index"
        class="flex-grow-0 text-gray-700 text-center my-1 ml-1"
      >
        <span
          class="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-blue-800 hover:bg-blue-400 text-white hover:text-black"
        >
          {{ keyword.desc }}
          <button
            type="button"
            class="flex-shrink-0 -mr-0.5 ml-1.5 inline-flex hover:bg-indigo-400 p-1 rounded-full"
            @click="keywords.splice(index, 1)"
          >
            <svg
              class="h-2 w-2"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 8 8"
            >
              <path
                stroke-linecap="round"
                stroke-width="1.5"
                d="M1 1l6 6m0-6L1 7"
              />
            </svg>
          </button>
        </span>
      </div>
      <div class="flex-grow text-gray-700 text-center">
        <input
          class="w-full h-full rounded-lg py-2 pl-2 pr-4 block appearance-none leading-normal transition duration-150 ease-in-out sm:text-sm sm:leading-5 outline-none border-none"
          v-model="newKeyword"
          v-on:keydown.tab.prevent="addKeyword"
          @keyup.enter="addKeyword"
          placeholder="Add New Keyword"
        />
      </div>
    </div>
  </div>
</template>
