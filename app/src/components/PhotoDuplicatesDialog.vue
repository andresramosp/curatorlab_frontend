<template>
  <v-dialog v-model="internalDialog" max-width="800px">
    <v-card>
      <v-card-title>Duplicated Photos</v-card-title>
      <v-card-text>
        <div class="duplicates-grid">
          <v-card
            v-for="photo in photos"
            :key="photo.id"
            class="duplicate-photo"
          >
            <v-img :src="photo.thumbnailUrl" height="120px" />
            <v-btn
              icon
              size="x-small"
              class="delete-button"
              @click="
                $emit(
                  'deleteDuplicates',
                  photos.map((p) => p.id)
                )
              "
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('update:modelValue', false)">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  photos: Array,
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue", "deleteDuplicates"]);

// 🔁 Variable local vinculada a modelValue
const internalDialog = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    internalDialog.value = val;
  }
);

watch(internalDialog, (val) => {
  emit("update:modelValue", val);
});
</script>

<style scoped>
.duplicates-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.duplicate-photo {
  position: relative;
  width: 120px;
  height: 120px;
}

.delete-button {
  position: absolute;
  top: 4px;
  right: 4px;
  background: white;
  padding: 2px;
  border-radius: 50%;
  z-index: 1;
}
</style>
