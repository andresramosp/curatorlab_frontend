<template>
  <v-sheet
    v-show="toolbarOpen"
    class="expansion-toolbar"
    elevation="6"
    color="surface"
  >
    <div class="toolbar-content">
      <!-- IZQUIERDA: Foto original con miniselect -->
      <PhotoBaseControls
        :photo="photo"
        :toolbar-state="toolbarState"
        @photos-generated="handleGeneratedPhotos"
      />

      <!-- DERECHA: Botón cerrar + fotos relacionadas -->
      <div class="related-section">
        <div class="header">
          <v-btn icon size="small" class="close-btn" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div
          class="related-photos"
          ref="scrollContainer"
          @scroll="handleScroll"
          @wheel="onWheel"
        >
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
    </div>
  </v-sheet>
</template>

<script setup>
import { nextTick, ref } from "vue";
import PhotoBaseControls from "./PhotoBaseControls.vue";
import { useCanvasStore } from "@/stores/canvas";

const props = defineProps({
  photo: Object,
  toolbarState: Object,
  toolbarOpen: Boolean,
});
const emit = defineEmits(["update:toolbarOpen"]);

const generatedPhotos = ref([]);
const visiblePhotos = ref([]);
const selectedIds = ref([]);
const isLoading = ref(false);
const chunkSize = 6;
const pageSize = 100;
const scrollContainer = ref(null);

function handleGeneratedPhotos(photos) {
  generatedPhotos.value = photos;
  visiblePhotos.value = photos.slice(0, pageSize);
  selectedIds.value = [];
  nextTick(() => {
    scrollContainer.value?.scrollTo({ left: 0 });
  });
}

function removePhotoFromList(photoId) {
  generatedPhotos.value = generatedPhotos.value.filter((p) => p.id !== photoId);
  visiblePhotos.value = visiblePhotos.value.filter((p) => p.id !== photoId);
}

defineExpose({ removePhotoFromList });

function close() {
  selectedIds.value = [];
  generatedPhotos.value = [];
  visiblePhotos.value = [];
  emit("update:toolbarOpen", false);
}

function onWheel(e) {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault();
    scrollContainer.value.scrollLeft += e.deltaY;
  }
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

function onDragStart(ev, photo) {
  const photosToDrag =
    selectedIds.value.length > 0
      ? generatedPhotos.value.filter((p) => selectedIds.value.includes(p.id))
      : [photo];

  const data = JSON.stringify(photosToDrag);
  ev.dataTransfer?.setData("application/json", data);
}
</script>

<style scoped>
.expansion-toolbar {
  background-color: #1e1e1e;
  border-top: 1px solid #333;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 5px 15px;
}

.toolbar-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.related-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-width: 0; /* CLAVE para que scroll-x funcione bien */
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 30px;
  min-height: 30px;
  padding-right: 5px;
  z-index: 2;
  flex-shrink: 0;
}

.close-btn {
  color: white;
  font-size: 10px;
  width: 25px;
  height: 25px;
}

.related-photos {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;
  gap: 12px;
  padding: 5px;
  height: 100%; /* asegúrate de que hereda correctamente */
  scroll-behavior: smooth;
}

.photo-wrapper {
  flex: 0 0 auto;
  position: relative;
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
</style>
