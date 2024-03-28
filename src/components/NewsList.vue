<template>
	<h1 class="text-4xl text-center">{{ headerText }}</h1>
	<div class="grid grid-cols-12 py-4 mx-auto max-w-screen-2xl lg:py-12">
		<ul
			class="grid grid-cols-12 col-span-10 col-start-2 gap-6 lg:gap-16 sm:gap-8"
		>
			<li
				v-for="(article, index) in articles"
				:key="index"
				class="col-span-12 mb-6 rounded-md shadow-md md:md-0 sm:col-span-6 lg:col-span-4"
			>
				<a :href="article.url" target="_blank" @click="clickedNews(article)">
					<img
						:src="article.urlToImage"
						:alt="article.title"
						class="w-full mb-4 duration-500 ease-in-out rounded-lg shadow-none group-hover:shadow-lg"
					/>
					<div class="flex items-center mb-3">
						<span
							class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold leading-5 text-white font-display mr-2 capitalize bg-red-500"
						>
							{{ article.author }}
						</span>
						<p class="font-mono text-xs font-normal text-black opacity-75">
							{{ article.publishedAt }}
						</p>
					</div>
					<p class="max-w-sm text-2xl font-bold leading-tight font-display">
						<span class="text-black link-underline link-underline-black">
							{{ article.title }}
						</span>
					</p>
					<p class="max-w-sm text-xl leading-tight font-display">
						<span class="text-black link-underline link-underline-black">
							{{ article.description }}
						</span>
					</p>
				</a>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import { News, Params } from "../types/types";

const articles = ref<News[]>([]);
const props = defineProps({
	searchQuery: String,
	type: String,
});

const clickedNews = (article: News) => {
	const { author, description, publishedAt, title, url, urlToImage } = article;

	let totalNews: News[] = [];

	const getNews = localStorage.getItem("news");

	if (getNews) {
		totalNews = JSON.parse(getNews);
	}

	const currentNews: News = {
		author,
		description,
		publishedAt,
		title,
		url,
		urlToImage,
	};

	const isDuplicate = totalNews.some((news) => {
		return (
			news.author === currentNews.author &&
			news.description === currentNews.description &&
			news.publishedAt === currentNews.publishedAt &&
			news.title === currentNews.title &&
			news.url === currentNews.url &&
			news.urlToImage === currentNews.urlToImage
		);
	});

	if (!isDuplicate) {
		totalNews.push(currentNews);
		localStorage.setItem("news", JSON.stringify(totalNews));
	}
};

const fetchNews = async () => {
	try {
		let endpoint;
		let params: Params = {
			q: props.searchQuery,
			pageSize: 9,
			apiKey: "a98f4a25d29740d18b3eb9e1cfc57de0",
		};

		if (props.type === "unread") {
			endpoint = "top-headlines";
			params.country = "id";
		} else if (props.type === "already-read") {
			const storedNews = localStorage.getItem("news");
			if (storedNews) {
				articles.value = JSON.parse(storedNews);
				return;
			}
		} else {
			return;
		}

		const response = await axios.get(`https://newsapi.org/v2/${endpoint}`, {
			params: params,
		});
		articles.value = response.data.articles;
	} catch (error) {
		console.error("Error fetching news:", error);
	}
};

onMounted(async () => {
	fetchNews();
});

watch(
	() => props.searchQuery,
	(newSearchQuery, oldSearchQuery) => {
		if (newSearchQuery !== oldSearchQuery || newSearchQuery === "") {
			fetchNews();
		}
	}
);

watch(
	() => props.type,
	(newType, oldType) => {
		if (newType !== oldType) {
			fetchNews();
		}
	}
);

const headerText = computed(() => {
	if (props.searchQuery === "") {
		return "Top Headlines";
	} else {
		return `Search "${props.searchQuery}"`;
	}
});
</script>
