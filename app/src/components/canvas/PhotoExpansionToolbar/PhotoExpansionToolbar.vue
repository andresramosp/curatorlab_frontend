<template>
  <v-sheet
    v-show="toolbarOpen"
    class="expansion-toolbar"
    elevation="6"
    color="surface"
  >
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
      <v-btn icon size="small" class="close-btn" @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div
      class="photos-container"
      ref="scrollContainer"
      @scroll="handleScroll"
      @wheel="onWheel"
    >
      <div class="original-photo">
        <v-img :src="photo.src" class="original" width="210" cover />
        <!-- Overlay de tags sólo cuando el criterio sea 'tags' -->
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
            :text-color="'white'"
            :pill-height="pillHeight"
          />
        </div>
        <div v-if="isLoading" class="loading-wrapper">
          <v-progress-circular indeterminate size="45" color="primary" />
        </div>
      </div>
      <div class="related-photos">
        <div
          v-if="!isLoading"
          class="photo-wrapper"
          v-for="photo in visiblePhotos"
          :key="photo.id"
        >
          <v-img
            draggable="true"
            @dragstart="(e) => onDragStart(e, photo)"
            :src="photo.thumbnailUrl"
            :class="{ selected: selectedIds.includes(photo.id) }"
            class="photo"
            width="210"
            @click="toggleSelection(photo.id)"
          />
          <div class="score">{{ Math.round((photo.score ?? 0) * 100) }}%</div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, watch, nextTick, computed } from "vue";
import { useCanvasStore } from "@/stores/canvas";
import { useTagDisplay } from "@/composables/canvas/useTagsDisplay";
import { debounce } from "lodash";
import SelectMini from "@/components/wrappers/SelectMini.vue";
import TagChip from "@/components/wrappers/TagChip.vue";

const props = defineProps({
  photo: Object,
  toolbarState: Object,
  toolbarOpen: Boolean,
});
const emit = defineEmits(["update:toolbarOpen", "add-photos-expanded"]);

const {
  filteredTags,
  selectedColor,
  hoverColor,
  defaultColor,
  textColor,
  pillHeight,
} = useTagDisplay(() => props.photo.tags);

const canvasStore = useCanvasStore();
const generatedPhotos = ref([]);
const visiblePhotos = ref([]);
const selectedIds = ref([]);
const isLoading = ref(false);
const pageSize = 100;
const chunkSize = 6;

const scrollContainer = ref(null);
const tagsOverlay = ref(null);

function removePhotoFromList(photoId) {
  generatedPhotos.value = generatedPhotos.value.filter((p) => p.id !== photoId);
  visiblePhotos.value = visiblePhotos.value.filter((p) => p.id !== photoId);
  selectedIds.value = selectedIds.value.filter((id) => id !== photoId);
}

defineExpose({ removePhotoFromList });

function onDragStart(ev, photo) {
  const photosToDrag =
    selectedIds.value.length > 0
      ? generatedPhotos.value.filter((p) => selectedIds.value.includes(p.id))
      : [photo];

  const data = JSON.stringify(photosToDrag);
  ev.dataTransfer?.setData("application/json", data);
}

function resetVisiblePhotos() {
  visiblePhotos.value = generatedPhotos.value.slice(0, pageSize);
}

function handleScroll() {
  const el = scrollContainer.value;
  if (!el) return;

  const threshold = 20;
  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - threshold) {
    const currentLength = visiblePhotos.value.length;
    const nextChunk = generatedPhotos.value.slice(
      currentLength,
      currentLength + chunkSize
    );
    if (nextChunk.length > 0) {
      visiblePhotos.value.push(...nextChunk);
    }
  }
}

function toggleSelection(photoId) {
  if (selectedIds.value.includes(photoId)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== photoId);
  } else {
    selectedIds.value.push(photoId);
  }
}

function close() {
  selectedIds.value = [];
  generatedPhotos.value = [];
  visiblePhotos.value = [];
  emit("update:toolbarOpen", false);
}

function onWheel(e) {
  // Si es más vertical que horizontal, convertimos a scroll horizontal
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault();
    scrollContainer.value.scrollLeft += e.deltaY;
  }
  // Si es horizontal (deltaX), lo dejamos pasar sin tocar nada
}

function onTagsWheel(e) {
  // mueve el scroll interno
  tagsOverlay.value.scrollTop += e.deltaY;
}

const loadPhotosFromToolbar = async () => {
  if (!props.toolbarOpen || !props.photo) return;

  isLoading.value = true;
  const basePosition = { x: 0, y: 0 };

  generatedPhotos.value = await canvasStore.addPhotosFromPhoto(
    [props.photo],
    props.toolbarState.expansion.type,
    100,
    basePosition,
    props.toolbarState.expansion.opposite,
    props.toolbarState.expansion.inverted
  );

  resetVisiblePhotos();
  await nextTick();
  scrollContainer.value.scrollLeft = 0;
  isLoading.value = false;
};

const loadPhotosFromSelectedTags = debounce(async () => {
  const selectedTags = filteredTags.value
    .filter((t) => t.tag.selected)
    .map((t) => t.tag);

  if (!props.photo || selectedTags.length === 0) {
    generatedPhotos.value = [];
    visiblePhotos.value = [];
    return;
  }

  isLoading.value = true;
  const basePosition = { x: 0, y: 0 };

  const dynamicType = {
    ...props.toolbarState.expansion.type,
    selectedTags,
  };

  generatedPhotos.value = await canvasStore.addPhotosFromPhoto(
    [props.photo],
    dynamicType,
    100,
    basePosition,
    props.toolbarState.expansion.opposite,
    props.toolbarState.expansion.inverted
  );

  resetVisiblePhotos();
  await nextTick();
  scrollContainer.value.scrollLeft = 0;
  isLoading.value = false;
}, 2000);

// nuevo watch: escucha los cambios en los tags seleccionados
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

// modificamos el watch original para que no actúe en modo tags/composition fuera del canvas
watch(
  () => [props.toolbarOpen, props.photo, props.toolbarState.expansion.type],
  async ([open, photo, type]) => {
    const isInteractive = ["tags", "composition"].includes(type?.criteria);
    const skip = isInteractive && !props.toolbarState.expansion.onCanvas;

    if (!open || !photo || skip) return;
    await loadPhotosFromToolbar();
  },
  { immediate: true }
);
</script>

<style scoped>
.expansion-toolbar {
  background-color: #1e1e1e;
  border-top: 1px solid #333;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 5px;
  padding-top: 5px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 14px;
}

.title-group {
  display: flex;
  flex-direction: column;
}

.title {
  font-weight: bold;
}

.expansion-type {
  color: #aaa;
  font-size: 12px;
  margin-top: 2px;
}

.photos-container {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 4px 0;
  scrollbar-width: none;
  overflow: hidden;
}

.photos-container::-webkit-scrollbar {
  height: 8px;
}
.photos-container::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 100, 0.5);
  border-radius: 4px;
}

.photo-wrapper {
  position: relative;
  flex: 0 0 auto;
}

.photo {
  cursor: pointer;
  transition: transform 0.2s;
}
.photo:hover {
  transform: scale(1.05);
}
.selected {
  outline: 3px solid rgb(var(--v-theme-accent));
}

.score {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 11px;
  padding: 2px 5px;
  border-radius: 3px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.close-btn {
  margin-left: auto;
  color: white;
  font-size: 10px;
  width: 25px;
  height: 25px;
}

.original-photo .label {
  margin-top: 4px;
  color: #aaa;
  font-size: 11px;
}

.related-photos {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 12px;
  flex: 1;
  padding: 5px;
  /* scrollbar-width: none; */
}

.original-photo {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  left: 0;
  background: #1e1e1e;
  z-index: 1;
  width: 210px;
  height: auto;
  margin-bottom: 18px;
}

.original-photo .original {
  border: 2px solid rgb(var(--v-theme-secondary));
}

.loading-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
/* Scrollbar */
.tags-overlay::-webkit-scrollbar {
  width: 6px;
}
.tags-overlay::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 100, 0.5);
  border-radius: 3px;
}
</style>
