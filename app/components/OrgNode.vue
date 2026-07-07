<template>
  <li>
    <div class="org-node" :class="{ 'org-root': node.isRoot }">
      <v-avatar
        v-if="node.isRoot"
        size="44"
        class="mb-1 org-root-logo"
      >
        <v-img src="/logo.png" contain></v-img>
      </v-avatar>
      <v-avatar
        v-else
        size="42"
        color="white"
        rounded="0"
        class="mb-1 border-white elevation-1"
      >
        <v-img v-if="node.image" :src="node.image" cover></v-img>
        <v-icon v-else color="primary">mdi-account</v-icon>
      </v-avatar>

      <!-- <div
        v-if="!node.isRoot && node.layer"
        class="org-layer-badge"
      >
        Layer {{ node.layer }}
      </div> -->

      <div class="org-node-name">{{ node.name }}</div>
      <div class="org-node-role">{{ node.title }}</div>

      <v-chip
        v-if="node.department"
        size="x-small"
        variant="tonal"
        color="teal"
        class="mt-1 font-weight-bold"
      >
        {{ node.department }}
      </v-chip>

      <!-- <v-chip
        v-if="!node.isRoot && node.status"
        :color="node.status === 'Active' ? 'success' : 'grey'"
        size="x-small"
        variant="tonal"
        class="mt-1 font-weight-black text-uppercase"
      >
        {{ node.status }}
      </v-chip> -->
    </div>

    <ul v-if="node.children && node.children.length">
      <OrgNode v-for="child in node.children" :key="child.uuid" :node="child" />
    </ul>
  </li>
</template>

<script setup lang="ts">
defineProps<{ node: any }>();
</script>

<style scoped>
li {
  list-style: none;
  text-align: center;
  position: relative;
  padding: 26px 14px 0;
}

/* Horizontal connectors between siblings + short vertical stubs down to nodes */
li::before,
li::after {
  content: "";
  position: absolute;
  top: 0;
  right: 50%;
  border-top: 2px solid #d9e2ec;
  width: 50%;
  height: 26px;
}
li::after {
  right: auto;
  left: 50%;
  border-left: 2px solid #d9e2ec;
}
li:only-child::before,
li:only-child::after {
  display: none;
}
li:only-child {
  padding-top: 0;
}
li:first-child::before,
li:last-child::after {
  border: 0 none;
}
li:last-child::before {
  border-right: 2px solid #d9e2ec;
}
li:first-child::after {
}

/* Children container + vertical drop line from parent node */
ul {
  display: flex;
  justify-content: center;
  padding-top: 26px;
  position: relative;
  margin: 0;
  padding-left: 0;
  list-style: none;
}
ul::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  border-left: 2px solid #d9e2ec;
  width: 0;
  height: 26px;
}

/* Node card — fixed width & height so every card is identical in size. */
.org-node {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  width: 168px;
  height: 168px;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 14px -8px rgba(15, 23, 42, 0.18);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  white-space: normal;
  vertical-align: top;
  overflow: hidden;
}
.org-node:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -12px rgba(15, 23, 42, 0.3);
}

/* Layer badge (e.g. Layer 1, Layer 2) */
.org-layer-badge {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #0d9488;
  background: #ccfbf1;
  padding: 1px 8px;
  margin-bottom: 2px;
}

.org-node-name {
  font-weight: 800;
  font-size: 13px;
  color: #0f172a;
  line-height: 1.2;
  text-align: center;
  /* Reserve two lines so short and long names keep cards the same height. */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 31px;
}
.org-node-role {
  font-size: 10.5px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

/* Root (school) node */
.org-root {
  background: linear-gradient(135deg, #14b8a5 0%, #0d9488 100%);
  border: 0;
  box-shadow: 0 10px 24px -10px rgba(13, 148, 136, 0.5);
}
.org-root .org-node-name {
  color: #ffffff;
}
.org-root .org-node-role {
  color: rgba(255, 255, 255, 0.8);
}
.org-root-logo {
  background: #ffffff;
  padding: 6px;
}

.border-white {
  border: 1.5px solid #ffffff;
}
</style>
