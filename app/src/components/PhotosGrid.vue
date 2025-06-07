<template>
  <div>
    <v-switch
      v-model="showOnlyDuplicates"
      label="Filter duplicates"
      class="mb-4"
    />

    <div v-if="filteredPhotos.length" class="photos-list">
      <v-hover v-for="photo in filteredPhotos" :key="photo.id">
        <template #default="{ isHovering, props }">
          <v-card v-bind="props" class="photo-card-upload">
            <v-img
              :src="photo.thumbnailUrl"
              class="photo-image"
              @error="fallbackImage(photo)"
            ></v-img>
            <v-icon
              v-if="photo.duplicates?.length"
              class="duplicate-icon"
              size="24"
              color="orange"
              @click.stop="openDuplicatesDialog(photo)"
            >
              mdi-account-box-multiple
            </v-icon>

            <div
              v-show="isHovering && !needProcess(photo).isAnalyzing"
              class="action-buttons"
            >
              <v-btn size="small" icon @click="deletePhoto(photo)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn size="small" icon @click="editPhoto(photo.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn size="small" icon @click="viewPhotoInfo(photo.id)">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </div>
          </v-card>
        </template>
      </v-hover>
    </div>

    <PhotoDialog v-model:dialog="showDialog" :selected-photo="selectedPhoto" />
    <PhotoDuplicatesDialog
      v-model="showDuplicatesDialog"
      :photos="duplicatePhotos"
      @deleteDuplicates="deleteDuplicates"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePhotosStore } from "@/stores/photos";
import PhotoDialog from "./PhotoDialog.vue";
import PhotoDuplicatesDialog from "./PhotoDuplicatesDialog.vue";

const props = defineProps({
  photos: Array,
  uploadingPhotos: Number,
  loadingIteration: Boolean,
  hasMoreIterations: Boolean,
});

const photosStore = usePhotosStore();

const showOnlyDuplicates = ref(false);
const showDialog = ref(false);
const selectedPhotoId = ref(null);
const showDuplicatesDialog = ref(false);
const duplicatePhotos = ref([]);

const filteredPhotos = computed(() => {
  if (!props.photos) return [];
  return showOnlyDuplicates.value
    ? props.photos.filter((p) => p.duplicates?.length)
    : props.photos;
});

const selectedPhoto = computed(() =>
  photosStore.photos.find((p) => p.id === selectedPhotoId.value)
);

function needProcess(photo) {
  return (
    !photo.analyzerProcess || photo.analyzerProcess.currentStage !== "finished"
  );
}

async function deleteDuplicates(photoIds) {
  await photosStore.deleteDuplicates(photoIds);
  await photosStore.checkDuplicates(photoIds);
  showDuplicatesDialog.value = false;
}

async function deletePhoto(photo) {
  await photosStore.deletePhoto(photo.id);
  await photosStore.checkDuplicates(photo.duplicates);
  showDuplicatesDialog.value = false;
}

function editPhoto(photoId) {
  console.log("Edit photo", photoId);
}

async function viewPhotoInfo(photoId) {
  await photosStore.fetchPhoto(photoId);
  selectedPhotoId.value = photoId;
  showDialog.value = true;
}

function fallbackImage(photo) {
  if (photo.url) {
    photo.url = null;
  }
}

function openDuplicatesDialog(photo) {
  duplicatePhotos.value = [
    photo,
    ...photosStore.photos.filter((p) => photo.duplicates.includes(p.id)),
  ];
  showDuplicatesDialog.value = true;
}
</script>

<style scoped>
.photos-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
  overflow-y: scroll;
  height: 90vh;
}

.photo-image {
  height: 150px;
  object-fit: cover;
  width: 100%;
}

.photo-skeleton {
  height: 150px;
  width: 100%;
}

.catalog-message {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.blurred-photo {
  filter: blur(3px);
}
.duplicate-icon {
  position: absolute;
  top: 4px;
  left: 6px;
  z-index: 2;
  border-radius: 50%;
  padding: 2px;
}
</style>
