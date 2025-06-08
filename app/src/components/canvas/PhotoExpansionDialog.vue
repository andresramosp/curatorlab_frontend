<template>
  <v-dialog v-model="dialog" max-width="900" height="700">
    <v-card style="display: flex; flex-direction: column; height: 700px">
      <!-- Header fijo -->
      <div class="px-6 pt-4">
        <h2 class="text-h6 font-weight-bold mb-1">Suggested related photos</h2>
        <p class="text-subtitle-2 text-grey-darken-1 mb-2">
          Expansion type: {{ expansionLabel }}
        </p>
      </div>

      <!-- Contenedor con scroll -->
      <div
        ref="scrollContainer"
        style="overflow-y: auto; flex: 1"
        @scroll="handleScroll"
      >
        <v-container fluid>
          <div
            v-if="!isLoading"
            class="d-flex flex-wrap justify-start"
            style="gap: 15px"
          >
            <v-card
              v-for="generated in visiblePhotos"
              :key="generated.id"
              style="width: 200px"
            >
              <v-img
                :src="generated.thumbnailUrl"
                :class="{
                  'selected-photo': selectedIds.includes(generated.id),
                }"
                width="250"
                @click="toggleSelection(generated.id)"
                cover
              />
            </v-card>
          </div>

          <!-- Spinner de carga inicial -->
          <div
            v-else
            class="d-flex justify-center align-center"
            style="height: 300px"
          >
            <v-progress-circular indeterminate size="40" color="primary" />
          </div>
        </v-container>
      </div>

      <!-- Footer fijo -->
      <v-card-actions class="mt-auto mr-13">
        <v-btn size="small" class="outline" text @click="close">Close</v-btn>
        <v-btn size="small" color="primary" @click="confirmSelection">
          Add to Canvas
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useCanvasStore } from "@/stores/canvas";

const props = defineProps({
  modelValue: Boolean,
  photo: Object,
  toolbarState: Object,
});
const emit = defineEmits(["update:modelValue", "add-photos-expanded"]);

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const canvasStore = useCanvasStore();
const selectedIds = ref([]);
const generatedPhotos = ref([]);
const visiblePhotos = ref([]);
const isLoading = ref(false);
const pageSize = 24;
const chunkSize = 6;

const scrollContainer = ref(null);

function resetVisiblePhotos() {
  visiblePhotos.value = generatedPhotos.value.slice(0, pageSize);
}

function handleScroll() {
  if (!scrollContainer.value) return;

  const el = scrollContainer.value;
  const threshold = 5; // Muy bajo para evitar precarga

  if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
    // Delay para permitir estabilizar el scroll antes de cargar
    setTimeout(() => {
      const currentLength = visiblePhotos.value.length;
      const nextChunk = generatedPhotos.value.slice(
        currentLength,
        currentLength + chunkSize
      );

      if (nextChunk.length > 0) {
        visiblePhotos.value.push(...nextChunk);
      }
    }, 500); // El delay también simula carga real
  }
}

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
  emit("update:modelValue", false);
}

function confirmSelection() {
  const selected = generatedPhotos.value.filter((p) =>
    selectedIds.value.includes(p.id)
  );
  emit("add-photos-expanded", selected);
  close();
}

watch(
  () => [props.modelValue, props.photo],
  async ([dialogOpen, photo]) => {
    if (!dialogOpen || !photo) return;
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
    await nextTick(); // para que `scrollContainer` esté disponible
    scrollContainer.value.scrollTop = 0;
    isLoading.value = false;
  },
  { immediate: true }
);
</script>

<style scoped>
.selected-photo {
  border: 3px solid rgb(var(--v-theme-secondary));
  border-radius: 4px;
}
</style>
