<script setup>
import Header from "./../partials/Header.vue";
import PageIllustration from "./../partials/PageIllustration.vue";
</script>

<template>
  <div
    class="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip"
  >
    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="relative grow">
      <!-- Page illustration -->
      <PageIllustration multiple />

      <section>
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="py-12 md:py-20">
            <!-- Section header -->
            <div class="pb-12 text-center">
              <h1
                class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text text-3xl font-semibold text-transparent md:text-4xl"
              >
                Welcome back
              </h1>
            </div>

            <!-- Contact form -->
            <form class="mx-auto max-w-[400px]">
              <div class="space-y-5">
                <div>
                  <label
                    class="mb-1 block text-sm font-medium text-indigo-200/65"
                    for="email"
                    >Email</label
                  >
                  <input
                    id="email"
                    type="email"
                    class="form-input w-full"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <div class="mb-1 flex items-center justify-between gap-3">
                    <label
                      class="block text-sm font-medium text-indigo-200/65"
                      for="password"
                      >Password</label
                    >
                    <router-link
                      class="text-sm text-gray-600 hover:underline"
                      to="/reset-password"
                      >Forgot?</router-link
                    >
                  </div>
                  <input
                    id="password"
                    type="password"
                    class="form-input w-full"
                    placeholder="Your password"
                  />
                </div>
              </div>
              <div class="mt-6 space-y-5">
                <button
                  class="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]"
                >
                  Sign in
                </button>
                <div
                  class="flex items-center gap-3 text-center text-sm italic text-gray-600 before:h-px before:flex-1 before:bg-linear-to-r before:from-transparent before:via-gray-400/25 after:h-px after:flex-1 after:bg-linear-to-r after:from-transparent after:via-gray-400/25"
                >
                  or
                </div>
                <button
                  class="btn relative w-full bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
                >
                  Sign In with Google
                </button>
              </div>
            </form>

            <!-- Bottom link -->
            <div class="mt-6 text-center text-sm text-indigo-200/65">
              Don't you have an account?
              <router-link class="font-medium text-indigo-500" to="/signup"
                >Sign Up</router-link
              >
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
