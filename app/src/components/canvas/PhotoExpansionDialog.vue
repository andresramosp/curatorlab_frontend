<template>
  <v-dialog v-model="dialog" max-width="900" height="600">
    <v-card style="display: flex; flex-direction: column; height: 600px">
      <v-card-text style="overflow-y: auto; flex: 1">
        <v-container fluid>
          <v-row>
            <v-col
              v-for="generated in generatedPhotos"
              :key="generated.id"
              cols="3"
              class="d-flex justify-center"
            >
              <v-card>
                <v-img
                  :src="generated.thumbnailUrl"
                  :class="{
                    'selected-photo': selectedIds.includes(generated.id),
                  }"
                  width="200"
                  @click="toggleSelection(generated.id)"
                  cover
                />
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

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
import { ref, computed, watch } from "vue";
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
  emit("update:modelValue", false);
}

function confirmSelection() {
  const selected = generatedPhotos.value.filter((p) =>
    selectedIds.value.includes(p.id)
  );
  emit("add-photos-expanded", selected);
  close();
}

// Carga fotos solo cuando el diálogo se abre y hay una foto válida
watch(
  () => [props.modelValue, props.photo],
  async ([dialogOpen, photo]) => {
    if (!dialogOpen || !photo) return;

    const basePosition = { x: 0, y: 0 };
    generatedPhotos.value = await canvasStore.addPhotosFromPhoto(
      [photo],
      props.toolbarState.expansion.type,
      100,
      basePosition,
      props.toolbarState.expansion.opposite,
      props.toolbarState.expansion.inverted
    );
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
