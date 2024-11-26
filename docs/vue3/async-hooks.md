# Async Hooks

<script setup lang="ts">
import { useAsync } from "../../src/hooks/useAsync";

const { data, load } = useAsync((i) => {
  return i + 1;
},res => res || 0);

load(2);
</script>

## 2333 + {{data}}