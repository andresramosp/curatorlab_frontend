<template>
  <v-menu v-model="menu" :close-on-content-click="true" offset-y>
    <template #activator="{ props }">
      <div v-bind="props" class="select-trigger">
        {{ selectedLabel }}
        <v-icon size="14" class="ml-1">mdi-menu-down</v-icon>
      </div>
    </template>

    <v-list density="compact">
      <v-list-item
        v-for="item in items"
        :key="item.label"
        @click="selectItem(item)"
      >
        <v-list-item-title>{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: [String, Number, Object],
  items: {
    type: Array,
    required: true, // [{ label, value }]
  },
});
const emit = defineEmits(["update:modelValue"]);

const menu = ref(false);

const selectedLabel = computed(() => {
  const found = props.items.find(
    (i) => JSON.stringify(i.value) === JSON.stringify(props.modelValue)
  );
  return found?.label ?? "—";
});

function selectItem(item) {
  emit("update:modelValue", item.value);
  menu.value = false;
}
</script>

<style scoped>
.select-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
