<template>
  <v-menu v-model="menu" :close-on-content-click="false" width="300" offset-y>
    <template #activator="{ props }">
      <v-btn icon size="small" class="mx-auto outline" v-bind="{ ...props }">
        <v-icon size="22">mdi-cog</v-icon>
      </v-btn>
    </template>

    <v-list density="compact" class="settings-menu">
      <v-list-subheader>Canvas</v-list-subheader>

      <v-list-item>
        <v-list-item-title>Auto Align</v-list-item-title>
        <template #append>
          <v-switch
            v-model="toolbarState.expansion.autoAlign"
            color="secondary"
            class="switch-compact"
            density="compact"
            hide-details
          />
        </template>
      </v-list-item>

      <!-- <v-list-item>
        <v-list-item-title>Display Lines</v-list-item-title>
        <template #append>
          <v-switch
            v-model="toolbarState.displayLines"
            color="secondary"
            class="switch-compact"
            density="compact"
            hide-details
          />
        </template>
      </v-list-item> -->

      <v-divider class="my-1" />

      <v-list-subheader>Expansion on Canvas</v-list-subheader>

      <v-list-item>
        <v-list-item-title>Layout</v-list-item-title>
        <template #append>
          <!-- <SelectMini
            v-model="toolbarState.photoOptions.spreadMode"
            :items="[
              { label: 'vertical', value: 'vertical' },
              { label: 'horizontal', value: 'horizontal' },
              { label: 'circular', value: 'circular' },
            ]"
          /> -->
          <ToggleButtons v-model="toolbarState.photoOptions.spreadMode">
            <ToggleOption
              size="x-small"
              value="linear"
              tooltip="Expand in horizontal line"
            >
              <v-icon left class="mr-1">mdi-pan-horizontal</v-icon>
            </ToggleOption>
            <ToggleOption
              size="x-small"
              value="perpendicular"
              tooltip="Expand in vertical column"
            >
              <v-icon left class="mr-1">mdi-pan-vertical</v-icon>
            </ToggleOption>
            <ToggleOption
              size="x-small"
              value="circular"
              tooltip="Expand in circular layout"
            >
              <v-icon left class="mr-1">mdi-orbit-variant</v-icon>
            </ToggleOption>
          </ToggleButtons>
        </template>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>Photos</v-list-item-title>
        <template #append>
          <SelectMini
            v-model="toolbarState.photoOptions.count"
            :items="[1, 2, 3, 4, 5]"
          />
          <!-- <v-select
            v-model="toolbarState.photoOptions.count"
            :items="[1, 2, 3, 4, 5]"
            variant="underlined"
            density="compact"
            hide-details
            style="width: 60px"
          /> -->
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref } from "vue";
import SelectMini from "../wrappers/SelectMini.vue";
import ToggleButtons from "../wrappers/ToggleButtons.vue";
import ToggleOption from "../wrappers/ToggleOption.vue";

const props = defineProps({
  toolbarState: {
    type: Object,
    required: true,
  },
});

const menu = ref(false);
</script>

<style scoped>
.v-list-item-title {
  font-size: 13px;
}
.v-list-subheader {
  font-size: 12px;
  font-weight: bold;
  opacity: 0.8;
}
</style>
