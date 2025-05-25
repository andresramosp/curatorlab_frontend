<script setup>
import { RouterLink } from "vue-router";

import ModalVideo from "./ModalVideo.vue";
import VideoThumb from "../images/hero-image-01.jpg";
import VideoSrc from "../videos/home_demo.mp4";

const comingSoon = () => alert("Coming soon!");
</script>

<template>
  <section>
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <!-- Hero content -->
      <div class="py-12 md:py-20">
        <!-- Section header -->
        <div class="pb-12 text-center md:pb-15">
          <h1
            class="flex items-center justify-center gap-2 font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 text-4xl font-semibold text-transparent md:text-5xl"
            data-aos="fade-up"
            style="gap: 3px"
          >
            <img
              class="w-14 h-14"
              src="../images/CuratorLogoGray.png"
              alt="CuratorLab Logo"
            />
            <span style="">Curator</span
            ><span style="color: white; font-weight: bold">Lab</span>
          </h1>

          <div class="mx-auto max-w-3xl">
            <p
              style="font-size: 17px"
              class="mb-8 text-xl text-indigo-200/65"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Start making sense of your photographic body of work like never
              before with the help of our powerful engine. 🕵️ Explore through
              descriptive or figurative queries. 🖼️ Build series for artistic or
              documentary projects. 🧭 Sequence images by narrative or visual
              rhythm, uncovering connections you hadn’t noticed before. And much
              more to come...
            </p>
            <div
              class="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
            >
              <div data-aos="fade-up" data-aos-delay="400">
                <a
                  href="#"
                  @click.prevent="comingSoon"
                  class="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                >
                  <span class="relative inline-flex items-center">
                    Playground
                    <span
                      class="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5"
                    >
                      -&gt;
                    </span>
                  </span>
                </a>
              </div>

              <div data-aos="fade-up" data-aos-delay="600">
                <a
                  @click.prevent="comingSoon"
                  class="btn relative w-full bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%] sm:ml-4 sm:w-auto"
                  href="#0"
                  >Register</a
                >
              </div>
            </div>
          </div>
        </div>

        <ModalVideo
          :thumb="VideoThumb"
          :thumbWidth="1104"
          :thumbHeight="576"
          thumbAlt="Modal video thumbnail"
          :video="VideoSrc"
          :videoWidth="1920"
          :videoHeight="1080"
        />
      </div>
    </div>
  </section>
</template>
