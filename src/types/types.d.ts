export interface News {
	url?: string;
	urlToImage?: string;
	title?: string;
	author?: string;
	publishedAt?: string;
	description?: string;
}

export interface Params {
	q?: string;
	pageSize?: number;
	apiKey: string;
	country?: string;
}
