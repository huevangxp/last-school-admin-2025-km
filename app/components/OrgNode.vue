<template>
  <li>
    <div class="org-node" :class="{ 'org-root': node.isRoot }">
      <v-avatar
        v-if="node.isRoot"
        size="44"
        rounded="lg"
        class="mb-1 org-root-logo"
      >
        <v-img src="/logo.png" contain alt=""></v-img>
      </v-avatar>
      <v-avatar v-else size="44" rounded="lg" class="mb-1 org-avatar">
        <v-img v-if="node.image" :src="node.image" cover alt=""></v-img>
        <v-icon v-else color="primary" size="22">mdi-account</v-icon>
      </v-avatar>

      <!-- <div
        v-if="!node.isRoot && node.layer"
        class="org-layer-badge"
      >
        Layer {{ node.layer }}
      </div> -->

      <div class="org-node-name">{{ node.name }}</div>
      <div class="org-node-role">{{ node.title }}</div>

      <span v-if="node.department" class="org-node-dept">
        {{ node.department }}
      </span>

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

    <ul
      v-if="node.children && node.children.length"
      :class="{ 'children--wrap': wrapLeaves }"
    >
      <OrgNode v-for="child in node.children" :key="child.uuid" :node="child" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ node: any }>();

// A big row of leaf people (e.g. all teachers under a deputy) is what makes the
// tree explode sideways. When a node's children are all leaves and there are
// several of them, wrap them into a compact multi-row grid instead of one long
// horizontal row.
const wrapLeaves = computed(() => {
  const children = props.node?.children || [];
  return (
    children.length > 4 &&
    children.every((c: any) => !(c.children && c.children.length))
  );
});
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
  border-radius: 0 10px 0 0;
}
li:first-child::after {
  border-radius: 10px 0 0 0;
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

/* Wrapped leaf group: many people hang off one parent as a compact grid that
   flows onto multiple rows instead of a single very wide line. The per-sibling
   connector lines don't make sense across wrapped rows, so we drop them and
   keep just the single drop-line from the parent into the block. */
ul.children--wrap {
  flex-wrap: wrap;
  max-width: 760px;
  margin: 0 auto;
  row-gap: 10px;
  column-gap: 4px;
}
ul.children--wrap > li {
  padding-top: 18px;
}
ul.children--wrap > li::before,
ul.children--wrap > li::after {
  display: none;
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
  border: 1px solid #e8edf3;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 10px 24px -16px rgba(15, 23, 42, 0.25);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  white-space: normal;
  vertical-align: top;
  overflow: hidden;
}
.org-node:hover {
  transform: translateY(-3px);
  border-color: #2dd4bf;
  box-shadow: 0 16px 32px -18px rgba(15, 23, 42, 0.35);
}

/* Avatar tile */
.org-avatar {
  background: #e6ecf2;
  border: 1px solid #e8edf3;
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
  border-radius: 999px;
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

/* Department pill */
.org-node-dept {
  display: inline-block;
  max-width: 100%;
  margin-top: 6px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 800;
  color: #0f766e;
  background: #f0fdfa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Root (school) node */
.org-root {
  background: linear-gradient(135deg, #0a3154 0%, #082741 100%);
  border: 0;
  box-shadow: 0 12px 26px -12px rgba(10, 49, 84, 0.6);
}
.org-root .org-node-name {
  color: #ffffff;
}
.org-root .org-node-role {
  color: rgba(255, 255, 255, 0.75);
}
.org-root .org-node-dept {
  color: #0a3154;
  background: #2dd4bf;
}
.org-root-logo {
  background: #ffffff;
  padding: 6px;
}
</style>
