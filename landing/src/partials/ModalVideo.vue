<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  video: String,
  videoWidth: Number,
  videoHeight: Number,
});

const videoRef = ref(null);

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.playbackRate = 1.8; // velocidad 1.5x
  }
});
</script>

<template>
  <div class="relative">
    <!-- Video autoplay visible directamente -->
    <video
      ref="videoRef"
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
