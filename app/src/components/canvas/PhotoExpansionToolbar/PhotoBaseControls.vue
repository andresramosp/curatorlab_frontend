<template>
  <div class="photo-base-controls">
    <div class="header">
      <SelectMini
        v-model="toolbarState.expansion.type"
        :items="[
          { label: 'General', value: { criteria: 'embedding' } },
          {
            label: 'Context',
            value: { criteria: 'semantic', fields: ['context'] },
          },
          {
            label: 'Story',
            value: { criteria: 'semantic', fields: ['story'] },
          },
          { label: 'Tags', value: { criteria: 'tags' } },
          { label: 'Composition', value: { criteria: 'composition' } },
        ]"
      />
    </div>
    <div class="original-photo">
      <v-img :src="photo.src" class="original" width="220" cover />
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
      <div v-if="isLoading" class="loading-wrapper">
        <v-progress-circular indeterminate size="45" color="primary" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useCanvasStore } from "@/stores/canvas";
import { useTagDisplay } from "@/composables/canvas/useTagsDisplay";
import SelectMini from "@/components/wrappers/SelectMini.vue";
import TagChip from "@/components/wrappers/TagChip.vue";
import { debounce } from "lodash";

const props = defineProps({
  photo: Object,
  toolbarState: Object,
});

const emit = defineEmits(["photos-generated"]);

const canvasStore = useCanvasStore();

const { filteredTags, selectedColor, hoverColor, defaultColor, pillHeight } =
  useTagDisplay(() => props.photo.tags);

const tagsOverlay = ref(null);
const isLoading = ref(false);
const pageSize = 100;

function onTagsWheel(e) {
  tagsOverlay.value.scrollTop += e.deltaY;
}

function resetAndEmit(photos) {
  emit("photos-generated", photos.slice(0, pageSize));
}

const loadPhotosFromToolbar = async () => {
  if (!props.photo) return;
  isLoading.value = true;

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
  isLoading.value = false;
  resetAndEmit(result);
};

const loadPhotosFromSelectedTags = debounce(async () => {
  const selectedTags = filteredTags.value
    .filter((t) => t.tag.selected)
    .map((t) => t.tag);

  if (!props.photo || selectedTags.length === 0) {
    emit("photos-generated", []);
    return;
  }

  isLoading.value = true;
  const basePosition = { x: 0, y: 0 };

  const dynamicType = {
    ...props.toolbarState.expansion.type,
    selectedTags,
  };

  const result = await canvasStore.addPhotosFromPhoto(
    [props.photo],
    dynamicType,
    100,
    basePosition,
    props.toolbarState.expansion.opposite,
    props.toolbarState.expansion.inverted
  );

  await nextTick();
  isLoading.value = false;
  resetAndEmit(result);
}, 2000);

// Watchers
watch(
  filteredTags,
  () => {
    if (
      props.toolbarState.expansion.type.criteria === "tags" &&
      !props.toolbarState.expansion.onCanvas
    ) {
      loadPhotosFromSelectedTags();
    }
  },
  { deep: true }
);

watch(
  () => [props.photo, props.toolbarState.expansion.type],
  async ([photo, type]) => {
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
      emit("photos-generated", []); // Vaciamos la lista al cambiar a tags
    }
  }
);
</script>

<style scoped>
.photo-base-controls {
  display: flex;
  flex-direction: column;
  width: 210px;
  margin-bottom: 20px;
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

.tags-overlay::-webkit-scrollbar {
  width: 6px;
}
.tags-overlay::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 100, 0.5);
  border-radius: 3px;
}

.loading-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
