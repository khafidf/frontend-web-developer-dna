<template>
	<div class="container mx-auto">
		<Navbar
			@searchNewsChanged="handleSearchNewsChange"
			@typeChanged="handleTypeChange"
		/>
		<NewsList :searchQuery="searchNews" :type="currentType" />
	</div>
</template>

<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import NewsList from "./components/NewsList.vue";
import { ref } from "vue";

const searchNews = ref("");
const currentType = ref(localStorage.getItem("type") || "unread");

function handleSearchNewsChange(newSearchNews: string) {
	searchNews.value = newSearchNews;
}

function handleTypeChange(newType: string) {
	currentType.value = newType;
}
</script>
