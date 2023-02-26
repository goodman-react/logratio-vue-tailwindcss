<script setup lang="ts">
import TopicForm from "@/components/TopicForm.vue";
import { IOpenQuestion } from "@/types/questions";
import { defineExpose, defineProps, reactive, computed, ref } from "vue";

interface topicInterface {
  topic: string;
  keywords: { desc: string }[];
}
let blankData = {
  desc: "",
  canBeNull: false,
  topics: [] as topicInterface[],
};
const isCollapsed = ref(false);
const newTopicName = ref("");
const topicRefs = ref<InstanceType<typeof TopicForm>[]>([]);

const props = defineProps<{ predefined?: Partial<typeof blankData> }>();

if (props.predefined) {
  blankData = { ...blankData, ...props.predefined };
}

const data = reactive(blankData);

function introduceTopic() {
  if (!newTopicName.value) return;
  data.topics.push({ topic: newTopicName.value, keywords: [] });
  newTopicName.value = "";
}

function onRejectTopic(topicId: number) {
  data.topics.splice(topicId, 1);
}
const topics = computed(() => data.topics);
function onUpdateTopic(topic: topicInterface, topicId: number) {
  data.topics[topicId] = topic;
}

function getJSONData(): IOpenQuestion {
  return {
    desc: data.desc,
    canBeNull: data.canBeNull,
    topics: Object.fromEntries(
      topicRefs.value.map((topic) => {
        return [topic.topic, topic.keywords.map((keyword) => keyword.desc)];
      })
    ),
    type: "OPEN",
  };
}

defineExpose({ getJSONData });
</script>

<template>
  <div>
    <h3 class="text-xl mb-2 font-bold">
      Open question{{ data.desc ? ": " + data.desc : "" }}
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
        </div>
      </div>
      <div>
        <h4 class="text-lg font-bold text-blue-800">Topics:</h4>
        <div class="pl-4">
          <div v-for="(topic, id) in topics" :key="`${topic.topic}${id}`">
            <TopicForm
              ref="topicRefs"
              :topic="topic"
              :topicNum="id"
              @reject-topic="onRejectTopic(id)"
              @update-topic="(topic: topicInterface) => onUpdateTopic(topic, id)"
            />
          </div>
          <div v-if="!predefined">
            <input
              type="text"
              class="topic-field mr-2"
              v-model="newTopicName"
              placeholder="New topic"
              @keyup.enter="introduceTopic"
            />
            <button
              @click="introduceTopic"
              class="btn bg-blue-600 border-0 text-white hover:bg-blue-400"
            >
              <i class="fas fa-plus"></i> Add topic
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
