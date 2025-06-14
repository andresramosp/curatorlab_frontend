<template>
  <div class="photo-base-controls">
    <div class="header">
      <SelectMini
        v-model="toolbarState.expansion.type"
        :items="[
          { label: 'General', value: { criteria: 'embedding' } },

          {
            label: 'Narrative',
            value: { criteria: 'semantic', fields: ['story'] },
          },
          {
            label: 'Cultural Context',
            value: { criteria: 'semantic', fields: ['context'] },
          },

          { label: 'Composition', value: { criteria: 'composition' } },
          { label: 'Tags', value: { criteria: 'tags' } },
        ]"
      />
    </div>

    <div class="original-photo">
      <v-img :src="photo.src" class="original" width="210" cover />

      <!-- Overlay de tags -->
      <div
        v-if="toolbarState.expansion.type.criteria === 'tags'"
        class="tags-overlay"
        ref="tagsOverlay"
        @wheel.prevent="onTagsWheel"
      >
        <TagChip
          v-for="tagPhoto in filteredTags"
          :key="tagPhoto.tag.id"
          :tag="tagPhoto.tag"
          v-model="tagPhoto.tag.selected"
          :selected-color="selectedColor"
          :hover-color="hoverColor"
          :default-color="defaultColor"
          text-color="white"
          :pill-height="pillHeight"
        />
      </div>

      <!-- Overlay de composición -->
      <div
        v-if="toolbarState.expansion.type.criteria === 'composition'"
        class="composition-overlay"
      >
        <div
          v-for="area in sortedDetectionAreas"
          :key="area.id"
          class="composition-box"
          :style="getBoxStyle(area)"
          @click.stop="() => toggleSelected(area)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, toRef } from "vue";
import { useCanvasStore } from "@/stores/canvas";
import { useTagDisplay } from "@/composables/canvas/useTagsDisplay";
import SelectMini from "@/components/wrappers/SelectMini.vue";
import TagChip from "@/components/wrappers/TagChip.vue";
import { debounce } from "lodash";
import { useDetectionAreas } from "@/composables/canvas/useDetectionsAreaDisplay";

const props = defineProps({
  photo: Object,
  toolbarState: Object,
});

const emit = defineEmits(["photos-generated", "loading"]);

const canvasStore = useCanvasStore();

const { filteredTags, selectedColor, hoverColor, defaultColor, pillHeight } =
  useTagDisplay(() => props.photo.tags);

const { sortedDetectionAreas, toggleSelected, resetSelectedAreas, scale } =
  useDetectionAreas(toRef(props, "photo"));

const tagsOverlay = ref(null);
const pageSize = 100;

function onTagsWheel(e) {
  tagsOverlay.value.scrollTop += e.deltaY;
}

function resetAndEmit(photos) {
  emit("photos-generated", photos.slice(0, pageSize));
}

const loadPhotosFromToolbar = async () => {
  if (!props.photo) return;
  emit("loading", true);
  const basePosition = { x: 0, y: 0 };

  const result = await canvasStore.addPhotosFromPhoto(
    [props.photo],
    props.toolbarState.expansion.type,
    100,
    basePosition,
    props.toolbarState.expansion.opposite,
    props.toolbarState.expansion.inverted
  );

  await nextTick();
  emit("loading", false);
  resetAndEmit(result);
};

const loadPhotosFromSelections = debounce(async () => {
  if (!props.photo) return;

  const hasSelections =
    (props.toolbarState.expansion.type.criteria === "tags" &&
      filteredTags.value.some((t) => t.tag.selected)) ||
    (props.toolbarState.expansion.type.criteria === "composition" &&
      sortedDetectionAreas.value.some((d) => d.selected));

  if (!hasSelections) {
    emit("photos-generated", []);
    return;
  }

  emit("loading", true);
  const basePosition = { x: 0, y: 0 };

  const result = await canvasStore.addPhotosFromPhoto(
    [props.photo],
    props.toolbarState.expansion.type,
    100,
    basePosition,
    props.toolbarState.expansion.opposite,
    props.toolbarState.expansion.inverted
  );

  await nextTick();
  emit("loading", false);
  resetAndEmit(result);
}, 2000);

const getBoxStyle = (detection) => {
  const s = scale.value;
  const x = detection.x1 * s;
  const y = detection.y1 * s;
  const width = (detection.x2 - detection.x1) * s;
  const height = (detection.y2 - detection.y1) * s;

  return {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
    border: "1.5px solid white",
    backgroundColor: detection.selected
      ? "rgba(var(--v-theme-secondary), 0.4)"
      : "transparent",
    pointerEvents: "auto",
    zIndex: 3,
  };
};

// Watchers
watch(
  [filteredTags, sortedDetectionAreas],
  () => {
    const { criteria } = props.toolbarState.expansion.type;
    if (
      (criteria === "tags" || criteria === "composition") &&
      !props.toolbarState.expansion.onCanvas
    ) {
      loadPhotosFromSelections();
    }
  },
  { deep: true }
);

watch(
  () => [props.photo, props.toolbarState.expansion.type],
  async ([photo, type]) => {
    resetAllTags();
    resetSelectedAreas();
    const isInteractive = ["tags", "composition"].includes(type?.criteria);
    const skip = isInteractive && !props.toolbarState.expansion.onCanvas;
    if (!photo || skip) return;
    await loadPhotosFromToolbar();
  },
  { immediate: true }
);

watch(
  () => props.toolbarState.expansion.type.criteria,
  (newCriteria) => {
    if (newCriteria === "tags" || newCriteria === "composition") {
      emit("photos-generated", []);
    }
  }
);

function resetAllTags() {
  filteredTags.value.forEach((tagPhoto) => {
    tagPhoto.tag.selected = false;
  });
}

onMounted(() => {
  resetAllTags();
  resetSelectedAreas();
});
</script>

<style scoped>
.photo-base-controls {
  display: flex;
  flex-direction: column;
  width: 210px;
  margin-bottom: 20px;
  margin-top: 6px;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: white;
  font-size: 14px;
  margin-bottom: 5px;
}

.original-photo {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #1e1e1e;
  z-index: 1;
}

.original-photo .original {
  border: 2px solid rgb(var(--v-theme-secondary));
}

.tags-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 4px;
  z-index: 2;
  justify-content: center;
}

.composition-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.composition-box {
  cursor: pointer;
}

.composition-box:hover {
  background-color: rgba(var(--v-theme-primary), 0.3);
}
</style>
