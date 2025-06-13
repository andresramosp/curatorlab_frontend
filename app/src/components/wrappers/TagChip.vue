<template>
  <v-chip
    variant="flat"
    density="compact"
    size="small"
    :input-value="modelValue"
    @click.stop="isSelected = !isSelected"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    :color="modelValue ? selectedColor : hovered ? hoverColor : defaultColor"
    :style="{
      opacity: 0.7,
      'border-radius': pillHeight / 2 + 'px',
      color: textColor,
    }"
  >
    {{ tag.name }}
  </v-chip>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  tag: Object,
  modelValue: Boolean,
  selectedColor: String,
  hoverColor: String,
  defaultColor: String,
  textColor: String,
  pillHeight: Number,
});

const emit = defineEmits(["update:modelValue"]);

const hovered = ref(false);

const isSelected = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
