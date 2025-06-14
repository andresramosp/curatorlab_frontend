<template>
  <v-chip
    variant="flat"
    density="compact"
    size="small"
    :input-value="modelValue"
    @click.stop="isSelected = !isSelected"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    :style="{
      opacity: isSelected ? 0.9 : 0.9,
      'border-radius': pillHeight / 2 + 'px',
      'background-color': isSelected
        ? selectedColor
        : hovered
        ? hoverColor
        : defaultColor,
      color: 'white',
      'font-size': fontSize + 'px',
      width: pillWidth + 'px',
      'justify-content': 'center',
      // transform: hovered ? 'scale(1.1)' : 'scale(1)',
      // transition: 'transform 0.1s ease-in-out',
    }"
  >
    {{ shortened }}
  </v-chip>
</template>

<script setup>
import { computed, ref } from "vue";
import { shortenTag } from "@/utils/utils";

const props = defineProps({
  tag: { type: Object, required: true },
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

const fontSize = 12;
const textPadding = 2;

const shortened = computed(() => shortenTag(props.tag.name));
const pillWidth = computed(() => {
  const approxWidth = shortened.value.length * (fontSize * 0.5);
  return approxWidth + textPadding + 7;
});
</script>
