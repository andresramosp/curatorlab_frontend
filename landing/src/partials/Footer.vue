<script setup>
const props = defineProps({
  border: Boolean,
});
</script>

<template>
  <footer>
    <div class="relative mx-auto max-w-6xl px-4 sm:px-6">
      <!-- Footer illustration -->
      <div
        class="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <img
          class="max-w-none"
          src="../images/footer-illustration.svg"
          width="1076"
          height="378"
          alt="Footer illustration"
        />
      </div>

      <div
        class="grid grid-cols-2 justify-between gap-12 py-8 sm:grid-rows-[auto_auto] md:grid-cols-4 md:grid-rows-[auto_auto] md:py-12 lg:grid-cols-[repeat(4,minmax(0,140px))_1fr] lg:grid-rows-1 xl:gap-20"
        :class="
          props.border
            ? 'border-t [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1]'
            : ''
        "
      >
        <!-- 1st block -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-gray-200">Product</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Features</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Integrations</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Pricing &amp; Plans</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Changelog</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Our method</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >User policy</a
              >
            </li>
          </ul>
        </div>

        <!-- 2nd block -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-gray-200">Company</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >About us</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Diversity &amp; Inclusion</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Blog</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Careers</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Financial statements</a
              >
            </li>
          </ul>
        </div>

        <!-- 3rd block -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-gray-200">Resources</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Community</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Terms of service</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Report a vulnerability</a
              >
            </li>
          </ul>
        </div>

        <!-- 4th block -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-gray-200">Content Library</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Templates</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Tutorials</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Knowledge base</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Learn</a
              >
            </li>
            <li>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Cookie manager</a
              >
            </li>
          </ul>
        </div>

        <!-- 5th block -->
        <div class="col-span-2 md:col-span-4 lg:col-span-1 lg:text-right">
          <div class="mb-3">
            <!-- Logo -->
            <router-link class="inline-flex shrink-0" to="/" aria-label="Cruip">
              <img
                src="../images/logo.svg"
                width="32"
                height="32"
                alt="Open Pro"
              />
            </router-link>
          </div>
          <div class="text-sm">
            <p class="mb-3 text-indigo-200/65">
              © Cruip.com
              <span class="text-gray-700"> · </span>
              <a
                class="text-indigo-200/65 transition hover:text-indigo-500"
                href="#0"
                >Terms</a
              >
            </p>
            <ul class="inline-flex gap-1">
              <li>
                <a
                  class="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                  href="#0"
                  aria-label="Twitter"
                >
                  <svg
                    class="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z"
                    ></path>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  class="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                  href="#0"
                  aria-label="Medium"
                >
                  <svg
                    class="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23 8H9a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Zm-1.708 3.791-.858.823a.251.251 0 0 0-.1.241V18.9a.251.251 0 0 0 .1.241l.838.823v.181h-4.215v-.181l.868-.843c.085-.085.085-.11.085-.241v-4.887l-2.41 6.131h-.329l-2.81-6.13V18.1a.567.567 0 0 0 .156.472l1.129 1.37v.181h-3.2v-.181l1.129-1.37a.547.547 0 0 0 .146-.472v-4.749a.416.416 0 0 0-.138-.351l-1-1.209v-.181H13.8l2.4 5.283 2.122-5.283h2.971l-.001.181Z"
                    ></path>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  class="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                  href="#0"
                  aria-label="Github"
                >
                  <svg
                    class="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"
                    ></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
