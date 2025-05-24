<script setup>
import { ref } from "vue";

const props = defineProps({
  video: String,
  videoWidth: Number,
  videoHeight: Number,
});
</script>

<template>
  <div class="relative">
    <!-- Video autoplay visible directamente -->
    <video
      class="rounded-2xl w-full h-auto"
      :width="props.videoWidth"
      :height="props.videoHeight"
      :src="props.video"
      autoplay
      muted
      loop
      playsinline
      controls
    >
      Your browser does not support the video tag.
    </video>
  </div>
</template>
