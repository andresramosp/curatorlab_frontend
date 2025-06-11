<template>
  <v-sheet
    v-show="toolbarOpen"
    class="expansion-toolbar"
    elevation="6"
    color="surface"
  >
    <div class="header">
      <!-- <div class="title-group">
        <span class="title">Related photos</span>
      </div> -->
      <v-btn icon size="small" class="close-btn" @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <div class="photos-container" ref="scrollContainer" @scroll="handleScroll">
      <div class="original-photo">
        <v-img :src="photo.src" class="original" width="170" cover />
      </div>
      <div class="related-photos">
        <template v-if="isLoading">
          <div class="loading-wrapper">
            <v-progress-circular indeterminate size="28" color="primary" />
          </div>
        </template>
        <template v-else>
          <div
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
              width="170"
              @click="toggleSelection(photo.id)"
            />
            <div class="score">{{ Math.round((photo.score ?? 0) * 100) }}%</div>
          </div>
        </template>
      </div>
    </div>

    <div class="actions">
      <v-btn
        size="small"
        variant="outlined"
        color="primary"
        style="height: 20px; font-size: 11px"
        @click="confirmSelection"
      >
        Add to Canvas
      </v-btn>
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useCanvasStore } from "@/stores/canvas";

const props = defineProps({
  photo: Object,
  toolbarState: Object,
  toolbarOpen: Boolean,
});
const emit = defineEmits(["update:toolbarOpen", "add-photos-expanded"]);

const canvasStore = useCanvasStore();
const generatedPhotos = ref([]);
const visiblePhotos = ref([]);
const selectedIds = ref([]);
const isLoading = ref(false);
const pageSize = 100;
const chunkSize = 6;

const scrollContainer = ref(null);

const expansionLabel = computed(() => {
  const criteria = props.toolbarState?.expansion?.type.criteria;
  const map = {
    embedding: "General",
    semantic_context: "Context",
    semantic_story: "Story",
    tags: "Tags",
    composition: "Composition",
  };
  if (!criteria) return "Unknown";
  if (criteria === "semantic") {
    const fields = props.toolbarState?.expansion?.fields?.[0];
    return map[`semantic_${fields}`] || "Semantic";
  }
  return map[criteria] || "Unknown";
});

function onDragStart(ev, photo) {
  const data = JSON.stringify(photo);
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

function confirmSelection() {
  const selected = generatedPhotos.value.filter((p) =>
    selectedIds.value.includes(p.id)
  );
  emit("add-photos-expanded", selected);
  close();
}

watch(
  () => [props.toolbarOpen, props.photo, props.toolbarState.expansion.type],
  async ([open, photo]) => {
    if (!open || !photo) return;
    isLoading.value = true;
    const basePosition = { x: 0, y: 0 };
    generatedPhotos.value = await canvasStore.addPhotosFromPhoto(
      [photo],
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
  },
  { immediate: true }
);
</script>

<style scoped>
.expansion-toolbar {
  padding: 8px 20px;
  background-color: #1e1e1e;
  border-top: 1px solid #333;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  overflow-x: auto;
  gap: 12px;
  padding: 4px 0;
  scrollbar-width: none;
}

.photo-wrapper {
  position: relative;
  flex: 0 0 auto;
}

.photo {
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
}
.photo:hover {
  transform: scale(1.05);
}
.selected {
  outline: 3px solid #7c4dff;
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

.loading-spinner {
  align-self: center;
  margin-left: 12px;
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
}

.photos-container {
  display: flex;
  overflow-x: hidden;
  padding: 4px 0;
  gap: 12px;
}

.original-photo {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 12px;
  position: sticky;
  left: 0;
  background: #1e1e1e;
  z-index: 1;
}

.original-photo .original {
  border: 2px solid rgb(var(--v-theme-secondary));
}

.original-photo .label {
  margin-top: 4px;
  color: #aaa;
  font-size: 11px;
}

.related-photos {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  flex: 1;
  scrollbar-width: none;
}
</style>
