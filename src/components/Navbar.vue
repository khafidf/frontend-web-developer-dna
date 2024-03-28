<template>
	<div class="flex flex-col gap-4 py-8">
		<h1 class="text-4xl font-bold text-center">eNews</h1>
		<div class="flex justify-center gap-4">
			<button
				@click="typeNews('unread')"
				:class="{ 'bg-black text-white': type === 'unread' }"
				class="px-2 py-1 duration-300 rounded-xl bg-black/20 hover:scale-105"
			>
				Unread
			</button>
			<button
				@click="typeNews('already-read')"
				:class="{ 'bg-black text-white': type === 'already-read' }"
				class="px-2 py-1 duration-300 rounded-xl bg-black/20 hover:scale-105"
			>
				Already Read
			</button>
		</div>
		<input
			class="w-64 p-2 mx-auto rounded-xl"
			:class="{ hidden: type === 'already-read' }"
			v-model="searchNews"
			@input="emitSearchNews"
			placeholder="Enter something"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch } from "vue";

const searchNews = ref("");
const type = ref(localStorage.getItem("type"));
const emits = defineEmits(["searchNewsChanged", "typeChanged"]);

const typeNews = (params: string) => {
	localStorage.setItem("type", params);
	type.value = params;
	emits("typeChanged", params);
};

function emitSearchNews() {
	emits("searchNewsChanged", searchNews.value);
}

watch(type, (newValue) => {
	localStorage.setItem("type", newValue || "unread");
	emits("typeChanged", newValue || "unread");
});
</script>
